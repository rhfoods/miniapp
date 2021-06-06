import React, { FC, useEffect, useMemo, useState } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

interface ITransition {
  className?: string;
  time?: number;
  show: boolean;
}

const XTransition: FC<ITransition> = (props) => {

  const { className, show, time } = props
  const [classTransition, setclassTransition] = useState<'step01'|'step02'|'step03'>('step01')
  const classes = classNames('c-transition', className, classTransition)
  const [style, setStyle] = useState<any>()

  useEffect(() => {
    if(show) {
      setclassTransition('step02')
      let timer = setTimeout(() => {
        setclassTransition('step01')
        clearTimeout(timer)
      }, 20)
    } else {
      setclassTransition('step01')
      setclassTransition('step02')
      let timer = setTimeout(() => {
        setclassTransition('step03')
        clearTimeout(timer)
      }, time)
    }
  }, [show])
  
  useEffect(() => {
    let timer = setTimeout(() => {
      setStyle({ transition: `all ${time/1000}s` })
      clearTimeout(timer)
    }, time)
  }, [time])
  
  return <View className={classes} style={style} >
      { props.children }
  </View>
}

XTransition.defaultProps = {
  time: 500
}

export default XTransition