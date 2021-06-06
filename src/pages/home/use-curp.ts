import { IHomeParams } from '@/core/interface/nav';
import Point from '@/models/point';
import { useState } from 'react';
import { IUsePoints } from './use-points';

export interface IUseCurP {
  info: any;
  setCurPId: any;
  setCurP: any;
  init: (params: IHomeParams, pointList: any[]) => void;
}

function useCurP(params: IHomeParams, points: IUsePoints): IUseCurP {
  const [curP, setCurP] = useState(null);

  const init = async (params: IHomeParams, pointList: any[]) => {
    const curPoint = getCurPoint(params);
    if (!curPoint) {
      return;
    }
    const target = pointList.find(
      (item) =>
        item.latitude === curPoint.latitude &&
        item.longitude === curPoint.longitude
    );
    if (target) {
      setCurP(target);
      return target;
    }
  };

  function getCurPoint(params: IHomeParams) {
    if (params?.curPoint) {
      return params.curPoint;
    }
    if (Point?.curPoint) {
      const point = Point.curPoint;
      Point.curPoint = null;
      return point;
    }
  }

  const setCurPId = (psaveId) => {
    const target = points.items.find((item) => item.psaveId === psaveId);
    if (target) {
      setCurP(target);
    }
  };

  return {
    info: curP,
    setCurPId,
    setCurP,
    init,
  };
}

export default useCurP;
