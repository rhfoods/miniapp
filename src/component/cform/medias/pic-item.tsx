import React, { FC, useEffect, useMemo, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import Tool from '@/utils/tools'
import { IFile } from '.'
import Media, { PICS_RESIZE_300 } from '@/models/media'
import classNames from 'classnames'

type TStatus = 'ing' | 'success' | 'fail'

export interface IPicItem {
  file: IFile
  onDel: (item: any) => void, // 点击删除按钮
  onBegin?: () => void, // 开始上传
  onFinish?: () => void, // 结束上传
  onClick?: () => void, // 点击图片
}

const XPicItem: FC<IPicItem> = (props) => {
  const { file, onDel } = props
  const [status, setStatus] = useState<TStatus>('ing')

  const classPic = classNames('pic', {
    'blur': status !== 'success',
  })

  useEffect(() => {
    if(!file.sts) {
      setStatus('success')
      return
    }
    upload()
  }, [])
  /**
   * 开始上传触发: onBegin
   * 结束上传触发: onFinish
   */
  useEffect(() => {
    if(status === 'ing') {
      props.onBegin()
      return
    }
    props.onFinish()
  }, [status])
  /**
   * 图片地址
   */
  const picUrl = useMemo(() => {
    if(status === 'ing' && file.tmp) {
      return file.tmp
    }
    if(file.picName) return Media.picUrl(file.picName) + PICS_RESIZE_300
  }, [file, status])
  /**
   * 上传到阿里云
   */
  async function upload() {
    try {
      setStatus('ing')
      await Tool.sleep(500)
      await Media.uploadMedia(file)
      setStatus('success')
    } catch (error) {
      setStatus('fail')
    }
  }
  /**
   * 上传进度提示信息
   */
  const tip = useMemo(() => {
    if(status === 'ing') return '上传中...'
    if(status === 'success') return '上传成功'
    if(status === 'fail') return '上传失败'
  }, [status])

  return <View className="c-pic-item">
    <Image className={classPic} src={picUrl} mode="aspectFill" onClick={props.onClick} />
    <View className="tip" >{tip}</View>
    {
      status === 'fail' && 
      <View className="tag" onClick={()=>upload()} >重试</View>
    }{
      <View className="p-close" onClick={()=>onDel(file.picName)} >
        <AtIcon value='close' size='12' color='#FFF'/>
      </View>
    }
  </View>
}

export default XPicItem