import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import XIcon from '@/component/icon'
import classNames from 'classnames'

interface IAddBtn {
  icon: string
  text: string
  iconColor?: string
  className?: string
  onClick?: () => void
}

const XAddBtn: FC<IAddBtn> = (props) => {

  const { icon, iconColor, text, className, onClick } = props
  const classes = classNames('c-icon-btn', className)

  return <View className={classes} onClick={()=>onClick()} >
    <XIcon name={icon} color={iconColor} size='21' />
    <Text className='text'>{text}</Text>
  </View>
}

XAddBtn.defaultProps = {
  iconColor: '#888888',
}

export default XAddBtn