import React, { FC, useEffect, useMemo, useState } from 'react'
import { View, Textarea } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'

interface ITxtArea {
  label: string,
  name: string,
  className?: string,
  initValue?: string,
  maxLength?: number,
}

const XTxtArea: FC<ITxtArea> = (props) => {

  const { className, initValue, name, label, maxLength } = props
  const [focus, setFocus] = useState(false)
  const [value, setValue] = useState('')

  useEffect(() => {
    setValue(initValue)
  }, [initValue])

  const classes = classNames('c-txt-area', className)

  const len = useMemo(() => {
    if(!value) return 0
    return value.length
  }, [value])

  function oninput(e) {
    setValue(e.detail.value)
  }

  return <View className={classes} onClick={() => setFocus(true)} >
    <View className='label' >{label}</View>
    <View className='textarea-con'>
      < Textarea
        className='textarea'
        name={name}
        focus={focus}
        value={value}
        onInput={oninput} 
        onBlur={() => setFocus(false)}
        maxlength={maxLength}
        auto-height
      />
    </View>
    <View className='count' >{len}/{maxLength}</View>
  </View>
}

XTxtArea.defaultProps = {
  maxLength: 128
}

export default XTxtArea