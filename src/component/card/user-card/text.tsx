import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'

interface ILabNum {
  lab: string,
  value: string | number
}

const XLabNum: FC<ILabNum> = (props) => {
  return <View className='c-lab-num'>
    <Text className='lab' >{props.lab}</Text>
    <Text className='num'>{props.value}</Text>
  </View>
}

export default XLabNum