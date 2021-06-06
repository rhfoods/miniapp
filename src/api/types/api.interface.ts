import { EPostType } from '@/component/poster';
import { EMsgType } from '@/context/message-ctx';
import { WXCodeType } from '@/hooks/use-params';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested
} from 'class-validator';
import {
  APIS,
  MapTypes,
  MediaTypes,
  PointNoteLinkTypes,
  RequestMethod,
  SqlOrderTypes,
  SystemConstants,
  SystemRoleTypes
} from './api.constant';

export type listType = 'ASC' | 'DESC'

/**
 * 网络请求参数
 */
export interface IUrlParams {
  url: APIS; //API地址
  method: RequestMethod; //请求的方法
  useToken: boolean; //是否需要TOKEN
}

/**
 * 网络请求可选参数
 */
export interface IUrlOptions {
  showErr?: (err: any) => void; //是否进行错误处理
  timeout?: number; //超时时间
  errHandle?: (err, retry) => void; //错误处理函数
}

/**
 * 微信请求数据定义
 */
export class WechatCode {
  code: string;
  nickName?: string;
  headUrl?: string;
  encryptedData?: string;
  iv?: string;
}

/**
 * 日记外部链接定义
 */
export class PointNoteLink {
  @IsEnum(PointNoteLinkTypes)
  type: PointNoteLinkTypes;

  symbol: string;
}

/**
 * ID请求数据定义
 */
export class IdRequest {
  id?: number;
}

/**
 * 查询请求数据定义
 */
export class PageRequest {
  order?: SqlOrderTypes;
  start?: number;
  take?: number;
}

/**
 * 登录认证
 */
export class AuthLogin {
  role: SystemRoleTypes;
  @ValidateNested({ each: true })
  @Type(() => WechatCode)
  wxCode: WechatCode;
}

/**
 * 刷新TOKEN
 */
export class RefreshToken { }

/**
 * 生成图片或者视频
 */
export class GetMedias {
  @IsNotEmpty()
  @IsEnum(MediaTypes)
  type: MediaTypes;

  @IsInt()
  @IsNotEmpty()
  @Min(SystemConstants.IMAGE_UPLOAD_MIN_COUNT)
  @Max(SystemConstants.IMAGE_UPLOAD_MAX_COUNT)
  counts: number;
}

/**
 * 删除图片或者视频
 */
export class DeleteMedias {
  @IsArray()
  @ArrayMinSize(SystemConstants.IMAGE_UPLOAD_MIN_COUNT)
  @ArrayMaxSize(SystemConstants.IMAGE_UPLOAD_MIN_COUNT)
  medias: string[];
}

/**
 * 获取地图信息
 */
export interface ILocation {
  longitude: number;
  latitude: number;
}

export class GetMap extends IdRequest {
  rightCorner: string;
  leftBottom: string;
  createrId: number;
  sortId?: number;
}
export class GetMapScope extends IdRequest {
  sortId: number;
  createrId: number;
  scale: number;
  code: number;
}
export class GetMapArea extends IdRequest {
  sortId: number;
  createrId: number;
  type: 'PR' | 'CI' | 'CO'; // '省' | '市' | '区'
  code: string;
}

export class GetSortPoints extends IdRequest {
  order?: SqlOrderTypes;
  start?: number;
  take?: number;
  sortId?: number;
  userId?: number;
  isNote?: boolean;
}

/**
 * 获取点位信息
 */
export class GetMapPointBase extends IdRequest {
  psaveId: number;
}

/**
 * 获取点位信息
 */
export class GetMapPoint extends IdRequest {
  psaveId: number;
  mo: MapTypes;
}

/**
 * 收藏地图
 */
export class SaveMap extends IdRequest {
  createrId: number;
}

/**
 * 取消地图收藏
 */
export class DeleteMap extends IdRequest {
  createrId: number;
}

/**
 * 获取部分或者全部收藏地图
 */
export class GetMaps extends PageRequest { }

/**
 * 创建点位分类
 */
export class CreatePointSort {
  @IsString()
  @IsNotEmpty({
    message: '请填写分类名称',
  })
  @MaxLength(SystemConstants.LITTLE_LENGTH, {
    message: `分类名称不得超过${SystemConstants.LITTLE_LENGTH}字`,
  })
  name: string;
}

/**
 * 更新点位分类
 */
export class UpdatePointSort extends CreatePointSort {
  sortId: number;
  name: string;
}
/**
 * 获取分类信息
 */
export class GetPointInfo {
  sortId: number;
  createrId: number;
}

/**
 * 删除点位分类
 */
export class DeletePointSort extends IdRequest {
  sortId: number;
}

/**
 * 获取所有点位分类
 */
export class GetPointSorts extends PageRequest {
  userId: number;
}

/**
 * 更新点位收藏
 */
export class UpdatePointSave extends IdRequest {
  price?: number;
  tag: string;
  name: string;
  psaveId: number;
  sortId: number;
  logo: string;
}

/**
 * 获取所有收藏点位
 */
export class GetPointSaves { }
/**
 * 获取所有自己的点位
 */
export class GetPointMys { 
  userId?: number
}
/**
 * 收藏点位、取消收藏点位
 */
export class PointSave {
  psaveId: number;
}

/**
 * 日记收藏和取消收藏
 */
export class NoteSave {
  noteId: number;
}
/**
 * 地图迁移
 */
export class MapTransferParams {
  phone: string;
  smsCode: string;
  providerId: number;
}
/**
 * 地图迁移(选城市)
 */
export class TransferPublicParams {
  cityName: string;
  providerId: number;
}

/**
 * 创建点位日记
 */
export class CreatePointNote {
  title: string;
  centent: string;
  medias?: string[];
  scenes?: string[];
  links?: PointNoteLink[];
  psaveId: number;
}

/**
 * 更新点位日记
 */
export class UpdatePointNote extends IdRequest {
  psaveId: number;
  title?: string;
  centent?: string;
  medias?: string[];
  scenes?: string[];
  links?: PointNoteLink[];
}

/**
 * 删除点位日记
 */
export class DeletePointNote extends IdRequest {
  noteId: number;
}

/**
 * 获取点位日记
 */
export class GetPointNote extends IdRequest {
  noteId: number;
}
/**
 * 获取多篇日记
 */
export class GetNotes extends IdRequest {
  ids: string;
}
/**
 * 获取发现更多
 */
export class GetFindNotes extends PageRequest {
  psaveId: number;
}
/**
 * 获取多篇日记
 */
export class PatchTopNote extends IdRequest {
  psaveId: number;
  noteId: number;
}

export interface UpdateUserInfo {
  nickName?: string;
  avatarUrl?: string;
  gender?: string;
  city?: string;
  province?: string;
  introduce?: string;
  userId?: number;
}

export interface GetUserInfo {
  userId: number;
}
export interface GetUserProfile {
  userId: number;
}

export interface PostUserClock {
  psaveId: number;
  feel: 'GOOD' | 'BAD';
  noteId?: number;
}

export interface PutLike {
  noteId: number;
  isLiked: boolean;
}

export interface POSTWXCodeBody {
  scene: {
    type: WXCodeType;
    share?: {
      id: number; commonId?: number; topNoteId?: number; cityCode?: string
    }
    transfer?: {
      phone: string;
    }
  };
  page?: string;
  width?: number;
  autoColor?: boolean;
  lineColor?: { r: string; g: string; b: string };
  isHyaline?: boolean;
}
export interface GETWXCodeBody {
  scene: string
}

export interface POSTPhoneCodeBody {
  phone: string;
  template: 'SMS_208626278' | 'SMS_197611110';
  sign: '热活' | '创享知道';
}

export interface POSTMapShareBody {
  psaveId?: number;
  noteId?: number;
  createrId?: number;
}

export type CommentType = 'Q' | 'A' | 'R' // '一级'|'二级'|'其他'
export interface POSCommentParams {
  type: CommentType;
  noteId: number;
  comment: string;
  fatherId?: number; // 一级评论的id
  upId?: number; // 被评论者的id
}
export interface GetCommentsParams {
  order?: listType,
  start?: number,
  take?: number,
  noteId: number
}
export interface GetSubCommentsParams {
  order?: listType,
  start?: number,
  take?: number,
  commentId: number
  counts: number
}
export interface DelCommentParams {
  noteId: number
  commentId: number
}
export interface CommentLikeParams {
  commentId: number
  isLiked: boolean
}
export interface PointRecommendPrams {
  name: string,
  address: string,
  longitude: number,
  latitude: number,
  medias?: string[],
  reason?: string,
  toUserId?: number,
}
export interface CitySortsPrams {
  cityCode: string
}
export interface GETMapPintsPrams {
  sortId: number
  cityCode: string
}
export interface GETNearPointsParams {
  cityCode: string
  longitude: number
  latitude: number  
}
export interface GETRecommendNotesPrams {
  psaveId: number
  take?: number
  start?: number
  order?: listType
}
export interface GETRecommendPointPrams {
  psaveId: number
}
export interface GETMessageParams {
  order?: listType,
  start?: number,
  take?: number,
  type?: EMsgType
}
export interface PostReadMessageParam {
  ids: string[]
}
export interface GetNewNotesParams {
  order?: listType,
  start?: number,
  take?: number,
  type?: EMsgType
}

