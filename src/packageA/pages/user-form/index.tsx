import React, { FC, useEffect, useMemo } from 'react'
import { View, Image, Text, Button, Form } from '@tarojs/components'
import XUserList from './list'
import User, { IUserInfo } from '@/models/user'
import Taro from '@tarojs/taro' 
import { PUTUserInfo } from '@/api/api'
import Tool from '@/utils/tools'
import XToast from '@/component/alert/toast'
import XTxtArea from './text-area'
import './index.scss'
import useParams from '@/hooks/use-params'
import { ISucFail } from '@/core/interface/nav'
import useLogin from '@/hooks/use-login'

let success: any

const PUserForm: FC = () => {

  const params: ISucFail = useParams();
  const user = useLogin()

  useEffect(() => {
    success = params?.success
  }, [params])

  const gender = useMemo(() => {
    if(user.info?.gender === '1') return '男'
    if(user.info?.gender === '2') return '女'
    return '你猜'
  }, [user.info?.gender])

  async function sub(e) {
    const introduce: string = e.detail.value?.introduce || ''
    // if(!introduce) {
    //   Tool.toast({text: '个人简介不能为空'})
    //   return
    // }
    const userInfo: IUserInfo = user.info
    await PUTUserInfo({
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      gender: userInfo.gender,
      city: userInfo.city,
      introduce
    })
    await Tool.load.hide('修改成功')
    Taro.navigateBack()
    const info = {...user.info}
    info.introduce = introduce
    User.setInfo(info)
    success && success(info)
  }

  return user.info && <View className='p-user-form' >
    <Form onSubmit={sub} >
      <View className='line' ></View>
      <XUserList 
        label='头像'
        right={<Image className='avatar' src={user.info?.avatarUrl} mode='aspectFill' ></Image>}
      />
      <XUserList 
        label='昵称'
        right={<Text>{user.info?.nickName}</Text>}
      />
      <View className='line' ></View>
      <XUserList 
        label='性别'
        right={<Text>{gender}</Text>}
      />
      <XUserList 
        label='城市'
        right={<Text>{user.info?.city || '未知'}</Text>}
      />
      <View className='line' ></View>
      <XTxtArea 
        label='个人简介' 
        name='introduce' 
        initValue={user.info?.introduce} 
      />
      <Button className='btn-long btn-fix' formType="submit">保存</Button>
    </Form>
    <XToast />
  </View>
}

export default PUserForm