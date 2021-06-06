import { POSTWXCode } from '@/api/api';
import { WXCodeType } from '@/hooks/use-params';
import Media from '@/models/media';
import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';
import { IGetPosterParams } from '.';
import CanvasPen from './canvas';
import PosterCommon from './poster-common';
/**
 * 生成海报: 详情页有日记时
 */
class PosterNote {
  /**
   * 绘制日记海报通用
   */
  static async draw(params: IGetPosterParams) {
    const { user } = params;
    const pics = await PosterNote.getPic(params);
    const ctx = Taro.createCanvasContext('canvasposter');
    await CanvasPen.picHttp(ctx, pics.bg, 0, 0, 510, 800); // 背景图片
    CanvasPen.text(ctx, 16, 37, `@${user.nickName}`, 20, '#888888'); // 昵称
    PosterCommon.drawTitle(ctx, params.title); // 海报标题
    // PosterCommon.drawInfo(ctx, params.info, pics.icon, 210, 14, 510); // 地址
    PosterCommon.drawInfoLeft(ctx, params.info, pics.icon, 210);
    await CanvasPen.picHttp(ctx, pics.notePic, 15, 225, 481, 447); // note图片
    CanvasPen.text(ctx, 169, 751, '热活·发现您身边的美味', 22, '#101010');  
    CanvasPen.pic(ctx, pics.code, 29, 688, 102, 102); // 小程序码
    await CanvasPen.draw(ctx);
    await Tool.sleep(200);
    const res = await Taro.canvasToTempFilePath({
      canvasId: 'canvasposter',
    });
    return res.tempFilePath;
  }
  /**
   * 获取日记海报需要的图片
   */
  static async getPic(params: IGetPosterParams) {
    let bg = Media.staticUrl('poster/note.png');
    let notePic = Media.picUrl(params.note.medias[0]); // return 'https://...'
    let code = await PosterNote.getWxCode(params);
    let icon = require('../../static/pic/unclocked/moren.png');
    if (params.isVideo) {
      notePic = `${notePic}?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast,ar_auto`;
    } else {
      notePic = `${notePic}?x-oss-process=image/format,png,w_100,h_100`;
    }
    return { bg, notePic, code, icon };
  }
  /**
   * 获取二维码: note
   */
  static async getWxCode(params: IGetPosterParams) {
    const res: any = await POSTWXCode({
      scene: {
        type: WXCodeType.Point,
        share: {
          id: params.point.psaveId,
          commonId: Number(params.userId),
          topNoteId: Number(params.note.noteId),
        }
      },
      page: params.page || 'pages/detail/index',
      isHyaline: false,
    });
    const buffer = res.qrCode.qrCode;
    return PosterCommon.buffer2Tmp(buffer);
  }
}

export default PosterNote;
