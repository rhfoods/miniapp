import { useEffect, useState } from "react"
import { ICommonTabItem } from "./tab"

export enum ECommonMap {
  msg = 'msg', // 消息
  recommend = 'recommend', // 推荐点位
  addNote = 'addNote', // 添加日记
  reset = 'reset', // 定位
  my = 'my', // 回到我的地图
  shopping = 'shopping', // 购物
}

function useCommonTab() {

  const [btns, setBtns] = useState<ICommonTabItem[]>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    setBtns([MSG, RECOMMEND, SHOPPING, RESET, MY])
  }, [])

  return { btns, show, setShow }
}

export default useCommonTab

const MSG: ICommonTabItem = {
  type: 'small',
  name: ECommonMap.msg,
  icon: 'pinglun',
  iconColor: '#fff',
  iconSize: '22',
  counts: 0,
}
const RECOMMEND: ICommonTabItem = {
  type: 'small',
  name: ECommonMap.recommend,
  icon: 'tuijian',
  iconColor: '#fff',
  iconSize: '22',
  counts: 0, 
}
export const ADDNOTE: ICommonTabItem = {
  type: 'big',
  name: ECommonMap.addNote,
  icon: 'jia',
  iconColor: '#fff',
  iconSize: '28',
  counts: 0, 
}
const RESET: ICommonTabItem = {
  type: 'small',
  name: ECommonMap.reset,
  icon: 'weizhi1',
  iconColor: '#fff',
  iconSize: '22',
  counts: 0,
}
const MY: ICommonTabItem = {
  type: 'small',
  name: ECommonMap.my,
  icon: 'wode-tiaozhuan',
  iconColor: '#FFD448',
  iconSize: '24',
  counts: 0,
}
const SHOPPING: ICommonTabItem = {
  type: 'big',
  name: ECommonMap.shopping,
  icon: 'gouwujianying',
  iconColor: '#fff',
  iconSize: '28',
  counts: 0, 
}
