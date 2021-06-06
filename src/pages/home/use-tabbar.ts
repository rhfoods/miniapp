import EFire from '@/core/enum/fire';
import MyMap from '@/models/map';
import Tool from '@/utils/tools';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import User, { IUserInfo } from '@/models/user';
import { IMapTabBtn } from './tab-bar';
import { useMsg } from '@/context/message-ctx';

export enum EHomeTabbar {
  msg = 'msg', // 消息
  add = 'add', // 添加
  reset = 'reset', // 重定位
  home = 'home', // 首页
  save = 'save', // 收藏
  common = 'common', // 公共地图
  note = 'note', // 添加日记
  point = 'point', // 添加点位
}

function useTabbar(userInfo: IUserInfo) {
  const [icons, setIcons] = useState<IMapTabBtn[]>([]);
  const [saved, setSaved] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      init(userInfo, saved);
    }
  }, [saved, show]);

  const init = async (userInfo, saved: boolean) => {
    setSaved(saved);
    const isSelf = User.isSelf(userInfo.userId);
    if (isSelf) {
      const icons = Tool.deepClone([MSG, ADD, RESET, COMMON])
      setIcons(icons);
      setShow(true);
      return;
    }
    if (saved) {
      const icons = Tool.deepClone([HOME, SAVE, RESET, COMMON])
      setIcons(icons);
      setShow(true);
      return;
    }
    const icons = Tool.deepClone([HOME, UNSAVE, RESET, COMMON])
    setIcons(icons);
    setShow(true);
  };
  /**
   * 打开消息页面
   */
  function openMsg() {
    // Tool.load.alert('功能正在开发中，敬请期待');
    Taro.navigateTo({url: '/packageA/pages/message/index'})
    // msg.setMsg({
    //   ...msg.info,
    //   total: 0
    // })
  }
  /**
   * 添加点位
   */
  async function addPoint() {
    // const { promisic, pointForm } = Tool;
    // await promisic(pointForm)();
    Tool.pointForm({})
  }
  /**
   * 添加文章
   */
  async function addNote(user, self) {
    const { promisic, articleForm } = Tool;
    const res: any = await promisic(articleForm)({
      openDetail: true, // 填完表单打开点位详情页面
      showChoosePoint: true,
    });
    if (res.form) {
      Tool.onfire.fire(EFire.addPointHome, res.point);
    }
  }
  /**
   * 地图(收藏/取消收藏)
   */
  async function mapSave(userInfo: any, sortId: number, sortName: string) {
    if (saved) {
      const res = await Taro.showModal({
        title: '提示',
        content: '确定不再收藏本地图吗?',
      });
      if (res.confirm) {
        setSaved(!saved);
        MyMap.deleteMap(userInfo.userId, sortId);
        Tool.onfire.fire(EFire.delMap, {
          createrId: userInfo.userId,
        });
      }
      return;
    }
    setSaved(!saved);
    MyMap.saveMap(userInfo.userId, sortId);
    Tool.onfire.fire(EFire.addMap, {
      ...userInfo,
      createrId: userInfo.userId,
      sortId,
      sortName,
    });
  }

  return {
    tabbarIcons: icons,
    show,
    addPoint,
    addNote,
    mapSave,
    openMsg,
    setSaved,
    init,
  };
}

export default useTabbar;

const MSG: IMapTabBtn = {
  key: EHomeTabbar.msg, 
  msg: 0, 
  icon: 'pinglun', 
  size: '24', 
  whiteColor: '#756B48', 
  blackColor: '#ffffff' 
}
const NOTE: IMapTabBtn = {
  key: EHomeTabbar.note, 
  msg: 0, 
  icon: 'xiexin', 
  size: '24', 
  whiteColor: '#FF5C45', 
  blackColor: '#FF5C45' 
}
const POINT: IMapTabBtn = {
  key: EHomeTabbar.point, 
  msg: 0, 
  icon: 'tianjiadianwei', 
  size: '28', 
  whiteColor: '#FF943E', 
  blackColor: '#FF943E' 
}
const ADD: IMapTabBtn = {
  key: EHomeTabbar.add, 
  msg: 0, 
  icon: 'jia2', 
  size: '24', 
  whiteColor: '#756B48', 
  blackColor: '#FFFFFF',
  children: [POINT, NOTE],
}
const RESET: IMapTabBtn = {
  key: EHomeTabbar.reset, 
  msg: 0, 
  icon: 'weizhi1', 
  size: '24', 
  whiteColor: '#756B48', 
  blackColor: '#ffffff' 
}
const COMMON: IMapTabBtn = {
  key: EHomeTabbar.common, 
  msg: 0, 
  icon: 'diqiu', 
  size: '24', 
  whiteColor: '#FF943E', 
  blackColor: '#FFD448' 
}
const HOME: IMapTabBtn = {
  key: EHomeTabbar.home, 
  msg: 0, 
  icon: 'wode-tiaozhuan', 
  size: '26', 
  whiteColor: '#756B48', 
  blackColor: '#ffffff' 
}
// 已收藏
const SAVE: IMapTabBtn = {
  key: EHomeTabbar.save, 
  msg: 0, 
  icon: 'shoucang1', 
  size: '26', 
  whiteColor: '#FFD448', 
  blackColor: '#FFD448' 
}
// 未收藏
const UNSAVE: IMapTabBtn = {
  key: EHomeTabbar.save, 
  msg: 0, 
  icon: 'shoucang1', 
  size: '26', 
  whiteColor: '#FFFFFF', 
  blackColor: '#FFFFFF' 
}
