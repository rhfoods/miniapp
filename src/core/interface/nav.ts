import { EMsgType } from "@/context/message-ctx";
import { ICommonSort } from "@/pages/map/use-com-sort";

export interface ISucFail {
  success?: (data: any) => void;
  faill?: (data: any) => void;
  [propname: string]: any;
}
/**
 * 打开点位表单
 */
export interface IPointForm extends ISucFail {
  psaveId?: number;
  pointInfo?: any;
  redirectTo?: boolean; // 关闭当前页面打开 point form
  useSuccessData?: boolean; // 是否通过 Save.successData 传递数据
  sortInfo?: {sortId: number, title: string}; // 默认分类value
}
export interface IRecommendFormParams extends ISucFail {
  toUserId: number
}
/**
 * 打开点位详情
 */
export interface IPointDetail {
  canSave?: 0 | 1; // 显示收藏按钮, 就不显示编辑按钮
  psaveId?: number;
  pointInfo?: any;
}
/**
 * 打开文章表单
 */
export interface IArticleForm {
  psaveId?: number; // 获取文章信息, 点位信息都用这个id
  noteId?: number;
  noteInfo?: any; // 文章详情, 本地数据
  pointInfo?: any; // 文章对应的点位信息
  openDetail?: boolean; // 直接跳转到文章详情页面
  showChoosePoint?: boolean; // 只有从地图页面添加点位时才显示选择点位
  redirectTo?: boolean; // 关闭当前页面打开表单
  cantNotUpdatePoint?: boolean; // 是否可以更新点位
  hideRecommend?: boolean; // 隐藏同步到公共地图
  [propname: string]: any;
}
/**
 * 打开文章详情页面
 */
export interface IArticleDetail {
  userId: number; // 被查看者的id
  psaveId?: number; // 点位id
  topNoteId?: number;
  topNote?: any;
  pointDetail?: any;
  redirectTo?: boolean; // 关闭当前页面打开表单
  hideMore?: boolean;
  count?: number;
  hideTab?: boolean; // 隐藏底部导航(从别人的个人中心打开详情页)
  saveTap?: () => void; // 收藏文章cb
}
/**
 * 选择分类的传入参数
 */
export interface ICatgrayParams extends ISucFail {
  userId: number;
  showAll?: boolean; // 是否显示所有分类按钮
  sortId?: number; // 被选中的分类sortId
}
/**
 * 选择公共地图分类的传入参数
 */
export interface ICommonCatgrayParams extends ISucFail {
  sort: ICommonSort
}
/**
 * 选择城市
 */
export interface IChooseCity extends ISucFail {
  type: 'simple' | 'detail',
  donotBack?: boolean,
}
/**
 * 选择分类的返回值
 */
export interface ICatgrayReturn {
  sortId: number;
  name: string;
}
/**
 * 选择点位的传入参数
 */
export interface IPointParams {
  psaveId?: number; // 被选中的点位id
  [propname: string]: any;
}
/**
 * 打开首页地图
 */
export interface IHomeParams {
  curPoint?: any; // 被选中的点位
  userId?: number; // 传了就有这个id获取点位, 没传就storage里的userId
  sortId?: number;
  showBack?: boolean; // 是否显示 back 按钮
  reLaunch?: boolean;
  latitude?: number;
  longitude?: number;
  phone?: number; // 数据迁移用
}
/**
 * 打开首页地图
 */
export interface ICommonMapParams {
  sortId?: number;
  cityCode?: number;
  reLaunch?: boolean;
  latitude?: number;
  longitude?: number;
  phone?: number; // 数据迁移用
}
/**
 * 打开个人主页
 */
export interface IPageUserParams {
  userId?: number;
}
/**
 * 打开消息列表
 */
export interface IOpenMsgList {
  msgType: EMsgType // 消息类型
}
/**
 * 打开评论列表
 */
export interface IAlertComment {
  total?: number
  noteId: number
  [propname: string]: any;
}
/**
 * 打开推荐列表
 */
export interface IRecommendNotes {
  psaveId: number
  [propname: string]: any;
}
/**
 * 打开: 嵌入公共号
 */
export interface IOpenEmbed {
  path: string,
  userId?: number,
  sortId?: number,
  cityCode?: string,
}
/**
 * 打开: 成功失败页面
 */
export interface ISuccessFailPage extends ISucFail {
  type: 'success' | 'fail'
  info: string
  subInfo?: string
  list?: string[]
  redirect?: boolean // 关闭当前页面打开下一个页面
  dontBack?: boolean // 点击确定后不返还上一个页面
}
