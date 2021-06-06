import { getMaps, getPointMys, getPointSaves } from '@/api/api';
import { PointOwnTypes } from '@/common/constants/point.constant';
import XSheet from '@/component/alert/sheet';
import XMapCard from '@/component/card/map-card';
import XUserCard from '@/component/card/user-card';
import XEmpty from '@/component/empty';
import XLoading from '@/component/loading';
import XPoster from '@/component/poster';
import useApi from '@/hooks/use-api';
import useList from '@/hooks/use-list';
import User, { IUserInfo } from '@/models/user';
import Tool from '@/utils/tools';
import { View } from '@tarojs/components';
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import React, { FC, useEffect, useMemo, useState } from 'react';
import './index.scss';
import useCardMore, { EUserOptions } from './use-card-more';
import useFire from './use-fire';
import useTabHeader, { EUserList } from './use-tabheader';
import { AtDivider, AtTabs, AtTabsPane } from 'taro-ui'
import XTabHeader from '@/component/nav/tab-header';
import Taro from '@tarojs/taro' 
import XFindCard from '@/component/card/find-card';
import Media from '@/models/media';
import useParams from '@/hooks/use-params';
import { IPageUserParams } from '@/core/interface/nav';
import classNames from 'classnames';
import XUserInfoBtn from '@/component/user-info-btn';

const PUser: FC = () => {
  const params: IPageUserParams = useParams()
  const user: any = useApi(User.userProfile);
  const [cur, setCur] = useState(0);
  const maps = useList(getMaps, 'saves', {}, [], true, 6);
  const savePoints = useList(getPointSaves, 'points', {}, [], true, 6);
  const tabHeader = useTabHeader(user.info, params);
  const card = useCardMore();
  const [fullScreen, setFullScreen] = useState(false)
  
  /**
   * 是否是自己的个人中心
   */
  const isSelf = useMemo(() => {
    if(params?.userId == User.userId()) {
      return true
    }
    return false
  }, [params, self])
  /**
   * 我的发现参数
   */
  const myNotesParams = useMemo(() => {
    let params: any = {}
    if(!isSelf && user.info) {
      params.userId = user.info.userId
    }
    return params
  }, [isSelf, user.info])
  /**
   * 我的发现列表
   */
  const myNotes = useList(getPointMys, 'points', myNotesParams, [], true, 6);
  /**
   * 
   */
  useFire(user, maps, myNotes, savePoints, cur, setCur);
  /**
   * 
   */
  const tabclasses = classNames('tab-header', {
    none: fullScreen
  })
  /**
   * 当前列表的item的
   */
  const getCurTotal = (cur) => {
    if(!tabHeader.items) {
      return 0
    }
    const key = tabHeader.items[cur].key
    if ( key === EUserList.maps ) return user.info?.saveMaps;
    if ( key === EUserList.my ) return user.info?.createPoints;
    if ( key === EUserList.save ) return user.info?.savePoints;
  }
  /**
   * 如果为0,就不用调接口了
   */
  useEffect(() => {
    user.info?.saveMaps === 0 && maps.init([], false);
    user.info?.createPoints === 0 && myNotes.init([], false);
    user.info?.savePoints === 0 && savePoints.init([], false);
  }, [user.info]);
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    user.getData(params.userId);
    const currentList = getCurList(cur)
    currentList.refresh().then(() => {
      Taro.stopPullDownRefresh()
    });
  }); 
  /**
   * 获取当前列表
   */
  function getCurList(cur: number) {
    const key = tabHeader.items[cur]?.key
    if ( key === EUserList.maps ) return maps;
    if ( key === EUserList.my ) return myNotes;
    if ( key === EUserList.save ) return savePoints;
  } 
  /**
   * 获取的数据没有ownType, 手动加上
   */
  const onlySaveList = useMemo(() => {
    return savePoints.list.map((item) => {
      item.ownType = PointOwnTypes.ONLY_SAVE;
      return item;
    });
  }, [savePoints.list]);
  /**
   * 初始化
   */
  useEffect(() => {
    if(!params?.userId) {
      return
    }
    const userId = params.userId
    user.getData(userId).then(userInfo => {
      tabHeader.init(userInfo, params)
      if(isSelf && userInfo.saveMaps > 0) {
        maps.getMore()
      }
      if(!isSelf && userInfo.createPoints > 0) {
        myNotes.getMore()
      }
    })
  }, [params]);
  /**
   * 触底
   */
  useReachBottom(() => {
    const curTotal = getCurTotal(cur)
    if (curTotal > 0) {
      const currentList = getCurList(cur)
      currentList.getMore();
    }
  });
  /**
   * 切换tab
   * cur --> curTotal --> getMore
   */
  function tabTap(index: number) {
    setCur(cur => {
      if(cur !== index && Media.vId) {
        const videoCtx = Taro.createVideoContext(Media.vId)
        videoCtx?.pause()
      }
      return index
    });
    const currentList = getCurList(index)
    currentList.getMore()
  }
  /**
   * 编辑 card
   */
  async function more(userInfo, cardInfo) {
    if (!cardInfo) {
      return;
    }
    const options = card.getOption(cardInfo, tabHeader.items[cur].key);
    const { promisic, sheet } = Tool;
    const res: any = await promisic(sheet)({ options });
    if (res.key === EUserOptions.addNote) card.addNote(cardInfo);
    if (res.key === EUserOptions.editorNote) card.editNote(cardInfo);
    if (res.key === EUserOptions.delNote) card.delNote(cardInfo);
    if (res.key === EUserOptions.editorPoint) card.editPoint(cardInfo);
    if (res.key === EUserOptions.delPoint) card.delPoint(cardInfo);
  }
  /**
   * 打开用户信息表单
   */
  async function openUserForm() {
    const { promisic, userForm } = Tool;
    const res: IUserInfo = await promisic(userForm)({});
    user.setInfo((info: IUserInfo) => {
      info.introduce = res.introduce;
      info.avatarUrl = res.avatarUrl;
      info.nickName = res.nickName;
      info.gender = res.gender;
      return { ...info };
    });
  }
  /**
   * 打开别人的地图
   */
  function openMap(mapInfo) {
    Tool.openMap({
      userId: mapInfo?.createrId,
      sortId: mapInfo?.sortId,
      showBack: true,
    });
  }
  /**
   * 顶部按钮: ta的地图
   */
  function hisMap() {
    Tool.openMap({
      userId: user.info.userId,
    });
  }
  /**
   * 打开详情页: 我的收藏
   */
  function openNote(userInfo, noteInfo, pointInfo) {
    Tool.detail({
      psaveId: pointInfo.psaveId,
      userId: user.info.userId,
    });
  }
  /**
   * 打开详情页: 我的发现
   */
  function findOpenNote(userInfo, noteInfo, pointInfo) {
    Tool.detail({
      psaveId: pointInfo.psaveId,
      topNoteId: noteInfo.noteId,
      userId: userInfo.userId,
    });
  }
  /**
   * 开全屏
   */
  const onFullscreenchange = (full: boolean) => {
    setFullScreen(full)
  }

  const MapList = maps.list.map((mapInfo) => (
    <XMapCard 
      className="map-card" 
      info={mapInfo} 
      onClick={openMap} 
    />
  ));
  const MyNotesList = myNotes.list.map((item, index) => (
    <XFindCard
      className="point-card"
      index={index}
      leng={myNotes.list.length}
      userInfo={user.info}
      noteInfo={item}
      pointInfo={item}
      showMore={isSelf ? true : false}
      onClick={findOpenNote}
      onAlertMore={more}
      onFullscreenchange={onFullscreenchange}
    />
  ));
  const SavePointsList = onlySaveList.map((point, index) => (
    <XFindCard
      className="point-card"
      index={index}
      leng={onlySaveList.length}
      userInfo={point}
      noteInfo={point}
      pointInfo={point}
      showMore={isSelf ? true : false}
      onClick={openNote}
      onAlertMore={more}
      onFullscreenchange={onFullscreenchange}
    />
  ));

  const FillUserInfo = (
    <View className="btn-s btn-diy" >
      完善信息
      <XUserInfoBtn onGetUserInfo={openUserForm}/>
    </View>
  )

  if (user.loading) {
    return <XLoading />;
  }

  return (
    <View className='p-user'>
      <View style='height: 10px' ></View>
      <XUserCard
        className="user-info"
        userInfo={user.info}
        showTotal={true}
        right={
          isSelf ?
          FillUserInfo:
          <View className="btn-s btn-diy" onClick={hisMap}>TA的地图</View>
        }
      />
      {
        isSelf &&
        <XTabHeader 
          className={tabclasses} 
          cur={cur} 
          items={tabHeader.items} 
          onClick={tabTap} 
        />
      }
      <AtTabs current={cur} tabList={tabHeader.items} onClick={tabTap} swipeable={false} >
        {
          tabHeader.items?.map((item, index) => {

            if(item.key === EUserList.maps) {
              return <AtTabsPane  current={cur} index={index} >
                {
                  !maps.empty &&
                  <View className="content map-list">
                    {
                      MapList
                    }{
                      !maps.more && maps.list.length>=6 &&
                      <AtDivider className='divider' content='我是有底线的' fontColor='#888' lineColor='#eee' />
                    }{
                      maps.more && maps.list.length>=6 &&
                      <AtDivider className='divider' content='加载中...' fontColor='#888' lineColor='#eee' />
                    }
                  </View>
                }{
                  maps.empty && !maps.more && 
                  <XEmpty
                    className="empty"
                    info="站在别人的肩上看世界"
                    info02="也是不错的选择哦～！"
                  />
                }
              </AtTabsPane >
            }

            if(item.key === EUserList.my) {
              return <AtTabsPane current={cur} index={index} >
                {
                  !myNotes.empty && 
                  <View className="content" style={{paddingTop: isSelf ? 20: 5}}>
                    {
                      MyNotesList
                    }{
                      !myNotes.more && myNotes.list.length>=3 &&
                      <AtDivider className='divider' content='我是有底线的' fontColor='#B0B0B0' lineColor='#eee' />
                    }{
                      myNotes.more && myNotes.list.length>=3 &&
                      <AtDivider className='divider' content='加载中...' fontColor='#B0B0B0' lineColor='#eee' />
                    }
                  </View>
                }{
                  myNotes.empty && !myNotes.more &&
                  <XEmpty
                    className="empty"
                    info="你去过的好地方"
                    info02="在这里都算数～～快去发现吧！"
                  />
                }  
              </AtTabsPane >
            }

            if(item.key === EUserList.save) {
              return <AtTabsPane  current={cur} index={2} >
                {
                  !savePoints.empty &&
                  <View className="content">
                    {
                      SavePointsList
                    }{
                      !savePoints.more && savePoints.list.length>=3 &&
                      <AtDivider className='divider' content='我是有底线的' fontColor='#888' lineColor='#eee' />
                    }{
                      savePoints.more && savePoints.list.length>=3 &&
                      <AtDivider className='divider' content='加载中...' fontColor='#888' lineColor='#eee' />
                    }
                  </View>
                }{
                  savePoints.empty && !savePoints.more &&
                  <XEmpty
                    className="empty"
                    info="收藏每一个精彩的瞬间"
                    info02="唤醒每一个重要的时刻"
                  />
                }
              </AtTabsPane >
            }

          })
        }
      </AtTabs>

      <XSheet />
      <XPoster />
    </View>
  );
};

export default PUser;
