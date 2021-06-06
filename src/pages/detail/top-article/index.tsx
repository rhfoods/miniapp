import React, { FC } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import XAvatar from '@/component/avatar'
import './index.scss'
import XTagPrice from '@/component/tag-price'
import XArticle from './article'
import XTag from '@/component/tag'
import useMedias from '@/hooks/use-medias'
import XVedio from '@/component/video'
import XPicLayout from '@/component/pic-layout'
import XIconText from '@/component/icon-text'
import Tool from '@/utils/tools'
import XEmpty from '@/component/empty'

interface ITopArticle {
  className?: string
  noteInfo?: any
  userInfo: any
  pointInfo: any
  showBtn: boolean
}

const XTopArticle: FC<ITopArticle> = (props) => {

  const { className, noteInfo, userInfo, pointInfo, showBtn } = props

  const classes = classNames('c-top-article', className)
  const { mediaList, showPics, showVideo } = useMedias(noteInfo?.medias)

  /**
   * 打开他的地图
   */
  function hisMap() {
    Tool.openMap({
      curPoint: pointInfo,
      userId: userInfo.userId,
      latitude: pointInfo?.latitude,
      longitude: pointInfo?.longitude,
      reLaunch: true,
    });
  }
  /**
   * 打开个人中心
   */
  function openUser() {
    if(userInfo.userId === 0) {
      return
    }
    Tool.pageUser({
      userId: userInfo.userId
    })
  }

  const EMPTY = <View className='c-t-empty' >
    <XEmpty className='empty' info='嘿！知道你有想法，我们正等着你说些什么呢～！' />
  </View>

  const NOTE = noteInfo && <View>
    <View className='c-t-title' >{noteInfo.title}</View>
    <XTagPrice className='tag-price' pointInfo={noteInfo}/>
    <XArticle noteInfo={noteInfo} />
    {
      noteInfo?.scenes?.length>0 && 
      <View className='tags' >
        { noteInfo.scenes.map((item: string) => <XTag text={item} className='tag' />) }
      </View>
    }{
      showVideo && 
      <XVedio 
        className='video'
        id={`detail-id${noteInfo.noteId}`}
        autoplay={true}
        src={mediaList[0]} 
        maxH={360}
        width={355}
      />
    }{
      showPics &&
      <XPicLayout 
        className='pics'
        mediaList={mediaList} 
      />
    }{
      <View className='note-footer'>
        <View className='left' >
          <XIconText iconColor='#888888' className='icon' fontColor='#888888' icon='liulan' text={Tool.numberToW(noteInfo.views || 0)} />
          <XIconText iconColor='#888888' className='icon' fontColor='#888888' icon='zhiding2' text={Tool.numberToW(noteInfo.tops || 0)} />
        </View>
        <View className='right' >发布于: {Tool.utc2Locale(noteInfo.updatedAt)}</View>
      </View>
    } 
  </View>

  return <View className={classes} >

    <View className='c-t-user' >
      {
        userInfo?.nickName &&
        <XAvatar 
          userInfo={userInfo} 
          otherInfo={userInfo?.city} 
          onClick={openUser}
        />
      }{
        userInfo && 
        showBtn &&
        <View className="btn-s btn-diy" onClick={hisMap}>
          TA的地图
        </View>
      }
    </View>
    {noteInfo ? NOTE : EMPTY}
  </View>
}

export default XTopArticle