import { useState } from 'react';
import { IUseCommonPoints } from './use-com-points';

export interface ICommonUseCurP {
  info: any;
  setCurPId: any;
  setCurP: any;
}

function useCommonCurP(points: IUseCommonPoints): ICommonUseCurP {
  const [curP, setCurP] = useState(null);

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
  };
}

export default useCommonCurP;
