import React, { FC } from 'react'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Theme from '@/models/theme'
import classNames from 'classnames'

interface ILoading {
  className?: string
}

const XLoading: FC<ILoading> = (props) => {

  const { className } = props
  const classes = classNames('c-loading', className)

  return <View className={classes} >
    <AtIcon className="icon-loading" value='loading-3' size='50' color={Theme.red} />
  </View>
}

export default XLoading