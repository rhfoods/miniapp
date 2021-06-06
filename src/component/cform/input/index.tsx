import React, { FC } from 'react'
import { Input, View } from '@tarojs/components'
import classNames from 'classnames'
import { ICRule } from '../form'
import useCInput from './use-cinput'
import './index.scss'

interface ICInput {
  className?: string
  name: string
  label: string
  rule?: ICRule
  placeholder?: string
  disabled?: boolean
}

const CInput: FC<ICInput> = (props) => {
  const { className, name, rule, placeholder, label, disabled } = props

  const classes = classNames('c-cinput', className)
  const { value, onInput } = useCInput(name, rule)

  return <View className={classes} >
    <View className='label' >{label}</View>
    <Input 
      className='input' 
      placeholderClass='placeholder'
      value={value} 
      onInput={(e) => onInput(e.detail.value)} 
      disabled={disabled}
      placeholder={placeholder}
    />
  </View>
}

CInput.defaultProps = {
  placeholder: '请输入'
}

export default CInput