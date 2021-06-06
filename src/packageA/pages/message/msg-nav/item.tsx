import React, { FC, useMemo } from 'react'
import { View } from '@tarojs/components'
import { IMsgNavItem } from '../use-navs'
import classNames from 'classnames'
import XIcon from '@/component/icon'
import { AtBadge } from 'taro-ui'
import { useMsg } from '@/context/message-ctx'

interface IXMsgNavItem {
  className?: string;
  info: IMsgNavItem;
  onClick: (info: IMsgNavItem) => void
}

const XMsgNavItem: FC<IXMsgNavItem> = ({className, info, onClick}) => {

  const classes = classNames('c-msg-nav-item', className)
  const msg = useMsg()

  const badgeValue = useMemo(() => {
    return msg.info[info.msgType]
  }, [info, msg.info])

  return <View className={classes} onClick={() => onClick(info)} >
    <View className='icon-container' style={{background: info.bgColor}} >
      <AtBadge value={badgeValue || ''} maxValue={99}>
        <XIcon name={info.icon} color='#fff' size='18' />
      </AtBadge>
    </View>
    <View>{info.text}</View>
  </View>
}

export default XMsgNavItem