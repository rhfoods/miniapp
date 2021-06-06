import React, { FC, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import XBubble from './bubble'
import Taro from '@tarojs/taro' 
import { StorageNames } from '@/common/constants/system.constants'
import { ETheme } from '@/core/enum/theme'

interface IXExplain {
  type: EShowType
}

export enum EShowType {
  others2my = 'others2my',  // 从别人的地图进入自己的地图 
  common2my = 'common2my',  // 从公共地图进入自己的地图
}

interface IExplain {
  others2my: string
  common2my: string
}

const XExplain:FC<IXExplain> = (props) => {
  const { type } = props
  const [otherShow, setOhterShow] = useState(false) // 别人的地图: 打开自己的地图
  const [commonShowUp, setCommonShowUp] = useState(false) // 公共地图: 收藏到桌面
  const [commonShowDown, setCommonShowDown] = useState(false) // 公共地图: 打开自己的地图
  const [saveStyle, setSaveStyle] = useState(null) // 不同手机胶囊位置不一样

  useEffect(() => {
    const explain: IExplain = Taro.getStorageSync(StorageNames.explain)
    if(type === EShowType.others2my && !explain?.others2my) {
      setShow(EShowType.others2my, setOhterShow)
    }
    if(type === EShowType.common2my && !explain?.common2my) {
      setShow(EShowType.common2my, setCommonShow)
    }
  }, [])

  useEffect(() => {
    const res = Taro.getMenuButtonBoundingClientRect()
    setSaveStyle({
      top: res.bottom + 10,
      right: '3%'
    })
  }, [])

  function setCommonShow(bo: boolean) {
    setCommonShowDown(bo)
    setCommonShowUp(bo)
  }

  function setShow(key, callback) {
    const explain = Taro.getStorageSync(StorageNames.explain)
    callback(true)
    Taro.setStorageSync(
      StorageNames.explain,
      {...explain, [key]: true}
    )
    setTimeout(() => callback(false), 15000)
  }

  return <View className='c-explain' >
    {
      otherShow &&
      <XBubble 
        theme={ETheme.black} 
        className='other-to-home' 
        type='down' 
        onClick={() => setOhterShow(false)}
        info='点击开启自己的地图' />
    }{
      commonShowUp && // 公共地图有两个提示
      <XBubble 
        theme={ETheme.black} 
        className='common-to-home' 
        type='down' 
        onClick={() => setCommonShowUp(false)}
        info='点击开启自己的地图' />
    }{
      commonShowDown && // 公共地图有两个提示
      <XBubble 
        theme={ETheme.black} 
        className='save' 
        style={saveStyle}  
        type='up' 
        onClick={() => setCommonShowDown(false)}
        info='添加到桌面,打开更方便' />
    }
  </View>
}

export default XExplain