import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import XCommentCard, { ICommentInfo } from '@/component/card/comment-card'
import classNames from 'classnames'
import usePageList from '@/hooks/usePageList'
import { GetCommentsParams } from '@/api/types/api.interface'
import { GetComments, POSComment } from '@/api/api'
import XEmpty from '@/component/empty'
import XLoading from '@/component/loading'
import User from '@/models/user'
import Save from '@/models/save'
import Tool from '@/utils/tools'
import useParams from '@/hooks/use-params'
import useLogin from '@/hooks/use-login'
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro'
import XInputComment, { XInputCommentExp } from '@/component/input-comment'
import Taro from '@tarojs/taro' 
import { IAlertComment } from '@/core/interface/nav'
import './index.scss'

let success

const PageComment: FC = () => {
  const params: IAlertComment = useParams();
  const self = useLogin()
  const [total, setTotal] = useState(0)
  const [noteId, setNoteId] = useState(0)
  const [state, setState] = useState<'empty'|'loading'|'success'>('loading')
  const [commenting, setCommenting] = useState<ICommentInfo>({
    fatherId: undefined, // 一级评论的id
    upId: undefined, // 被评论者的id
    toNickName: '', // 被评论者的昵称
    type: 'Q',
  })
  const input = useRef<XInputCommentExp>()
  const list = usePageList<GetCommentsParams>(GetComments, { noteId }, 'comments')
  const classes = classNames('p-comment', {})
  /**
   * 解决退出页面时无法获取到最新值
   */
  const totalRef = useRef<number>()
  useEffect(() => {
    totalRef.current = total
    Taro.setNavigationBarTitle({title: `评论(${total})`})
  }, [total])

  useEffect(() => {
    return () => {
      success && success(totalRef.current)
    }
  }, [])
  /**
   * 启动
   */
  useEffect(() => {
    if(!params) return
    params.noteId && setNoteId(params.noteId)
    success = params.success
    list.refresh({noteId: params.noteId}).then(res => {
      if(res.comments?.length) {
        setState('success') 
      } else {
        setState('empty')
      }
      setTotal(res?.counts || 0)
    })
  }, [params])

  /**
   * 上拉加载
   */
  useReachBottom(() => {
    list.getMore().then(res => {
      res && setTotal(res.counts || 0)
    });
  });
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    setState('loading')
    list.refresh().then(res => {
      setState('success')
      Taro.stopPullDownRefresh()
      res && setTotal(res.counts || 0)
    });
  });
  /**
   * 点击了某一条评论
   */
  const commentTap = (info: ICommentInfo, father: ICommentInfo) => {
    if(input.current.value) {
      return
    }
    input.current.setFocus(true)
    setCommenting(commenting => {
      const newTarget = {...commenting}
      if(info.type === 'Q') {
        newTarget.fatherId = info.commentId
        newTarget.type = 'A'
        newTarget.upId = info.commentId
        newTarget.toNickName = info.nickName
      }
      if(info.type === 'A' || info.type === 'R') {
        newTarget.fatherId = father.commentId
        newTarget.type = 'R'
        newTarget.upId = info.commentId
        newTarget.toNickName = info.fromNickName
      }
      return newTarget
    })
  }
  /**
   * 删除一级评论
   */
  const delComment = (info, num) => {
    list.del(info, 'commentId')
    setTotal(total => {
      let count = total-num
      if(count === 0) {
        setState('empty')
      }
      if(count < 0) {
        count = total
      }
      return count
    })
  }
  /**
   * 删除二级评论
   */
  const delSubComment = (info) => {
    setTotal(total => {
      let count = total-1
      if(count === 0) {
        setState('empty')
      }
      if(count < 0) {
        count = total
      }
      return count
    })
  }
  /**
   * 在某条评论后面插入新的评论
   */
  const insertComment = (sublist, newItem) => {
    sublist.setPage(page => {
      const newList = insert(page.list, commenting.upId, newItem)
      return {
        ...page,
        list: newList,
        amount: page.amount+1
      }
    })
  }
  /**
   * 在指定的item后面添加newItem
   */
  const insert = (list: any[], id: number, newItem: any) => {
    let newList = []
    list.map(item => {
      newList.push(item)
      if(item.commentId === id) {
        newList.push(newItem)
      }
    })
    return newList
  }
  /**
   *
   */
  const initCommenting = () => {
    setCommenting({
      fatherId: undefined, // 一级评论的id
      upId: undefined, // 被评论者的id
      toNickName: '', // 被评论者的昵称
      type: 'Q',
    })
  }  
  /**
   * 发评论
   */
  const onSend = async (info: string) => {
    const res: any = await POSComment({
      noteId,
      comment: info,
      fatherId: commenting.fatherId,
      upId: commenting.upId,
      type: commenting.type,
    })
    setState('success')
    setTotal(total => total+1)
    const commentInfo: ICommentInfo = res.note
    const avatarUrl = User.info().avatarUrl
    const nickName = User.info().nickName
    if(commentInfo.type === 'Q') {
      commentInfo.avatarUrl = avatarUrl
      commentInfo.nickName = nickName
      list.add(commentInfo)
      initCommenting()
    } 
    if(commentInfo.type === 'A') {
      const sublist = Save.curSubComment
      commentInfo.fromAvatarUrl = avatarUrl
      commentInfo.fromNickName = nickName
      sublist.add(commentInfo)
      Save.curSubComment = null
      initCommenting()
    }
    if(commentInfo.type === 'R') {
      const sublist = Save.curSubComment
      commentInfo.fromAvatarUrl = avatarUrl
      commentInfo.fromNickName = nickName
      commentInfo.toNickName = commenting.toNickName
      insertComment(sublist, commentInfo)
      Save.curSubComment = null
      initCommenting()
    }
  }
  /**
   * 
   */
  const placeholder = useMemo(() => {
    let toNickName = commenting?.toNickName
    let fromNickName = Tool.text.ellipsis(self.info?.nickName, 6)
    if(toNickName) {
      toNickName = Tool.text.ellipsis(toNickName, 6)
      return `${fromNickName} 回复 ${toNickName}`
    }
    return `${fromNickName}发表评论:`
  }, [commenting, self.info])  
  /**
   * 
   */
  const Comments = list.list.map((item: ICommentInfo) => {
    return <XCommentCard 
      className='card'  
      info={item}
      noteId={noteId}
      onCommentTap={commentTap}
      onDel={ delComment }
      onDelSub={ delSubComment }
      key={item.commentId}
    />
  })  

  if(state === 'loading') {
    return <XLoading className='loading' />
  }

  return <View className={classes} >
    {
      state === 'empty' && <XEmpty className='empty' />
    }{
      state === 'success' && Comments
    }
    <XInputComment 
      className='input' 
      ref={input} 
      onSend={onSend} 
      placeholder={placeholder} 
    />
  </View>
}

export default PageComment