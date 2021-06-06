import Tool from "@/utils/tools";
import { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro' 

function useAuthorize() {
  const [location, setLocation] = useState(false) // 是否授权了位置信息
  const [user, setUser] = useState(false) // 是否授权了用户信息
  
  useDidShow(() => {
    init()
  })

  async function init() {
    const { promisic } = Tool
    const res: any = await promisic(Taro.getSetting)();
    if (res.authSetting['scope.userLocation']) {
      setLocation(true)
    }
    if (res.authSetting['scope.userInfo']) {
      setUser(true)
    }
  }

  return {
    user,
    location,
    refresh: init
  }

}

export default useAuthorize