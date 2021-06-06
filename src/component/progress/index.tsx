import Theme from '@/models/theme'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { AtProgress } from 'taro-ui'
export interface IProgressRef {
  stop: () => void
}

interface IProgress {
  isHidePercent?: boolean
}

const XProgress = forwardRef<IProgressRef, IProgress>((props, ref) => {
  const { isHidePercent } = props

  const [percent, setPercent] = useState(0)
  let timer: any

  useEffect(() => {
    run(90, 300)
  }, [])

  function stop() {
    run(100)
  }
  
  useImperativeHandle(ref, () => ({
    stop
  }), [])

  /**
   * 跑到百分之多少停下来
   */
  function run(end=80, speed=200) {
    timer = setInterval(() => {
      setPercent(p => {
        if(p < end) {
          return p+10
        }
        clearInterval(timer)
        return end
      })
    }, speed)    
  }

  return <AtProgress className='c-progress' percent={percent} color={Theme.red} isHidePercent={isHidePercent} />
})

XProgress.defaultProps = {
  isHidePercent: false
}

export default XProgress