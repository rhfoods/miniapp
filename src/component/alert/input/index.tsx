import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, Input, View } from '@tarojs/components'
import { AtModal, AtModalContent } from 'taro-ui'
import { useDidShow, useDidHide } from '@tarojs/taro'
import Tool from '@/utils/tools'

type TType = 'text' | 'number' | 'idcard' | 'digit'

export interface IAletInput {
  title?: string
  placeholder?: string
  maxlength?: number
  type?: TType
  btnText?: string
  value?: string
  showTextArea: boolean // 退出时显示真的textarea
  [propname: string]: any
}

let success: any
let fail: any

const XAlertInput: FC = (props) => {
  const [title, setTitle] = useState('')
  const [btnText, setBtnText] = useState('确定')
  const [placeholder, setPlaceholder] = useState('请输入')
  const [maxlength, setMaxlength] = useState(6)
  const [type, setType] = useState<TType>('text')
  const [show, setShow] = useState(false)
  const input = useRef<HTMLInputElement>()
  const [showTextArea, setShowTextArea] = useState(false)

  useEffect(() => { Tool.alertInput = alertInput }, [])
  useDidShow(() => { Tool.alertInput = alertInput })
  useDidHide(() => { Tool.alertInput = null })

  async function alertInput(params: IAletInput) {
    params.title && setTitle(params.title)
    params.btnText && setBtnText(params.btnText)
    params.placeholder && setPlaceholder(params.placeholder)
    params.maxlength && setMaxlength(params.maxlength)
    params.type && setType(params.type)
    params.showTextArea && setShowTextArea(params.showTextArea)
    success = params.success
    fail = params.fail
    setShow(true)
    if(params.value) {
      input.current.value = params.value
    }
  }

  function sub () {
    const value = input.current.value
    if(value.length > maxlength) {
      Tool.load.alert(`最多输入${maxlength}个字`)
      return
    }
    const isNull = Tool.text.isNull(value)
    !isNull && success && success(value)
    setShow(false)
    showTextArea && Tool.areaShowHid && Tool.areaShowHid({show: true})
  }
  
  const inputProps = {
    className: 'input',
    'cursor-spacing': 100,
    // maxlength,
    placeholder, type
  }

  function onClose() {
    input.current.value = ''
    setShow(false)
    showTextArea && Tool.areaShowHid && Tool.areaShowHid({show: true})
  }

  const ModalProps = {
    className: 'c-alert-input',
    maxlength: 21,
    onClose
  }

  return <AtModal isOpened={show} {...ModalProps} >
    {
      show &&
      <AtModalContent>
        <View className="title" >{title}</View>
        <Input ref={input} {...inputProps} />
        <Button className="btn-m btn-diy" onClick={sub} >{btnText}</Button>
      </AtModalContent>
    }
  </AtModal>
}

export default XAlertInput