import React, { FC, useMemo } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames';

interface ILayout {
  name: React.ReactNode
  count: React.ReactNode
  right: React.ReactNode
  onRightTap?: () => void
}

const XLayout: FC<ILayout> = (props) => {
  const {name, count, right, onRightTap} = props

  function tapRight(e: any) {
    e.stopPropagation();
    onRightTap()
  }

  const classLeft = classNames('at-col', 'left', {
    'at-col-10': right,
    'at-col-12': !right,
  })
  const classRight = classNames('at-col', 'right', {
    'at-col-2': right,
    'at-col-0': !right,
  })

  return <View className="at-row layout" >
    <View className={classLeft}>
      {name}
      {count}
    </View>
    <View className={classRight} onClick={tapRight} >
      {right}
    </View>
  </View>
}

export default XLayout