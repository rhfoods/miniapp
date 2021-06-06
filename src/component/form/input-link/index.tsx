import React, { FC, useContext } from 'react'
import { Input, View } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import { FormCxt } from '../form'
import useInput from '@/hooks/use-input'

interface IInputLink {
  name: string
  className?: string
  icon?: React.ReactNode
  maxlength?: number
  placeholder?: string
  onTapQuestion?: (name: string) => void
}

const XInputLink: FC<IInputLink> = (props) => {
  const { className, name, placeholder, icon, onTapQuestion } = props
  const { form } = useContext(FormCxt)
  const { txt, onBlur, onInput } = useInput(form[name])

  const classes = classNames('c-input-link', className)

  return <View className={classes} >
    {icon}
    <Input 
      name={name} 
      className='input' 
      value={txt} 
      placeholder={placeholder} 
      onBlur={onBlur}
      onInput={onInput}
    />
    <View className='question' onClick={() => onTapQuestion(name)} >?</View>
  </View>
}

XInputLink.defaultProps = {
  placeholder: '请输入'
}

export default XInputLink