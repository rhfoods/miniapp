import { useState } from "react"

export interface PageParams {
  list?: any[]
  amount?: number
  more?: boolean
  empty?: boolean
  hasReq?: boolean
}

export interface IPageListExp<T> {
  list: any[],
  more: boolean,
  empty: boolean,
  amount: number,
  hasReq: boolean,
  getMore: (args?: T) => Promise<any>,
  refresh: (args?: T) => Promise<any>,
  add: (item) => void,
  del: (target, key: string) => void,
  setPage: (data: any) => void,
  // response,
  // loading,
  // del,
  // update,
}

function usePageList<T>(req: (data: T) => Promise<any>, params:T, key: string): IPageListExp<T> {
  const [page, setPage] = useState<PageParams>({
    list: [],
    amount: 0,
    more: true,
    empty: true,
    hasReq: false,
  })
  const [loading, setLoading] = useState(false)

  const getMore = async (args?: T) => {
    if(!page.more) {
      return
    }
    if(loading) {
      return
    }
    setLoading(true)
    const res = await req({
      ...params,
      ...args,
      start: page.list.length,
    })
    setLoading(false)
    setPage(page => {
      const list = [...page.list, ...res[key]]
      const amount = res.page.amount
      return {
        list,
        amount,
        more: list.length >= amount ? false : true,
        empty: list.length ? false : true,
        hasReq: true
      }
    })
    return res
  }

  const refresh = async (args?: T) => {
    setLoading(true)
    const res = await req({
      ...params,
      ...args,
      start: 0,
    })
    setLoading(false)
    const list = res[key]
    const amount = res.page.amount
    setPage({
      list,
      amount,
      more: list.length >= amount ? false : true,
      empty: list.length ? false : true,
      hasReq: true
    })
    return res
  }

  const add = (item) => {
    const newPage = {...page}
    newPage.list.unshift(item)
    newPage.amount = page.amount+1
    newPage.empty = false
    setPage(newPage)
  }  

  const del = (target, key='id') => {
    const newList = []
    page.list.map(item => {
      if(item[key] !== target[key]) {
        newList.push(item)
      }
    })
    setPage(page => ({
      ...page,
      list: newList,
      amount: page.amount-1,
      empty: newList.length ? false : true
    }))
  }

  return {
    list: page.list,
    more: page.more,
    empty: page.empty,
    amount: page.amount,
    hasReq: page.hasReq,
    setPage,
    getMore,
    add,
    del,
    refresh,
    // response,
    // hasReq,
    // loading,
    // del,
    // update,
  }
}

export default usePageList