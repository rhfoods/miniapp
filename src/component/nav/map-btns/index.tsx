import React, { FC } from 'react'
import { View, CoverView, Image } from '@tarojs/components'
import classNames from 'classnames'
import XIcon from '@/component/icon'
import { ETheme } from '@/core/enum/theme'
import XUserInfoBtn from '@/component/user-info-btn'
import User, { IUserInfo } from '@/models/user'
import './index.scss'

export enum EHomeBtn {
  trigger='trigger', // 切换样式
  share='share',  // 分享
  wxServer='wxServer', // 微信客服
  recommend='recommend',  // 推荐点位
}

export interface IMapbtnInfo {
  key: string
  icon: string
  imgUrl: string
  type: 'common' | 'share' | 'concat'
  colorWhite: string
  colorBlack: string
  bgWhite: string
  bgBlack: string
  size: string
}

interface IMapBtns {
  className?: string
  items: IMapbtnInfo[]
  theme: ETheme
  onClick: (item: IMapbtnInfo, otherInfo?: any) => void
}

const XMapBtns: FC<IMapBtns> = (props) => {
  const { className, items, theme, onClick } = props
  const classes = classNames('c-map-btns', className )
  const classBtn = classNames('btn', {
    shadow: theme === ETheme.white,
    white: theme === ETheme.white,
    black: theme === ETheme.black
  })

  return (
    <View className={classes} >
      {
        items.map(item => {
          const color = theme === ETheme.white ? item.colorWhite : item.colorBlack
          return (
            <View className={classBtn} >
              {
                item.type === 'share' && 
                !User.info().nickName &&
                <XUserInfoBtn 
                  onGetUserInfo={(userInfo: IUserInfo) => onClick(item, userInfo)} 
                  useCover={true}
                />
              }{
                item.imgUrl
                ? <View className='cover-item-pic' >
                    <Image className='item-pic' mode='aspectFit' src={item.imgUrl} />
                    <CoverView className='item-cover' onClick={() => onClick(item)} />
                  </View>
                : <XIcon 
                    name={item.icon} 
                    size={item.size} 
                    color={color} 
                    useCover={true} 
                    onClick={() => onClick(item) } 
                  />
              }
            </View>
          )
        })  
      }
    </View>
  )
}

export default XMapBtns