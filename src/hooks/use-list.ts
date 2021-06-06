import { useEffect, useMemo, useRef, useState } from 'react';

type TReq = (data: any) => Promise<any>;

export interface IUseList {
  list: any[];
  more: boolean;
  empty: boolean;
  amount: number;
  response: any;
  hasReq: boolean;
  loading: boolean;
  getMore: () => void;
  refresh: () => Promise<any>;
  add: (item: any) => void;
  del: (item: any, key: string) => void;
  update: (item: any, key: string) => void;
  init: (initList: any[], moteData: boolean) => void;
}

/**
 * 分页加载用
 */
function useList<ListItem>(
  req: TReq,
  listName: string,
  params = {},
  arr = [],
  moreDate = true,
  take = 10
): IUseList {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [response, setResponse] = useState(null);
  const [list, setList] = useState([]);
  const [more, setMore] = useState(true);
  const [hasReq, setHasReq] = useState(false);
  const options = useRef({});

  useEffect(() => {
    if (params) options.current = params;
  }, [params]);
  /**
   *
   */
  function init(initList = [], moreData: boolean) {
    setList(initList);
    setMore(moreData);
    !moreData && setAmount(initList.length);
  }
  /**
   *
   */
  const start = useRef(0);
  useEffect(() => {
    start.current = list.length;
  }, [list]);
  /**
   * 是否可以获取更多
   */
  const canReq = useRef(true);
  useEffect(() => {
    if (loading === true || more === false) {
      canReq.current = false;
      return;
    }
    canReq.current = true;
  }, [loading, more]);
  /**
   * 列表是否为空
   */
  const empty = useMemo(() => {
    if (!list) return true;
    if (list.length === 0) return true;
    return false;
  }, [list]);

  /**
   * 获取更多数据
   */
  async function getMore() {
    if (!canReq.current) {
      return;
    }
    setLoading(true);
    const data: any = {
      ...options.current,
      start: start.current,
      take,
    };
    const res = await req(data);
    setHasReq(true);
    setResponse(res);
    setAmount(res.page.amount);
    let items = res[listName];
    setList((list) => {
      const newList = [...list, ...items];
      if (newList.length >= res.page.amount) {
        setMore(false);
      }
      return newList;
    });
    setLoading(false);
  }
  /**
   * 清空列表: 下拉刷新用
   */
  async function refresh() {
    setLoading(true);
    const data: any = {
      ...options.current,
      take,
      start: 0,
    };
    const res = await req(data);
    setResponse(res);
    setAmount(res.page.amount);
    setList((list) => {
      const newList = res[listName];
      if (newList.length >= res.page.amount) {
        setMore(false);
      } else {
        setMore(true);
      }
      return newList;
    });
    setLoading(false);
    return;
  }
  /**
   * 往列表添加item
   */
  function add(item: ListItem) {
    setList((list) => {
      return [item, ...list];
    });
    setAmount((amount) => amount + 1);
  }
  /**
   * 删除
   */
  function del(target: ListItem, key = 'id') {
    setList((list) => {
      const newList = list.filter((item) => item[key] !== target[key]);
      return newList;
    });
    setAmount((amount) => amount - 1);
  }
  /**
   * 编辑
   */
  function update(target: ListItem, key = 'id') {
    setList((list) => {
      return list.map((item) => {
        if (item[key] === target[key]) {
          return { ...item, ...target };
        }
        return item;
      });
    });
  }

  return {
    list,
    more,
    empty,
    amount,
    response,
    hasReq,
    loading,
    getMore,
    refresh,
    add,
    del,
    update,
    init,
  };
}

export default useList;
