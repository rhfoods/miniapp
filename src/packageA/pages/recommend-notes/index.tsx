import React, { FC, useEffect, useRef } from 'react'
import { View } from '@tarojs/components'
import XPointCard from '@/component/card/point-card'
import XNoteCard from '@/component/card/note-card'
import XDetailTabbar, { IDetailTabbarItem } from '@/component/nav/detail-tabbar'
import XWaterFlow, { IWaterFollowState } from '@/component/waterflow'
import Taro, { usePullDownRefresh, useReachBottom, useShareAppMessage } from '@tarojs/taro' 
import Tool from '@/utils/tools'
import useParams from '@/hooks/use-params'
import useApi from '@/hooks/use-api'
import RcommendListModel from './model'
import XLoading from '@/component/loading'
import usePageList from '@/hooks/usePageList'
import { GETRecommendNotes } from '@/api/api'
import { GETRecommendNotesPrams } from '@/api/types/api.interface'
import useFooter from './use-footer'
import XEmpty from '@/component/empty'
import './index.scss'
import XPoster, { EPostType } from '@/component/poster'
import XAlertPoster from '@/component/alert/alert-poster'
import XAlertShare from '@/component/alert/share'
import useRecommedShare from './use-share-list'
import useRecommendForward from './use-recommend-forward'
import { ESharetItem } from '@/component/alert/sheet'
import User, { IUserInfo } from '@/models/user'
import useUserLocation from '@/hooks/use-user-location'
import XAlertIcon from '@/component/alert/alert-icon'
import XGoodOrBad from '@/component/alert/goodOrBad'
import useLogin from '@/hooks/use-login'
import { ButtonNames } from '@/common/constants/point.constant'
import { IRecommendNotes } from '@/core/interface/nav'
import XForwardPic from '@/component/forward-pic'

const recommendNotes: FC = () => {

  const self = useLogin(); // 登录
  const params: IRecommendNotes = useParams()
  const woterFllow = useRef<IWaterFollowState>()
  const point = useApi(RcommendListModel.getPointInfo)
  const list = usePageList<GETRecommendNotesPrams>(GETRecommendNotes, { psaveId: params?.psaveId }, 'notes')
  const { items } = useFooter(point)
  const { shareList } = useRecommedShare()
  const forward = useRecommendForward()
  const { distance } = useUserLocation(point.info);

  useEffect(() => {
    if(params) {
      point.getData({psaveId: params.psaveId}).then(info => {
        forward.refresh(info)
      })
      list.getMore().then(res => {
        if(!res?.notes?.length) return
        Tool.sleep(300).then(() => woterFllow.current.add(res.notes))
      })
    }
  }, [params])
  /**
   * 点击底部导航
   */
  const footerTap = (item: IDetailTabbarItem) => {
    if(item.name === ButtonNames.FIND) addNote()
    if(item.name === ButtonNames.DETAIL) openMyNote()
    if(item.name === ButtonNames.SHARE) share()
    if(item.name === ButtonNames.CLOCK) RcommendListModel.LOCK(point, distance)
    if(item.name === ButtonNames.CLOCKED) Tool.load.alert('已经打过卡了')
  }
  /**
   * 点击分享按钮
   */
  const share = async () => {
    if(!self.info?.nickName) {
      self.setInfo(User.info())
    }
    const { promisic, alertShare } = Tool;
    const res: any = await promisic(alertShare)({options: shareList});
    if(res.text === ESharetItem.poster) getPoster()
  }
  /**
   * 生成海报
   */
  const getPoster = () => {
    const userInfo: IUserInfo = User.info()
    const title = userInfo.gender === '1'
    ? '他正在用自己的方式记录生活~'
    : '她正在用自己的方式记录生活~'
    Tool.alertPoster({
      type: EPostType.point,
      user: userInfo,
      point: point.info,
      userId: User.userId(),
      title: title,
      info: Tool.text.ellipsis(point.info.name),
      width: 510,
      height: 800,
      page: 'packageA/pages/recommend-notes/index',
    });
  }
  /**
   * 转发
   */
   useShareAppMessage(() => {
    return {
      title: point.info?.name,
      imageUrl: forward.pic,
      path: `/packageA/pages/recommend-notes/index?psaveId=${params.psaveId}`,
    };
  });  
  /**
   * 添加日记
   */
  const addNote = async () => {
    const { promisic, articleForm } = Tool;
    const res: any = await promisic(articleForm)({
      pointInfo: point.info,
      cantNotUpdatePoint: true,
      hideRecommend: true,
    });
    if(res.form) {
      const item = {...res.form, ...User.info()}
      list.add(item)
      point.setInfo(info => ({
        ...info,
        newPsaveId: item.newPsaveId,
        newNoteId: item.noteId,
      }))
      await Tool.sleep(200)
      woterFllow.current.add([item])
    }
  }
  /**
   * 打开某一篇文章(点击note卡片)
   */
  const openNote = async (item) => {
    const psaveId = item.userId === self.info.userId 
    ? point.info.newPsaveId
    : point.info.psaveId 
    Tool.detail({
      psaveId,
      topNoteId: item.noteId,
      userId: item.userId,
      saveTap: () => {
        point.setInfo((p) => {
          p.saves++;
          return { ...p };
        });
      }
    });
  }
  /**
   * 打开某一篇文章(点击footer)
   */
  const openMyNote = () => {
    Tool.detail({
      psaveId: point.info.newPsaveId,
      topNoteId: point.info.newNoteId,
      userId: self.info.userId,
    })
  }

  useReachBottom(() => {
    list.getMore().then(res => {
      if(!res?.notes?.length) return
      woterFllow.current.add(res.notes)
    })
  })

  usePullDownRefresh(() => {
    point.getData({psaveId: params.psaveId})
    list.refresh().then(async (res) => {
      if(!res?.notes?.length) return
      await Tool.sleep(200)
      woterFllow.current.clear()
      woterFllow.current.add(res.notes)
      Taro.stopPullDownRefresh()
    })
  })

  if(point.loading) {
    return <XLoading />
  }

  return <View className='p-recommend-note' >

    <XPointCard 
      className='point-card' 
      point={point.info} 
      distance={distance} 
    />

    {
      list.empty && list.hasReq 
      ? <XEmpty className='empty' />
      : <XWaterFlow 
          ref={woterFllow} 
          item={<XNoteCard className='note-card' onClick={openNote} />} 
        />
    }

    <XDetailTabbar
      itemTap={footerTap}
      className="tabbar"
      items={items}
    />

    <XAlertIcon />
    <XGoodOrBad />
    <XPoster />
    <XForwardPic />
    <XAlertPoster />
    <XAlertShare />
  </View>
}

export default recommendNotes