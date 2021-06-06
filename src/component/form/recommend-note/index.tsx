import React, { FC, useContext, useEffect, useState } from 'react'
import { Switch, View } from '@tarojs/components'
import Taro from '@tarojs/taro' 
import classNames from 'classnames'
import { FormCxt } from '../form'
import './index.scss'
import XIcon from '@/component/icon'
import Theme from '@/models/theme'
import { StorageNames } from '@/common/constants/system.constants'

interface IRecommendNote {
  className?: string
  lab: string
  name: string
}

const XRecommendNote: FC<IRecommendNote> = (props) => {

  const { className, name, lab } = props
  const classes = classNames('c-recommend-note', className)
  const { form } = useContext(FormCxt)
  const [checked, setChecked] = useState(true)

  useEffect(() => {
    form[name] && setChecked(form[name])
  }, [form])

  useEffect(() => {
    const checked = Taro.getStorageSync(StorageNames.recommend)
    if(checked === false) {
      setChecked(false)
      return
    }
    setChecked(true)
  }, [])

  const check = () => {
    setChecked(v => {
      Taro.setStorageSync(StorageNames.recommend, !v)
      return !v
    })
  }

  return <View className={classes} onClick={check} >
    <View className='lab' >{lab}</View>
    <XIcon name='kuangxuan' size='18' color={checked ? Theme.red : '#E8E8E8'} />
    <Switch className='none' name={name} checked={checked} />
  </View>
}

export default XRecommendNote