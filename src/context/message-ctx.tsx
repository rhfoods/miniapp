import { GetHint } from '@/api/api'
import { CommentType } from '@/api/types/api.interface'
import React, { createContext, FC, useContext, useState } from 'react'

export enum EMsgType {
  save= 'ST',
  clock= 'CL',
  comment= 'CO',
  like= 'LI',
  system= 'SY',
}

export interface IMsgItemInfo {
  msgId: number
  type: MessageReturnTypes
  userId?: number
  nickName?: string
  avatarUrl?: string
  createdAt?: string
  psaveId?: number
  name?: string
  sortName?: string
  noteId?: number
  title?: string
  media?: string
  goods?: number
  bads?: number
  commentId?: number // 该条评论的id
  fatherId?: number // 一级评论的id
  upId?: number // 被评论对象的id
  cType?: CommentType // 评论的类型 
  tag?: string // 系统消息title
  comment?: string
  fComment?: string
  isPassed?: boolean
  description?: string
  isLiked?: boolean
  feel: 'GOOD'|'BAD'
}

/**
 * 返回消息类型定义
 */
 export enum MessageReturnTypes {
  SAVE_POINT = 'SP', //收藏没有发现的点位
  SAVE_MAP = 'SM', //收藏地图
  SAVE_NOTE = 'SN', //收藏发现
  SET_TOP = 'ST', //置顶文章
  CLOCK_POINT = 'CP', //打卡没有发现的点位
  CLOCK_NOTE = 'CN', //打卡有发现的点位
  COMMENT_NOTE = 'CO', //评论文章
  COMMENT_COMMENT = 'CC', //评论评论
  LIKE_NOTE = 'LN', //点赞发现
  LIKE_COMMENT = 'LC', //点赞评论
  SYSTEM = 'SY', //系统消息
}

interface IMsg {
  total: number
  [EMsgType.save]: number
  [EMsgType.clock]: number
  [EMsgType.comment]: number
  [EMsgType.like]: number
  [EMsgType.system]: number
}

const UserCtx = createContext<{
  info: IMsg,
  setMsg: (info: object) => void,
  init: () => Promise<any>,
  refresh: () => void,
  refreshSomeOne: (key: EMsgType) => void
}|null>(null)
UserCtx.displayName = 'messageCtx'

export const MsgProvider: FC = (props) => {

  const [info, setInfo] = useState<IMsg>({
    total: 0,
    [EMsgType.save]: 0,
    [EMsgType.clock]: 0,
    [EMsgType.comment]: 0,
    [EMsgType.like]: 0,
    [EMsgType.system]: 0,
  })
  const [hasReq, setHasReq] = useState(false)

  const setMsg = (data: Partial<IMsg>) => {
    setInfo({
      ...info,
      ...data,
    })
  }

  const refresh = () => getMsg()

  const init = async () => {
    if(!hasReq) {
      getMsg()
    }
  }

  const getMsg = async () => {
    const res: any= await GetHint({})
    setHasReq(true)
    const savetops = Number(res.hint.savetops) || 0
    const clocks = Number(res.hint.clocks) || 0
    const comments = Number(res.hint.comments) || 0
    const likes = Number(res.hint.likes) || 0
    const systems = Number(res.hint.systems) || 0
    const info = {
      total: savetops + clocks + comments + likes + systems,
      [EMsgType.save]: savetops,
      [EMsgType.clock]: clocks,
      [EMsgType.comment]: comments,
      [EMsgType.like]: likes,
      [EMsgType.system]: systems,
    }
    setInfo(info)
    return info
  }
  /**
   * 只刷新某一类消息
   */
  const refreshSomeOne = async (msgType: EMsgType) => {
    let map = {
      [EMsgType.save]: 'savetops',
      [EMsgType.clock]: 'clocks',
      [EMsgType.comment]: 'comments',
      [EMsgType.like]: 'likes',
      [EMsgType.system]: 'systems',
    }
    const res: any= await GetHint({})
    const count = Number(res.hint[map[msgType]]) || 0
    setInfo(info => {
      const total = info.total - info[msgType] + count
      return {
        ...info,
        total,
        [msgType]: count,
      }
    })
  }

  return <UserCtx.Provider value={{
    info, 
    setMsg,
    init,
    refresh,
    refreshSomeOne,
  }} >
    {props.children}
  </UserCtx.Provider>
}

export const useMsg = () => {
  const ctx = useContext(UserCtx)
  if(!ctx) {
    throw new Error('useMsg必须在MsgProvider内使用')
  }
  return ctx
}