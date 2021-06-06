import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import XIcon from '../icon'
import Theme from '@/models/theme'
import classNames from 'classnames'

interface IIconText {
  icon?: string
  text?: number | string
  iconColor?: string
  fontColor?: string
  className?: string
  fontSize?: string
  iconSize?: string
  vertical?: boolean
  onClick?: (e) => void
}

const XIconText: FC<IIconText> = (props) => {
  const { className, icon, iconColor, fontColor, text, vertical, fontSize, iconSize, onClick } = props

  const classes = classNames('c-icon-count', className, {
    'vertical': vertical
  })

  const textStyle = {
    color: fontColor,
    fontSize: `${fontSize}px`
  }

  return <View className={classes} onClick={onClick} >
    <XIcon name={icon} color={iconColor} size={iconSize} />
    <Text className='text' style={textStyle} >{text}</Text>
  </View>
}

XIconText.defaultProps = {
  iconSize: '15',
  fontSize: '12',
  icon: 'shoucang',
  iconColor: Theme.red,
  fontColor: '#333333'
}

export default XIconText