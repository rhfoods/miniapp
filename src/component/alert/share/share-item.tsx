import React, { FC } from 'react'
import { View, Text, CoverView, Button } from '@tarojs/components'
import { IShareItem } from '.'
import classNames from 'classnames'
import XIcon from '@/component/icon'

interface IXShareItem {
  item: IShareItem;
  onChoose: (item: IShareItem) => void
}

const XShareItem: FC<IXShareItem> = (props) => {

  const { item, onChoose } = props
  const classes = classNames('scroll-item', item.className)
  const style = { color: item.fontColor }

  return <View className={classes} style={style} >
    <XIcon 
      className="icon" 
      name={item.icon} 
      size={item.iconSize || '44'} 
      colorFull={item.colorFull} 
      color={item.iconColor} />
    <Text className="text" >{item.text}</Text>
    {
      item.type === 'share' &&
      <CoverView className='cover'>
        <Button className='cover share-btn' openType='share'>share</Button>
      </CoverView>
    }{
      item.type === 'feedback' &&
      <CoverView className='cover'>
        <Button className='cover share-btn' openType='feedback'>feedback</Button>
      </CoverView>
    }{
      item.type === 'common' &&
      <CoverView className='cover' onClick={() => onChoose(item)} ></CoverView>
    }
  </View>
}

export default XShareItem