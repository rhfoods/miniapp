import { PointNoteLinkTypes } from '@/api/types/api.constant';

/**
 * 添加点位
 */
export interface IFormPoint {
  name?: string;
  address?: string;
  tag?: string;
  price?: number;
  sortId?: number;
  logo?: string;
  longitude?: string;
  latitude?: string;
  ownType?: 'C' | 'F' | 'S' | 'N'; // 自己创建的 收藏别人 仅收藏 未收藏
}
/**
 * 添加文章
 */
export interface IFormarticle {
  title?: string;
  content?: string;
  medias?: string;
  scenes?: string;
  bilibili?: string;
  webo?: string;
  xhs?: string;
  psaveId?: string;
}
export interface INoteLinkItem {
  symbol: string;
  type: PointNoteLinkTypes;
}
/**
 * 上传图片
 */
export interface ISts {
  AccessKeyId: string;
  AccessKeySecret: string;
  SecurityToken: string;
}
