import React, { FC, useState } from 'react'
import { ScrollView, View } from '@tarojs/components'
import cityList from './cities'
import XLetterItem, { Icity } from './letter-item'
import XRightLetters from './right-letters'
import Taro from '@tarojs/taro' 
import './index.scss'

interface IXIndexes {
  className?: string;
  top?: string;
  onClick: (city: Icity) => void;
}

const XIndexes: FC<IXIndexes> = (props) => {

  const [cities] = useState(cityList)
  const [target, setTarget] = useState('')
  const { top, onClick } = props

  /**
   * 
   */
  const onItemTap = (city) => {
    onClick(city)
  }
  /**
   * 
   */
  const onChange = (key) => {
    Taro.showToast({title: key, icon: 'none'})
    setTarget(`letter-${key}`)
  }

  return <View>
    <XRightLetters items={cities} onChange={onChange} top={top}  />
    <ScrollView scrollY className='c-indexes' scrollIntoView={target} >
      {
        <View id={`letter-${top}`} >
          {props.children}
        </View>
      }{
        cities.map(item => {
          return <XLetterItem item={item} onClick={onItemTap} />
        })
      }
    </ScrollView>
  </View>
}

XIndexes.defaultProps = {
  top: 'Top'
}

export default XIndexes