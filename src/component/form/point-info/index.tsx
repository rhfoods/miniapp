import Tool from '@/utils/tools'
import { Input, View } from '@tarojs/components'
import classNames from 'classnames'
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { FormCxt } from '../form'
import XTagPrice from '@/component/tag-price'

export interface IPointInfo {
  info?: IShopInfo
  name?: string
  className?: string
  tapAnimation?: boolean
  curPointId?: number
  onClick?: (point: IShopInfo) => void
}
export interface IPointInfoRef {
  update: () => void
  choose: () => void
  setPointInfo: (data: any) => void
  point: any
}

export interface IShopInfo {
  psaveId: number
  logo: string
  tag: string
  name: string
  address: string
  [propname: string]: any
}

const XPointInfo = forwardRef<IPointInfoRef, IPointInfo>((props, ref) => {
  const { info, className, tapAnimation, onClick, name, curPointId } = props
  const [pointInfo, setPointInfo] = useState<IShopInfo>() // 依赖 info
  const point = useRef(pointInfo) // 依赖 pointInfo
  const { form } = useContext(FormCxt)
  /**
   * 
   */
  useEffect(() => {
    info && setPointInfo(info)
  }, [info])
  /**
   * 
   */
  useEffect(() => {
    form && form.pointInfo && setPointInfo(form.pointInfo)
  }, [form])
  /**
   * 
   */
  useEffect(() => { point.current = pointInfo }, [pointInfo])
  /**
   * 
   */
  useImperativeHandle(ref, () => ({
    point, choose, update, setPointInfo
  }), [])
  /**
   * 选择点位
   */
  async function choose() {
    const {promisic, choosePoint} = Tool
    const res: any = await promisic(choosePoint)({
      psaveId: point.current?.psaveId
    })
    setPointInfo(res)
    return res
  }
  /**
   * 更新点位
   */
  async function update() {
    const {promisic, pointForm} = Tool
    const pointInfo: any = await promisic(pointForm)({psaveId: point.current?.psaveId})
    setPointInfo(point => ({...point, ...pointInfo}))
    return {...point.current, ...pointInfo}
  }

  const classes = classNames('c-point-info', className, {
    'none': !pointInfo?.psaveId,
    'cur': curPointId && curPointId === pointInfo?.psaveId
  })
  const hoverClass = tapAnimation ? 'c-point-info-hover' : ''

  return <View className={classes} hoverClass={hoverClass} onClick={() => onClick(pointInfo)} >
    <View className='shop-name' >{Tool.text.ellipsis(pointInfo?.name, 21)}</View>
    <View className='address' >{Tool.text.ellipsis(pointInfo?.address, 25)}</View>
    <XTagPrice className='info' pointInfo={pointInfo} showPrice={false} />
    <Input name={name} value={String(pointInfo?.psaveId || '')} className='none' />
  </View>
})

XPointInfo.defaultProps = {
  tapAnimation: false
}

export default XPointInfo