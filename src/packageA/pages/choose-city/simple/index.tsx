import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface IChooseCitySimple {
  className?: string
  title: string
  cities: IChooseCitySimpleItem[]
  onItemTap: (info: IChooseCitySimpleItem) => void
}

interface IChooseCitySimpleItem {
  name: string
}

const XChooseCitySimple: FC<IChooseCitySimple> = (props) => {
  const { className, cities, title, onItemTap } = props
  const classes = classNames('c-choose-city-simple', className)

  return <View className={classes} >
    <View className='title' >{title}</View>
    <View className='cities' >
      {
        cities.map(item => <View 
          className='city' 
          onClick={() => onItemTap(item)} >
          {item.name}
        </View>)
      }
    </View>
  </View>
}

export default XChooseCitySimple