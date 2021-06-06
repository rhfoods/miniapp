import { IShareItem } from "@/component/alert/share"
import { ESharetItem } from "@/component/alert/sheet"
import { useEffect, useState } from "react"

const options: IShareItem[] = [
  { 
    type: 'share', 
    text: ESharetItem.share, 
    icon: 'weixin', 
    key: 'weixin',
    iconColor: '#3ABF11', 
  },{ 
    type: 'common', 
    text: ESharetItem.poster, 
    icon: 'pengyouquan', 
    key: 'pengyouquan', 
    colorFull: true,
    className: 'share-poster',
  },{ 
    type: 'common', 
    text: ESharetItem.embed, 
    icon: 'qianruxiaochengxu', 
    key: 'qianruxiaochengxu', 
    iconColor: '#3ABF11'
  },
]
const ROW2: IShareItem[] = [
  { 
    type: 'common', 
    text: ESharetItem.fllowWx, 
    icon: 'wode', 
    key: 'wode',
    iconColor: '#6f6f6f', 
    iconSize: '30'
  },{ 
    type: 'feedback', 
    text: ESharetItem.feedback, 
    icon: 'yijianfankui', 
    key: 'yijianfankui',
    iconColor: '#6f6f6f', 
    iconSize: '30'
  }
]

function useCommonShare() {

  const [items, setItems] = useState<IShareItem[]>()
  const [row2, setRow2] = useState<IShareItem[]>()

  useEffect(() => {
    const items = [...options]
    const row2 = [...ROW2]
    setItems(items)
    setRow2(row2)
  }, [])

  return {
    options: items,
    row2
  }
}

export default useCommonShare