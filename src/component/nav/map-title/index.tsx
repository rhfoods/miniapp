import React, { FC, useEffect, useMemo, useState } from 'react'
import { CoverView, View } from '@tarojs/components'
import { ETheme } from '@/core/enum/theme'
import classNames from 'classnames'
import Taro from '@tarojs/taro' 
import './index.scss'
import XIcon from '@/component/icon'
import Theme from '@/models/theme'
import Tool from '@/utils/tools'


interface IMapTitle {
  theme: ETheme
  showBack?: boolean
  showCity?: boolean
  className?: string
  sort?: any,
  onCatgrayTap?: () => void
  onCommonCategrayTap?: () => void
}

const XMapTitle: FC<IMapTitle> = (props) => {
  const { className, theme, showBack, showCity, sort } = props
  const classes = classNames('c-map-title', className)
  const [style, setStyle] = useState({
    width: 370,
    height: 40,
    top: 20,
    backgroundColor: 'rgba(240, 215, 135, .5)',
    color: '#CA9519'
  })

  const catgrayTap = () => {
    props.onCatgrayTap()
  }

  const commonCategrayTap = () => {
    props.onCommonCategrayTap()
  }

  const backTap = () => {
    Taro.navigateBack()
  }

  useEffect(() => {
    const {height, top, right} = Taro.getMenuButtonBoundingClientRect()
    setStyle({
      width: right+3,
      height: height+6, 
      top: top-3,
      backgroundColor: theme === ETheme.white ? 'rgba(240, 215, 135, .4)' : 'rgba(0, 0, 0, .33)',
      color: theme === ETheme.white ? '#CA9519' : '#FFFFFF'
    })
    if(theme === ETheme.black) {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#000000'
      })
    }
    if(theme === ETheme.white) {
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      })
    }
  }, [theme])

  const color = useMemo(() => {
    if(theme === ETheme.white) {
      return '#CA9519'
    }
    return '#ffffff'
  }, [theme])

  return <View className={classes} style={style} >

    {
      showBack &&
      <XIcon 
        name='zuo' 
        color={color} 
        size='16' 
        className='back' 
        useCover={true} 
        onClick={backTap} 
      />
    }{
      showCity &&
      <View className='title' >
        <XIcon name='weizhi2' color={Theme.red} size='16' />
        <View className='address' >{sort.city}</View>
        <XIcon name='xiala' color={color} size='10' />
        <View className='sortname'>{Tool.text.ellipsis(sort.sortName, 12)}</View>
        <CoverView className='cover-btn' onClick={commonCategrayTap} />
      </View>
    }{
      !showCity &&
      <View className='title' >
        <XIcon name='weizhi2' color={Theme.red} size='16' />
        <View className='sortname'>{Tool.text.ellipsis(sort.sortName, 17)}</View>
        <XIcon name='xiala' color={color} size='10' />
        <CoverView className='cover-btn' onClick={catgrayTap} />
      </View>
    }

  </View>
}

export default XMapTitle