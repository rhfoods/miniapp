import React, { FC } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro' 
import Tool from '@/utils/tools'

interface ICopyItem {
  info: {
    title: string,
    info: string,
  }
}

const XCopyItem: FC<ICopyItem> = (props) => {

  const { info } = props
  const tab = () => {
    Taro.setClipboardData({
      data: info.info
    })
  }

  return <View className='copy-item' >
    <View className='title' >{info.title}</View>
    <View className='info' >{info.info}</View>
    <View className='btn-copy' onClick={tab} >一键复制</View>
  </View>
}

export default XCopyItem