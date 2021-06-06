import CreateMapPoint from '@/pages/point-form/models';
import { HTTP } from './http';
import { APIS, RequestMethod } from './types/api.constant';
import {
  AuthLogin,
  CitySortsPrams,
  CommentLikeParams,
  CreatePointNote,
  CreatePointSort,
  DelCommentParams,
  DeleteMap,
  DeleteMedias,
  DeletePointNote,
  DeletePointSort,
  GetCommentsParams,
  GetFindNotes,
  GetMap,
  GetMapArea,
  GETMapPintsPrams,
  GetMapPoint,
  GetMapPointBase,
  GetMaps,
  GetMapScope,
  GetMedias,
  GETMessageParams,
  GETNearPointsParams,
  GetNewNotesParams,
  GetNotes,
  GetPointInfo,
  GetPointMys,
  GetPointNote,
  GetPointSaves,
  GetPointSorts,
  GETRecommendNotesPrams,
  GETRecommendPointPrams,
  GetSortPoints,
  GetSubCommentsParams,
  GetUserInfo,
  GetUserProfile,
  GETWXCodeBody,
  IUrlOptions,
  MapTransferParams,
  NoteSave,
  PatchTopNote,
  PointRecommendPrams,
  PointSave,
  POSCommentParams,
  POSTMapShareBody,
  POSTPhoneCodeBody,
  PostReadMessageParam,
  PostUserClock,
  POSTWXCodeBody,
  PutLike,
  SaveMap,
  TransferPublicParams,
  UpdatePointNote,
  UpdatePointSave,
  UpdatePointSort,
  UpdateUserInfo
} from './types/api.interface';

/**
 * 后台系统API接口
 */

/**
 * 获取点位logo
 */
export const getMediasIcons = (body = {}, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MEDIA_ICONS,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 生成图片或者视频的存储名称和对应STS
 */
export const getMedias = (body: GetMedias, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MEDIA,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 删除图片或者视频
 */
export const deleteMedias = (body: DeleteMedias, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MEDIA,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 登录认证
 */
export const authLogin = (body: AuthLogin, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.AUTH_LOGIN,
      method: RequestMethod.POST,
      useToken: false,
    },
    body,
    options
  );
};

/**
 * 通过用户ID获取地图信息
 */
export const getMap = (body: GetMap, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 根据中心点获取points
 */
export const getMapSope = (body: GetMapScope, options?: IUrlOptions) => {
  if(!body.code) {
    throw new Error('没有获取到adcode')
  }
  if(!body.sortId && body.sortId !== 0) {
    body.sortId = -1
  }
  return HTTP(
    {
      url: APIS.MAP_SCOPE,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取某个集合点下的points
 */
export const getMapArea = (body: GetMapArea, options?: IUrlOptions) => {
  if(!body.code) {
    throw new Error('没有获取到adcode')
  }
  return HTTP(
    {
      url: APIS.MAP_AREA,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};

/**
 * 通过用户ID获取极简地图信息
 */
export const getSortPoints = (body: GetSortPoints, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.SORT_POINTS,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};

/**
 * 创建点位
 */
export const createMapPoint = (body: CreateMapPoint, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_POINT,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 更新点位
 */
export const updateMapPoint = (body: any, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_POINT,
      method: RequestMethod.PUT,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 收藏地图
 */
export const saveMap = (body: SaveMap, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_SAVE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 取消地图收藏
 */
export const deleteMap = (body: DeleteMap, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_SAVE,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取部分或者全部收藏地图
 */
export const getMaps = (body: GetMaps, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_SAVES,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 创建点位分类
 */
export const createPointSort = (
  body: CreatePointSort,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_SORT,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 删除点位分类
 */
export const deletePointSort = (
  body: DeletePointSort,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_SORT,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 更新点位分类
 */
export const updatePointSort = (
  body: UpdatePointSort,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_SORT,
      method: RequestMethod.PUT,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取分类名称
 */
export const getSortInfo = (body: GetPointInfo, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_SORT,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};

/**
 * 获取部分点位分类
 */
export const getPointSorts = (body: GetPointSorts, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_SORTS,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 获取点位信息
 */
export const getMapPoint = (body: GetMapPoint, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_SAVE,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取更多的点位信息
 */
export const getMapPointBase = (
  body: GetMapPointBase,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_SAVE_BASE,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};

/**
 * 收藏别人的点位
 */
export const pointSave = (body: PointSave, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_SAVE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 取消收藏点位
 */
export const pointUnSave = (body: PointSave, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_SAVE,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 更新点位收藏
 */
export const updatePointSave = (
  body: UpdatePointSave,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_SAVE,
      method: RequestMethod.PUT,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取自己收藏的点位
 */
export const getPointSaves = (body: GetPointSaves, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_SAVES,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取自己的点位
 */
export const getPointMys = (body: GetPointMys, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_MYS,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 创建点位日记
 */
export const createPointNote = (
  body: CreatePointNote,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_NOTE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 删除点位日记
 */
export const deletePointNote = (
  body: DeletePointNote,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_NOTE,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 更新点位日记
 */
export const updatePointNote = (
  body: UpdatePointNote,
  options?: IUrlOptions
) => {
  return HTTP(
    {
      url: APIS.POINT_NOTE,
      method: RequestMethod.PUT,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取日记
 */
export const getPointNote = (body: GetPointNote, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_NOTE,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取多篇日记
 */
export const getPointNotes = (body: GetNotes, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_NOTES,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取发现更多
 */
export const getFindNotes = (body: GetFindNotes, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_FINDS,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 置顶日记
 */
export const PatchSetTop = (body: PatchTopNote, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.SETTOP,
      method: RequestMethod.PUT,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取userInfo
 */
export const GETUserInfo = (body: GetUserInfo, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.USER,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 获取userInfo DETAIL
 */
export const GETUserProfile = (body: GetUserProfile, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.USER_PROFILE,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 更新userInfo
 */
export const PUTUserInfo = (body: UpdateUserInfo, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.USER,
      method: RequestMethod.PUT,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 打卡
 */
export const USERClock = (body: PostUserClock, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.USER_CLOCK,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 点赞
 */
export const PUTNoteLike = (body: PutLike, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.NOTE_LIKE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 获取小程序二维码
 */
export const POSTWXCode = (body: POSTWXCodeBody, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.WXCODE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 验证二维码是否有效
 */
export const GETWXCode = (body: GETWXCodeBody, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.WXCODE,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 短信验证码
 */
export const POSPhoneCode = (body: POSTPhoneCodeBody, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.AUTH_SMS,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};


/**
 * 分享数据记录
 */
export const POSTMapShare = (body: POSTMapShareBody, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_SHARE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 日记收藏
 */
export const POSTNoteSave = (body: NoteSave, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.NOTE_SAVE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};

/**
 * 日记取消收藏
 */
export const DELETENoteSave = (body: NoteSave, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.NOTE_SAVE,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 扫二维码迁移
 */
export const POSTTransfer = (body: MapTransferParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_TRANSFER,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 点位迁移(选城市)
 */
export const POSTTransferPublic = (body: TransferPublicParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.TRANSFER_PUBLIC,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 发送评论
 */
export const POSComment = (body: POSCommentParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.SEND_COMMENT,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取一级评论
 */
export const GetComments = (body: GetCommentsParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.COMMENTS,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取二级评论
 */
export const GetSubComments = (body: GetSubCommentsParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.SUBCOMMENTS,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 删除评论
 */
export const DelComment = (body: DelCommentParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.DEL_COMMENT,
      method: RequestMethod.DELETE,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 评论点赞
 */
export const PostCommentLike = (body: CommentLikeParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.LIKE_COMMENT,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * form: 推荐点位
 */
export const PointRecommend = (body: PointRecommendPrams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.POINT_RECOMMEND,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取公共地图cities
 */
export const CommonMapCities = (body: any, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MAP_CITIES,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 获取当前城市的分类
 */
export const CitySorts = (body: CitySortsPrams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.CITY_SORTS,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 获取当前城市当前分类下的点
 */
export const GETMapPints = (body: GETMapPintsPrams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.SORT_P,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 获取附近的点
 */
export const GETNearPoints = (body: GETNearPointsParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.CITY_NEAR,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取日记推荐列表
 */
export const GETRecommendNotes = (body: GETRecommendNotesPrams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.RECOMMEND_NOTES,
      method: RequestMethod.GET,
      useToken: false,
    },
    body,
    options
  );
};
/**
 * 获取日记推荐列表的点位信息
 */
export const GETRecommendPoint = (body: GETRecommendPointPrams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.PROFILE_P,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取消息列表
 */
export const GETMessage = (body: GETMessageParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MESSAGE,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 告诉服务器已读哪条消息
 */
export const PostReadMessages = (body: PostReadMessageParam, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MESSAGE,
      method: RequestMethod.POST,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取消息统计信息
 */
export const GetHint = (body: any, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.HINT,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};
/**
 * 获取最新日记
 */
export const GetNewNotes = (body: GetNewNotesParams, options?: IUrlOptions) => {
  return HTTP(
    {
      url: APIS.MESSAGE_NEWS,
      method: RequestMethod.GET,
      useToken: true,
    },
    body,
    options
  );
};

