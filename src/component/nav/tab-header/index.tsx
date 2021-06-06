import React, { FC } from 'react'
import { View } from '@tarojs/components'
import { ITabHeaderItem } from '@/pages/user/use-tabheader'
import './index.scss'
import classNames from 'classnames'

interface ITabHeader {
  className?: string
  items?: ITabHeaderItem[]
  cur?: number
  onClick?: (index: number) => void
}

const XTabHeader: FC<ITabHeader> = (props) => {
  const { items, cur, onClick, className } = props
  const classes = classNames('c-tab-header', className)

  return <View className={classes} >
    { 
      items?.map( (item, index) => {
        const classes = classNames('tab-header-item', {
          'cur': index === cur
        })
        return <View className={classes} onClick={() => onClick(index)} >
          <View className='total'>{item.total}</View>
          <View className='title'>{item.title}</View>
        </View>
      }) 
    }
  </View>
}

export default XTabHeader