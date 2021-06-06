import React, { FC } from 'react'
import { AtTag } from 'taro-ui'
import classNames from 'classnames'

interface ITag {
  value: string
  chooseList?: string[]
  onClick?: (tag: string) => void
}

const XTag: FC<ITag> = (props) => {

  const { value, chooseList, onClick } = props
  const classes = classNames('tag', {
    'act': chooseList?.some(tag => tag === value)
  })

  return <AtTag 
    className={classes} 
    circle 
    onClick={() => onClick(value)} >
    {value}
  </AtTag>
}

export default XTag