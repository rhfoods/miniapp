import { GETUserInfo } from '@/api/api';
import { IHomeParams } from '@/core/interface/nav';
import { useMemo, useState } from 'react';

function useUserinfo(self) {
  const [info, setInfo] = useState(null);
  /**
   * 是否是自己的地图
   */
  const isOwn = useMemo(() => {
    if (info && info.userId === self.userId) {
      return true;
    }
    return false;
  }, [info]);

  const getInfo = async (params: IHomeParams) => {
    const id = params?.userId || self.userId;
    if (!id) {
      return;
    }
    if (id === self.userId) {
      setInfo(self);
      return self;
    }
    const res: any = await GETUserInfo({ userId: id });
    setInfo(res.user);
    return res.user;
  };

  return {
    info,
    isOwn,
    setInfo,
    getInfo,
  };
}

export default useUserinfo;
