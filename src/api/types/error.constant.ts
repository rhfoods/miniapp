import { IErrorArray } from './error.interface';

export const ERRORS: IErrorArray = {
  /**
   * 系统相关错误
   */
  NETWORK_EXCEPTION: {
    errCode: -1,
    errMsg: '亲，现在网络好像不太好~~',
  },
  INTERNAL_SERVER_ERROR: {
    errCode: 30000,
    errMsg: '服务器开小差去了，稍后再试',
  },
  ENVIRONMENT_NOTMATCHED: {
    errCode: 30001,
    errMsg: '令牌请求与运行环境不一致',
  },
  TOKEN_INVALID: {
    errCode: 30002,
    errMsg: '令牌无效',
  },
  NO_UNIONID: {
    errCode: 30012,
    errMsg: '缺少unionId',
  },
  RESOURCE_NOTFINDED: {
    errCode: 30003,
    errMsg: '请求的资源不存在',
  },
  RESOUCE_ROLE_INVALID: {
    errCode: 30004,
    errMsg: '资源访问权限无效',
  },
  PARAMS_INVALID: {
    errCode: 30005,
    errMsg: '错误的参数输入',
  },
  TOKEN_EXPIRED: {
    errCode: 30006,
    errMsg: '令牌过期',
  },
  RESOURCE_DUP: {
    errCode: 30007,
    errMsg: '资源重复',
  },
  QUERY_INVALID: {
    errCode: 30008,
    errMsg: '错误的查询参数输入',
  },
  TOKEN_ROLE_INVALID: {
    errCode: 30009,
    errMsg: '令牌访问权限无效',
  },
  RESOURCE_EXIST: {
    errCode: 30010,
    errMsg: '资源存在',
  },
};
