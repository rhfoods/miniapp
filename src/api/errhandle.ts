import { development, isDev, production } from '@/config/http';
import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';
import { StorageNames } from '../common/constants/system.constants';
import {
  APIS,
  RequestMethod,
  ReturnStatus,
  SystemRoleTypes,
} from './types/api.constant';
import { ERRORS } from './types/error.constant';
import { IError } from './types/error.interface';

const BASE_URL = isDev ? development.baseURL : production.baseURL;

interface ICheckoutResult {
  succeed: boolean;
  data: IError | Object;
}

/**
 * 检查结果
 */
function checkResult(res): ICheckoutResult {
  const netErr = 'request:fail';

  //检查是否网络异常
  if (res.errMsg && res.errMsg.search(netErr) !== -1) {
    return {
      succeed: false,
      data: ERRORS.NETWORK_EXCEPTION,
    };
  }

  //如果后台返回异常则抛出
  if (
    res.data &&
    res.data.returnCode &&
    res.data.returnCode === ReturnStatus.ERR
  ) {
    return {
      succeed: false,
      data: res.data.message,
    };
  }

  return {
    succeed: true,
    data: res.data,
  };
}

/**
 * 当出现TOKEN失效或过期时，尝试重新请求一次
 */
async function retryRequest(retry): Promise<ICheckoutResult> {
  retry.header.Authorization =
    'Bearer ' + Taro.getStorageSync(StorageNames.TokenAccess);
  let result: any;
  try {
    const requestTask = Taro.request(retry);
    result = await requestTask;
    requestTask.abort();
  } catch (err) {
    result = err;
  }

  return checkResult(result);
}

/**
 * 刷新TOKEN操作
 */
async function updateToken(): Promise<any> {
  const code = await Taro.login();
  const req = {
    data: {
      role: SystemRoleTypes.USER,
      wxCode: {
        code: code.code,
      },
    },
    url: `${BASE_URL}${APIS.AUTH_LOGIN}`,
    header: {
      'content-type': 'application/json',
    },
    method: RequestMethod.POST,
  };

  let result: any;
  try {
    const requestTask = Taro.request(req);
    result = await requestTask;
    requestTask.abort();
  } catch (err) {
    result = err;
  }

  return checkResult(result);
}

/**
 * 处理TOKEN失效或者过期的错误
 */
async function handleTokenErr(retry): Promise<ICheckoutResult> {
  Taro.removeStorageSync(StorageNames.TokenAccess);
  const result = await updateToken();
  if (result.succeed) {
    Taro.setStorageSync(
      StorageNames.TokenAccess,
      result.data.user.token.access
    );

    //如果TOKEN更新成功，则进行一次请求重试
    return retryRequest(retry);
  } else {
    return result;
  }
}

/**
 * TOKEN失效或过期的处理函数
 */
export async function urlErrHandle(err, retry): Promise<ICheckoutResult> {
  switch (err.message.errCode) {
    case ERRORS.TOKEN_EXPIRED.errCode:
    case ERRORS.NO_UNIONID.errCode:
    case ERRORS.TOKEN_INVALID.errCode:
      return await handleTokenErr(retry);
    default:
      return {
        succeed: false,
        data: err.message,
      };
  }
}

/**
 * 界面显示错误信息
 */
export function showErrInfo(err: IError) {
  Tool.load.hide(err.errMsg);
}
