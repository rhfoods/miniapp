import React, { FC, useEffect } from 'react'
import { View } from '@tarojs/components'
import XAvatar from '@/component/avatar'
import XCommentLine from './comment-line'
import XOneComment from './one-comment'
import classNames from 'classnames'
import { CommentType, GetSubCommentsParams } from '@/api/types/api.interface'
import Tool from '@/utils/tools'
import usePageList from '@/hooks/usePageList'
import { GetSubComments, PostCommentLike } from '@/api/api'
import Save from '@/models/save'
import XLike from '@/component/like'

export interface ICommentInfo {
  comment?: string,         // 评论者: commnetId
  commentId?: number,       // 评论者: 评论id
  createdAt?: string,       // 评论者: 评论时间
  likes?: number,           // 评论者: 点赞
  userId?: number,          // 评论者: userId
  fromUserId?: number,      // 评论者: userId
  nickName?: string,        // 评论者: 昵称
  fromNickName?: string,    // 评论者: 昵称
  avatarUrl?: string,       // 评论者: 头像
  fromAvatarUrl?: string,   // 评论者: 头像
  type?: CommentType,       // 评论者: type
  fatherId?: number,        // 一级评论: commnetId
  isLiked?: boolean,           // 评论是否被点赞
  upId?: number,            // 被评论者: commnetId
  toNickName?: string,      // 被评论者: 昵称
  aCommentId?: number,      // 子评论: commnetId
  aCreatedAt?: string,      // 子评论: 评论时间
  aType?: CommentType,      // 子评论: type
  aComment?: string,        // 子评论: 评论类容
  aUserId?: number,         // 子评论: userId
  aAvatarUrl?: string,      // 子评论: 头像
  aNickName?: string,       // 子评论: 昵称
  aCounts?: number,         // 子评论: 总量
  aLikes?: number,          // 子评论: 点赞量
  aIsLiked?: boolean,       // 子评论: 是否被点赞

}
interface ICommentCard {
  className?: string
  info: ICommentInfo
  noteId: number
  onCommentTap: (info: ICommentInfo, father?: ICommentInfo) => void  // 点击了一条评论
  onDel: (info: ICommentInfo, num: number) => void // 删除一级评论
  onDelSub: (info: ICommentInfo, father: ICommentInfo) => void // 删除二级评论
}
const XCommentCard: FC<ICommentCard> = (props) => {
  const { className, info, onCommentTap, noteId, onDel, onDelSub } = props
  const classes = classNames('c-comment-card', className)
  const list = usePageList<GetSubCommentsParams>(GetSubComments, {
    commentId: info.commentId,
    counts: info.aCounts,
  }, 'comments')

  /**
   * 列表初始化
   */
  useEffect(() => {
    if(info?.aNickName) {
      const item: ICommentInfo = {
        commentId: info.aCommentId,
        createdAt: info.aCreatedAt,
        type: info.aType,
        comment: info.aComment,
        fromAvatarUrl: info.aAvatarUrl,
        fromNickName: info.aNickName,
        fromUserId: info.aUserId,
        likes: info.aLikes,
        isLiked: info.aIsLiked,
      }
      list.setPage(page => ({
        ...page,
        list: [item],
        amount: info.aCounts,
        empty: false,
        more:  info.aCounts>1 ? true : false
      }))
    } else {
      list.setPage(page => ({
        ...page,
        more: false
      }))
    }
  }, [info])

  /**
   * 点击了一级评论评论
   */
  const commentTap = () => {
    onCommentTap(info)
    Save.curSubComment = list
  }
  /**
   * 点赞一级评论
   */
  const likeTap = (isLiked: boolean) => {
    PostCommentLike({
      commentId: info.commentId,
      isLiked
    })
  }
  /**
   * 点击了二级评论
   */
  const subCommentTap = (data) => {
    onCommentTap(data, info)
    Save.curSubComment = list
  }
  /**
   * 删除一级评论
   */
  const delFirstComment = (info, num) => {
    onDel(info, num)
  }
  /**
   * 删除二级评论
   */
  const delSubComment = (subCommnet: ICommentInfo) => {
    onDelSub(subCommnet, info)
    list.del(subCommnet, 'commentId')
    if(list.list.length===1 && list.more) {
      list.getMore({
        counts: list.amount-1, 
        commentId: info.commentId
      })
    }
  }
  /**
   * 获取更多二级评论
   */
  const getMore = () => {
    list.getMore({
      counts: list.amount,
      commentId: info.commentId
    })
  }
  
  return <View className={classes} >
    <View className='head' >
      <XAvatar
        className="comment-avatar"
        userInfo={info}
        otherInfo={Tool.utc2Locale(info.createdAt, true, true)}
        hideGender={true}
        onClick={commentTap}
      />
      <XLike className='like' isLiked={info?.isLiked} likes={info?.likes} onClick={likeTap} />
    </View>
    <View className='comments' >
      {/* 一级评论 */}
      <XOneComment 
        className='comment-first' 
        info={info} 
        noteId={noteId}
        onClick={commentTap} 
        onDel={delFirstComment}
      />
      {/* 二级评论 */}
      {
        list.list.length > 0 &&
        <View className='comment-second'>
          {
            list.list.map((item: ICommentInfo) => {
              return <XCommentLine 
                className='sub-comment' 
                info={item} 
                onClick={ subCommentTap }
                noteId={noteId}
                key={item.commentId}
                onDel={delSubComment}
              />
            })
          }{ 
            list.more && list.list.length > 1 && 
            <View className='orange' onClick={getMore} >加载更多 ＞</View> 
          }{ 
            list.more && list.list.length === 1 &&  
            <View className='orange' onClick={() => list.refresh()} >共{list.amount}条回复 ＞</View> 
          }
        </View>
      }
    </View>

  </View>
}

export default XCommentCard