import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import XIcon from '../icon'
import useShowHide from '@/hooks/use-show-hide'

interface ITextLong {
  className?: string
  value?: string
}

const XTextLong: FC<ITextLong> = (props) => {

  const { className, value } = props
  const { txt, showTrigger, isLong, triggerTap } = useShowHide(value, 23, 1)

  const classes = classNames('c-text-long', className)
  const classTrigger = classNames('trigger', {
    'turn': isLong
  })

  return <View className={classes} >
    <Text decode className='text' selectable >{txt}</Text>

    {
      showTrigger && <View className='right' >
        <View className={classTrigger}>
          <XIcon name='xiala' size='12' color='#888888' />
          <View className='btn' onClick={triggerTap} ></View>
        </View>
      </View>      
    }

  </View>

}

export default XTextLong