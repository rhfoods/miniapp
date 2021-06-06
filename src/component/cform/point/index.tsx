import React, { FC, useContext, useEffect } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import XIcon from '@/component/icon'
import Theme from '@/models/theme'
import { FormCtx, ICRule } from '../form'
import MyMap from '@/models/map'

interface ICPoint {
  names: string[]
  rule: ICRule
  className?: string
  placeholder?: string
  onChange?: (data: any) => void
}

const CPoint: FC<ICPoint> = (props) => {
  const { className, placeholder, rule, names, onChange } = props

  const classes = classNames('c-choose-p', className)
  const form = useContext(FormCtx)

  useEffect(() => {
    if(!names?.length) {
      console.error('formItem: 选取坐标没有names')
      return
    }
    form.setRules(rules => ({
      ...rules,
      [names[0]]: rule  
    }))
  }, [])

  const chooseLocation = async () => {
    const res = await MyMap.chooseLocation(
      form.data?.latitude,
      form.data?.longitude
    )
    form.setData(data => ({
      ...data,
      latitude: res.latitude,
      longitude: res.longitude,
      address: res.address,
    }))
    onChange(res)
  }

  return <View className={classes} onClick={chooseLocation} >
    <View className='c-choose-p-left' >
      {
        form.data.address 
        ? <View className='value' >{form.data.address}</View>
        : <View>{placeholder}</View>
      }
    </View>
    <View className='c-choose-p-right' >
      <XIcon name='weizhi2' color={Theme.red} size='20' />
    </View>
  </View>
}

CPoint.defaultProps = {
  placeholder: '详细地址'
}

export default CPoint