/**
 * 系统中所有常量约束
 */
export enum SystemConstants {
  //短长度
  LITTLE_LENGTH = 16,

  //较短长度
  SMALL_LENGTH = 32,

  //普通长度
  NORMAL_LENGTH = 128,

  //较大长度
  MORE_LENGTH = 2048,

  //口令最小长度
  PWD_MIN_LENGTH = 6,

  //口令最大长度
  PWD_MAX_LENGTH = 12,

  //电话码号最小长度
  PHONE_MIN_LENGTH = 11,

  //电话号码最大长度
  PHONE_MAX_LENGTH = 13,

  //图片一次上传最小张数值
  IMAGE_UPLOAD_MIN_COUNT = 1,

  //图片一次上传最多张数值
  IMAGE_UPLOAD_MAX_COUNT = 9,

  //一次获取最多的点位数值
  POINT_MAX_COUNT = 20,

  //查询数据库一次最大返回的条目数
  SQLDB_QUERY_PAGE_COUNT_MAX = 50,

  //查询数据库一次最小返回的条目数
  SQLDB_QUERY_PAGE_COUNT_MIN = 1,

  //查询数据库一次缺省返回的条目数
  SQLDB_QUERY_PAGE_COUNT_DEFAULT = 10,
}

/**
 * 后台系统API接口列表
 */
export enum APIS {
  USER = '/user', // 用户信息
  USER_PROFILE = '/user/profile', // 用户详细信息
  USER_CLOCK = '/user/clock', // 打卡
  MEDIA = '/media', // 图片或者视频
  MEDIA_ICONS = '/media/icons', // 获取点位logo
  AUTH_LOGIN = '/auth/login', // 登录认证
  AUTH_TOKEN = '/auth/token', // 更新TOKEN
  AUTH_SMS = '/auth/sms', // 获取短信验证码
  MAP = '/map', // 地图查看
  MAP_SCOPE = '/map/scope', // 获取地图信息
  MAP_AREA = '/map/area', // 获取根据区域编码获取地图信息
  MAP_SAVE = '/map/save', // 收藏地图操作
  MAP_SAVES = '/map/saves', // 查看所有收藏的地图
  MAP_POINT = '/map/point', // 创建/更新点位
  POINT_SORT = '/map/point/sort', // 点位分类操作
  SORT_POINTS = '/map/point/sort/points', // 分类下的点位信息
  POINT_SORTS = '/map/point/sorts', // 点位分类查看
  POINT_SAVE = '/map/point/save', // 点位收藏操作
  POINT_SAVE_BASE = '/map/point/save/base', // 查看基本的点位收藏信息
  POINT_SAVES = '/map/point/saves', // 点位收藏查看
  POINT_MYS = '/map/point/mys', // 自己创建的点位
  SETTOP = '/map/point/savetop', // 置顶日记
  WXCODE = '/map/wxcode', // 小程序二维码
  MAP_SHARE = '/map/share', // 统计分享数据
  MAP_TRANSFER = '/map/transfer', // 地图迁移
  TRANSFER_PUBLIC = '/map/transfer/public', // 点位迁移
  POINT_NOTE = '/map/point/note', // 点位日志
  POINT_NOTES = '/map/point/notes', // 获取多篇日记
  NOTE_LIKE = '/map/point/note/like', // 点赞
  POINT_FINDS = '/map/point/note/more', // 获取发现更多
  NOTE_SAVE = '/map/point/note/save', //日记收藏和取消收藏
  SEND_COMMENT = '/map/point/note/comment', // 发送评论
  DEL_COMMENT = '/map/point/note/comment', // 删除评论
  COMMENTS = '/map/point/note/comments', // 获取一级评论
  SUBCOMMENTS = '/map/point/note/subcomments', // 获取二级评论
  LIKE_COMMENT = '/map/point/note/comment/like', // 点赞评论
  POINT_RECOMMEND = '/map/point/recommend', // 推荐点位
  MAP_CITIES = '/map/citys', // 获取公共地图cities
  CITY_SORTS = '/map/city/sorts', // 获取当前城市的分类
  CITY_NEAR = '/map/city/near', // 获取城市附近的点
  SORT_P = '/map/city/sort/points', // 当前城市当前分类下的点
  PROFILE_P = '/map/city/point/profile', // 推荐列表的点位信息
  RECOMMEND_NOTES = '/map/city/point/notes', // 日记推荐列表
  MESSAGE = '/message', // 消息
  MESSAGE_NEWS = '/message/news', // 消息
  HINT = '/hint', // 消息
}

/**
 * API请求返回码定义
 */
export enum ReturnStatus {
  OK = 'SUCCESS', //返回成功
  ERR = 'FAILURE', //返回失败
}

/**
 * 系统角色类型定义
 */
export enum SystemRoleTypes {
  USER = 'ur', //用户
  MERCHANT = 'mc', //商家
  ADMIN = 'ad', //系统后台管理
}

/**
 * 图片类型定义
 */
export enum MediaTypes {
  POINTNOTE_IMAGES = 'PI', //日记图片
  POINTNOTE_VIDEO = 'PV', //日记视频
}

/**
 * 点位日记外部链接类型定义
 */
export enum PointNoteLinkTypes {
  WEIBO = 'wbLink', //微博
  REDBOOK = 'xhsLink', //小红书
  BILIBILI = 'blLink', //B站
}

/**
 *  查询排序类型定义
 */
export enum SqlOrderTypes {
  ASC = 'ASC', //升序
  DESC = 'DESC', //降序
}

/**
 * HTTP请求方法
 */
export enum RequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * 点位字段长度定义
 */
export enum MapPointFieldLengths {
  TAG = 10, // 点位tag长度
  NOTE_TITLE = 20, //日记标题长度
  NOTE_CONTENT = 2000, //日记内容长度
}

/**
 * 所在地图的类型
 */
export enum MapTypes {
  MY = 'M', //自己的地图
  OTHER = 'O', //别人的地图
}
