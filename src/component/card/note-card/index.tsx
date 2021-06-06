import React, { FC, useMemo } from 'react'
import { View, Image } from '@tarojs/components'
import XAvatar from '@/component/avatar'
import XIconText from '@/component/icon-text'
import classNames from 'classnames'
import Media from '@/models/media'

interface INoteCard {
  className?: string
  info?: any
  onClick: (data: any) => void
}

const XNoteCard: FC<INoteCard> = (props) => {

  const { className, info, onClick } = props
  const classes = classNames('c-note-card', className)

  const isVideo = useMemo(() => {
    if(!info?.medias) {
      return false
    }
    return Media.isVideo(info.medias) 
  }, [info])

  return <View className={classes} onClick={() => onClick(info)} >
    {
      isVideo
      ? <Image className='card-pic' mode='aspectFill' src={`${Media.picUrl(info.medias[0])}?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast,ar_auto`} />
      : <Image className='card-pic' mode='aspectFill' src={Media.picUrl(info.medias[0])} />
    }
    {
      isVideo &&
      <View className='play-btn' >
        <View className='triangle' ></View>
      </View>
    }
    <View className='container' >
      <View className='title' >{info.title}</View>
      <View className='footer' >
        <XAvatar 
          className='avatar' 
          userInfo={info} 
          nameLength={5}
          hideGender={true}
        />
        <XIconText 
          className='icon-text' 
          text={Number(info.likes) || ''}
          iconColor='#686868' 
          fontColor='#686868' 
          icon='dianzan-01' 
          fontSize='12'
        />
      </View>
    </View>
  </View>
}

export default XNoteCard