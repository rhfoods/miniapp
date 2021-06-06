import MyMap from "@/models/map"
import Tool from "@/utils/tools"
import { useEffect, useRef, useState } from "react"

function useEnableZoom(scale: number, minS=MyMap.defaultDividing) {

  const [enableZoom, setenableZoom] = useState(true)
  const preScale = useRef(2000)
  const [s, setS] = useState(scale)

  useEffect(() => {
    setS(scale)
  }, [scale])

  function onChange(scale: number) {
    if(scale - preScale.current < 0 && scale < minS) {
      // preScale.current = minS
      // setS(s => {
      //   return s === 13 ? 14 : 13
      // })
      setenableZoom(false)
      Tool.sleep(200).then(() => setenableZoom(true))
    }
    if(scale - preScale.current >= 0) {
      setenableZoom(true)
    }
    preScale.current = scale
  }

  return {
    scale: s,
    enableZoom,
    onChange
  }
}

export default useEnableZoom