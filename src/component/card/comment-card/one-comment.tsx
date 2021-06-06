import React, { FC, useMemo } from 'react'
import { ICommentInfo } from '.'
import User from '@/models/user'
import Taro from '@tarojs/taro' 
import { DelComment } from '@/api/api'
import Tool from '@/utils/tools'
import XTextEllips from '@/component/text-ellipsis'

interface IOneComment {
  info: ICommentInfo
  noteId?: number
  className?: string
  onClick?: (info: ICommentInfo) => void
  onDel?: (info: ICommentInfo, res: any) => void
}

const XOneComment: FC<IOneComment> = (props) => {

  const { info, noteId, className, onClick, onDel } = props

  const isSelf = useMemo(() => {
    if(!info) {
      return false
    }
    const userId = User.info().userId
    if(info.userId === userId) {
      return true
    }
    if(info.fromUserId === userId) {
      return true
    }
    return false
  }, [info])

  const longPress = async () => {
    if(isSelf) {
      const res: any = await Taro.showActionSheet({
        itemList: ['复制', '删除']
      })
      if(res.tapIndex === 0) {
        Taro.setClipboardData({data: info.comment})
      }
      if(res.tapIndex === 1) {
        Tool.load.show('删除中')
        const res: any = await DelComment({
          noteId,
          commentId: info.commentId
        })
        onDel && onDel(info, res.counts)
        Tool.load.hide('删除成功')
      }
    } else {
      Taro.setClipboardData({data: info.comment})
    }
  }
  /**
   * 点击了一条评论
   */
  const onTap = () => {
    onClick && onClick(info)
  }

  return <XTextEllips 
    className={className} 
    text={info.comment} 
    onClick={onTap} 
    onLongPress={longPress} 
  />
}

export default XOneComment