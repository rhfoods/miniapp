import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Input, View } from '@tarojs/components'
import classNames from 'classnames'
import Throttle from '@/utils/throttle'
import Tool from '@/utils/tools'
import './index.scss'
import XAvatar from '@/component/avatar'
import User from '@/models/user'

interface IInputComment {
  className?: string
  placeholder?: string
  onSend?: (info: string) => void
  blurEvent?: () => void
}
export interface XInputCommentExp {
  setFocus: React.Dispatch<React.SetStateAction<boolean>>
  value
}

const XInputComment = forwardRef<XInputCommentExp, IInputComment>((props, ref) => {
  const { className, placeholder, onSend, blurEvent } = props
  const classes = classNames('c-input-comment', className)
  const [value, setVlaue] = useState('')
  const [focus, setFocus] = useState(false)
  const [keyboardH, setKeyboardH] = useState(0)

  const style = useMemo(() => {
    return {
      bottom: keyboardH
    }
  }, [keyboardH])

  const onInput = (e) => {
    setVlaue(e.detail.value)
  }

  const onFocus = () => {
    setFocus(true)
  }
  
  const onBlur = () => {
    setFocus(false)
    setKeyboardH(0)
    blurEvent && blurEvent()
  }

  const send = async () => {
    await Throttle.wait(1000)
    const isEmpty = Tool.text.isNull(value)
    if(isEmpty) {
      Tool.load.alert('输入内容不能为空')
      setVlaue('')
      return
    }
    setVlaue('')
    value && onSend && onSend(value)
  }
  const onKeyboardHeightChange = (e) => {
    const keyboardH = e.detail.height
    setKeyboardH(keyboardH)
  }

  useImperativeHandle(ref, () => ({
    setFocus,
    value,
  }), [value])

  return <View className={classes} style={style} >
    <XAvatar
      className="comment-avatar"
      userInfo={User.info()}
      onlyAvatar={true}
      hideGender={true}
    />
    <Input 
      className='input-commnet'
      placeholderClass='input-commnet-holder'
      confirmType='send'
      value={value} 
      placeholder={placeholder} 
      focus={focus}
      adjustPosition={false}
      onConfirm={send}
      onInput={onInput}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyboardHeightChange={onKeyboardHeightChange}
    />
  </View>
})

export default XInputComment