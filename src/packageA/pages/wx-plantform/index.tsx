import React, { FC, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import './index.scss'
import PlantFormModel from './models'
import XCopyItem from './copy-item'
import Taro from '@tarojs/taro' 
import useCopyList from './use-copy-list'
/**
 * 嵌入到公众号说明
 */
const PWXPlantForm: FC = () => {

  const [cur, setCur] = useState(0)
  const { articleItems, tabItems } = useCopyList()

  const handleClick = (cur: number) => {
    setCur(cur)
  }
  const prePic = (pic: string) => {
    const list = cur === 0 ? PlantFormModel.article : PlantFormModel.tablist
    const urls = list.map(item => item.pic)
    Taro.previewImage({
      current: pic,
      urls
    })
  }
  const articleCopyList = articleItems.map(
    item => <XCopyItem info={item} ></XCopyItem>
  )
  const tabCopyList = tabItems.map(
    item => <XCopyItem info={item} ></XCopyItem>
  )
  
  /**
   * 嵌入到文章图文
   */
  const articleList = PlantFormModel.article.map(item => {
    return <View className='pic-item' >
      <View className='title' >{item.title}</View>
      <Image className='pic' src={item.pic} onClick={() => prePic(item.pic)} />
    </View>
  })
  /**
   * 嵌入到菜单栏图文
   */
  const tabList = PlantFormModel.tablist.map(item => {
    return <View className='pic-item' >
      <View className='title' >{item.title}</View>
      <Image className='pic' src={item.pic} onClick={() => prePic(item.pic)} />
    </View>
  })

  return <View className='p-wx-plantform' >
    <AtTabs
      current={cur}
      swipeable={false}
      tabList={[
        { title: '嵌入到文章' },
        { title: '嵌入到菜单栏' },
      ]}
      onClick={handleClick}>

      <AtTabsPane current={cur} index={0}>
        <View className='container' >
          <View className='copy' >{articleCopyList}</View>
          {articleList}
        </View>
      </AtTabsPane>

      <AtTabsPane current={cur} index={1}>
        <View className='container' >
          <View className='copy' >{tabCopyList}</View>
          {tabList}
        </View>
      </AtTabsPane>

    </AtTabs>    
  </View>
}

export default PWXPlantForm