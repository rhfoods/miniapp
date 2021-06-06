import React, { FC } from 'react'
import { View, Image } from '@tarojs/components'
import XAvatar from '@/component/avatar'
import XIconText from '@/component/icon-text'
import './index.scss'
import Theme from '@/models/theme'
import classNames from 'classnames'

interface IMapCard {
  className?: string
  info: any
  onClick?: (mapInfo: any) => void
}

const XMapCard: FC<IMapCard> = (props) => {

  const { info, onClick } = props

  const { className } = props
  const classes = classNames('c-map-card', className)
  
  return <View className={classes} onClick={() => onClick(info)} >
    <View className='up' >
      <Image src={require('../../../static/pic/map-card.png')} className='map-pic' />
      <XAvatar 
        className='avatar' 
        userInfo={info} 
        nameLength={5}
        hideGender={true}
      />
      <XIconText 
        text={info.savePoints+info.createPoints}
        iconColor={Theme.red} 
        className='icon-text' 
        fontColor='#ffffff' 
        icon='weizhi2' 
        fontSize='14'
      />
    </View>

    <View className='down' >
      {info.sortName}
    </View>
  </View>
}

export default XMapCard