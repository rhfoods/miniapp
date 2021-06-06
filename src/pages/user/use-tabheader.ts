import { IPageUserParams } from '@/core/interface/nav';
import User from '@/models/user';
import { initial } from 'lodash';
import { useEffect, useState } from 'react';

export enum EUserList {
  maps= 'maps',
  my= 'my',
  save= 'save',
}

const tabList = [
  { title: '收藏的图', key: EUserList.maps },
  { title: '我的发现', key: EUserList.my },
  { title: '收藏的点', key: EUserList.save },
];

export interface ITabHeaderItem {
  title: string;
  key: string;
  total?: number;
}

function useTabHeader(userInfo, params: IPageUserParams) {
  const [items, setItems] = useState<ITabHeaderItem[]>();
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if(ready && userInfo && items?.length > 1 ) {
      refresh(userInfo)
    }
  }, [userInfo])

  function refresh(userInfo) {
    const items: ITabHeaderItem[] = [...tabList]
    items[0].total = userInfo?.saveMaps,
    items[1].total = userInfo?.createPoints,
    items[2].total = userInfo?.savePoints
    setItems(items);
    return items
  }

  function init(userInfo, params) {
    if(params.userId === User.userId()) {
      const items = refresh(userInfo)
      setReady(true)
      return items
    } else {
      const item: ITabHeaderItem = {...tabList[1]}
      item.total = userInfo?.createPoints,
      setItems([item]);
      setReady(true)
      return items
    }
  }

  return { items, init };
}

export default useTabHeader;
