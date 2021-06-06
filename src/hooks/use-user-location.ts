import MyMap from '@/models/map';
import Tool from '@/utils/tools';
import { useDidShow } from '@tarojs/taro';
import { useEffect, useState } from 'react';

function useUserLocation(point) {
  const [dis, setDis] = useState<number>(null);

  useEffect(() => {
    if (point?.latitude) {
      init();
    }
  }, [point?.latitude]);

  useDidShow(() => {
    if (point?.latitude) {
      init();
    }
  });

  async function init() {
    getDis();
    // 如果没有获取位置授权就不弹框了
    // const { promisic } = Tool;
    // const res: any = await promisic(Taro.getSetting)();
    // if (res.authSetting['scope.userLocation']) {
    // }
  }

  async function getDis() {
    const { latitude, longitude }: any = await MyMap.getLocation();
    const dis = Tool.getDis(
      latitude,
      longitude,
      point?.latitude,
      point?.longitude
    );
    setDis(dis);
    return dis;
  }

  return {
    distance: dis,
    getDis,
  };
}

export default useUserLocation;
