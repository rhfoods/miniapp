import React, { FC, useEffect, useState } from 'react'
import { Image } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'
import { useDidHide, useDidShow } from '@tarojs/taro'
import Tool from '@/utils/tools'
import './index.scss'

export interface IAlertPic {
  url: string
  [propname: string]: any
}

const XAlertPic: FC = (props) => {
  const [url, setUrl] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    Tool.alertPic = alertPic
  }, [])
  
  useDidShow(() => {
    Tool.alertPic = alertPic
  })
  
  useDidHide(() => {
    Tool.alertPic = null
  })

  async function alertPic(params: IAlertPic) {
    params.url && setUrl(params.url)
    Tool.areaShowHid && Tool.areaShowHid({show: false})
    setShow(true)
  }
  
  function onClose() {
    setShow(false)
    Tool.areaShowHid && Tool.areaShowHid({show: true})
  }

  return <AtCurtain className='c-alert-pic' isOpened={show} onClose={onClose} >
    <Image className='pic' src={url} mode='widthFix' />
  </AtCurtain>
}

export default XAlertPic