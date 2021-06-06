import React, { FC, useEffect, useState } from 'react'
import { Button, Input, View, Image } from '@tarojs/components'
import './index.scss'
import Tool from '@/utils/tools'
import Taro from '@tarojs/taro' 
import XPoster, { EPostType } from '@/component/poster'

const PTransfer: FC = () => {
  const [phone, setPhone] = useState<string>()
  const [src, setSrc] = useState('')
  const [state, setSate] = useState<'form'|'code'>('form')

  useEffect(() => {
    Taro.hideShareMenu()
  }, [])

  const onInput = (e) => {
    setPhone(e.detail.value)
  }

  const onSub = async () => {
    const isPhone = Tool.isPhone(phone) 
    if(!isPhone) {
      Tool.load.alert('请输入正确手机号码')
      return
    }
    Tool.load.show('二维码生成中');
    const time = getTime()
    const src = await Tool.getPoster({
      info: `小程序码将于${time}失效`,
      page: 'pages/home/index',
      type: EPostType.transfer,
      phone,
      width: 300,
      height: 300,
    }); 
    if(src) {
      Tool.load.hide();
      setSrc(src);
      setSate('code')
    }     
    else {
      Tool.load.alert('发现有点位不是自己创建的点位，请先处理~~')     
    }
  }

  const getTime = () => {
    const now = +new Date()
    const oneDay = 1000*60*60*24
    const time = Tool.utc2Locale(now+oneDay, false)
    return time
  }

  const download = () => {
    Taro.saveImageToPhotosAlbum({
      filePath: src,
      success: () => Tool.load.alert('保存成功'),
      fail: () => Tool.load.alert('保存失败')
    })
  }

  const Form = <View className='form'>
    <View className='info' >请输入迁移对象的手机号码，对方需要通过短信验证码进行身份确认后，才能进行迁移操作</View>
    <Input 
      className='input'
      value={phone} 
      type='number' 
      maxlength={11} 
      placeholder='请输入迁移对象的手机号码'
      placeholderClass='input-holder'
      onInput={onInput}
    />
    <Button className='btn-long btn-diy' onClick={onSub} >确定</Button>
  </View>

  const Code = <View className='code' >
    <Image className='code-pic' src={src} />
    <Button className='btn-long btn-diy' onClick={download} >保存二维码</Button>
  </View>

  return <View className='p-transfer' >
    { state === 'form' ? Form : Code }
    <XPoster />
  </View>
}

export default PTransfer