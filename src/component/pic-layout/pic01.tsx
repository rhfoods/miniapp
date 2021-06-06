import React, { FC, useEffect, useState } from 'react'
import { Image, View } from '@tarojs/components'
import Taro from '@tarojs/taro' 
import Tool from '@/utils/tools'

interface IPic01 {
  src: string
  prePic: (index: number) => void
}

const XPic01: FC<IPic01> = (props) => {
  const { src, prePic } = props
  const [style, setStyle] = useState('width: 0px;height:0px')
  const [tmp, setTmp] = useState('')

  useEffect(() => {
    if(!src) {
      return
    }
    setTmp('')
    Taro.getImageInfo({src}).then(res => {
      let x = res.width/res.height
      if(x<0.6) x = 0.6
      if(res.width > res.height) {
        setStyle(`width:92vw;height:${92/x}vw`)
      } else {
        setStyle(`width:${92*x}vw;height:92vw`)
      }
      setTmp(res.path)
    })
  }, [src])

  if(!tmp) {
    return <View className='c-pic-01-empty' ></View>
  }

  return (
    <Image 
      className='c-pic-01' 
      style={style}
      src={tmp}
      mode='aspectFill'
      onClick={() => prePic(0)}
    />
  )
}

export default XPic01

