import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface IXLetterItem {
  className?: string
  item: ILetterItem
  onClick: (item: Icity) => void
}

export interface ILetterItem {
  title: string,
  key: string,
  items: Icity[]
}

export interface Icity {
  name: string,
  key: string,
  [propname: string]: any
}

const XLetterItem: FC<IXLetterItem> = (props) => {
  const { className, item, onClick } = props

  const classes = classNames('c-letter-item', className)

  return <View className={classes} id={`letter-${item.key}`} >
    <View className='title' >{item.title}</View>
    {
      item.items.map(info => {
        return <View 
          className='city-name' 
          onClick={() => onClick(info)} >
          {info.name}
        </View>
      })
    }
  </View>
}

export default XLetterItem