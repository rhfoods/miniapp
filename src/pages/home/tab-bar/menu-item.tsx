import React, { FC, useMemo } from 'react'
import { View } from '@tarojs/components'
import { AtBadge } from 'taro-ui'
import XIcon from '@/component/icon'
import { IMapTabBtn } from '.'
import classNames from 'classnames'
import { ETheme } from '@/core/enum/theme'
import Taro from '@tarojs/taro' 
import { useMsg } from '@/context/message-ctx'
import { EHomeTabbar } from '../use-tabbar'

interface IHomeMenuItem {
  className?: string,
  item: IMapTabBtn,
  theme: ETheme,
  onClick: (item: IMapTabBtn) => void
}

const XHomeMenuItem: FC<IHomeMenuItem> = (props) => {

  const { className, item, theme } = props
  const classes = classNames('c-home-tabbar-item', className)
  const msg = useMsg()

  const itemTap = () => {
    Taro?.vibrateShort()
    props.onClick(item)
  }

  const badgeValue = useMemo(() => {
    if(item.key === EHomeTabbar.msg) {
      return msg.info.total
    }
    return item.msg
  }, [item, msg.info])

  return <View className={classes} >
    <AtBadge value={badgeValue || ''} maxValue={99}>
      <XIcon 
        name={item.icon} 
        color={theme === ETheme.white ? item.whiteColor : item.blackColor} 
        size={item.size} 
        useCover={true} 
        onClick={itemTap} 
      />
    </AtBadge>
  </View>
}

export default XHomeMenuItem