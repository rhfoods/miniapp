import User from '@/models/user';
import { useEffect, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro' 
import Tool from '@/utils/tools';

type stateType = 'loading' | 'success' | 'err'

function useLogin() {
  const [info, setInfo] = useState(null);
  const [state, setState] = useState<stateType>('loading')

  useEffect(() => {
    User.login().then((info) => {
      setInfo(info);
      setState('success')
    }).catch(err => {
      refresh()
      setState('err')
    })
  }, []);
  /**
   * 登录失败刷新当前页面
   */
  const refresh = () => {
    let timer = setTimeout(() => {
      const url = Tool.getCurrentPages()
      Taro.clearStorageSync()
      Taro.reLaunch({url})
      clearTimeout(timer)
    }, 3000)
  }

  useEffect(() => {
    setShareMenu(info?.nickName)
  }, [info])
  
  useDidShow(() => {
    setShareMenu(info?.nickName)
  })

  function setShareMenu(nickName: string) {
    if(nickName) {
      Taro.showShareMenu({})
    } else {
      Taro.hideShareMenu()
    }
  }

  return {
    state,
    info,
    setInfo,
  };
}

export default useLogin;
