import React, { FC, useEffect, useMemo, useRef } from 'react'
import { View } from '@tarojs/components'
import useParams from '@/hooks/use-params'
import { IOpenMsgList } from '@/core/interface/nav'
import useMsgTitle from './use-msg-title'
import XMsgCard from '@/component/card/msg-card'
import { AtDivider } from 'taro-ui'
import { EMsgType, useMsg } from '@/context/message-ctx'
import XAlertCommentInput from '@/component/alert/comment-input'
import usePageList from '@/hooks/usePageList'
import { GETMessageParams } from '@/api/types/api.interface'
import { GETMessage } from '@/api/api'
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import Taro from '@tarojs/taro' 
import XSystemMsgCard from './system-card'
import XEmpty from '@/component/empty'
import XLoading from '@/component/loading'
import './index.scss'

const XMsgList: FC = () => {

  const params: IOpenMsgList = useParams()
  useMsgTitle(params)
  const pageList = usePageList<GETMessageParams>(GETMessage, {
    type: params?.msgType,
    order: 'DESC',
    take: 10
  }, 'messages')
  const message = useMsg()
  /**
   * init
   */
  useEffect(() => {
    if(params) {
      pageList.getMore()
    }
  }, [params])
  /**
   * 获取不到最新的params
   */
  const msgTypeRef = useRef(params?.msgType)
  useEffect(() => {
    msgTypeRef.current = params?.msgType
  }, [params])
  /**
   * 退出页面触发
   */
  useEffect(() => {
    return () => {
      message.refreshSomeOne(msgTypeRef.current)
    }
  }, [])
  /**
   * 底部分割线信息
   */
  const dividingInfo = useMemo(() => {
    if(pageList.more) return '加载更多'
    return '我是有底线的'
  }, [pageList.more])
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    pageList.refresh().then(res => {
      Taro.stopPullDownRefresh()
    });
  });  
  /**
   * 上拉加载
   */
  useReachBottom(() => {
    pageList.getMore()
  });
  /**
   * 卡片列表
   */
  const CARDS = pageList.list.map(item => {
    return params?.msgType === EMsgType.system
    ? <XSystemMsgCard className='card' info={item} />
    : <XMsgCard 
        className='card' 
        info={item}
        type={params?.msgType} 
      />
  })

  if(!pageList.hasReq) {
    return <XLoading />
  }

  return <View className='p-msg-list' >
    <View>{[CARDS]}</View>
    {
      pageList.empty &&
      <XEmpty info='暂时还没有消息哦' />
    }{
      pageList.list.length > 10 &&
      <AtDivider className='divider' content={dividingInfo} fontColor='#B0B0B0' lineColor='#eee' />
    }{
      params?.msgType === EMsgType.comment &&
      <XAlertCommentInput />
    }
  </View>
}

export default XMsgList