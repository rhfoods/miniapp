import React, { useImperativeHandle, forwardRef, useContext, useEffect } from 'react'
import { View, Input } from '@tarojs/components'
import { FormCxt } from '../form'
import useInput from '@/hooks/use-input'
import './index.scss'
import classNames from 'classnames'

export interface IInput {
  name: string
  type?: 'text' | 'number' | 'idcard' | 'digit'
  isPrice?: boolean
  maxlength?: number
  disabled?: boolean
  label?: string
  placeholder?: string
  unit?: string
  left?: any
  onChange?: (value: string) => void
  children?: React.ReactNode
  className?: string
}

export interface IInputRef {
  setInput?: (v: string) => void
}

const XInput = forwardRef<IInputRef, IInput>((props, ref) => {
  const { name, type, label, unit, left, placeholder, maxlength, disabled, isPrice, className } = props
  const { form } = useContext(FormCxt)
  const {
    txt,
    value,
    onBlur,
    onInput,
    setTxt,
  } = useInput(form[name], isPrice )

  /**
   * 外部修改 text & value
   */
  function setInput(text: string) {
    setTxt(text)
  }
  /**
   * 
   */
  useImperativeHandle(ref, () => ({
    setInput
  }), [])
  /**
   * 
   */
  const txtInputProps = {
    value: txt,
    type, 
    placeholder, 
    onBlur, 
    onInput, 
    maxlength, 
    disabled,
    'placeholder-class': 'placeholder'
  }

  const classes = classNames('c-input', className)

  return <View className={classes} >
    {label && <View className="label" >{label}</View>}

    <View className='down' >
      <View className="left" >
        <Input className="input" {...txtInputProps} />
      </View>
      <View className="right" >
        {unit && <View className="unit" >{unit}</View>}
        {left}
      </View>
    </View>

    <Input className="none" name={name} value={value} />
  </View>
})

XInput.defaultProps = {
  placeholder: '请输入',
}

export default XInput