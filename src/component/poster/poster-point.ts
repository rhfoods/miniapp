import { POSTWXCode } from '@/api/api';
import { WXCodeType } from '@/hooks/use-params';
import Media from '@/models/media';
import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';
import { IGetPosterParams } from '.';
import CanvasPen from './canvas';
import PosterCommon from './poster-common';
/**
 * 生成海报: 详情页没有日记时, 公共地图推荐列表生成海报
 */
class PosterPoint {
  static async draw(params: IGetPosterParams) {
    const { user } = params;
    const pics = await PosterPoint.getPic(params);
    const ctx = Taro.createCanvasContext('canvasposter');
    await CanvasPen.picHttp(ctx, pics.bg, 0, 0, 510, 800); // 背景图片
    CanvasPen.text(ctx, 16, 37, `@${user.nickName}`, 18, '#888888'); // 昵称
    PosterCommon.drawTitle(ctx, params.title); // 海报标题
    // PosterCommon.drawInfo(ctx, params.info, pics.icon, 210, 14, 510); // 地址
    PosterCommon.drawInfoLeft(ctx, params.info, pics.icon, 210);
    CanvasPen.text(ctx, 169, 751, '热活·发现您身边的美味', 22, '#101010');  
    CanvasPen.pic(ctx, pics.code, 29, 688, 102, 102); // 小程序码
    await CanvasPen.draw(ctx);
    await Tool.sleep(200);
    const res = await Taro.canvasToTempFilePath({
      canvasId: 'canvasposter',
    });
    return res.tempFilePath;
  }

  static async getPic(params: IGetPosterParams) {
    return {
      bg: Media.staticUrl('poster/map.png'),
      code: await PosterPoint.getWxCode(params),
      icon: require('../../static/pic/unclocked/moren.png'),
    };
  }
  /**
   * 获取二维码: note
   */
  static async getWxCode(params: IGetPosterParams) {
    const { point } = params;
    const res: any = await POSTWXCode({
      scene: {
        type: WXCodeType.Point,
        share: {
          id: point.psaveId,
          commonId: Number(params.userId),
        }
      },
      page: params.page || 'pages/detail/index',
      isHyaline: false,
    });
    const buffer = res.qrCode.qrCode;
    return PosterCommon.buffer2Tmp(buffer);
  }
}

export default PosterPoint;
