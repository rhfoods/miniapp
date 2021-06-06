import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'

interface IEmpty {
  info?: string
  info02?: string
  className?: string
}

const XEmpty: FC<IEmpty> = (props) => {
  const { info, info02, className } = props
  const classes = classNames('c-empty', className)

  return <View className={classes} >
    <View className='empty-div icon-empty' ></View>
    <View className='info'>{info || '空空如也'}</View>
    {
      info02 &&
      <View className='info02' >{info02}</View>
    }
  </View>
}

export default XEmpty