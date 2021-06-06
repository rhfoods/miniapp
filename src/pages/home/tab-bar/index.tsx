import React, { FC, useMemo } from 'react'
import { View, Image } from '@tarojs/components'
import { ETheme } from '../../../core/enum/theme';
import classNames from 'classnames';
import XAvatar from '@/component/avatar';
import { UpdateUserInfo } from '@/api/types/api.interface';
import XHomeMenuItem from './menu-item';
import XHomeTabBarSub from './sub-menu';
import User, { IUserInfo } from '@/models/user';
import './index.scss'

interface IHomeTabBar {
  theme: ETheme
  userInfo: UpdateUserInfo
  icons: IMapTabBtn[]
  onItemTap: (item: IMapTabBtn, userInfo: IUserInfo) => void
  onGetUserInfo?: (userInfo: IUserInfo) => void
}

export interface IMapTabBtn {
  key: string,
  msg: number,
  icon: string,
  size: string,
  whiteColor?: string,
  blackColor?: string,
  auth?: boolean, // 是否需要授权用户信息
  children?: IMapTabBtn[]
}

const XHomeTabBar: FC<IHomeTabBar> = (props) => {
  const { theme, userInfo, icons, onGetUserInfo, onItemTap } = props

  const classes = classNames('c-home-tabbar')

  const bgPic = useMemo(() => {
    if(theme === ETheme.white) {
      return require('@/static/pic/tabbar-white.png')
    }
    return require('@/static/pic/tabbar-black.png')
  }, [theme])

  /**
   * 点击按钮: 添加点位
   */
  function itemTap(item: IMapTabBtn, userInfo?: IUserInfo) {
    onItemTap(item, userInfo)
  }
  /**
   * 是否需要用户授权
   */
  const Auth = useMemo(() => {
    if(!userInfo?.nickName && userInfo.userId === User.userId()) {
      return true
    }
    return false
  }, [userInfo])

  return <View className={classes} >

    <XAvatar 
      userInfo={userInfo}
      onClick={onGetUserInfo}
      onlyAvatar={true}
      hideGender={true}
      className='avatar' 
      btnType={Auth ? 'user' : 'cover'}
    />

    <Image src={bgPic} className='bg-pic' />
    
    {
      icons.map((item: IMapTabBtn) => {
        if(item.children) {
          return <XHomeTabBarSub item={item} theme={theme} onClick={itemTap} />
        }
        return <XHomeMenuItem item={item} theme={theme} onClick={itemTap} />
      })
    }

  </View>
}

export default XHomeTabBar