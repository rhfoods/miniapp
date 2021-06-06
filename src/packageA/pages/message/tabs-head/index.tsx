import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface IXTabsHead {
  className?: string
  items?: IMsgItem[]
  current?: number
  onClick?: (index: number) => void
}

export interface IMsgItem {
  title: string;
  key: string;
  className?: string;
  list?: any[] | null
}

const XTabsHead: FC<IXTabsHead> = ({
  className, items, current, onClick,
}) => {

  const classes = classNames('c-msg-tab-head', className)

  return <View className={classes} >
    {
      items.map((item, index) => {
        const classItem = classNames('item', {
          cur: current === index
        })
        return <View 
          className={classItem} 
          onClick={() => onClick(index)} >
          {item.title}
        </View>
      })
    }
  </View>
}

export default XTabsHead