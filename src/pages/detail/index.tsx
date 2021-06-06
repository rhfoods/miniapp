import { getFindNotes, PatchSetTop } from '@/api/api';
import { ButtonNames, PointOwnTypes } from '@/common/constants/point.constant';
import XAlertIcon from '@/component/alert/alert-icon';
import XAlertPoster from '@/component/alert/alert-poster';
import XGoodOrBad from '@/component/alert/goodOrBad';
import XAlertShare from '@/component/alert/share';
import XSheet from '@/component/alert/sheet';
import XToast from '@/component/alert/toast';
import XFindCard from '@/component/card/find-card';
import XPointCard from '@/component/card/point-card';
import XEmpty from '@/component/empty';
import XForwardPic from '@/component/forward-pic';
import XLoading from '@/component/loading';
import XDetailTabbar, { IDetailTabbarItem } from '@/component/nav/detail-tabbar';
import XPoster from '@/component/poster';
import EFire from '@/core/enum/fire';
import { IArticleDetail } from '@/core/interface/nav';
import useAuthorize from '@/hooks/use-authorize';
import useList from '@/hooks/use-list';
import useLogin from '@/hooks/use-login';
import useParams from '@/hooks/use-params';
import useUserLocation from '@/hooks/use-user-location';
import User from '@/models/user';
import Tool from '@/utils/tools';
import { View } from '@tarojs/components';
import Taro, { usePullDownRefresh, useShareAppMessage } from '@tarojs/taro';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import './index.scss';
import DetailTabbar, { BottomButtons } from './tabbar';
import XTopArticle from './top-article';
import useForwardPic from './use-forward-pic';
import usePoint from './use-point';
import useTopNote from './use-topnote';
import useUserCardInfo from './use-user-car-info';
import useCount from './useCount';
import useDetailState from './useDetailState';
import useLinks from './useLinks';

const ArticleDetail: FC = () => {
  const params: IArticleDetail = useParams();
  const authorize = useAuthorize();
  const self = useLogin(); // 登录
  const point = usePoint();
  const topCard = useUserCardInfo(self.info, params);
  const topNote = useTopNote(point.info);
  const notes = useList(getFindNotes, 'notes', {
    psaveId: point.info?.psaveId,
  });
  const forward = useForwardPic(); // 转发图片
  const { hasLinks, linkTap } = useLinks(topNote.info);
  const { distance } = useUserLocation(point.info);
  const count = useCount(params);
  const page = useDetailState(
    point,
    topCard,
    topNote,
    notes,
    forward,
    params,
    self.info
  );
  const classes = classNames('p-detail')

  /**
   * 是否是自己的地图
   */
  const isMyMap = useMemo(() => {
    if (!point.info) {
      return true;
    }
    return Number(params.userId) === Tool.userId();
  }, [point.info]);
  /**
   * 底部按钮
   */
  const tabItems = useMemo(() => {
    if (!self.info?.userId) return [];
    if (!point.info) return [];
    const buttons = JSON.parse(JSON.stringify(BottomButtons))
    if (isMyMap) {
      return DetailTabbar.getMyButton(point.info, buttons, topNote.info);
    } else {
      return DetailTabbar.getOtherButton(
        point.info,
        buttons,
        topNote.info
      );
    }
  }, [self.info?.userId, point.info, topNote.info]);
  /**
   * 发现更多list
   */
  const listMore = useMemo(() => {
    if(params?.hideTab) {
      return []
    }
    // 置顶文章放最上面
    const topNoteId = point.info?.topNoteId
    const target = notes.list.find(item => item.noteId === topNoteId);
    const noteList = notes.list.filter(item => item.noteId !== topNoteId);
    target && noteList.unshift(target);
    return noteList.filter((item) => item.noteId !== topNote.info?.noteId);
  }, [notes.list, topNote.info, point.info, params]);
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    page.refresh()
    .then(() => Taro.stopPullDownRefresh())
  });  
  /**
   * 分享
   */
  useShareAppMessage(() => {
    DetailTabbar.mapShareCount(point, topNote);
    let query = `psaveId=${params.psaveId}&userId=${params.userId}`
    if(topNote.info) {
      query += `&noteId=${topNote.info.noteId}`
    }
    let path = `/pages/detail/index?${query}`;
    const imageUrl = forward.pic;
    const title = topNote.info?.title || point.info?.name;
    return {
      path,
      imageUrl,
      title,
    };
  });
  /**
   * 点击底部按钮
   */
  async function footerTap(item: IDetailTabbarItem) {
    if (item.name === ButtonNames.MYSELF) {
      DetailTabbar.MYSELF(point, self, count);
      return;
    }
    if (item.name === ButtonNames.CLOCK) {
      DetailTabbar.CLOCK(point, topNote, distance); // 打卡
      return;
    }
    if (item.name === ButtonNames.FIND) {
      DetailTabbar.FIND(topNote, point, forward, topCard); // 添加日记
      return;
    }
    if (item.name === ButtonNames.MODIFY) {
      DetailTabbar.MODIFY(topNote, point, forward); // 修改日记
      return;
    }
    if (item.name === ButtonNames.LIKE) {
      DetailTabbar.LikeTrigger(topNote, true, point); // 点赞
      return;
    }
    if (item.name === ButtonNames.UNLIKE) {
      DetailTabbar.LikeTrigger(topNote, false, point); // 取消点赞
      return;
    }
    if (item.name === ButtonNames.DELETE) {
      DetailTabbar.DELETE(point);
      return;
    }
    if (item.name === ButtonNames.SAVE) {
      DetailTabbar.SAVE(point, topCard, topNote); // 收藏
      params?.saveTap()
      return;
    }
    if (item.name === ButtonNames.UNSAVE) {
      DetailTabbar.UNSAVE(point, topNote);
      return;
    }
    if (item.name === ButtonNames.SHARE) {
      authorize.refresh()
      DetailTabbar.SHARE(topCard, topNote, point, params, self); // 海报
      return;
    }
    if(item.name === ButtonNames.COMMENT) {
      authorize.refresh()
      await DetailTabbar.Comments(topNote, self, topCard)
    }
  }
  /**
   * 点击更多按钮
   */
  async function onAlertMore(userInfo, noteInfo) {
    const { promisic } = Tool;
    const res: any = await promisic(Taro.showActionSheet)({
      itemList: ['置顶日记'],
    });
    if (res.tapIndex === 0) {
      upNote(noteInfo);
    }
  }
  /**
   * 置顶note
   */
  async function upNote(info) {
    const res = await Taro.showModal({
      title: '提示',
      content: '您确定要置顶此日记吗?',
    });
    if (res.confirm) {
      const isOthers = info.userId !== User.info().userId; // 是否置顶了别人的文章
      PatchSetTop({
        psaveId: point.info.psaveId,
        noteId: info.noteId,
      });
      !params.topNoteId && changeTopNote(info);
      Tool.onfire.fire(EFire.updatePointUser, {
        ...info,
        ownType: PointOwnTypes.ONLY_SAVE,
        psaveId: point.info.psaveId,
      });
      await notes.refresh();
      point.setInfo((point) => {
        return {
          ...point,
          topNoteId: info.noteId,
          isToped: isOthers ? true : false,
        };
      });
    }
  }
  /**
   * 更换topNote
   */
  function changeTopNote(info) {
    topNote.getData(info.noteId);
    topCard.setInfo(info);
  }
  /**
   * 点击发现更多卡片
   */
  function onItemTap(userInfo, noteInfo) {
    Tool.detail({
      psaveId: point.info.psaveId,
      topNoteId: noteInfo.noteId,
      userId: params.userId,
      redirectTo: count > 0,
      count: count === 0 ? count + 1 : count,
    });
  }
  /**
   * 点击发现更多卡片头像
   */
  const findUserTap = (userInfo) => {
    const userId = userInfo?.userId
    if(userId && userId !== self.info.userId) {
      Tool.pageUser({ userId: userInfo.userId });
    }
  }

  if (page.state === 'loading') {
    return <XLoading />;
  }

  if (page.state === 'bug') {
    return <XEmpty info="请重新点击链接" />;
  }

  if (page.state === 'err') {
    return <XEmpty info="亲, 现在网络好像不太好~~" />;
  }

  if (page.state === 'null') {
    return <XEmpty info="这家伙把什么都删了，还看什么呢？" />;
  }

  return (
    <View className={classes}>
      <View style="height:10px"></View>
      {
        topNote.show && 
        <XTopArticle
          className="top-note"
          userInfo={topCard.info}
          noteInfo={topNote.info}
          pointInfo={point.info}
          showBtn={topCard.showBtn}
        />
      }{
        point.info && 
        <View className="point-info">
          <XPointCard className='card' point={point.info} distance={distance} />
        </View>
      }{
        // !topNote.info && <XQuestion className="question" />
      }{
        listMore?.map((note: any, index: number) => {
          let showToped = false;
          if (params.topNoteId) {
            if (!point.info.isToped && note.userId === self.info.userId) {
              // 置顶的是自己的日记
              showToped = true;
            }
            if (point.info.isToped && note.noteId === point.info.topNoteId) {
              // 置顶的是别人的日记
              showToped = true;
            }
          }
          return <XFindCard
            className="findCard"
            showTitle={index === 0}
            index={index}
            leng={listMore.length}
            userInfo={note}
            noteInfo={note}
            pointInfo={note}
            showMore={isMyMap && !showToped}
            showToped={isMyMap && showToped}
            onClick={onItemTap}
            onAlertMore={onAlertMore}
            onUser={findUserTap}
          />
        })
      }{
        hasLinks && 
        <View className="links" onClick={linkTap}>相关链接</View>
      }{
        !params.hideTab &&
        <XDetailTabbar
          itemTap={footerTap}
          className="tabbar"
          items={tabItems}
        />
      }
      <XAlertIcon />
      <XGoodOrBad />
      <XSheet />
      <XToast />
      <XPoster />
      <XForwardPic />
      <XAlertPoster />
      <XAlertShare />
    </View>
  );
};

export default ArticleDetail;
