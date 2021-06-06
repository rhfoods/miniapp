import React, { FC } from 'react'
import { View, Text } from '@tarojs/components'
import useShowHide from '@/hooks/use-show-hide'

interface IXArticle {
  noteInfo: any
}

const XArticle: FC<IXArticle> = (props) => {

  const { noteInfo } = props

  const article = useShowHide(noteInfo?.content, 100, 3)

  return article.txt &&
    <View className='container' >
      <Text space='nbsp' decode className='txt' >
        {
          article.isLong 
          ? article.txt
          : article.txt+'...'
        }
      </Text>
      {
        article.showTrigger && 
        <Text 
          className='trigger' 
          onClick={article.triggerTap} >
          { article.isLong ? '收起' : '展开' }
        </Text>
      }
    </View>
}

export default XArticle