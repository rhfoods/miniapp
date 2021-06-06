import React, { FC, useMemo, useState } from 'react'
import { View } from '@tarojs/components'
import XIcon from '../icon'
import classNames from 'classnames'

interface IXLike {
  className?: string
  isLiked: boolean
  likes: number
  max?: number
  onClick: (isLiked: boolean) => void
}

const XLike: FC<IXLike> = (props) => {
  const [isLiked, setIsLiked] = useState(!!props?.isLiked)
  const [likes, setLikes] = useState(props?.likes || 0)
  const classes = classNames('c-thumbs-up', props?.className)

  /**
   * 点赞
   */
  const likeTap = () => {
    setLikes(num => {
      if(isLiked) num--
      else num++
      return num
    })
    setIsLiked(!isLiked)
    props?.onClick(!isLiked)
  }

  const likeNum = useMemo(() => {
    if(likes<=0) return ''
    if(likes > props.max) return `${props.max}+`
    return likes
  }, [likes])

  return <View className={classes} onClick={likeTap} >
    <View 
      style={{color: isLiked ? '#FF9144' : '#888' }}
      className='num' >{likeNum}</View>
    <XIcon 
      color={isLiked ? '#FF9144' : '#888'} 
      name={isLiked ? 'dianzanshixin_huaban1-01' : 'dianzan-01'}
      size='18' 
    />
  </View>
}

XLike.defaultProps = {
  max: 99
}

export default XLike