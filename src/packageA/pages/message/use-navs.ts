import { EMsgType, useMsg } from "@/context/message-ctx"
import Tool from "@/utils/tools"
import { useEffect, useState } from "react"

export interface IMsgNavItem {
  icon: string;
  bgColor: string;
  text: string;
  msg: number;
  key: EMsgType;
  msgType: EMsgType;
}

function useNavs() {

  const [items, setItems] = useState<IMsgNavItem[]>([])

  useEffect(() => {
    setItems(Tool.deepClone([SAVES, CLOCK, COMMENTS, LIKES, SYSTEM]))
  }, [])

  return {
    items,
  }
}

export default useNavs

const SAVES: IMsgNavItem = {
  icon: 'quxiaoshoucang-01',
  bgColor: 'linear-gradient(315deg, #FF7271, #FF9572)',
  text: '收藏与置顶',
  msg: 0,
  key: EMsgType.save,
  msgType: EMsgType.save
}
const CLOCK: IMsgNavItem = {
  icon: 'daka',
  bgColor: 'linear-gradient(315deg, #FED04F, #FCEC74)',
  text: '打卡',
  msg: 0,
  key: EMsgType.clock,
  msgType: EMsgType.clock,
}
const COMMENTS: IMsgNavItem = {
  icon: 'pinglun1',
  bgColor: 'linear-gradient(315deg, #33EDAF, #79E7D7)',
  text: '评论',
  msg: 0,
  key: EMsgType.comment,
  msgType: EMsgType.comment,
}
const LIKES: IMsgNavItem = {
  icon: 'dianzan-01',
  bgColor: 'linear-gradient(315deg, #7DCEFE, #7BE7F9)',
  text: '点赞',
  msg: 0,
  key: EMsgType.like,
  msgType: EMsgType.like,
}
const SYSTEM: IMsgNavItem = {
  icon: 'xiaoxitongzhi',
  bgColor: 'linear-gradient(315deg, #A594FA, #C3B1FE)',
  text: '系统',
  msg: 0,
  key: EMsgType.system,
  msgType: EMsgType.system,
}
