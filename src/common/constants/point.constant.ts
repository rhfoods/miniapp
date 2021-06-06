/**
 * 点位所属关系类型定义
 */
export enum PointOwnTypes {
  MY_CREATE = 'C', // 自己创建的
  SAVE_FIND = 'F', // 收藏别人，并写了日记
  ONLY_SAVE = 'S', // 仅收藏
  NOT_SAVE = 'N', // 未收藏
}

/**
 * 点位底部button命名
 */
export enum ButtonNames {
  SHARE = '分享',
  DELETE = '删除',
  FIND = '发现', // 添加note
  CLOCK = '打卡',
  CLOCKED = '已打卡',
  COMMENT = '评论',
  LIKE = '点赞',
  UNLIKE = '已点赞',
  MODIFY = '修改',
  SAVE = '想去', // 收藏
  UNSAVE = '取消收藏', // 取消收藏
  MYSELF = '我的', //我的日记
  DETAIL = '详情页', // 打开详情页
}
