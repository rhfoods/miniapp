import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import { $ } from '@tarojs/extend'
import Tool from '@/utils/tools'
import './index.scss'

interface IWaterFollow {
  className?: string;
  item: any;
}
export interface IWaterFollowState {
  add: (list: any[]) => void;
  clear: () => void
}

const XWaterFlow = forwardRef<IWaterFollowState, IWaterFollow>((props, ref) => {
  
  const { className, item } = props
  const [leftList, setLeftList] = useState<any[]>([])
  const [rightList, setRightList] = useState<any[]>([])
  const classes = classNames('c-water-follow', className)

  useImperativeHandle(ref, () => ({
    add,
    clear,
  }), [])

  function clear() {
    setLeftList([])
    setRightList([])
  }
  
  async function add(list: any[]) {
    for(let i=0; i<list.length; i++) {
      await addItem(list[i])
      await Tool.sleep(100)
    }
  }

  async function addItem(item) {
    const hL = await geth('#water-fllow-left') 
    const hR = await geth('#water-fllow-right') 
    if(hL <= hR) {
      setLeftList(list => [...list, item])
    } else {
      setRightList(list => [...list, item])
    }
  }

  async function geth(classname: string) {
    const h = await $(classname).height()
    return h
  }

  const LEFT = leftList.map(data => {
    return React.cloneElement(item, {
      info: data, 
    })
  })

  const RIGHT = rightList.map(data => {
    return React.cloneElement(item, {
      className: `${item.props.className} water-fllow-item`,
      info: data, 
    })
  })

  return <View className={classes} >
    <View className='list-left'>
      <View id='water-fllow-left' >{LEFT}</View>
    </View>
    <View className='list-right'>
      <View id='water-fllow-right'>{RIGHT}</View>
    </View>
  </View>
})

export default XWaterFlow