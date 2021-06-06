import React, { FC, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import XChooseCitySimple from './simple'
import { CommonMapCities } from '@/api/api'
import useApi from '@/hooks/use-api'
import useParams from '@/hooks/use-params'
import { IChooseCity } from '@/core/interface/nav'
import Taro from '@tarojs/taro' 
import XIndexes from '@/component/indexes/indexes'
import './index.scss'
// import ChooseCityModel from './model'

let success: any

const PChooseCity: FC = () => {

  const params: IChooseCity = useParams()
  const cities = useApi(getCities)
  const [type, setType] = useState<IChooseCity['type']>('simple')

  useEffect(() => {
    if(params) {
      cities.getData()
      success=params.success
      params.type && setType(params.type)
      // const list = ChooseCityModel.getData()
      // console.log(JSON.stringify(list), '--------------- list')
    }
  }, [params])

  async function getCities() {
    const res: any = await CommonMapCities({})
    const cities = res.citys
    return cities
  }

  function simpleItemTap(city) {
    if(type === 'detail') {
      chooseCity(city)
      return
    }
    success && success(city)
    if(!params.donotBack) {
      Taro.navigateBack()
    }
  }

  async function chooseCity(city) {
    const res = await Taro.showModal({
      content: `确认迁移到${city.name}?`
    })
    if(res.confirm) {
      success && success(city)
      !params.donotBack && Taro.navigateBack()
    }
  }

  return <View className='p-choose-city'>
    {
      type === 'simple' 
      ? <XChooseCitySimple title='可选城市' cities={cities.info || []} onItemTap={simpleItemTap} />
      : <XIndexes onClick={chooseCity} >
          {
            cities.info?.length > 0 &&
            <XChooseCitySimple 
              title='热门城市' 
              cities={cities.info || []} 
              onItemTap={simpleItemTap} 
            />
          }
        </XIndexes>
    }
  </View>
}

export default PChooseCity