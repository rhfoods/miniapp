import { useEffect } from "react"
import Taro from '@tarojs/taro' 
import { EMsgType } from "@/context/message-ctx"
import { IOpenMsgList } from "@/core/interface/nav"

function useMsgTitle(params: IOpenMsgList) {

  useEffect(() => {
    if(!params?.msgType) return
    let title = '消息'
    if(params.msgType === EMsgType.save) title= '收藏与置顶'
    if(params.msgType === EMsgType.clock) title= '打卡消息'
    if(params.msgType === EMsgType.comment) title= '评论消息'
    if(params.msgType === EMsgType.like) title= '点赞消息'
    if(params.msgType === EMsgType.system) title= '系统消息'
    Taro.setNavigationBarTitle({title})
  }, [params])

}

export default useMsgTitle