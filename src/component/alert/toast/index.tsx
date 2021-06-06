import React, { FC, useEffect, useState } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro' 
import { AtToast } from 'taro-ui'
import Tool from '../../../utils/tools';

export interface IParams {
  text: string
  time?: number
  [propname:string]: any
}

const XToast: FC = () => {

  const [open, setOpen] = useState(false)
  const [hasMask, setHasMask] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    Tool.toast = toast
  }, [])
  
  useDidShow(() => {
    Tool.toast = toast
  })
  
  useDidHide(() => {
    Tool.toast = null
  })

  async function toast(params: IParams) {
    setText(params.text)
    setHasMask(params.hasMask || true)
    setOpen(true)
    await Tool.sleep(params.time || 1500)
    setOpen(false)
  }

  return <AtToast 
    isOpened={open} 
    text={text} 
    className="toast"
    hasMask={hasMask}>
  </AtToast>
}

export default XToast