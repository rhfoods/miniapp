import XIcon from '@/component/icon';
import { Input, Text, View } from '@tarojs/components';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import MyMap from '../../../models/map';
import Theme from '../../../models/theme';
import { FormCxt } from '../form';
import './index.scss';

interface ILocation {
  onChange?: (res: ILocationInfo) => void
  dis?: boolean
}

export interface ILocationInfo {
  name: string
  address: string
  latitude: string
  longitude: string
}

const XLocation: FC<ILocation> = (props) => {
  const { onChange, dis } = props
  const [address, setAddress] = useState('')
  const latitude = useRef<HTMLInputElement>()
  const longitude = useRef<HTMLInputElement>()
  const { form } = useContext(FormCxt)

  useEffect(() => {
    setAddress(form.address)
    latitude.current.value = form?.latitude
    longitude.current.value = form?.longitude
  }, [])

  async function chooseLocation() {
    if(dis) {
      return
    }
    const res = await MyMap.chooseLocation(
      Number(latitude.current.value), 
      Number(longitude.current.value)
    )
    const data: ILocationInfo = res as undefined
    setAddress(data.address)
    latitude.current.value = data?.latitude
    longitude.current.value = data?.longitude
    onChange && onChange(data)
  }


  return <View className="c-location" onClick={chooseLocation} >
    <View className="address">
      {
        address &&
        <Text className="text" >{address}</Text>
      }{
        !address &&
        <Text className="text holder" >详细地址</Text>
      }
      <XIcon name='weizhi2' color={Theme.red} size='20' />
    </View>
    <Input name="latitude" ref={latitude} />
    <Input name="longitude" ref={longitude} />
    <Input name="address" value={address} />
  </View>
}

export default XLocation