import React, { FC, useMemo } from 'react'
import { Image, View } from '@tarojs/components'
import { PICS_RESIZE_300 } from '@/models/media'

interface IPic03 {
  pics: string[]
  prePic: (index: number) => void
}

const XPic03: FC<IPic03> = (props) => {
  const { pics, prePic } = props

  /**
   * 媒体列表: small
   */
  const picsSmall = useMemo(() => {
    return pics.map((url) => {
      return (url += PICS_RESIZE_300);
    });
  }, [pics]);

  return <View className='c-pic-03' >
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

export default XPic03

