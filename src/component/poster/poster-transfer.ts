import CanvasPen from './canvas';
import Taro from '@tarojs/taro';
import PosterCommon from './poster-common';
import Tool from '@/utils/tools';
import { IGetPosterParams } from '.';
import { POSTWXCode } from '@/api/api';
import { WXCodeType } from '@/hooks/use-params';

class PosterTransfer {
  static async draw(params: IGetPosterParams) {
    const pics = await PosterTransfer.getPic(params);
    const ctx = Taro.createCanvasContext('canvasposter');
    CanvasPen.rect(ctx, 0, 0, 300, 300, '#ffffff')
    CanvasPen.pic(ctx, pics.code, 50, 25, 200, 200);
    CanvasPen.text(ctx, 45, 260, params.info, 14, '#6f6f6f');
    await CanvasPen.draw(ctx);
    await Tool.sleep(200);
    const res = await Taro.canvasToTempFilePath({
      canvasId: 'canvasposter',
    });
    return res.tempFilePath;
  }
  /**
   * 获取二维码: note
   */
  static async getWxCode(params: IGetPosterParams) {
    const res: any = await POSTWXCode({
      scene: {
        type: WXCodeType.Transfer,
        transfer: {
          phone: params.phone
        }
      },
      page: params.page || 'pages/home/index',
      isHyaline: false,
    });
    const buffer = res.qrCode.qrCode;
    return PosterCommon.buffer2Tmp(buffer);
  }
  /**
   * 获取图片
   */
  static async getPic(params: IGetPosterParams) {
    const code = await PosterTransfer.getWxCode(params)
    return { code };
  }
}

export default PosterTransfer;
