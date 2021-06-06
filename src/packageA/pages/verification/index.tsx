import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import './index.scss'
import { POSPhoneCode, POSTTransfer } from '@/api/api'
import { useRouter } from '@tarojs/taro'
import Tool from '@/utils/tools'
import Taro from '@tarojs/taro' 

let timer: any

const PVerification: FC = () => {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState('')
  const [phone, setPhone] = useState('')
  const [userId, setUserId] = useState('')
  const hasGetCode = useRef(false)
  const {params} = useRouter()

  useEffect(() => {
    Taro.hideShareMenu()
  }, [])

  useEffect(() => {
    params?.phone && setPhone(params.phone)
    params?.userId && setUserId(params.userId)
  }, [params])

  useEffect(() => {
    return () => clearInterval(timer)
  }, [])

  const startCount = () => {
    setCount(59)
    timer = setInterval(() => {
      setCount(c => {
        if(c<0) {
          clearInterval(timer)
          return 0
        }
        return c-1
      })
    }, 1000)
  }

  const getCode = async () => {
    if(count !== 0) {
      return
    }
    startCount()
    try {
      await POSPhoneCode({
        phone,
        template: 'SMS_208626278',
        sign: '热活'
      })
      hasGetCode.current = true
    } catch (error) {
      clearInterval(timer)
      setCount(0)
    }
  }

  const info = useMemo(() => {
    if(count>0) {
      return `${count} s`
    }
    return '获取'
  }, [count])

  const onTransfer = async () => {
    if(!hasGetCode.current) {
      Tool.load.alert('请先获取验证码')
      return
    }
    if(code.length !== 6) {
      Tool.load.alert('请输入正确验证码')
      return
    }
    Tool.load.show('迁移中...')
    const { successFail } = Tool
    try {
      await POSTTransfer({
        phone,
        smsCode: code,
        providerId: Number(userId),
      })
      Tool.load.hide()
      successFail({
        type: 'success',
        info: '迁移成功!',
        redirect: true,
        dontBack: true,
        success: () => Tool.openMap({reLaunch: true})
      })
    } catch (error) {
      successFail({
        type: 'fail',
        info: error.errMsg,
      })
      clearInterval(timer)
      setCount(0)
    }
  }

  return <View className='p-verification' >
    <View className='info' >
      <Text>请输入手机</Text>
      <Text className='blue' >{phone.substr(0, 3)}****{phone.substr(7)}</Text>
      <Text>收到的数据迁移短信验证码，以确认其身份。短信验证码10分钟内有效，请勿向任何人泄露。</Text>
    </View>

    <View className='input-container' >
      <Input 
        className='input' 
        placeholder='请输入验证码' 
        onInput={e => setCode(e.detail.value)} 
        maxlength={6}
        value={code}
        type='number'
      />
      <Button className='btn-r btn-code' onClick={getCode} >{info}</Button>
    </View>

    <Button className='btn-long btn-sub' onClick={onTransfer} >确认迁移</Button>
  </View>
}

export default PVerification