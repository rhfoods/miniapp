import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import { IMsgItemInfo } from '@/context/message-ctx'
import Tool from '@/utils/tools'
import Taro from '@tarojs/taro' 

interface IXSystemMsgCard {
  className?: string
  info: IMsgItemInfo
  titleLength?: number
}

const XSystemMsgCard: FC<IXSystemMsgCard> = ({className, info, titleLength}) => {

  const classes = classNames('c-msg-card-system', className)

  const dotClasses = classNames('dot', {
    red: info.tag === '审核未通过',
    green: info.tag === '审核通过',
    none: disPlayNone(info),
  })

  function disPlayNone(info: IMsgItemInfo) {
    if(info.tag === '审核通过') return false
    if(info.tag === '审核未通过') return false
    return true
  }

  const onTap = () => {
    if(info.tag === '关注公众号') {
      Taro.navigateTo({url: '/packageA/pages/wx-fllow/index'})
    }
  }

  return (
    <View className={classes} onClick={onTap} >
      <View className='title'>
        <View className={dotClasses} ></View>
        <Text>{Tool.text.ellipsis(info.tag || '系统消息', titleLength)}</Text>
      </View>
      <View className='info' >{info.description || '什么也没有'}</View>
      {
        info.tag === '关注公众号'
        ? <View className='follow' >{'去关注 >'}</View>
        : <View className='time' >{Tool.utc2Locale(info.createdAt)}</View>
      }
    </View>
  )
}

XSystemMsgCard.defaultProps = {
  titleLength: 16
}

export default XSystemMsgCard