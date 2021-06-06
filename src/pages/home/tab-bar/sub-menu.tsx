import React, { useEffect, useState } from 'react'
import { CoverView, View } from '@tarojs/components'
import { IMapTabBtn } from '.'
import { ETheme } from '@/core/enum/theme'
import { FC, useDidHide } from '@tarojs/taro'
import XIcon from '@/component/icon'
import { AtBadge } from 'taro-ui'
import classNames from 'classnames'
import User, { IUserInfo } from '@/models/user'
import XUserInfoBtn from '@/component/user-info-btn'

interface IHomeTabBarSub {
  className?: string,
  item: IMapTabBtn,
  theme: ETheme,
  onClick: (item: IMapTabBtn, userInfo?: IUserInfo) => void
}

const XHomeTabBarSub: FC<IHomeTabBarSub> = (props) => {

  const { className, item, theme } = props
  const [iconContainerStyle, setIconContainerStyle] = useState({
    transform: `rotate(${0}deg)`,
  })
  const [atBadgeStyle, setAtBadgeStyle] = useState({
    zIndex: 0,
  })
  const [subShow, setSubShow] = useState(false)
  const classes = classNames('c-home-tabbar-sub', className)

  useDidHide(() => setSubShow(false))

  useEffect(() => {
    if(subShow) {
      setAtBadgeStyle({zIndex: 101})
      setIconContainerStyle({ transform: `rotate(${45}deg)` })
      return
    }
    setAtBadgeStyle({zIndex: 0})
    setIconContainerStyle({ transform: `rotate(${0}deg)` })
  }, [subShow])

  const addPoint = () => {
    props.onClick(item.children[0])
  }
  const addNote = (userinfo?: IUserInfo) => {
    props.onClick(item.children[1], userinfo)
  }

  const SUBLIST = item.children.map(item => {
    return (
      <View className='sub-btn' >
        <XIcon 
          name={item.icon} 
          color={theme === ETheme.white ? item.whiteColor : item.blackColor} 
          size={item.size} 
          // onClick={() => props.onClick(item)}
        />
      </View>
    )
  })

  return <View className={classes} >
    <AtBadge value={item.msg || ''} maxValue={99} customStyle={atBadgeStyle}>
      <View style={iconContainerStyle} className='icon-container' >
        <XIcon 
          name={item.icon} 
          color={theme === ETheme.white ? item.whiteColor : item.blackColor} 
          size={item.size} 
          useCover={true} 
          onClick={() => setSubShow(true)} 
        />
      </View>
    </AtBadge>
    {
      subShow && 
      <View className='sub-btns' >{SUBLIST}</View>
    }{
      subShow &&
      <View className='mark' ></View>
    }{
      subShow &&
      <CoverView className='mark cover' onClick={() => setSubShow(false)} >
        <CoverView className='cover-btn cover-point' onClick={addPoint} ></CoverView>
        <CoverView className='cover-btn cover-note'>
          {
            User.info().nickName 
            ? <CoverView className='note' onClick={() => addNote()} />
            : <XUserInfoBtn onGetUserInfo={userinfo => addNote(userinfo)} useCover={true} />
          }
        </CoverView>
      </CoverView>
    }
  </View>
}

export default XHomeTabBarSub