import {
  DELETENoteSave,
  pointSave,
  pointUnSave,
  POSTMapShare,
  POSTNoteSave,
  PUTNoteLike,
} from '@/api/api';
import { ButtonNames, PointOwnTypes } from '@/common/constants/point.constant';
import { ESharetItem, IGoodOrBad } from '@/component/alert/sheet';
import { EDetailTabItem } from '@/component/nav/detail-tabbar';
import { EPostType } from '@/component/poster';
import EFire from '@/core/enum/fire';
import Media from '@/models/media';
import Note from '@/models/note';
import Point from '@/models/point';
import Theme from '@/models/theme';
import User from '@/models/user';
import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';

const shareList = [
  { 
    type: 'share', 
    text: ESharetItem.share, 
    icon: 'weixin', 
    key: 'weixin',
    iconColor: '#3ABF11', 
  },{ 
    type: 'common', 
    text: ESharetItem.poster, 
    icon: 'pengyouquan', 
    key: 'pengyouquan', 
    colorFull: true,
    className: 'share-poster',
  }
]
class DetailTabbar {
  /**
   * 给后台发送分享数据
   */
  static async mapShareCount(point, note) {
    if (note.info) {
      await POSTMapShare({
        noteId: note.info.noteId,
      });
    } else {
      await POSTMapShare({
        psaveId: point.info.psaveId,
      });
    }
  }
  /**
   * 授权后: 跟新本人用户信息
   */
  static updateSelf(self) {
    let selfInfo = self.info;
    if (!selfInfo.nickName) {
      selfInfo = User.info();
      self.setInfo(selfInfo);
      Tool.onfire.fire(EFire.setUser, selfInfo);
    }
  }
  /**
   * 授权后: 更新文章用户信息
   */
  static updateTopCard(topCard) {
    let topUser = topCard.info
    let selfInfo = User.info();
    if(topUser.userId === selfInfo.userId && !topUser.nickName) {
      topCard.setInfo(selfInfo)
      return selfInfo
    }
    return topUser
  }
  /**
   * 评论
   */
  static async Comments(topNote, self, topCard) {
    DetailTabbar.updateSelf(self)
    DetailTabbar.updateTopCard(topCard)
    // 弹出评论框
    const { promisic, alertComment } = Tool
    const comments = await promisic(alertComment)({
      noteId: topNote.info.noteId
    })
    topNote.setInfo(info => {
      return { ...info, comments }
    })
  }
  /**
   * 分享
   */
  static async SHARE(topCard, note, point, params, self) {
    DetailTabbar.updateSelf(self)
    const topUser = DetailTabbar.updateTopCard(topCard)
    const { promisic, alertShare } = Tool;
    const res: any = await promisic(alertShare)({options: shareList,});
    if (res.text == ESharetItem.poster) {
      if (!Tool.alertPoster) {
        return;
      }
      await Tool.alertPoster({
        type: EPostType.point,
        user: topUser,
        note: note.info,
        point: point.info,
        isVideo: Media.isVideo(note.info?.medias),
        userId: params.userId,
        title: note.info?.title || point.info.name,
        info: Tool.text.ellipsis(point.info.name),
        width: 510,
        height: 800,
        page: 'pages/detail/index',
      });
      await DetailTabbar.mapShareCount(point, note);
    }
  }
  /**
   * 删除点位
   */
  static async DELETE(point) {
    Tool.load.show('点位删除中');
    await pointUnSave({
      psaveId: point.info.psaveId,
    });
    await Tool.load.hide('删除成功');
    Taro.navigateBack();
    Tool.onfire.fire(EFire.delPointUser, point.info);
  }
  /**
   * 添加日记
   */
  static async FIND(topNote, point, forward, topCard) {
    const { promisic, articleForm } = Tool;
    const res: any = await promisic(articleForm)({
      pointInfo: point.info,
    });
    if (res.form) {
      topNote.setShow(false);
      topNote.setShow(true);
      topNote.setInfo(() => {
        const note = { ...res.form };
        note.updatedAt = new Date().toISOString();
        note.shares = 0;
        note.likes = 0;
        note.comments = 0;
        note.userId = User.userId();
        note.logo = res.point.logo;
        note.tag = res.point.tag;
        note.price = res.point.price;
        forward.refresh(note); // 跟新转发图片
        return note;
      });
      topCard.setInfo(User.info());
      Tool.onfire.fire(EFire.addNoteUser, { ...res.point, ...res.form });
    }
    if (res.point) {
      point.setInfo((point) => {
        const p = { ...point, ...res.point };
        if (res.form?.noteId) {
          p.noteId = res.form.noteId;
          p.topNoteId = res.form.noteId;
          if (p.ownType === PointOwnTypes.ONLY_SAVE) {
            p.ownType = PointOwnTypes.SAVE_FIND;
          }
        }
        return p;
      });
    }
    if (res.point || res.form) {
      Tool.alertPoster && Tool.alertPoster({ type: EPostType.clear });
    }
  }
  /**
   * 修改日记
   */
  static async MODIFY(topNote, point, forward) {
    const { promisic, articleForm } = Tool;
    const res: any = await promisic(articleForm)({
      noteInfo: topNote.info,
      pointInfo: point.info,
      hideRecommend: true,
    });
    if (res.form) {
      topNote.setInfo((topNote) => {
        const newTopNote = {
          ...topNote,
          ...res.form,
          status: Note.getState(topNote.status),
        };
        forward.refresh(newTopNote); // 跟新转发图片
        return newTopNote;
      });
      Tool.onfire.fire(EFire.updatePointUser, {
        ...res.point,
        ...res.form,
        status: Note.getState(topNote.info.status),
      });
    }
    if (res.point) {
      point.setInfo((point) => {
        return {
          ...point,
          ...res.point,
        };
      });
    }
    if (res.point || res.form) {
      Tool.alertPoster && Tool.alertPoster({ type: EPostType.clear });
    }
  }
  /**
   * 点击按钮:点赞/取消点赞
   */
  static LikeTrigger(topNote, isLiked, point) {
    if (isLiked === true) {
      Tool.alertIcon({
        icon: 'dianzanshixin_huaban1-01',
        color: Theme.red,
      });
    }
    PUTNoteLike({
      noteId: topNote.info.noteId,
      isLiked,
    });
    topNote.setInfo((note) => {
      note.isLiked = isLiked;
      isLiked ? note.likes++ : note.likes--;
      Tool.onfire.fire(EFire.updatePointUser, {
        ownType: point.info.ownType,
        psaveId: point.info.psaveId,
        likes: note.likes,
      });
      return { ...note };
    });
  }
  /**
   * 点击按钮: 我的
   */
  static MYSELF(point, self, count) {
    Tool.detail({
      psaveId: point.info.psaveId,
      topNoteId: point.info.noteId,
      userId: self.info.userId,
      redirectTo: count > 0,
      count: count === 0 ? count + 1 : count,
    });
  }
  /**
   * 点击按钮: 打卡
   */
  static async CLOCK(point, topNote, distance) {
    const { promisic, goodOrBad } = Tool;
    const params = Tool.cleanObject<IGoodOrBad>({
      psaveId: point.info?.psaveId,
      noteId: topNote.info?.noteId,
      distance
    })
    const res = await promisic(goodOrBad)(params);
    if (res === 'GOOD') {
      Tool.alertIcon({
        icon: 'xin',
        color: Theme.red,
      });
      point.setInfo((p) => {
        p.goods++;
        p.isClocked = true;
        return { ...p };
      });
    }
    if (res === 'BAD') {
      Tool.alertIcon({
        icon: 'xinsui',
        color: '#333333',
      });
      point.setInfo((p) => {
        p.bads++;
        p.isClocked = true;
        return { ...p };
      });
    }
    Tool.onfire.fire(EFire.updatePointHome, {
      isPassed: true,
      psaveId: point.info.psaveId,
    });
  }
  /**
   * 收藏
   */
  static async SAVE(point, topCard, topNote) {
    let res = null;
    if (topNote.info) {
      res = await POSTNoteSave({
        noteId: topNote.info.noteId,
      });
      topNote.setInfo((note) => {
        note.isSaved = true;
        return { ...note };
      });
    } else {
      res = await pointSave({
        psaveId: point.info.psaveId,
      });
    }
    point.setInfo((p) => {
      p.saves++;
      p.newPsaveId = res?.point?.psaveId; // 取消收藏时要用
      p.ownType = PointOwnTypes.ONLY_SAVE;
      Point.curPoint = p;
      Tool.onfire.fire(EFire.addPointHome, res.point);
      Tool.onfire.fire(
        EFire.addPointUser,
        {
          ...p,
          ...topCard.info,
          ...topNote.info,
          ...res.point,
          updatedAt: new Date().toISOString(),
        },
        2
      );
      return { ...p };
    });
    Taro.showToast({
      title: '已成功收藏！',
      icon: 'none',
      mask: true,
    });
  }
  /**
   * 取消收藏
   */
  static async UNSAVE(point, topNote) {
    if (topNote.info && topNote.info.isMy) {
      Taro.showToast({
        title: '您已在此发表过内容，请到个人主页进行管理',
        icon: 'none',
        mask: true,
      });
      return;
    }
    if (topNote.info && topNote.info.isSaved) {
      const result = await Taro.showModal({
        title: '提示',
        content: '您真的要取消收藏吗？',
      });
      if (result.confirm) {
        await DELETENoteSave({
          noteId: topNote.info.noteId,
        });
        topNote.setInfo((note) => {
          note.isSaved = false;
          return { ...note };
        });
      }
    } else {
      if (
        point.info.ownType === PointOwnTypes.SAVE_FIND ||
        point.info.ownType === PointOwnTypes.MY_CREATE
      ) {
        Taro.showToast({
          title: '这个点位已经在你的地图上了，不要重复收藏哦~~',
          icon: 'none',
          mask: true,
        });
        return;
      }
      if (point.info.newPsaveId > 0) {
        const result = await Taro.showModal({
          title: '提示',
          content: '您真的要取消收藏吗？',
        });
        if (result.confirm) {
          await pointUnSave({
            psaveId: point.info.newPsaveId,
          });
          point.setInfo((p) => {
            p.saves--;
            delete p.newPsaveId;
            return { ...p };
          });
        }
      }
    }
  }

  /**
   * 设置底部图标的数值
   */
  static setButtonCount(point: any, Buttons: any, note?: any) {
    if (!note) {
      Buttons.SHARE.counts = 0;
      Buttons.SAVE.counts = point.saves;
    }
    Buttons.COMMENT.counts = note ? note.comments : 0;
    Buttons.UNLIKE.counts = note ? note.likes : 0;
    note ? (Buttons.SHARE.counts = note.shares) : null;
    Buttons.LIKE.counts = note ? note.likes : 0;
    Buttons.CLOCK.counts = point.goods + point.bads;
    Buttons.CLOCKED.counts = point.goods + point.bads;
  }

  /**
   * 通过自己地图的点获取button列表
   */
  static getMyButton(point: any, Buttons: any, note?: any) {
    const buttons = [Buttons.SHARE];

    this.setButtonCount(point, Buttons, note);

    if (note) {

      buttons.push(Buttons.COMMENT);
      if (note.noteId === point.noteId) {
        buttons.push(Buttons.MODIFY);
      } else {
        if (point.noteId === 0) {
          buttons.push(Buttons.FIND);
        } else {
          buttons.push(Buttons.MYSELF);
        }
      }
      if (note.isLiked) {
        buttons.push(Buttons.UNLIKE);
      } else {
        buttons.push(Buttons.LIKE);
      }
    } else {
      buttons.push(Buttons.FIND);
    }

    point.isClocked
      ? buttons.push(Buttons.CLOCKED)
      : buttons.push(Buttons.CLOCK);

    return buttons;
  }

  /**
   * 通过别人地图获取button列表
   */
  static getOtherButton(point: any, Buttons: any, note?: any) {
    const buttons = [Buttons.SHARE];
    this.setButtonCount(point, Buttons, note);

    if (note) {
      buttons.push(Buttons.COMMENT);
      if (note.isSaved || note.isMy) {
        buttons.push(Buttons.UNSAVE);
      } else {
        buttons.push(Buttons.SAVE);
      }
      if (note.isLiked) {
        buttons.push(Buttons.UNLIKE);
      } else {
        buttons.push(Buttons.LIKE);
      }
    } else {
      if (point.newPsaveId) {
        buttons.push(Buttons.UNSAVE);
      } else {
        buttons.push(Buttons.SAVE);
      }
    }

    point.isClocked
      ? buttons.push(Buttons.CLOCKED)
      : buttons.push(Buttons.CLOCK);

    return buttons;
  }
}

export const BottomButtons = {
  SHARE: {
    name: ButtonNames.SHARE,
    icon: 'fenxiang-01',
    iconColor: '#353535',
    type: EDetailTabItem.iocn,
    counts: 0,
  },
  FIND: {
    name: ButtonNames.FIND,
    icon: 'jia',
    iconColor: '#ffffff',
    type: EDetailTabItem.cIcon,
  },
  CLOCK: {
    name: ButtonNames.CLOCK,
    icon: 'daka',
    iconColor: '#353535',
    type: EDetailTabItem.iocn,
    counts: 0,
  },
  CLOCKED: {
    name: ButtonNames.CLOCKED,
    icon: 'dakashixin',
    iconColor: Theme.red,
    type: EDetailTabItem.iocn,
    counts: 0,
  },
  COMMENT: {
    name: ButtonNames.COMMENT,
    icon: 'pinglun1',
    iconColor: '#353535',
    type: EDetailTabItem.iocn,
    counts: 0,
  },
  LIKE: {
    name: ButtonNames.LIKE,
    icon: 'dianzan-01',
    iconColor: '#353535',
    type: EDetailTabItem.iocn,
    counts: 0,
  },
  UNLIKE: {
    name: ButtonNames.UNLIKE,
    icon: 'dianzanshixin_huaban1-01',
    iconColor: Theme.red,
    type: EDetailTabItem.iocn,
    counts: 0,
  },
  MODIFY: {
    name: ButtonNames.MODIFY,
    icon: 'bianji',
    iconColor: '#353535',
    type: EDetailTabItem.cIcon,
    size: '24',
  },
  SAVE: {
    name: ButtonNames.SAVE,
    icon: 'quxiaoshoucang-01',
    iconColor: '#353535',
    type: EDetailTabItem.cIcon,
    counts: 0,
  },
  UNSAVE: {
    name: ButtonNames.UNSAVE,
    icon: 'shoucang',
    iconColor: Theme.red,
    type: EDetailTabItem.cIcon,
    counts: 0,
  },
  MYSELF: {
    name: ButtonNames.MYSELF,
    icon: 'wode',
    iconColor: '#353535',
    type: EDetailTabItem.cIcon,
  },
};

export default DetailTabbar;
