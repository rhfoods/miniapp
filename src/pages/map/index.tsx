import React, { FC } from 'react'
import { View } from '@tarojs/components'
import { ETheme } from '@/core/enum/theme'
import XMap from '../home/map'
import Tool from '@/utils/tools'
import XMapTitle from '@/component/nav/map-title'
import XCommonTab, { ICommonTabItem } from './tab'
import useCommonTab, { ADDNOTE, ECommonMap } from './use-commontab'
import Taro, { useShareAppMessage } from '@tarojs/taro' 
import useAuthorize from '@/hooks/use-authorize'
import useLogin from '@/hooks/use-login'
import useCommonSort from './use-com-sort'
import useParams from '@/hooks/use-params'
import { ICommonMapParams } from '@/core/interface/nav'
import useMap, { EPointType } from '@/hooks/use-map'
import useCommonPoints from './use-com-points'
import useCommonCurP from './use-com-curp'
import Point from '@/models/point'
import MyMap from '@/models/map'
import EFire from '@/core/enum/fire'
import useCommonShare from './use-com-share'
import XAlertShare from '@/component/alert/share'
import XMapBtns, { EHomeBtn, IMapbtnInfo } from '@/component/nav/map-btns'
import useCommonBtns from './use-com-btns'
import XAlertAddService, { useAlertAddService } from '@/component/alert/add-service'
import { ESharetItem } from '@/component/alert/sheet'
import User, { IUserInfo } from '@/models/user'
import XPoster, { EPostType } from '@/component/poster'
import XAlertPoster from '@/component/alert/alert-poster'
import useForwardPic from '../home/use-forwardpic'
import XExplain, { EShowType } from '@/component/explain'
import { useMsg } from '@/context/message-ctx'
import XLoading from '@/component/loading'
import XTabCommonItem from './tab/item'
import './index.scss'
import XForwardPic from '@/component/forward-pic'

const PageMap: FC = () => {

  const params: ICommonMapParams = useParams();
  const self = useLogin();
  const authorize = useAuthorize()
  const sort = useCommonSort();
  const points = useCommonPoints(sort)
  const curPoint = useCommonCurP(points)
  const commonBtns = useCommonBtns()
  const footer = useCommonTab()
  const share = useCommonShare()
  const addServiceExp = useAlertAddService()
  const map = useMap(points.items, curPoint.info, ETheme.black, points.type, false);
  const msg = useMsg()

  /**
   * 转发图片
   */
  const forwardPic = useForwardPic({
    ready: points.items ? true : false,
    info: `${sort.total}个地点等你来寻`
  })
  /**
   * 分享
   */
  useShareAppMessage(() => {
    return {
      title: `${User.info().nickName}正在用自己喜欢的方式记录生活`,
      imageUrl: forwardPic.pic,
      path: `/pages/map/index?sortId=${sort.sortId}&cityCode=${sort.cityCode}`,
    };
  });
  /**
   * 
   */
  async function mapReady() {
    try {
      Tool.sleep(3000).then(() => msg.init())
      map.eventInit()
      let sortInfo
      footer.setShow(true)
      if(params.cityCode){
        sortInfo = await sort.initByParam(params)
      }else {
        let cities = await points.mapCities()
        if(!cities.length) return
        let city = await Point.nearlyPoint(cities, map) // 需要用户授权位置
        sortInfo = await sort.initByPoint(city)
      }
      const res = await points.mapPoints({
        sortId: sortInfo.sortId,
        cityCode: sortInfo.cityCode
      })
      MyMap.includeMarkers(res, map)
    }
    catch (error) {
      Tool.sleep(3000).then(() => {
        Taro.clearStorageSync()
        Taro.reLaunch({url: '/pages/map/index'})
      })
    }
  }
  /**
   * 点击点位
   */
  async function pointTap(psaveId: number) {
    if(points.type === EPointType.PO) {
      curPoint.setCurPId(psaveId)
      Tool.recommendList({psaveId})
    }
    if(points.type === EPointType.CI) {
      const items = points.scaleChange(sort.dividing+1)
      MyMap.includeMarkers({points: items}, map)
    }
  }
  /**
   * 推荐点位
   */
  async function recommend() {
    const { promisic, recommendForm } = Tool
    await promisic(recommendForm)({})
  }
  /**
   * 选择分类
   */
  async function chooseCatgray() {
    const { promisic, chooseCommonCatgray } = Tool
    const resSort:any = await promisic(chooseCommonCatgray)({sort})
    sort.setSort(resSort)
    await Tool.sleep(500)
    const resPoints = await points.mapPoints({
      sortId: resSort.sortId,
      cityCode: resSort.cityCode
    })
    MyMap.includeMarkers(resPoints, map)
    Tool.alertPoster && Tool.alertPoster({ type: EPostType.clear });
  }
  /**
   * 点击底部导航
   */
  function tabTap(item: ICommonTabItem, userInfo) {
    if(userInfo)  self.setInfo(userInfo)
    if(item.name === ECommonMap.recommend) recommend()
    if(item.name === ECommonMap.my) myMap()
    if(item.name === ECommonMap.reset) reSet()
    if(item.name === ECommonMap.addNote) addNote()
    if(item.name === ECommonMap.msg) openMsg()
    if(item.name === ECommonMap.shopping) shopping()
  }
  /**
   * 打开购物商城
   */
  function shopping() {
    Taro.navigateToMiniProgram({
      appId: 'wx1391fe7a44a283ab',
      path: '/pages/index/index'
    })
  }
  /**
   * 
   */
  function openMsg() {
    Taro.navigateTo({url: '/packageA/pages/message/index'})
  }
  /**
   * 移动到当前位置
   */
  async function reSet() {
    const res = await MyMap.getLocation(true);
    const center = {
      longitude: res.longitude,
      latitude: res.latitude
    }
    map.moveTo(center, 14)
    if(!points.items.length) {
      return
    }
    await Tool.sleep(320)
    const mapInfo = await MyMap.getMapInfo()
    const cityCode = String(mapInfo.code).substr(0, 4)
    const pointsRes: any = await points.nearPoints({
      latitude: res.latitude,
      longitude: res.longitude,
      cityCode,
    })
    sort.setSort(info => ({
      sortId: 0,
      sortName: '附近',
      total: pointsRes.points,
      city: mapInfo.city,
      cityCode: cityCode,
      dividing: info.dividing,
    }))

    // const city = points.cities.find(city => city.code === cityCode)
    // if(!city || sort.cityCode === city.code) {
    //   points.scaleChange(14)
    //   return
    // }
    // const sortInfo = await sort.initByPoint(city)
    // const pointsRes = await points.mapPoints({
    //   sortId: sortInfo.sortId,
    //   cityCode: sortInfo.cityCode
    // })
    // MyMap.includeMarkers(pointsRes, map)
  }
  /**
   * 打开个人中心
   */
  function myMap() {
    Taro.navigateTo({url: '/pages/home/index'})
  }
  /**
   * 
   */
  async function addNote() {
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
   * 点击右上角按钮
   */
  function btnsTap(item: IMapbtnInfo, userInfo: IUserInfo) {
    if(userInfo)  self.setInfo(userInfo)
    item.key === EHomeBtn.share && shareTap()
    item.key === EHomeBtn.wxServer && addServiceExp.alert()
  }
  /**
   * 点击分享按钮
   */
  async function shareTap() {
    authorize.refresh()
    const { promisic, alertShare  } = Tool;
    const res: any = await promisic(alertShare)({
      options: share.options,
      row2: share.row2
    })
    if(res.text === ESharetItem.poster) {
      getPoster()
    }
    if(res.text === ESharetItem.embed) {
      Tool.openEmbed({
        cityCode: sort.cityCode,
        path: 'pages/map/index'
      })
    }
    if(res.text === ESharetItem.fllowWx){
      Taro.navigateTo({url: '/packageA/pages/wx-fllow/index'})
    }
  }
  /**
   * 生成海报
   */
   function getPoster() {
    if(!Tool.alertPoster) {
      return
    }
    if(!sort.total) {
      Tool.load.alert('还没有点位可以分享哦')
      return
    }
    const userInfo = self.info.nickName ? self.info : User.info()
    const title = userInfo.gender === '1'
    ? '他正在用自己的方式记录生活~'
    : '她正在用自己的方式记录生活~'
    Tool.alertPoster({
      type: EPostType.map,
      user: userInfo,
      title: title,
      info: `${sort.city}${sort.total}个地点等你来寻`,
      sortId: sort.sortId,
      cityCode: sort.cityCode,
      width: 510,
      height: 800,
      page: 'pages/map/index',
    })
  }  
  /**
   * 记录scale(关闭聚合时用)
   */
  const onGetPoints = (e) => {
    points.scaleChange(e.scale)
  }

  if(self.state !== 'success') {
    return <XLoading />
  }

  return <View className='p-map' >
    <XMap
      mapId="commonMap"
      markers={map.markers}
      isOld={map.isOld}
      theme={ETheme.black}
      latitude={map.latitude}
      longitude={map.longitude}
      scale={map.scale}
      onGetPoints={onGetPoints}
      onReady={mapReady}
      onPointTap={pointTap}
    />
    {
      sort.show &&
      <XMapTitle
        theme={ETheme.black}
        sort={sort}
        showCity={true}
        onCommonCategrayTap={chooseCatgray}
      />
    }{
      footer.show &&
      <XMapBtns 
        className='map-btns' 
        items={commonBtns.items}  
        theme={ETheme.black}
        onClick={btnsTap}
      />
    }{
      footer.show &&
      <XCommonTab 
        btns={footer.btns} 
        onClick={tabTap} 
      />
    }{
      footer.show &&
      <XTabCommonItem 
        item={ADDNOTE}
        className='add-note'
        onClick={addNote}
      />
    }{
      footer.show &&
      <XExplain type={EShowType.common2my}/>
    }
    <XAlertShare />
    <XPoster />
    <XForwardPic />
    <XAlertPoster />
    <XAlertAddService exp={addServiceExp} />
  </View>
}

export default PageMap
