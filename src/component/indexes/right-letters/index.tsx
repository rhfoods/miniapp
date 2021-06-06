import React, { FC, useEffect, useState } from 'react'
import { View } from '@tarojs/components'
import { ILetterItem } from '../letter-item'
import classNames from 'classnames'
import { $ } from '@tarojs/extend'
import './index.scss'
import Throttle from '@/utils/throttle'

interface IXRightLetters {
  className?: string;
  items: ILetterItem[]
  top: string
  onChange: (key: string) => void
}

const id = 'c-r-letters-id'

const XRightLetters: FC<IXRightLetters> = (props) => {

  const { className, items, top, onChange } = props
  const classes = classNames('c-r-letters', className)
  const [t, setT] = useState(0)
  const [itemH, setItemH] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      $(`#${id}`).offset().then(res => {
        setT(res.top)
      })
      $(`.r-item`).height().then(itemH => {
        setItemH(itemH)
      })
    }, 280)
  }, [])

  const onTouchMove = Throttle.delay(e => {
    const clientY = e.mpEvent.changedTouches[0].clientY
    const index = Math.floor((clientY-t)/itemH)
    if(index <= 0) {
      onChange('Top')
    }else {
      const key = items[index-1]?.key || items[items.length-1]?.key
      key && onChange(key)
    }
  }, 200)

  return <View className={classes} id={id}>
    <View className='r-item' onTouchMove={onTouchMove} >{top}</View>
    {
      items.map(item => {
        return <View className='r-item' onTouchMove={onTouchMove} >{item.title}</View>
      })
    }
  </View>
}

export default XRightLetters