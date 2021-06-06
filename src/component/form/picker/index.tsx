import React, { forwardRef, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './index.scss'
import usePicker from '@/hooks/use-picker'

export type TPicker = 'catgray'

interface IPicker {
  name: string
  type: TPicker
  label?: string
  placeholder?: string
  onChange?: (data: any) => void
}

interface IPickerRef {

}

const XPicker = forwardRef<IPickerRef, IPicker>((props, ref) => {

  const { type, label, name, placeholder, onChange } = props
  const { handleClick, text, value, otherInfo } = usePicker(type, name)

  useEffect(() => {
    onChange && onChange({ text, value, otherInfo })
  }, [text, value, otherInfo])

  return <View className="c-picker" onClick={handleClick} >
    <View className="label" >{label}</View>

    <View className='down' >
      <View className="left" >
        {!text && <Text className="placeholder" >{placeholder}</Text>}
        { text && <Text className="text" >{text}</Text>}
      </View>
      <View className="right" >
        <AtIcon value='chevron-down' size='20' color='#888'></AtIcon>
      </View>
    </View>

    <Input className="none" name={name} value={value} />
  </View>
})

XPicker.defaultProps = {
  placeholder: '请选择'
}

export default XPicker