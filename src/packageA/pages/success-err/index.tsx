import React, { FC, useEffect } from 'react'
import { Button, View } from '@tarojs/components'
import useParams from '@/hooks/use-params'
import { ISuccessFailPage } from '@/core/interface/nav'
import XIcon from '@/component/icon'
import Taro from '@tarojs/taro' 
import './index.scss'

let success

const PSuccessErr: FC = () => {

  const params: ISuccessFailPage = useParams()

  useEffect(() => {
    success = params?.success
  }, [params])

  useEffect(() => {
    return () => {
      success && success(true)
    }
  }, [])

  const back = () => Taro.navigateBack()

  const SUCCESS = <View className='up' >
    <XIcon name='dui' color='#3BB430' size='36' />
    <View className='info' >{params?.info}</View>
  </View>

  const FAIL = <View className='up' >
    <View className='cha' >
      <XIcon name='cha' color='#ffff' size='28' />
    </View>
    <View className='info' >{params?.info}</View>
    {
      params?.subInfo &&
      <View className='subInfo' >{params.subInfo}</View>
    }{
      params?.list?.map(item => <View className='list-item'>{item}</View>)
    }
  </View>

  return <View className='p-success-err' >
    {
      params?.type === 'success'
      ? SUCCESS
      : FAIL
    }
    <Button className='btn-long btn-fix' onClick={back} >确定</Button>
  </View>
}

export default PSuccessErr