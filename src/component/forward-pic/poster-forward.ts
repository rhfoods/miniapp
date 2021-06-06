import Taro from '@tarojs/taro';
import Tool from '@/utils/tools';
import { IGetPosterParams } from '../poster';
import CanvasPen from '../poster/canvas';
import PosterCommon from '../poster/poster-common';
// const bg =
// 转发图片
class PosterForwardPic {
  static async draw(params: IGetPosterParams) {
    const pics = await PosterForwardPic.getPic(params);
    await Tool.sleep(1000); // 在别的页面获取不到canvas标签
    const ctx = Taro.createCanvasContext('canvasforward');
    await CanvasPen.pic(ctx, pics.bg, 0, 0, 300, 239); // 背景图片
    PosterCommon.drawInfo(ctx, params.info, pics.icon, 230, 14, 300, 12); // 图片
    await CanvasPen.draw(ctx);
    await Tool.sleep(200);
    const res = await Taro.canvasToTempFilePath({
      canvasId: 'canvasforward',
    });
    return res.tempFilePath;
  }

  static async getPic(params: IGetPosterParams) {
    return {
      bg: require('../../static/pic/forward.jpg'),
      icon: require('../../static/pic/unclocked/moren.png'),
    };
  }
}

export default PosterForwardPic;
