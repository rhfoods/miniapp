import React, { FC, useEffect, useRef } from 'react'
import { Button, View } from '@tarojs/components'
import CForm, { useCForm } from '@/component/cform/form'
import CPoint from '@/component/cform/point'
import CInput from '@/component/cform/input'
import Tool from '@/utils/tools'
import CInputArea from '@/component/cform/inputarea'
import RecommendFormModel from './model'
import { deleteMedias, PointRecommend } from '@/api/api'
import { PointRecommendPrams } from '@/api/types/api.interface'
import CMedias, { useMedias } from '@/component/cform/medias'
import XAddBtn from '@/component/icon-btn'
import useParams from '@/hooks/use-params'
import Taro from '@tarojs/taro'
import './index.scss'
import { IRecommendFormParams } from '@/core/interface/nav'

export interface IRecommendForm {
  addres: string;
  name: string;
  latitude: string;
  longitude: string;
  images: string[];
}

export enum ERecommendForm {
  name = 'name',
  address = 'address',
  longitude = 'longitude',
  latitude = 'latitude',
  medias = 'medias',
  reason = 'reason'
}

let success: any;

const RecommendForm: FC = () => {

  const form = useCForm()
  const medias = useMedias()
  const params: IRecommendFormParams = useParams();
  const hasSub = useRef(false)

  const onFinish = async (data: PointRecommendPrams) => {
    if(params.toUserId) {
      data.toUserId = params.toUserId
    }
    await PointRecommend(data)
    hasSub.current = true
    await Taro.showModal({
      content: '您的推荐我们已收到，谢谢！',
      showCancel: false
    });
    success && success(data)
    Taro.navigateBack()
  }

  const onError = (err: string) => {
    Tool.load.alert(err)
  }

  useEffect(() => {
    success = params?.success;
  }, [params]);

  useEffect(() => {
    return () => {
      const newImgs = medias.newImgs.current
      if(!hasSub.current && newImgs.length) {
        deleteMedias({ medias: newImgs });
      }
    }
  }, [])

  const onSub = () => {
    form.submit()
  }

  const pointChange = (values) => {
    form.setData(data => ({
      ...data,
      name: values.name
    }))
  }

  return <View className='p-recommend-form' >
    <CForm onFinish={onFinish} onError={onError} form={form} >
      <CPoint 
        names={[ERecommendForm.address, ERecommendForm.latitude, ERecommendForm.longitude]} 
        rule={{required: true, message: '请选择地址'}}
        onChange={pointChange}
      />
      <CInput 
        name={ERecommendForm.name}
        label='点位名称'
        rule={{required: true, message: '请输入门店名称'}}
        disabled={true}
      />
      <CInputArea 
        name={ERecommendForm.reason}
        label='推荐理由'
        rule={{required: true, fn: RecommendFormModel.reasonRule}}
        placeholder='将好店推荐给我们，有机会让更多人看到哦~' 
      />
      <XAddBtn
        icon="zhaopian"
        text="照片"
        iconColor="#ff7505"
        className="add-pics"
        onClick={() => medias.addPic()}
      />
      <CMedias 
        name={ERecommendForm.medias} 
        exp={medias} 
        rule={{required: false, message: '请上传图片' }}
      />
    </CForm>

    <View className="fix-bottom">
      <Button className="btn-long" onClick={onSub} >确认推荐</Button>
    </View>

  </View>
}

export default RecommendForm