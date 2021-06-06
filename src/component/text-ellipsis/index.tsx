import React, { FC } from 'react'
import { View, Text, ITouchEvent } from '@tarojs/components'
import useShowHide from '@/hooks/use-show-hide'
import classNames from 'classnames'

interface IXTextEllips {
  text: string
  className?: string
  count?: number
  maxRow?: number
  onClick?: () => void
  onLongPress?: () => void
}

const XTextEllips: FC<IXTextEllips> = (props) => {

  const { text, className, count, maxRow, onClick, onLongPress } = props
  const { txt, showTrigger, isLong, triggerTap } = useShowHide(text, count, maxRow, false)
  const classes = classNames('c-text-ellipsis', className)

  const onTriggerTap = (e: ITouchEvent<any>) => {
    e.stopPropagation()
    triggerTap()
  }

  return <View className={classes} hoverClass='c-text-ellipsis-hover' onLongPress={onLongPress} >
    <Text className='comment-txt' onClick={onClick} >{txt}</Text>
    {
      showTrigger && isLong === false &&
      <View onClick={onTriggerTap} className='orange trigger-show' >...展开</View>
    }{
      showTrigger && isLong &&
      <View onClick={onTriggerTap} className='orange' >收起</View>
    }
  </View>
}

XTextEllips.defaultProps = {
  count: 50,
  maxRow: 2,
}

export default XTextEllips