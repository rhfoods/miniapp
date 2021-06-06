import React, { FC, useEffect, useState } from 'react'
import { Button, CoverView, View } from '@tarojs/components'
import User from '@/models/user'
import classNames from 'classnames'
import Tool from '@/utils/tools'

interface IUserInfoBtn {
  className?: string
  useCover?: boolean
  onGetUserInfo?: (userInfo: any) => void
}

const XUserInfoBtn: FC<IUserInfoBtn> = (props) => {
  const { onGetUserInfo, useCover, className } = props
  const classes = classNames('c-user-info-btn', className)
  const [canIUseGetUserProfile, setcanIUseGetUserProfile] = useState(false)

  useEffect(() => {
    // @ts-ignore
    if(wx.getUserProfile){
      setcanIUseGetUserProfile(true)
    }
  }, [])
  /**
   * 
   */
  async function getUserProfile() {
    const { promisic } = Tool
    // @ts-ignore
    const res: any = await promisic(wx.getUserProfile)({
      desc: '用于完善会员资料',
      lang: 'zh_CN'
    })
    let userInfo = res.userInfo
    if(userInfo) {
      userInfo = await User.newtUserInfo(userInfo) // 跟新服务器, 更新localstorage
      onGetUserInfo && onGetUserInfo(userInfo)
    }
  }
  /**
   * 老版本
   */
  async function getUserInfo(e: any) {
    let userInfo = e?.detail?.userInfo
    if(userInfo) {
      userInfo = await User.newtUserInfo(userInfo) // 跟新服务器, 更新localstorage
      onGetUserInfo && onGetUserInfo(userInfo)
    }
  }  

  return <XUserInfoBtnContainer useCover={useCover} className={classes} >
      {
        canIUseGetUserProfile 
        ? <Button
            className='c-user-info-btn'
            onClick={getUserProfile}>
            userInfo
          </Button>
        : <Button 
            className='c-user-info-btn'
            openType='getUserInfo' 
            lang='zh_CN'
            onGetUserInfo={getUserInfo} >
            userInfo
          </Button>
      }
  </XUserInfoBtnContainer>
}

XUserInfoBtn.defaultProps = {
  useCover: true
}

export default XUserInfoBtn

interface IXUserInfoBtnContainer {
  className?: string
  useCover: boolean
}

const XUserInfoBtnContainer: FC<IXUserInfoBtnContainer> = ({useCover, className, children}) => {

  if(useCover) {
    return <CoverView className={className} >{children}</CoverView>
  }

  return <View className={className} >{children}</View>
}