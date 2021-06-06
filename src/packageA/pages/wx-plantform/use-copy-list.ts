import { IOpenEmbed } from "@/core/interface/nav"
import useParams from "@/hooks/use-params"
import { useMemo } from "react"

interface ICopyItem {
  title: string
  info: string
}

function useCopyList() {

  const params: IOpenEmbed = useParams()

  const path = useMemo(() => {
    const item = {...PATH}
    if(params) {
      let arr = []
      let p = {...params}
      const path = p.path
      delete p.path
      delete p['__key_']
      Object.keys(p).map(key => {
        arr.push(`${key}=${p[key]}`)
      })
      item.info = `${path}?${arr.join('&')}`
    }
    return item
  }, [params])

  const articleItems = useMemo(() => {
    return [APPID, path]
  }, [path])

  const tabItems = useMemo(() => {
    return [APPID, path, WEB]
  }, [path])

  return {
    articleItems,
    tabItems
  }
}

export default useCopyList

const APPID: ICopyItem = {
  title: '小程序APPID',
  info: 'wx2a7fb0920a954073',
}
const PATH: ICopyItem = {
  title: '小程序路径',
  info: `pages/home/index`
}
const WEB: ICopyItem = {
  title: '备用网页',
  info: 'https://bfx.kim'
}
