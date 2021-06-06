import { getSortInfo } from '@/api/api';
import { useState } from 'react';

export interface ISort {
  sortId: number;
  sortName: string;
  total: number;
  city?: string;
  [props: string]: any;
}

function useSort() {
  const [sort, setSort] = useState<ISort>();

  const init = async (params, userInfo) => {
    const sortId = getSortId(params);
    return await getInfo(sortId, userInfo)
  }

  function resolvingSortId(sortId) {
    if(sortId === 0) return sortId
    if(!sortId) return -1
    return sortId
  }

  const getInfo = async (sortId, userInfo) => {
    const res: any = await getSortInfo({
      sortId: resolvingSortId(sortId),
      createrId: userInfo.userId,
    });
    const sort = {
      sortId,
      sortName: res.sort.name,
      total: res.sort.points,
    };
    setSort(sort);
    return sort;
  };
  /**
   * 获取分类id
   */
  function getSortId(params) {
    const sortId = params?.sortId;
    if (!sortId && sortId !== 0) {
      return -1;
    }
    return Number(sortId);
  }

  return {
    sortId: sort?.sortId,
    sortName: sort?.sortName,
    total: sort?.total,
    setSort,
    getInfo,
    init,
  };
}

export default useSort;
