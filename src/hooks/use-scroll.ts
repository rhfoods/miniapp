import { usePageScroll } from "@tarojs/taro"
import { useState } from "react"

function useScroll(time=20, dis=100) {
  const [direction, setDirection] = useState<'up' | 'down' | 'free'>('free')
  const [top, setTop] = useState(0)

  usePageScroll(res => {
    const scrollTop = res.scrollTop
    if(Math.abs(top - res.scrollTop) < dis) {
      return
    }
    if(scrollTop>top) {
      setDirection('up')
    }else {
      setDirection('down')
    }
    setTop(scrollTop)
  })

  return {
    direction,
    top,
  }
}

export default useScroll