import React, { FC, useEffect, useState } from 'react'
import XIcon from '@/component/icon'
import Tool from '@/utils/tools'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { IAlerIconParams } from '../sheet'
import classNames from 'classnames'
import { View } from '@tarojs/components'


const XAlertIcon: FC = () => {

  const [show, setShow] = useState(false)
  const [color, setColor] = useState('#888888')
  const [icon, setIcon] = useState('shanchu')

  const classes = classNames('c-alert-icon')

  useEffect(() => { Tool.alertIcon = alertIcon }, [])
  useDidShow(() => { Tool.alertIcon = alertIcon })
  useDidHide(() => { Tool.alertIcon = null })

  async function alertIcon(params: IAlerIconParams) {
    params?.icon && setIcon(params.icon)
    params?.color && setColor(params.color)
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
      clearTimeout(timer)
    }, 1000)
  }

  return show && <View className={classes} >
    <XIcon 
      name={icon} 
      size='60' 
      color={color} 
    />
  </View>
}

export default XAlertIcon