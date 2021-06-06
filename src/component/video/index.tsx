import React, { FC, useEffect, useMemo, useState } from 'react'
import { View, Video } from '@tarojs/components'
import classNames from 'classnames'
import Taro from '@tarojs/taro' 
import Media from '@/models/media'

interface vedioProps {
  className?: string,
  src: string,
  autoplay?: boolean,
  id: string,
  width?: number,
  maxH?: number,
  defaultH?: number,
  onReady?: (info: any) => void,
  onFullscreen?: (full: boolean) => void,
}

const XVedio: FC<vedioProps> = (props) => {

  const { className, src, autoplay, id, width, maxH, defaultH, onReady, onFullscreen } = props
  const [h, setH] = useState(defaultH)
  const [direction, setDirection] = useState(0)
  const [full, setFull] = useState(false)

  const style = useMemo(() => {
    return {
      width: `${(width/375)*100}vw`,
      height: `${(h/375)*100}vw`,
    }
  }, [h])

  function onFullscreenChange(e) {
    const full = e.detail.fullScreen
    setFull(full)
    onFullscreen && onFullscreen(full)
  }

  const classes = classNames('c-v', className)

  useEffect(() => {
    if(!src) {
      return
    }
    Taro.getImageInfo({
      src: `${src}?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast,ar_auto`,
      success(res) {
        init(res.width, res.height)
      }
    })
  }, [src])

  async function init(w: number, h: number) {
    let height = h*width/w
    if(height > width) height = maxH
    setH(height)
    if(w > h) {
      setDirection(90)
    }
    onReady && onReady({w, h})
  }

  /**
   * 住址冒泡
   */
  function tap(e) {
    e.stopPropagation();
  }

  function onPlay() {
    let oldId = Media.vId
    if(oldId !== id) {
      const videoCtx = Taro.createVideoContext(oldId||'')
      videoCtx?.pause()
      Media.vId = id
    }
  }

  return <View className={classes} onClick={tap}>
    <Video
      className='c-video'
      id={id}
      src={src}
      style={style}
      controls={true}
      loop={false}
      muted={false}
      object-fit={full ? 'contain' : 'contain'}
      autoplay={autoplay}
      direction={direction}
      enable-play-gesture
      onFullscreenChange={onFullscreenChange}
      onPlay={onPlay}
    />
  </View>
}

XVedio.defaultProps = {
  width: 330,
  maxH: 195,
  defaultH: 0
}


export default XVedio