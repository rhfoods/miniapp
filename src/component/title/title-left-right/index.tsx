import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import XIcon from '@/component/icon'
import classNames from 'classnames'

interface XTittleLeftRight {
  className?: string
  textLeft: string
  textRight?: string
  iconLeft?: string
  iconRight?: string
  num?: number
  onRightTap?: () => void
}

const XTittleLeftRight: FC<XTittleLeftRight> = (props) => {

  const { textLeft, textRight, iconLeft, iconRight, num, className, onRightTap } = props
  const classes = classNames('c-t-l-r', className)

  return <View className={classes} >
    <View className='left' >
      <Text className='co' >{textLeft}</Text>
      { (num || num === 0) && <Text className='count' >({num})</Text>}
    </View>
    <View className='right' >
      { iconLeft && <XIcon name={iconLeft} size='12' color='#757070' /> }
      <Text className='more' >{textRight}</Text>
      { iconRight && <XIcon name={iconRight} size='12' color='#757070' onClick={onRightTap} /> }
    </View>
  </View>
}

XTittleLeftRight.defaultProps = {
  textLeft: '评论',
}

export default XTittleLeftRight