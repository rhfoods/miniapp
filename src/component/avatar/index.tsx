import React, { FC, useMemo } from 'react'
import { View, Image, CoverView, Text } from '@tarojs/components'
import XIcon from '../icon'
import classNames from 'classnames'
import Tool from '@/utils/tools'
import XUserInfoBtn from '../user-info-btn'

interface IAvatar {
  className?: string
  userInfo?: any
  otherInfo?: string
  onlyAvatar?: boolean
  hideGender?: boolean
  nameLength?: number
  btnType?: 'user' | 'cover' | 'normal'  // '需要授权用户信息' | '已授权: 使用CoverView' | '已授权: 使用View'
  onClick?: (userInfo?: any) => void
}

const XAvatar: FC<IAvatar> = (props) => {
  const {className, nameLength, otherInfo, userInfo, onlyAvatar, hideGender, btnType, onClick } = props
  const classes = classNames('c-user-info', className)
  const classGender = classNames('gender', {
    'blue': userInfo?.gender === '1',
    'red': userInfo?.gender === '2',
  })

  const userName = useMemo(() => {
    if(!userInfo?.nickName) {
      return '匿名用户'
    }
    return Tool.text.ellipsis(userInfo.nickName, nameLength)
  }, [userInfo?.nickName, nameLength])

  const iconGender = useMemo(() => {
    if(userInfo?.gender === '1') return 'nan'
    if(userInfo?.gender === '2') return 'nv'
    return ''
  }, [userInfo?.gender])

  const onTap = (e) => {
    if(onClick) {
      e.stopPropagation();
      onClick(userInfo)
    }
  }

  const Left = <View className='left' >
    {
      userInfo?.avatarUrl ? 
      <Image className='pic' src={userInfo?.avatarUrl} mode='aspectFill' /> :
      <XIcon name='touxiang' color='#dedede' />
    }{
      !hideGender && iconGender && 
      <View className={classGender} >
        <XIcon name={iconGender} size='10' color='#ffffff' />
      </View>
    }{
      btnType === 'normal' &&
      <View
        className='avatar-cover' 
        onClick={onTap} 
      />
    }{
      btnType === 'cover' &&
      <CoverView
        className='avatar-cover' 
        onClick={onTap} 
      />
    }{
      btnType === 'user' &&
      <XUserInfoBtn onGetUserInfo={onClick} />
    }
  </View>

  const Right = <View className='right' >
    <View className='name' onClick={onTap} >{userName}</View>
    { otherInfo && <Text className='other-info' space='nbsp' >{otherInfo}</Text> }
  </View>

  return <View className={classes} >
    { Left }
    { !onlyAvatar && Right }
  </View>
}

XAvatar.defaultProps = {
  nameLength: 16,
  btnType: 'normal',
}

export default XAvatar