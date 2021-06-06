import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import XLayout from './layout'
import './index.scss'
import XIcon from '@/component/icon'
import Theme from '@/models/theme'

interface IChooseCatgrayCard {
  info: any
  className?: string
  right?: React.ReactNode
  onClick?: (info: any) => void
  onRightTap?: (info: any) => void
}

const XChooseCatgrayCard: FC<IChooseCatgrayCard> = (props) => {
  const { className, info, right, onRightTap, onClick } = props
  const classes = classNames('c-choose-catgray-card', className)

  const COUNT = <View className='count' >
    <XIcon name="fenlei" color={Theme.red} size="13" />
    <Text className='txt' >{info.points}个点</Text>
  </View>

  return <View className={classes} onClick={() => onClick(info)} >
    <XLayout
      onRightTap={() => onRightTap(info)}
      name={<View className="name" >{info.name}</View>}
      count={COUNT}
      right={right}>
    </XLayout>
  </View>
}

export default XChooseCatgrayCard