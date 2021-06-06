import useScroll from "@/hooks/use-scroll"
import { useEffect, useState } from "react"

export function usePointCardShow() {
  const { direction, top } = useScroll()

  const [show, setShow] = useState(true)

  useEffect(() => {
    if(direction === 'up') {
      setShow(false)      
    } else {
      setShow(true)
    }
  }, [direction])

  return {
    show,
  }
}