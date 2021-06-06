import React, { FC, useMemo } from 'react'
import { View, Text, CoverView } from '@tarojs/components'
import XIcon from '../../icon'
import classNames from 'classnames'
import { EBtnBg, EBtnColor, ETheme } from '@/core/enum/theme'

interface IBubble {
  info: string
  type: 'up' | 'down'
  className?: string
  style?: any
  theme: ETheme
  onClick: () => void
}

const XBubble: FC<IBubble> = (props) => {
  const { className, type, style, theme, info, onClick } = props

  const classes = classNames('bubble', className)
  const bg = useMemo(() => theme===ETheme.white ? 'rgba(16, 16, 16, .4)' : EBtnBg.black, [theme])
  const color = useMemo(() => theme===ETheme.white ? '#fff' : EBtnColor.black, [theme])

  const BubbleStyle = useMemo(() => {
    const res = {
      ...style,
      backgroundColor: bg,
      color,
    }
    if(theme === ETheme.white) {
      res.boxShadow = '0px 1px 3px #eee'
    }
    return res
  }, [style, theme])

  const downStyle = useMemo(() => {
    return {
      borderTop: `2vw solid ${bg}`,
      borderBottom: `2vw solid transparent`,
      borderLeft: `2vw solid transparent`,
      borderRight: `2vw solid transparent`,
      bottom: '-4vw',
    }
  }, [theme])

  const upStyle = useMemo(() => {
    return {
      borderBottom: `2vw solid ${bg}`,
      borderTop: `2vw solid transparent`,
      borderLeft: `2vw solid transparent`,
      borderRight: `2vw solid transparent`,
      top: '-4vw',
    }
  }, [theme])

  return <View className={classes} style={BubbleStyle} >
    <Text className='txt' >{info}</Text>
    <XIcon name='cha' color={color} size='14' />
    <CoverView className='cover' onClick={onClick} ></CoverView>
    {
      type === 'down' &&
      <View className='down' style={downStyle} ></View>
    }{
      type === 'up' &&
      <View className='up' style={upStyle} ></View>
    }
  </View>
}

export default XBubble