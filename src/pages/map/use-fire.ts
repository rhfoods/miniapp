import EFire from '@/core/enum/fire';
import Tool from '@/utils/tools';
import { useEffect } from 'react';
import { IUseCommonPoints } from './use-com-points';

function useCommonFire(
  points: IUseCommonPoints,
) {
  /**
   *
   */
  useEffect(() => {
    onfire()
  }, [])

  function onfire() {
    /**
     * 刷新
     */
    Tool.onfire.on(EFire.commonRefresh, async () => {
      points.refresh()
    });
  }
}

export default useCommonFire;
