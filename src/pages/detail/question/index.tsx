import React, { FC } from 'react'
import { View } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import XTittleLeftRight from '@/component/title/title-left-right'
import XEmpty from '@/component/empty'

interface IQuestion {
  className?: string
}

const XQuestion: FC<IQuestion> = (props) => {
  const { className } = props
  const classes = classNames('c-question', className)

  return <View className={classes} >
    <XTittleLeftRight
      textLeft='问答'
      textRight='去提问'  
      iconRight='you'
      className='q-title' 
    />
    <XEmpty 
      className='q-empty' 
      info='关于这里，我想知道更多呀！'
    />
  </View>
}

export default XQuestion