import { CanvasContext } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import PosterCommon from './poster-common';

class CanvasPen {
  /**
   * 开始绘制
   */
  static async draw(ctx: CanvasContext) {
    return new Promise((resolve) => {
      ctx.draw(false, (res) => {
        resolve(res);
      });
    });
  }
  /**
   * 文字
   */
  static text(
    ctx: CanvasContext,
    x: number,
    y: number,
    text: string,
    fontSize = 24,
    fontColor = '#333',
    bold = false
  ) {
    ctx.save();
    ctx.setFontSize(fontSize);
    ctx.setFillStyle(fontColor);
    ctx.setTextAlign('left');
    ctx.fillText(text, x, y);
    if (bold) {
      ctx.fillText(text, x - 0.5, y);
      ctx.fillText(text, x, y - 0.5);
    }
    ctx.restore();
  }
  /**
   * 绘制本地图片
   */
  static pic(
    ctx: CanvasContext,
    pic: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.save();
    ctx.drawImage(pic, x, y, w, h);
    ctx.restore();
  }
  /**
   * 绘制网络图片(长宽未知, 需要裁剪)
   */
  static async picHttp(
    ctx: CanvasContext,
    src: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const img = await PosterCommon.getPic(src, w, h);
    ctx.save();
    ctx.drawImage(
      img.path, // 'wxfile://...'
      img.x, // 截图坐标x
      img.y, // 截图坐标y
      img.w, // 截图宽度
      img.h, // 截图高度
      x, // 画布中图片坐标x
      y, // 画布中图片坐标y
      w, // 画布中图片宽度
      h // 画布中图片高度
    );
    ctx.restore();
  }
  /**
   * 绘制圆形头像(网络图片)
   */
  static async roundPic(
    ctx: CanvasContext,
    src: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    if(src.includes('https')) {
      const { path } = await Taro.getImageInfo({ src });
      src = path
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + w / 2, y + w / 2, w / 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(src, x, y, w, h);
    ctx.restore();
  }
  /**
   * 绘制圆形头像(本地图片)
   */
  static async roundPicLocal(
    ctx: CanvasContext,
    src: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    // const { path } = await Taro.getImageInfo({ src });
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + w / 2, y + w / 2, w / 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(src, x, y, w, h);
    ctx.restore();
  }
  /**
   * 绘制一个矩形
   */
  static rect(
    ctx: CanvasContext,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string
  ) {
    ctx.save();
    ctx.setFillStyle(color);
    ctx.fillRect(x, y, w, h);
    ctx.restore();
  }
  /**
   * 绘制圆角矩形
   */
  static fillRoundRect(
    cxt: CanvasContext,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string
  ) {
    //圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
      return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边
    CanvasPen.drawRoundRectPath(cxt, width, height, radius);
    cxt.setFillStyle(fillColor);
    cxt.fill();
    cxt.restore();
  }
  /**
   * 绘制圆角矩形的各个边
   */
  static drawRoundRectPath(
    cxt: CanvasContext,
    width: number,
    height: number,
    radius: number
  ) {
    cxt.beginPath();
    //从右下角顺时针绘制，弧度从0到1/2PI
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
    //矩形下边线
    cxt.lineTo(radius, height);
    //左下角圆弧，弧度从1/2PI到PI
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
    //矩形左边线
    cxt.lineTo(0, radius);
    //左上角圆弧，弧度从PI到3/2PI
    cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
    //上边线
    cxt.lineTo(width - radius, 0);
    //右上角圆弧
    cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
    //右边线
    cxt.lineTo(width, height - radius);
    cxt.closePath();
  }
}

export default CanvasPen;
