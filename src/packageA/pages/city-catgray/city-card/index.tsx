import React, { FC } from 'react'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import XIcon from '@/component/icon'

interface ICityCard {
  className?: string
  name: string
  onClick: () => void
}

const XCityCard: FC<ICityCard> = (props) => {

  const { className, name, onClick } = props
  const classes = classNames('c-city-card', className)

  return <View className={classes} onClick={onClick} >
    <View className='title' >当前城市</View>
    <View className='city' >
      <XIcon name='weizhi2' color='#ffffff' size='16' />
      <View className='city-name' >{name}</View>
    </View>
    <XIcon name='you' color='#eee' className='more' size='22' />
    <Image className='bg-pic' src={require('../../../../static/pic/city-bg.png')} />
  </View>
}

export default XCityCard