import { View } from '@tarojs/components'
import classNames from 'classnames'
import React, { FC, useMemo } from 'react'
import './index.scss'
import Taro from '@tarojs/taro' 
import XPic01 from './pic01'
import XPic03 from './pic03'
import XPic04 from './pic04'

interface IPicLayout {
  className?: string
  mediaList: string[]
}

const XPicLayout: FC<IPicLayout> = (props) => {
  const { className, mediaList } = props

  const classes = classNames('c-pic-layout', className)

  /**
   * 预览图片
   */
  function prePic(index: number) {
    Taro.previewImage({
      urls: mediaList,
      current: mediaList[index]
    })
  }

  const showPic01 = useMemo(() => {
    if(mediaList.length === 1) {
      return true
    }
    return false
  }, [mediaList])

  const showPic03 = useMemo(() => {
    const len = mediaList.length
    if(len === 1 || len === 2 || len === 4) {
      return false
    }
    return true
  }, [mediaList])

  const showPic04 = useMemo(() => {
    if(mediaList.length === 4 || mediaList.length === 2) {
      return true
    }
    return false
  }, [mediaList])

  return <View className={classes} >
    {
      showPic01 &&
      <XPic01 prePic={prePic} src={mediaList[0]} />
    }{
      showPic03 &&
      <XPic03 prePic={prePic} pics={mediaList} />
    }{
      showPic04 &&
      <XPic04 prePic={prePic} pics={mediaList} />
    }
  </View>
}

export default XPicLayout