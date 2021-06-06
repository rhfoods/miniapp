import { EHomeBtn, IMapbtnInfo } from "@/component/nav/map-btns"
import { useEffect, useState } from "react"

function useHomeBtns(isOwn) {

  const [items, setItems] = useState<IMapbtnInfo[]>([])

  useEffect(() => {
    if(isOwn) {
      setItems([SHARE, WXSERVER])
      return
    }
    setItems([SHARE, RECOMMEND, WXSERVER])
  }, [isOwn])

  return {
    items
  }
}

export default useHomeBtns

const SHARE: IMapbtnInfo = {
  key: EHomeBtn.share,
  icon: 'fenxiangshixin',
  imgUrl: '',
  type: 'share',
  colorWhite: '#756B48',
  colorBlack: '#ffffff',
  bgWhite: '#ffffff',
  bgBlack: 'rgba(255, 255, 255, .4)',
  size: '24',
}
const RECOMMEND: IMapbtnInfo = {
  key: EHomeBtn.recommend,
  icon: 'tuijian',
  imgUrl: '',
  type: 'common',
  colorWhite: '#756B48',
  colorBlack: '#ffffff',
  bgWhite: '#ffffff',
  bgBlack: 'rgba(255, 255, 255, .4)',
  size: '24',
}
const WXSERVER: IMapbtnInfo = {
  key: EHomeBtn.wxServer,
  icon: '',
  imgUrl: require('../../static/pic/wx-server.png'),
  type: 'common',
  colorWhite: '#756B48',
  colorBlack: '#ffffff',
  bgWhite: '#ffffff',
  bgBlack: 'rgba(255, 255, 255, .4)',
  size: '24',  
}
