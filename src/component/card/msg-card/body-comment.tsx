import React, { FC, useEffect, useState } from 'react'
import { ITouchEvent, View } from '@tarojs/components'
import XIconText from '@/component/icon-text'
import { IMsgItemInfo } from '@/context/message-ctx'
import XTextEllips from '@/component/text-ellipsis'

interface IXBodyComment {
  info: IMsgItemInfo;
  onComment?: (e) => void
  onLike?: (isLiked: boolean) => void
}

const XBodyComment: FC<IXBodyComment> = ({info, onComment, onLike}) => {

  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    setIsLiked(!!info.isLiked)
  }, [info])

  const likeTap = (e: ITouchEvent<any>) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    onLike(!isLiked)
  }

  return <View className='comment' >
    <XTextEllips className='txt' text={info.comment} />
    <View className='actions' >
      <XIconText
        className="icon-comment"
        iconColor="#888888"
        fontColor="#888888"
        text='回复'
        iconSize="15"
        fontSize="12"
        icon="pinglun1"
        onClick={onComment}
      />
      <XIconText
        className="icon-comment"
        iconColor={isLiked ? '#FF6143' : '#888888'}
        fontColor={isLiked ? '#FF6143' : '#888888'}
        text='点赞'
        iconSize="15"
        fontSize="12"
        icon="dianzan-01"
        onClick={likeTap}
      />
    </View>
  </View>
}

export default XBodyComment