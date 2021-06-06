import React, { FC } from 'react'
import { View } from '@tarojs/components'
import XTabCommonItem from './item'
import classNames from 'classnames'
import { IUserInfo } from '@/models/user'

interface ICommonTab {
  className?: string
  btns: ICommonTabItem[]
  onClick: (item: ICommonTabItem, userInfo?: IUserInfo) => void
}

export interface ICommonTabItem {
  type: 'small' | 'big';
  name: string;
  icon: string;
  iconColor: string;
  iconSize: string;
  counts: number;
  bgColor?: string;
}

const XCommonTab: FC<ICommonTab> = (props) => {

  const { className, btns, onClick } = props
  const classes = classNames('c-common-tab', className)

  return <View className={classes} >
    {
      btns.map(item => {
        return (
          <XTabCommonItem 
            item={item}
            className={item.type === 'big' ? 'big' : 'small'}
            onClick={onClick}
          />
        )
      })
    }
  </View>
}

export default XCommonTab