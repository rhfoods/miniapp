import React, { FC, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import XCityCard from './city-card'
import XCityCatgrayCard, { ICityCatgrayCardInfo } from './city-catgray-card'
import { CitySorts } from '@/api/api'
import useApi from '@/hooks/use-api'
import useParams from '@/hooks/use-params'
import { ICommonCatgrayParams } from '@/core/interface/nav'
import { ICommonSort } from '@/pages/map/use-com-sort'
import classNames from 'classnames'
import Taro from '@tarojs/taro' 
import Tool from '@/utils/tools'
import { CitySortsPrams } from '@/api/types/api.interface'
import './index.scss'

let success: any;

const PCityCatgray: FC = () => {
  
  const params: ICommonCatgrayParams = useParams();
  const list = useApi(getList);
  const [sort, setSort] = useState<ICommonSort>(null)
  
  useEffect(() => {
    if(params) {
      success = params.success;
      const sort = params.sort
      setSort(sort)
      list.getData({ cityCode: sort.cityCode })
    }
  }, [params]);
  /**
   * 获取城市下的分类
   */
  async function getList(params: CitySortsPrams) {
    const res: any = await CitySorts(params)
    return res.sorts
  }
  /**
   * 选择分类
   */
  const cardTap = (info: ICityCatgrayCardInfo) => {
    const SORT: ICommonSort = {
      sortId: info.sortId,
      total: info.points,
      sortName: info.name,
      city: sort.city,
      cityCode: sort.cityCode,
      dividing: sort.dividing,
    }
    setSort(SORT)
    success && success(SORT)
    Taro.navigateBack()
  }
  /**
   * 选择城市
   */
  const chooseCity =  async () => {
    const { promisic, chooseCity } = Tool
    const city: any = await promisic(chooseCity)({type: 'simple'})
    if(city.code === sort.cityCode) {
      return
    }
    list.getData({ cityCode: city.code })
    setSort({
      sortId: 0,
      total: 0,
      sortName: '',
      city: city.name,
      cityCode: city.code,
      dividing: city.scale,
    })
  }

  return <View className='p-city-catgray' >
    <XCityCard className='card' onClick={chooseCity} name={sort?.city} />
    {
      list.info?.map(item => {
        const classCard = classNames('card', {
          'red': item.sortId === sort.sortId
        })
        return <XCityCatgrayCard className={classCard} info={item} onClick={() => cardTap(item)} />
      })
    }
  </View>
}

export default PCityCatgray