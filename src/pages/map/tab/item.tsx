import React, { FC, useMemo } from 'react'
import { View } from '@tarojs/components'
import XIcon from '@/component/icon'
import classNames from 'classnames'
import { AtBadge } from 'taro-ui'
import { ICommonTabItem } from '.'
import User, { IUserInfo } from '@/models/user'
import XUserInfoBtn from '@/component/user-info-btn'
import { ECommonMap } from '../use-commontab'
import { useMsg } from '@/context/message-ctx'

interface ITabCommonItem {
  className?: string;
  item: ICommonTabItem;
  onClick: (item:ICommonTabItem, userInfo?: IUserInfo) => void
}

const XTabCommonItem: FC<ITabCommonItem> = (props) => {

  const { className, item, onClick } = props
  const classes = classNames('c-tabcommon-item', className)
  const msg = useMsg()

  const badgeValue = useMemo(() => {
    if(item.name === ECommonMap.msg) {
      return msg.info.total
    }
    return item.counts
  }, [item, msg.info])

  return (
    <View className={classes} style={{backgroundColor: item.bgColor}} >
      {
        item.name === ECommonMap.addNote &&
        !User.info().nickName &&
        <XUserInfoBtn onGetUserInfo={(usreInfo) => onClick(item, usreInfo)} />
      }
      <AtBadge value={badgeValue || null} maxValue={99}>
        <XIcon 
          useCover={true} 
          name={item.icon} 
          size={item.iconSize} 
          color={item.iconColor} 
          onClick={()=>onClick(item)} 
        />
      </AtBadge>
    </View>
  )
}

export default XTabCommonItem