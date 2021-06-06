import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import Taro from '@tarojs/taro' 

interface IMsg {
  className?: string
  textLeft?: string
  textRight?: string
  info?: string
}

const XMsg: FC<IMsg> = (props) => {

  const { className, textLeft, textRight, info } = props

  const classes = classNames('c-msg', className)

  const alert = () => {
    if(!info) {
      return
    }
    Taro.showModal({
      title: '未通过原因',
      content: info,
      showCancel: false
    })
  }

  return <View className={classes} onClick={alert} >
    <View className='text' >{textLeft}</View>
    <View className='text' >{textRight}</View>
  </View>
}

export default XMsg