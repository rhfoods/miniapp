import React, { FC } from 'react'
import { ITouchEvent, View } from '@tarojs/components'
import XIcon from '@/component/icon'

interface IXMapBtn {
  onClick: () => void
}

const XMapBtn: FC<IXMapBtn> = ({onClick}) => {

  const tap = (e: ITouchEvent<any>) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <View className='c-map-btn' onClick={tap} >
      <XIcon name='liulan' size='16' color='#888888' className='icon-eye' />
      <View>查看TA的地图</View>
    </View>
  )
}

export default XMapBtn