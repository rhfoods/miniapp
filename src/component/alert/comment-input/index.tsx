import React, { FC, useEffect, useRef, useState } from 'react'
import XInputComment, { XInputCommentExp } from '@/component/input-comment'
import classNames from 'classnames'
import Tool from '@/utils/tools'
import { ISucFail } from '@/core/interface/nav'
import { useDidHide, useDidShow } from '@tarojs/taro'
import { View } from '@tarojs/components'

interface IXAlertCommentInput {
  
}

let success: any

const XAlertCommentInput: FC<IXAlertCommentInput> = () => {
  const [show, setShow] = useState(false)
  const ref = useRef<XInputCommentExp>()
  const classes = classNames('c-alert-comment-input', {
    hide: !show
  })

  useEffect(() => { Tool.alertCommentInput = showInput }, [])
  useDidShow(() => { Tool.alertCommentInput = showInput })
  useDidHide(() => { Tool.alertCommentInput = null })

  const onSend = (v) => {
    success && success(v)
  }

  const showInput = async (params: ISucFail) => {
    setShow(true)
    await Tool.sleep(0)
    ref.current.setFocus(true)
    success = params?.success
  }
  
  const hideInput = () => {
    setShow(false)
  }

  return (
    <View className={classes} >
      <XInputComment
        ref={ref} 
        onSend={onSend} 
        blurEvent={hideInput}
        placeholder='说点什么吧' 
      />
    </View>
  )
}
export default XAlertCommentInput
