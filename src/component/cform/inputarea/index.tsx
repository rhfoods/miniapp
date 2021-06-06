import React, { FC } from 'react'
import { View } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'
import { ICRule } from '../form'
import './index.scss'
import classNames from 'classnames'
import useCInput from '../input/use-cinput'

interface ICInputArea {
  className?: string
  name: string
  label: string
  rule?: ICRule
  placeholder?: string
}

const CInputArea: FC<ICInputArea> = (props) => {
  const { className, name, rule, placeholder, label } = props

  const classes = classNames('c-input-area', className)
  const { value, onInput } = useCInput(name, rule)

  return (
    <View className={classes} >
      <View className='label' >{label}</View>
      <AtTextarea
        className='areainput'
        value={value}
        onChange={(v) => onInput(v) }
        maxLength={200}
        placeholder={placeholder}
        height={140}
      />
    </View>
  )
}

CInputArea.defaultProps = {
  placeholder: '请输入...'
}

export default CInputArea