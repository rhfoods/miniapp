import React, { FC } from 'react'
import { Text } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'

interface ITag {
  text: string
  className?: string
}

const XTag: FC<ITag> = (props) => {

  const classes = classNames('c-tag', props.className)

  return <Text className={classes} >{props.text}</Text>
}

export default XTag