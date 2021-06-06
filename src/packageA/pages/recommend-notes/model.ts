import { GETRecommendPoint } from "@/api/api"
import { GETRecommendPointPrams } from "@/api/types/api.interface"
import EFire from "@/core/enum/fire";
import Theme from "@/models/theme";
import Tool from "@/utils/tools";

class RcommendListModel {
  /**
   * 获取点位信息
   */
  static async getPointInfo(params: GETRecommendPointPrams) {
    let res: any = await GETRecommendPoint(params)
    return res.point
  }
  /**
   * 打卡
   */
  static async LOCK(point: any, distance) {
    const { promisic, goodOrBad } = Tool;
    const res = await promisic(goodOrBad)({
      psaveId: point.info?.psaveId,
      distance,
    });
    if (res === 'GOOD') {
      Tool.alertIcon({
        icon: 'xin',
        color: Theme.red,
      });
      point.setInfo((p) => {
        p.goods++;
        p.isClocked = true;
        return { ...p };
      });
      Tool.onfire.fire(EFire.commonRefresh) // 图标加爱心
    }
    if (res === 'BAD') {
      Tool.alertIcon({
        icon: 'xinsui',
        color: '#333333',
      });
      point.setInfo((p) => {
        p.bads++;
        p.isClocked = true;
        return { ...p };
      });
    }
  }
}

export default RcommendListModel