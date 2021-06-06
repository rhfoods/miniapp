import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'

interface IUserList {
  label: string
  right: React.ReactNode
  className?: string
}

const XUserList: FC<IUserList> = (props) => {
  const classes = classNames('c-user-list', props.className)

  return <View className={classes} >
    <View className='left' >{props.label}</View>
    <View className='right' >{props.right}</View>
  </View>
}

export default XUserList