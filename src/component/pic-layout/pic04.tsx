import React, { FC, useMemo } from 'react'
import { Image, View } from '@tarojs/components'
import { PICS_RESIZE_500 } from '@/models/media'

interface IPic04 {
  pics: string[]
  prePic: (index: number) => void
}

const XPic04: FC<IPic04> = (props) => {
  const { pics, prePic } = props

  /**
   * 媒体列表: small
   */
  const picsSmall = useMemo(() => {
    return pics.map((url) => {
      return (url += PICS_RESIZE_500);
    });
  }, [pics]);

  return <View className='c-pic-04' >
    {
      picsSmall.map((src, index) => <Image 
        src={src} 
        className='pic' 
        mode='aspectFill' 
        onClick={() => prePic(index)} 
      />)
    }
  </View>
}

export default XPic04

