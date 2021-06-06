import React, { FC, useState } from 'react'
import { Button, CoverImage, CoverView } from '@tarojs/components'
import classNames from 'classnames'

interface IAlertAddService {
  className?: string
  exp: IAlertAddServiceExp
}

interface IAlertAddServiceExp {
  alert: () => void
}

const XAlertAddService: FC<IAlertAddService> = (props) => {
  const { className, exp } = props
  const [show, setShow] = useState(false)
  const classes = classNames('c-alert-add-service', className, {
    none: !show
  })

  exp.alert = () => {
    setShow(true)
  }

  const hide = () => {
    setShow(false)
  }

  return <CoverView className={classes} onClick={hide} >

    <CoverView className='container' >
      <CoverView className='title' >亲爱的，知道您的美食足迹遍布天下！</CoverView>
      <CoverView className='title02' >联系我可以立刻帮助您：</CoverView>
      <CoverView className='info' >创建自己的美食地图，不用您辛苦建点！</CoverView>
      <CoverView className='info02' >点击按钮去回复，即可联系客服</CoverView>
      <Button className='btn' openType='contact' >去回复1</Button>
    </CoverView>

    <CoverView className='pic-container' >
      <CoverImage className='pic' src={require('../../../static/pic/wx-server.png')} />
    </CoverView>
    
  </CoverView>
}

export default XAlertAddService

export function useAlertAddService(): IAlertAddServiceExp {
  return {
    alert: null
  }
}