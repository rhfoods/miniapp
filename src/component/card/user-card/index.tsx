import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import XAvatar from '@/component/avatar'
import XTextLong from '@/component/text-long'
import XLabNum from './text'
import Tool from '@/utils/tools'

interface IUserCard {
  className?: string
  userInfo?: any
  right?: React.ReactNode
  showTotal?: boolean // 是否显示统计信息
}

const XUserCard: FC<IUserCard> = (props) => {
  const { className, userInfo, right, showTotal } = props

  const classes = classNames('c-user-card', className)

  return <View className={classes}>

    <View className='up' >
      <View className='left' >
        <XAvatar userInfo={userInfo} otherInfo={userInfo?.city} />
      </View>
      <View className='right' >{ right }</View>
    </View>

    <View className='down' >
      {
        showTotal && <View className='total' >
          <XLabNum lab='浏览' value={Tool.numberToW(userInfo?.noteViews)} />
          <XLabNum lab='置顶' value={Tool.numberToW(userInfo?.noteTops)} />
          <XLabNum lab='获赞' value={Tool.numberToW(userInfo?.noteLikes)} />
        </View>
      }
      {
        userInfo?.introduce && <XTextLong className='textlong' value={userInfo.introduce} />
      }
    </View>

  </View>
}

export default XUserCard