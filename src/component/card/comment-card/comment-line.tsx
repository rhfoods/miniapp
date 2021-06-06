import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import XOneComment from './one-comment'
import { ICommentInfo } from '.'
import classNames from 'classnames'
import XLike from '@/component/like'
import { PostCommentLike } from '@/api/api'

interface ICommentLine {
  info: ICommentInfo
  noteId: number
  className?: string
  onClick?: (info: ICommentInfo) => void
  onDel?: (info: ICommentInfo) => void
}

const XCommentLine: FC<ICommentLine> = (props) => {
  const { info, className, noteId, onClick, onDel } = props
  const classes = classNames('c-comment-line', className)

  const likeTap = (isLiked: boolean) => {
    PostCommentLike({
      commentId: info.commentId,
      isLiked
    })
  }

  return <View className={classes} >
    <Text className='orange' onClick={() => onClick(info)} >{info.fromNickName}</Text>
    {
      info.toNickName &&
      <Text className='reply' onClick={() => onClick(info)} >回复</Text>
    }{
      info.toNickName &&
      <Text className='orange' onClick={() => onClick(info)} >{info.toNickName}</Text>
    }
    <Text className='colon' space='nbsp' onClick={() => onClick(info)} >:  </Text>
    <XOneComment info={info} noteId={noteId} onDel={onDel} onClick={() => onClick(info)} />
    <XLike className='sub-like' likes={info?.likes} isLiked={info?.isLiked} onClick={likeTap} />
  </View>
}

export default XCommentLine