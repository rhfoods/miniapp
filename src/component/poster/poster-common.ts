import Taro from '@tarojs/taro';
import CanvasPen from './canvas';
import base64src from './base64src.js';

class PosterCommon {
  /**
   * 海报标题: 绘制文章标题
   */
  static async drawTitle(ctx, title: string) {
    if (title.length <= 12) {
      CanvasPen.text(ctx, 16, 144, title, 38, '#505050');
      return;
    }
    const line01 = title.substr(0, 12);
    let line02 = title.substr(12);
    CanvasPen.text(ctx, 16, 115, line01, 38, '#505050');
    CanvasPen.text(ctx, 16, 160, line02, 38, '#505050');
  }
  /**
   * 海报标题: 绘制文章地址
   */
  static async drawInfo(
    ctx,
    info: string,
    icon: string,
    top: number,
    right: number,
    w: number,
    fontSize = 20
  ) {
    const len = info.length * fontSize;
    const x = w - len - right;
    CanvasPen.text(ctx, x, top, info, fontSize, '#101010');
    const wh = fontSize + 2;
    CanvasPen.pic(ctx, icon, x - wh - 2, top - wh + 2, wh, wh);
  }
  /**
   * 海报标题: 绘制文章地址
   */
  static async drawInfoLeft(
    ctx,
    info: string,
    icon: string,
    top: number,
    left=14,
    fontSize = 20
  ) {
    const width = fontSize+2
    CanvasPen.text(ctx, left+width, top, info, fontSize, '#888888');
    CanvasPen.pic(ctx, icon, left, top - width + 2, width, width);
  }
  /**
   * 小程序码转临时文件 buffre -> base64 --> tmp
   */
  static async buffer2Tmp(buffer) {
    const base64 = `data:image/png;base64,${buffer?.toString('base64')}`;
    return await base64src(base64); // base64 --> tmp
  }
  /**
   * @param src : 图片地址
   * @param pw  : 图片在海报中的尺寸
   * @param ph  : 图片在海报中的尺寸
   */
  static async getPic(src, pw: number, ph: number) {
    const { width, height, path } = await Taro.getImageInfo({ src });
    let x: number; // 裁剪坐标x
    let y: number; // 裁剪坐标y
    let h: number; // 裁剪高度
    let w: number; // 裁剪宽度
    if (width/height > pw/ph) {
      h = height;
      w = (height * pw) / ph;
      x = width / 2 - w / 2;
      y = 0;
    } else {
      w = width;
      h = (width * ph) / pw;
      x = 0;
      y = height / 2 - h / 2;
    }
    return { w, h, x, y, path };
  }
}

export default PosterCommon;
