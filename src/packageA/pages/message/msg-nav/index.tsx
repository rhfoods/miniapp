import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { IMsgNavItem } from '../use-navs'
import XMsgNavItem from './item'
import './index.scss'

interface IXMsgNav {
  className?: string;
  items: IMsgNavItem[];
  onClick: (info: IMsgNavItem) => void;
}

const XMsgNav: FC<IXMsgNav> = ({items, className, onClick}) => {

  const classes = classNames('c-msg-nav', className)

  return <View className={classes} >
    {
      items?.map(item => {
        return <XMsgNavItem info={item} onClick={onClick} />
      })
    }
  </View>
}

export default XMsgNav