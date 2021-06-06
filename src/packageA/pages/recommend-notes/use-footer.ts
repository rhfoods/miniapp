import { ButtonNames } from "@/common/constants/point.constant"
import { EDetailTabItem, IDetailTabbarItem } from "@/component/nav/detail-tabbar"
import Theme from "@/models/theme"
import { useEffect, useState } from "react"

const useFooter = (point) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const items = [Share]
    // 添加 or 查看
    if(point?.info?.newNoteId) {
      items.push(Detail)
    }else {
      items.push(Add)
    }
    // 已打卡 or 未打卡
    if(point?.info?.isClocked) {
      items.push(Locked)
    }else {
      items.push(UnLocked)
    }
    
    setItems([...items])
  }, [point?.info])

  return {
    items
  }
}

export default useFooter

const Share: IDetailTabbarItem = {
  type: EDetailTabItem.iocn,
  name: ButtonNames.SHARE,
  icon: 'fenxiang-01',
  iconColor: '#333',
  counts: 0
}
const Add: IDetailTabbarItem = {
  type: EDetailTabItem.cIcon,
  name: ButtonNames.FIND,
  icon: 'jia',
  iconColor: '#ffffff',
  counts: 0
}
const Detail: IDetailTabbarItem = {
  type: EDetailTabItem.cIcon,
  name: ButtonNames.DETAIL,
  icon: 'wode',
  iconColor: '#ffffff',
  counts: 0
}
const UnLocked: IDetailTabbarItem = {
  type: EDetailTabItem.iocn,
  name: ButtonNames.CLOCK,
  icon: 'daka',
  iconColor: '#333',
  counts: 0
}
const Locked: IDetailTabbarItem = {
  type: EDetailTabItem.iocn,
  name: ButtonNames.CLOCKED,
  icon: 'daka',
  iconColor: Theme.red,
  counts: 0
}