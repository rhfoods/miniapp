import React, { FC, useMemo } from 'react'
import { View, Image, ITouchEvent } from '@tarojs/components'
import classNames from 'classnames'
import XAvatar from '@/component/avatar'
import User, { IUserInfo } from '@/models/user'
import XMapBtn from './map-btn'
import { EMsgType, IMsgItemInfo, MessageReturnTypes } from '@/context/message-ctx'
import Tool from '@/utils/tools'
import Media from '@/models/media'
import { POSComment, PostCommentLike } from '@/api/api'
import XBodyComment from './body-comment'
import XTextEllips from '@/component/text-ellipsis'
interface IXMsgCard {
  className?: string
  type: EMsgType
  info: IMsgItemInfo
  onClick?: (info: IMsgItemInfo) => void
}

const XMsgCard: FC<IXMsgCard> = ({
  className,type,info,
  onClick,
}) => {

  const classes = classNames('c-msg-card', className)
  
  /**
   * 昵称下的信息
   */
  const avatarInfo = useMemo(() => {
    if(!info?.type) {
      return 
    }
    let time = Tool.utc2Locale(info.createdAt);
    if(info.type === MessageReturnTypes.SAVE_POINT) return `收藏了你的点位     ${time}`
    if(info.type === MessageReturnTypes.SAVE_MAP) return `收藏了你的地图     ${time}`
    if(info.type === MessageReturnTypes.SAVE_NOTE) return `收藏了你的发现     ${time}`
    if(info.type === MessageReturnTypes.SET_TOP) return `置顶了你的发现     ${time}`
    if(info.type === MessageReturnTypes.CLOCK_POINT) return `在这里打卡  ${info.feel === 'GOOD' ? '❤' : '💔'} ${time}`
    if(info.type === MessageReturnTypes.CLOCK_NOTE) return `在这里打卡  ${info.feel === 'GOOD' ? '❤' : '💔'} ${time}`
    if(info.type === MessageReturnTypes.COMMENT_NOTE) return `评论了我的发现     ${time}`
    if(info.type === MessageReturnTypes.COMMENT_COMMENT) return `评论了我的评论     ${time}`
    if(info.type === MessageReturnTypes.LIKE_NOTE) return `赞了你的发现     ${time}`
    if(info.type === MessageReturnTypes.LIKE_COMMENT) return `赞了你的评论     ${time}`
  }, [info])
  /**
   * 右边文字信息
   */
  const rightInfo = useMemo(() => {
    let txt = ''
    if(info?.type === MessageReturnTypes.SAVE_MAP) {
      txt = info.sortName
    }
    if(info?.type === MessageReturnTypes.COMMENT_COMMENT) {
      txt = info.fComment
    }
    if(
      info?.type === MessageReturnTypes.SAVE_NOTE ||
      info?.type === MessageReturnTypes.SET_TOP ||
      info?.type === MessageReturnTypes.CLOCK_NOTE ||
      info?.type === MessageReturnTypes.COMMENT_NOTE ||
      info?.type === MessageReturnTypes.LIKE_COMMENT ||
      info?.type === MessageReturnTypes.LIKE_NOTE
    ) {txt = info.title}
    if(
      info?.type === MessageReturnTypes.SAVE_POINT ||
      info?.type === MessageReturnTypes.CLOCK_POINT
    ) {txt = info.name}
    return Tool.text.ellipsis(txt, 8, false)
  }, [info])
  /**
   * 右边的图片
   */
  const rightPic = useMemo(() => {
    if(!info) return ''
    if(info.type === MessageReturnTypes.SAVE_MAP) return require('../../../static/pic/map-card.png')
    if(
      info.type === MessageReturnTypes.SAVE_NOTE ||
      info.type === MessageReturnTypes.SET_TOP ||
      info.type === MessageReturnTypes.CLOCK_NOTE ||
      info.type === MessageReturnTypes.COMMENT_NOTE ||
      info.type === MessageReturnTypes.LIKE_NOTE ||
      info.type === MessageReturnTypes.LIKE_COMMENT
    ) return Media.picUrl(info.media)
  }, [info])
  /**
   * 打开地图
   */
  const openMap = () => {
    Tool.openMap({
      userId: info.userId,
      showBack: true,
    });
  }
  /**
   * 点击头像
   */
  const avatarTap = (userInfo: IUserInfo) => {
    if(userInfo.userId) {
      Tool.pageUser({ userId: userInfo.userId });
    }
  }
  /**
   * 打开点位/日记
   */
  const rightTap = (e: ITouchEvent<any>) => {
    if(info.fComment) return // 评论了评论
    e.stopPropagation()
    if(info.type === MessageReturnTypes.SAVE_MAP) {
      Tool.openMap({
        userId: info.userId,
        showBack: true,
      });
      return
    }
    if(!info.psaveId) {
      Tool.load.alert('文章找不到了')
      return
    }
    Tool.detail({
      psaveId: info.psaveId,
      userId: User.userId(),
    });
  }
  /**
   * 点击回复按钮
   */
  const commentTap = async (e: ITouchEvent<any>) => {
    e.stopPropagation()
    const { alertCommentInput, promisic } = Tool
    const comment: any = await promisic(alertCommentInput)({})
    POSComment({
      noteId: info.noteId,
      comment: comment,
      fatherId: info.fatherId || info.commentId,
      upId: info.commentId,
      type: info.cType === 'Q' ? 'A' : 'R',
    })
    Tool.load.alert('评论成功')
  }
  /**
   * 点击点赞按钮
   */
  const likeTap = (isLiked) => {
    PostCommentLike({
      commentId: info.commentId,
      isLiked: isLiked
    })
  }
  /**
   * 点击了卡片
   */
  const cardTap = () => {
    if(
      info.type === MessageReturnTypes.COMMENT_NOTE || 
      info.type === MessageReturnTypes.COMMENT_COMMENT
    ) {
      Tool.alertComment({ noteId: info.noteId })
    }
    onClick && onClick(info)
  }

  if(!info) {
    return <View></View>
  }

  return <View className={classes} onClick={cardTap} >
    
    <XAvatar 
      className='head'
      userInfo={info} 
      otherInfo={avatarInfo}
      hideGender={true}
      onClick={avatarTap}
    />

    <View className='tab' >
      {
        type === EMsgType.save &&
        <XMapBtn onClick={openMap} />
      }{
        type === EMsgType.clock &&
        <XMapBtn onClick={openMap} />
      }{
        type === EMsgType.comment &&
        <XBodyComment info={info} onComment={commentTap} onLike={likeTap} />
      }{
        type === EMsgType.like &&
        <View className='like' >
          {
            info.type === MessageReturnTypes.LIKE_COMMENT &&
            <XTextEllips className='txt' text={info.comment} />
          }
          <XMapBtn onClick={openMap} />
        </View>
      }
    </View>

    <View className='right-part' onClick={rightTap} >
      {
        rightPic 
        ? <Image className='pic' mode='aspectFill' src={rightPic} />
        : <View className='space' ></View>
      }
      <View className='txt' >{rightInfo}</View>
    </View>

  </View>
}

export default XMsgCard