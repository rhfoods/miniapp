import { POSTMapShare, POSTTransferPublic } from '@/api/api';
import XAlertPoster from '@/component/alert/alert-poster';
import XSheet, { ESharetItem } from '@/component/alert/sheet';
import XToast from '@/component/alert/toast';
import XLoading from '@/component/loading';
import XPoster, { EPostType } from '@/component/poster';
import { IHomeParams } from '@/core/interface/nav';
import useLogin from '@/hooks/use-login';
import useParams from '@/hooks/use-params';
import useTheme from '@/hooks/use-theme';
import useUserinfo from '@/hooks/use-user-info';
import MyMap from '@/models/map';
import Point, { ETransferSubInfo } from '@/models/point';
import Tool from '@/utils/tools';
import { Button, CoverView, View } from '@tarojs/components';
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro';
import React, { FC, useEffect, useMemo } from 'react';
import XMap from './map';
import useCurP from './use-curp';
import useFire from './use-fire';
import useForwardPic from './use-forwardpic';
import XHomeTabbar, { IMapTabBtn } from './tab-bar';
import usePoints, { IUsePoints } from './use-points';
import useSort, { ISort } from './use-sort';
import useTabbar, { EHomeTabbar } from './use-tabbar';
import useAuthorize from '@/hooks/use-authorize';
import Throttle from '@/utils/throttle';
import XAlertShare from '@/component/alert/share';
import useHomeShare from './use-home-share';
import XExplain, { EShowType } from '@/component/explain';
import useHomeState from './use-home-state';
import XMapTitle from '@/component/nav/map-title';
import XMapBtns, { EHomeBtn, IMapbtnInfo } from '@/component/nav/map-btns';
import useHomeBtns from './use-btns';
import User, { IUserInfo } from '@/models/user';
import './index.scss';
import useMap, { EPointType } from '../../hooks/use-map';
import XAlertAddService, { useAlertAddService } from '@/component/alert/add-service';
import { useMsg } from '@/context/message-ctx';
import XForwardPic from '@/component/forward-pic';

let userInfo: any;
let curSortId: number;

const Home: FC = () => {
  const theme = useTheme();
  const params: IHomeParams = useParams();
  const authorize = useAuthorize()
  const self = useLogin();
  const user = useUserinfo(self.info);
  const sort = useSort();
  const points: IUsePoints = usePoints();
  const curPoint = useCurP(params, points);
  const tabbar = useTabbar(user.info);
  const share = useHomeShare(self.info, params);
  const homeBtns = useHomeBtns(user.isOwn)
  const addServiceExp = useAlertAddService()
  const msg = useMsg()
  /**
   * 按分类过滤点位
   */
  const filterPoints = useMemo(() => {
    if(points.type === EPointType.PO) {
      return Point.filterPoints(sort.sortId, points.items);
    }
    return points.items // 集合点没有sortId, 不过滤
  }, [sort.sortId, points.items]);
  /**
   * 地图信息
   */
  const map = useMap(filterPoints, curPoint.info, theme.theme, points.type, false);
  /**
   * 页面状态
   */
  const state = useHomeState(self, map, params)
  /**
   * 转发图片
   */
  const forwardPic = useForwardPic({
    ready: points.items ? true : false,
    info: `${sort.total}个地点等你来寻`
  })
  useFire(user.isOwn, points, curPoint, user, sort, forwardPic, map);
  /**
   * 是否显示底部tabbar
   */
  const showTabbar = useMemo(() => {
    if(!tabbar.show) {
      return false
    }
    if(user.isOwn) {
      return true
    }
    if(params?.phone) {
      return false
    }
    return true
  }, [tabbar.show, user.isOwn, params?.phone])
  /**
   * 
   */
  const explainType = useMemo(() => {
    if(!user.isOwn && !params?.showBack) {
      return EShowType.others2my
    }
  }, [user, params])
  /**
   * 
   */
  useDidShow(() => {
    userInfo = user.info;
    curSortId = sort.sortId;
  });
  /**
   * 
   */
  useEffect(() => {
    userInfo = user.info;
    curSortId = sort.sortId;
  }, [user.info, sort.sortId]);
  /**
   * 点击了某一个坐标
   */
  async function pointTap(id: number) {
    if(points.type === EPointType.PO) {
      curPoint.setCurPId(id);
      Tool.detail({
        psaveId: id,
        userId: userInfo.userId,
        hideTab: params.phone ? true : false
      });
    } else {
      const result = await points.cityTap({
        createrId: userInfo.userId,
        sortId: sort.sortId,
        type: points.type,
        code: String(id),
      })
      MyMap.includeMarkers(result, map)
      await Tool.sleep(500)
      points.updateOldInfo()
    }
  }
  /**
   * 点击底部tabbar
   */
  function tabTap(item: IMapTabBtn, uInfo: IUserInfo) {
    if(uInfo) {
      self.setInfo(uInfo)
      self.info.userId === user.info.userId && user.setInfo(uInfo)
    }
    if(item.key === EHomeTabbar.reset) {
      MyMap.moveHere(map, points, userInfo.userId, sort.sortId)
    }
    if(item.key === EHomeTabbar.save) {
      tabbar.mapSave(user.info, sort.sortId, sort.sortName);
    }
    if(item.key === EHomeTabbar.home) {
      Tool.openMap({ reLaunch: true });
    }
    if(item.key === EHomeTabbar.msg) {
      tabbar.openMsg();
    }
    if(item.key === EHomeTabbar.point) {
      tabbar.addPoint()
    }
    if(item.key === EHomeTabbar.note) {
      tabbar.addNote(user, self)
    }
    if(item.key === EHomeTabbar.common) {
      openCommonMap()
    }
  }
  /**
   * 打开公共地图
   */
  function openCommonMap() {
    if(user.isOwn) {
      Taro.navigateBack({fail: () => {
        Taro.reLaunch({url: '/pages/map/index'})
      }})
    }else {
      Taro.reLaunch({url: '/pages/map/index'})
    }
  }
  /**
   * 点击左侧按钮
   */
  function btnsTap(item: IMapbtnInfo, userInfo) {
    item.key === EHomeBtn.trigger && onTrigger()
    item.key === EHomeBtn.share && updateUserAlertShare(userInfo)
    item.key === EHomeBtn.wxServer && addServiceExp.alert()
    item.key === EHomeBtn.recommend && recommend()
  }
  /**
   * 推荐
   */
  function recommend() {
    Tool.recommendForm({
      toUserId: user.info.userId
    })
  }
  /**
   * 选择分类
   */
  async function chooseCatgray() {
    // 选分类
    const { chooseCatgray, promisic } = Tool;
    const res: any = await promisic(chooseCatgray)({
      userId: user.info?.userId,
      showAll: true,
      sortId: sort.sortId,
    });
    const sortInfo: ISort = {
      sortId: res.sortId,
      sortName: res.name,
      total: res.points,
    }
    sort.setSort(sortInfo)
    // 获取points
    let mapInfo = await MyMap.getMapInfo()
    const pointsRes: any = await points.citiesOrPoints({
      createrId: userInfo.userId,
      sortId: sortInfo.sortId,
      code: mapInfo.code || 610422,
      scale: mapInfo.scale,
    })
    tabbar.setSaved(pointsRes.isSaved)
    MyMap.includeMarkers(pointsRes, map)
    points.updateOldInfo(mapInfo)
  }
  /**
   * 点击按钮: 一键迁移
   */
  function onTransfer() {
    const phone = params.phone
    const userId = params.userId
    const url = `/packageA/pages/verification/index?phone=${phone}&userId=${userId}`
    Taro.navigateTo({url})
  }
  /**
   * 给后台发送分类操作，后台进行对应的计数操作
   */
  async function mapShareCount(user) {
    await POSTMapShare({
      createrId: user.info.userId,
    });
  }
  /**
   * 点击按钮: 分享地图
   */
  async function shareMap() {
    authorize.refresh()
    if(!sort.total) {
      Tool.load.alert('您还没有点位哦')
      return
    }
    const { promisic, alertShare  } = Tool;
    const res: any = await promisic(alertShare)({
      options: share.options,
      row2: share.row2
    })
    if(res.text === ESharetItem.transfer) {
      Taro.navigateTo({url: '/packageA/pages/transfer/index'})
    }
    if(res.text === ESharetItem.embed) {
      Tool.openEmbed({
        userId: user.info.userId,
        sortId: sort.sortId,
        path: 'pages/home/index'
      })
    }
    if(res.text === ESharetItem.poster) {
      getPoster()
    }
    if(res.text === ESharetItem.fllowWx){
      Taro.navigateTo({url: '/packageA/pages/wx-fllow/index'})
    }
    if(res.text === ESharetItem.transferPoint) {
      chooseCity()
    }
  }
  /**
   * 迁移点位选择城市
   */
  async function chooseCity() {
    const { promisic, chooseCity, successFail } = Tool
    const res: any = await promisic(chooseCity)({
      type: 'detail',
      donotBack: true
    })
    POSTTransferPublic({
      cityName: res.name,
      providerId: self.info.userId,
    }, {
      showErr: () => {}
    })
    .then(async res => {
      successFail({
        type: 'success',
        info: '恭喜您，迁移成功！',
        redirect: true,
        success: () => Taro.reLaunch({url: '/pages/home/index'})
      })
    })
    .catch(err => {
      successFail({
        type: 'fail',
        redirect: true,
        info: err.errMsg,
        subInfo: ETransferSubInfo[`C${err.errCode}`],
        list: err.extraMsg?.map(item => `name: ${item.name}, tag: ${item.tag}`)
      })
    })
  }
  /**
   * 生成海报
   */
  function getPoster() {
    if(!Tool.alertPoster) {
      return
    }
    const userInfo = user.info.nickName ? user.info : User.info()
    const title = userInfo.gender === '1'
    ? '他正在用自己的方式记录生活~'
    : '她正在用自己的方式记录生活~'
    Tool.alertPoster({
      type: EPostType.map,
      user: userInfo,
      title,
      info: `${sort.total}个地点等你来寻`,
      sortId: curSortId,
      width: 510,
      height: 800,
      page: 'pages/home/index',
    })
    mapShareCount(user);
  }
  /**
   * 更新userInfo, 然后打开个人主页
   */
  async function updateUserOpenCenter(userInfo: IUserInfo) {
    user.setInfo(userInfo);
    const isSelf = userInfo.userId === self.info.userId
    if(isSelf) {
      self.setInfo(userInfo)
      Tool.pageUser({ userId: userInfo.userId });
    }
    if(!isSelf && userInfo?.nickName) {
      Tool.pageUser({ userId: userInfo.userId });
    }
  }
  /**
   * 更新userInfo, 然后打开弹出分享
   */
  function updateUserAlertShare(userInfo) {
    if(userInfo && userInfo.userId === self.info.userId) {
      user.setInfo(userInfo);
      self.setInfo(userInfo);
    }
    shareMap();
  }
  /**
   * 修改地图样式
   */
  async function onTrigger() {
    await map.update();
    theme.trigger();
  }
  /**
   *
   */
  async function mapReady() {
    try {
      msg.refresh()
      map.eventInit()
      const userInfo = await user.getInfo(params)
      const sortInfo = await sort.init(params, userInfo)
      const mapInfo = await MyMap.getMapInfo()
      const pointsRes: any = await points.citiesOrPoints({
        createrId: userInfo.userId,
        sortId: sortInfo.sortId,
        scale: mapInfo.scale,
        code: mapInfo.code,
      })
      curPoint.init(params, pointsRes.points)
      tabbar.init(userInfo, pointsRes.isSaved)
      MyMap.includeMarkers(pointsRes, map)
      points.updateOldInfo(mapInfo)
    } catch (error) {
      refresh()
    }
  }
  /**
   * 拖拽or缩放比例
   */
  async function onGetPoints() {
    points.dragOrScale({
      createrId: user.info.userId,
      sortId: sort.sortId,
    })
  }
  /**
   * 分享
   */
  useShareAppMessage(() => {
    mapShareCount(user);
    return {
      title: `${userInfo.nickName}正在用自己喜欢的方式记录生活`,
      imageUrl: forwardPic.pic,
      path: `/pages/home/index?userId=${userInfo.userId}&sortId=${curSortId}`,
    };
  });
  /**
   * 刷新页面
   */
  async function refresh() {
    Taro.clearStorageSync()
    await Throttle.wait(1000)
    let timer = setTimeout(() => {
      Tool.openMap({
        ...params,
        reLaunch: true
      })
      clearTimeout(timer)
    }, 1500)
  }
  /**
   * 
   */
  useEffect(() => {
    if(self.state === 'err') {
      refresh()
    }
  }, [self.state])

  if (state.state === 'loading') {
    return <XLoading />
  }

  return (
    <View className="p-home">
      <XMap
        // isOld={true}
        isOld={map.isOld}
        markers={map.markers}
        mapId={map.mapId}
        theme={theme.theme}
        latitude={map?.latitude}
        longitude={map?.longitude}
        scale={map.scale}
        onGetPoints={onGetPoints}
        onReady={mapReady}
        onPointTap={pointTap}
      />
      {
        tabbar.show &&
        <XMapTitle 
          theme={theme.theme} 
          sort={sort}
          showBack={params.showBack}
          onCatgrayTap={chooseCatgray}
        />
      }{
        showTabbar &&
        <XHomeTabbar
          theme={theme.theme}
          onItemTap={tabTap}
          userInfo={user.info}
          icons={tabbar.tabbarIcons}
          onGetUserInfo={updateUserOpenCenter}
        />
      }{
        tabbar.tabbarIcons.length > 0 && !showTabbar &&
        <CoverView className='transfer-fix' >
          <Button className='btn-long btn-diy' onClick={onTransfer} >一键迁移数据</Button>
        </CoverView>
      }{
        showTabbar&&
        <XMapBtns 
          className='map-btns' 
          items={homeBtns.items}  
          theme={theme.theme}
          onClick={btnsTap}
        />
      }{
        showTabbar &&
        <XExplain type={explainType}/>
      }
      <XToast />
      <XSheet />
      <XPoster />
      <XAlertPoster />
      <XForwardPic />
      <XAlertShare />
      <XAlertAddService exp={addServiceExp} />
    </View>
  );
};

export default Home;
