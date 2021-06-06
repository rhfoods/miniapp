import React, { useState, useImperativeHandle, forwardRef, useEffect, useContext, useMemo } from 'react'
import { View, Textarea, Text } from '@tarojs/components'
import { FormCxt } from '../form'
import './index.scss'
import classNames from 'classnames'
import { useDidHide, useDidShow } from '@tarojs/taro'
import Tool from '@/utils/tools'
import { IAreaShowHid } from '@/component/alert/sheet'

export interface IInput {
  name: string
  maxlength?: number
  disabled?: boolean
  placeholder?: string
  onChange?: (value: string) => void
  children?: React.ReactNode
}

export interface IInputRef {
  setValue?: (v: string) => void
}

const XTextarea = forwardRef<IInputRef, IInput>((props, ref) => {
  const { name, placeholder, maxlength, disabled } = props
  const { form } = useContext(FormCxt)
  const [value, setValue] = useState('')
  const [focus, setFocus] = useState(false)
  const [show, setShow] = useState(true) // 是否显示真的input

  const classes = classNames('textarea', {
    'hide': !show
  })

  useEffect (() => { Tool.areaShowHid = areaShowHid}, []);
  useDidShow(() => { Tool.areaShowHid = areaShowHid});
  useDidHide(() => { Tool.areaShowHid = null });

  function areaShowHid(params:IAreaShowHid) {
    if(params.show === true) {
      setShow(true)
    }
    if(params.show === false) {
      setShow(false)
    }
  }

  /**
   * 文章内容
   */
  const content = useMemo(() => {
    if(!value) return ''
    return value.replace(/↵/g, '\n')
  }, [value])

  useEffect(() => {
    setValue(form[name])
  }, [])

  function onInput(e: any) {
    let value = e.detail.value
    setValue(value)
  }

  function onBlur() {
    setFocus(false)
  }
  
  useImperativeHandle(ref, () => ({
    setValue
  }), [])

  return <View className="c-textarea" onClick={() => setFocus(true)} >
    <Textarea 
      className={classes} 
      name={name}
      placeholder-class='placeholder'
      auto-height={true}
      value={value}
      placeholder={placeholder}
      focus={focus}
      onBlur={onBlur}
      onInput={onInput}
      maxlength={maxlength}
      disabled={disabled} 
    />
    {
      !show && 
      <View className='textarea' >
        { value && <Text className='txt' space='nbsp' decode >{content}</Text> }
        { !value && <View className='fake-placeholder txt' >{placeholder}</View> }
      </View>
    }
  </View>
})

XTextarea.defaultProps = {
  placeholder: '请输入',
  maxlength: 2000
}

export default XTextarea