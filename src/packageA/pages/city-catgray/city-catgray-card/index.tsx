import React, { FC } from 'react'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import Media from '@/models/media'

interface ICityCatgrayCard {
  className?: string
  info: ICityCatgrayCardInfo
  onClick: (info: ICityCatgrayCardInfo) => void
}

export interface ICityCatgrayCardInfo {
  logo: string;
  name: string;
  points: number
  sortId: number;
}

const XCityCatgrayCard: FC<ICityCatgrayCard> = (props) => {

  const { className, info, onClick } = props
  const classes = classNames('c-city-catgray-card', className)

  return <View className={classes} onClick={() => onClick(info)} >
    <View className='sort-name' >{info.name}</View>
    <View className='count' >{info.points}个点</View>
    <Image className='logo' src={require(`../../../../static/pic/unclocked/${info.logo}`)} />
  </View>
}

export default XCityCatgrayCard