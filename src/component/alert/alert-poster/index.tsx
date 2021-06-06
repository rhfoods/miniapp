import React, { FC, useEffect, useRef, useState } from 'react'
import { View, Image, CoverView } from '@tarojs/components'
import classNames from 'classnames'
import { useDidShow } from '@tarojs/taro'
import Tool from '@/utils/tools'
import { EPostType, IGetPosterParams } from '@/component/poster'
import XProgress, { IProgressRef } from '@/component/progress'
import Taro from '@tarojs/taro' 

interface IAlertPoster {
  className?: string
}

const XAlertPoster: FC<IAlertPoster> = (props) => {

  const {className} = props

  const [src, setSrc] = useState('')
  const [show, setShow] = useState(false)
  const srcRef = useRef('')
  const loader = useRef<IProgressRef>()

  useEffect(() => {
    srcRef.current = src
  }, [src])

  const classes = classNames('c-alert-poster', className, {
    hide: !show
  })

  useEffect(() => {
    Tool.alertPoster = alertPoster;
  }, []);
  useDidShow(() => {
    Tool.alertPoster = alertPoster;
  });

  const alertPoster = async (params: IGetPosterParams) => {
    if(params.type === EPostType.clear) {
      setSrc('')
      return
    }
    setShow(true)
    if(!srcRef.current) {
      let pic = await Tool.getPoster(params)
      await Tool.sleep(300)
      loader.current?.stop()
      setSrc(pic)
    }
  }

  function downloadFile() {
    Taro.saveImageToPhotosAlbum({
      filePath: src,
      success() {
        Tool.load.alert('保存成功')
        setShow(false)
      },
      fail() {
        Tool.load.alert('保存失败')
        setShow(false)
      }
    })
  }

  return <View className={classes} >
    {
      show &&
      <CoverView className='cover-mark' onClick={() => setShow(false)} ></CoverView>
    }{
      src 
      ?
      <View className='container' >
        <Image src={src} className='pic'/>
        <View className="btn-long btn-diy" >
          保存图片
          { 
            show &&  
            <CoverView className='cover-mark btn-cover' onClick={downloadFile} />
          }
        </View>
      </View> 
      :
      <View className='loading'>
        { show && <XProgress ref={loader} /> }
      </View>
    }
  </View> 
}

export default XAlertPoster