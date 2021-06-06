import { MapTypes } from '@/api/types/api.constant';
import { IArticleDetail } from '@/core/interface/nav';
import useApi from '@/hooks/use-api';
import Point from '@/models/point';
import Tool from '@/utils/tools';

function usePoint() {
  const pointInfo = useApi(Point.getPointInfo);

  async function getInfo(params: IArticleDetail) {
    if (params?.pointDetail) {
      pointInfo.setInfo(params.pointDetail);
      return;
    }
    if (params?.psaveId) {
      const info = await pointInfo.getData({
        mo:
          Number(params.userId) === Tool.userId()
            ? MapTypes.MY
            : MapTypes.OTHER,
        psaveId: params?.psaveId,
      });
      return info;
    }
  }

  return {
    ...pointInfo,
    getInfo,
  };
}

export default usePoint;
