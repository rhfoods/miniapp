import { EHomeBtn, IMapbtnInfo } from "@/component/nav/map-btns"
import { useState } from "react"

const btns: IMapbtnInfo[] = [
  {
    key: EHomeBtn.share,
    icon: 'fenxiangshixin',
    imgUrl: '',
    type: 'share',
    colorWhite: '#756B48',
    colorBlack: '#ffffff',
    bgWhite: '#ffffff',
    bgBlack: 'rgba(255, 255, 255, .4)',
    size: '24',
  },{
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
]

function useCommonBtns() {

  const [items, setItems] = useState([...btns])

  return {
    items
  }
}

export default useCommonBtns