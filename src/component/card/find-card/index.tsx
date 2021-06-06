import React, { FC, useMemo } from 'react'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import XTittleLeftRight from '@/component/title/title-left-right'
import './index.scss'
import XAvatar from '@/component/avatar'
import Tool from '@/utils/tools'
import XIcon from '@/component/icon'
import XTagPrice from '@/component/tag-price'
import useMedias from '@/hooks/use-medias'
import XIconText from '@/component/icon-text'
import Taro from '@tarojs/taro' 
import XTag from '@/component/tag'

interface IFindCard {
  className?: string
  index: number
  showTitle?: boolean
  showMore?: boolean
  showToped?: boolean
  userInfo: any
  noteInfo: any
  pointInfo: any
  leng: number
  onClick: (userInfo: any, noteInfo: any, pointInfo: any) => void
  onAlertMore?: (userInfo: any, noteInfo: any, pointInfo: any) => void
  onFullscreenchange?: (full: boolean) => void
  onUser?: (userInfo: any) => void // 点击用户头像
}

const XFindCard: FC<IFindCard> = (props) => {

  const { className, index, userInfo, noteInfo, pointInfo, showTitle, leng, showMore, showToped, onAlertMore, onClick, onFullscreenchange, onUser } = props
  const classes = classNames('c-find-card', className, {
    type01: leng == 1, // 全圆
    type02: leng > 1 && index===0, // 上圆
    type03: leng > 1 && index===leng-1 // 下圆
  })
  const { mediaListSmall, mediaList, showPics, showVideo } = useMedias(
    noteInfo?.medias
  );

  /**
   * 更新时间
   */
  const updateTime = useMemo(() => {
    let time = Tool.utc2Locale(noteInfo?.updatedAt);
    return time;
  }, [noteInfo]);

  /**
   * 最多显示3张图片
   */
  const pics = useMemo(() => {
    if (mediaListSmall.length <= 3) return mediaListSmall;
    const arr = [...mediaListSmall];
    return arr.splice(0, 3);
  }, [mediaListSmall]);
  /**
   * 点击发现更多
   */
  function alert(e) {
    e.stopPropagation();
    onAlertMore(userInfo, noteInfo, pointInfo)
  }
  /**
   * 预览图片
   */
  const prePic = (index: number) => {
    Taro.previewImage({
      current: mediaList[index],
      urls: mediaList
    })
  }
  /**
   * 视频进入和退出全屏时触发
   */
  const onFullscreen = (full: boolean) => {
    onFullscreenchange && onFullscreenchange(full)
  }
  /**
   * 图片列表
   */
  const PicList = pics.map((url: string, index: number) => <Image 
    onClick={(e) => {
      e.stopPropagation();
      prePic(index)
    }}
    mode="aspectFill" 
    className="img" 
    src={url} 
  />)
  /**
   * 底部数据
   */
  const NoteFooter = (
    <View className="footer">
      <XIconText
        className="icon"
        iconColor="#757070"
        fontColor="#757070"
        text={Tool.numberToW(noteInfo.views)}
        iconSize="15"
        fontSize="12"
        icon="liulan"
      />
      <XIconText
        className="icon"
        iconColor="#757070"
        fontColor="#757070"
        text={Tool.numberToW(noteInfo.tops)}
        iconSize="15"
        fontSize="12"
        icon="zhiding2"
      />
      <XIconText
        className="icon"
        iconColor="#757070"
        fontColor="#757070"
        text={Tool.numberToW(noteInfo.likes)}
        iconSize="15"
        fontSize="12"
        icon="dianzan-01"
      />  
    </View>
  );  
  /**
   * 底部数据
   */
  const PointFooter = (
    <View className="footer">
      <XIconText
        className="icon"
        iconColor="#757070"
        fontColor="#757070"
        text={Tool.numberToW(noteInfo.saves)}
        iconSize="15"
        fontSize="12"
        icon="quxiaoshoucang-01"
      />
      <XIconText
        className="icon"
        iconColor="#757070"
        fontColor="#757070"
        text={Tool.numberToW(noteInfo.goods+noteInfo.bads)}
        iconSize="15"
        fontSize="12"
        icon="daka"
      />
    </View>
  );  

  return <View className={classes} onClick={() => onClick(userInfo, noteInfo, pointInfo)} >
    {
      showTitle &&
      <XTittleLeftRight className='find-title' textLeft='朋友去过'/>
    }
    <View className='f-userinfo'>
      <XAvatar
        className="f-avatar"
        userInfo={userInfo}
        otherInfo={updateTime}
        hideGender={true}
        onClick={onUser}
      />
      {
        showMore &&
        <XIcon 
          name="gengduo" 
          size="16" 
          color="#888888" 
          className='f-icon-more'
        />
      }{
        showMore &&
        <View className='alert-btn' onClick={alert} />
      }{
        showToped &&
        <XTag text='已置顶' className='f-tag' />
      }
    </View>
    {
      !noteInfo.title && 
      <View className='f-shop-name' >{Tool.text.ellipsis(pointInfo.name, 21)}</View>
    }{
      noteInfo.title
      ?
      <View className='f-note-title' >{Tool.text.ellipsis(noteInfo.title, 21)}</View>
      :
      <View className='f-note-title' >{Tool.text.ellipsis(pointInfo.address, 21)}</View>
    }
    <XTagPrice className="tag-price" pointInfo={pointInfo} />
    {
      showPics &&
      <View className='f-pics' >{PicList}</View>
    }{
      // showVideo &&
      // <XVedio 
      //   id={`id${pointInfo.noteId}`}
      //   className='video'
      //   src={mediaList[0]} 
      //   width={330}
      //   maxH={195}
      //   defaultH={195}
      //   onFullscreen={onFullscreen}
      // />
    }{
      showVideo &&
      <View className='f-video' >
        <Image 
          className='v-pic' 
          mode='aspectFill'
          src={`${mediaList[0]}?x-oss-process=video/snapshot,t_10000,f_jpg,m_fast,ar_auto`} />
        <View className='play'></View>
      </View>
    }{
      noteInfo.title ? NoteFooter : PointFooter
    }
  </View>
}

export default XFindCard