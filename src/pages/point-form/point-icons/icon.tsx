import React, { FC } from 'react'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import { path } from '@/config/http'
import Media from '@/models/media'

interface IIconItem {
  info: IIcon,
  active?: string,
  onClick?: (name: string) => void
}

export interface IIcon {
  name: string,
  desc: string,
}

const XIconItem: FC<IIconItem> = (props) => {
  const { info, active, onClick } = props

  const classes = classNames('icon', {
    'active': active === info.name
  })

  function handleClick() {
    onClick(info.name)
  }

  return <View className={classes} onClick={handleClick} >
      <Image 
        className="pic" 
        mode="aspectFit" 
        src={Media.pointIcon(`${path.unclocked}/${info.name}`)}
      />
  </View>
}

export default XIconItem