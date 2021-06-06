import { getMedias } from '@/api/api';
import { MediaTypes } from '@/api/types/api.constant';
import { IFile } from '@/component/form/pics';
import { development, isDev, production } from '@/config/http';
import Tool from '@/utils/tools';
import upload from '../utils/uploadPic/uploadFile';

export const PICS_RESIZE_500 = '?x-oss-process=image/resize,w_500,h_500';
export const PICS_RESIZE_400 = '?x-oss-process=image/resize,w_400,h_400';
export const PICS_RESIZE_300 = '?x-oss-process=image/resize,w_300,h_300';
export const PICS_RESIZE_250 = '?x-oss-process=image/resize,w_250,h_250';
export const PICS_RESIZE_40 = '?x-oss-process=image/resize,w_40,h_40';
export const PICS_RESIZE_20 = '?x-oss-process=image/resize,w_20,h_20';

class Media {
  static vId: string; // 正在被播放的视频
  static aliUrl = isDev ? development.user : production.user;
  static baseUrl = isDev ? development.baseURL : production.baseURL;
  /**
   * 图片地址(说明图片, 海报背景...)
   */
  static staticUrl(picName: string) {
    if (isDev) {
      return `${development.static}/${picName}`;
    }
    return `${production.static}/${picName}`;
  }
  /**
   * 图片地址(文章图片)
   */
  static picUrl(picName: string) {
    if (isDev) {
      return `${development.user}/${picName}`;
    }
    return `${production.user}/${picName}`;
  }
  /**
   * 获取点位图标
   */
  static pointIcon(name) {
    return require(`../static/pic/${name}`);
  }
  /**
   * sts : {OSSAccessKeyId, AccessKeySecret, stsToken}
   * tmps: [{picName, tmp}]
   */
  static uploadMedia(file: IFile) {
    return upload({
      name: file.picName, // 图片名字
      filePath: file.tmp, // 临时图片地址
      url: Media.aliUrl, // 阿里云地址
      OSSAccessKeyId: file.sts.AccessKeyId,
      AccessKeySecret: file.sts.AccessKeySecret,
      stsToken: file.sts.SecurityToken,
    });
  }
  /**
   * 是否是视频
   */
  static isVideo(medias: string[]) {
    if (!medias) {
      return false;
    }
    if (medias.length === 0) {
      return false;
    }
    if (medias[0].includes('/PV')) return true;
  }
  /**
   * 上传视频用
   * https://rehuo-app.oss-cn-chengdu.aliyuncs.com
   * -->
   * oss-cn-chengdu
   */
  static getRegion() {
    let arr = Media.aliUrl.split('//');
    arr = arr[1].split('.');
    return arr[1];
  }
  /**
   * 上传视频用
   * https://rehuo-app.oss-cn-chengdu.aliyuncs.com
   * -->
   * rehuo-app
   */
  static getBucket() {
    let arr = Media.aliUrl.split('//');
    arr = arr[1].split('.');
    return arr[0];
  }
  /**
   * 上传视频用
   * https://rehuo-app.oss-cn-chengdu.aliyuncs.com
   * -->
   * rehuo-app.oss-cn-chengdu.aliyuncs.com
   */
  static getUrl() {
    let arr = Media.baseUrl.split('//');
    arr = arr[1].split('/');
    return arr[0];
  }
  /**
   * 压缩图片
   * 1M=1024*1024
   */
  static async compress(items: any[], maxSize = 1024 * 1024) {
    let pics = [];
    for (let i = 0; i < items.length; i++) {
      const pic = items[i];
      if (pic.size > maxSize && !pic.path.includes('.gif')) {
        const quality = Math.floor((maxSize / pic.size) * 100);
        // @ts-ignore
        const compressedPic: any = await Tool.promisic(wx.compressImage)({
          src: pic.path,
          quality,
        });
        pics.push(compressedPic.tempFilePath);
      } else {
        pics.push(pic.path);
      }
    }
    return pics;
  }
  /**
   * 获取图片名, sts
   */
  static async getName(counts: number, type: MediaTypes) {
    const res: any = await getMedias({ type, counts });
    return {
      medias: res.medias,
      sts: res.sts,
    };
  }
}

export default Media;
