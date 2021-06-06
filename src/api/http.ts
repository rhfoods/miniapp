import Taro from '@tarojs/taro';
import { StorageNames } from '../common/constants/system.constants';
import { development, isDev, production } from '../config/http';
import { showErrInfo, urlErrHandle } from './errhandle';
import { ReturnStatus } from './types/api.constant';
import { IUrlOptions, IUrlParams } from './types/api.interface';
import { ERRORS } from './types/error.constant';

const BASE_URL = isDev ? development.baseURL : production.baseURL;

export const HTTP = function (
  params: IUrlParams,
  body: Object,
  options: IUrlOptions = {}
) {
  options = {
    showErr: showErrInfo,
    timeout: 2000,
    errHandle: urlErrHandle,
    ...options
  }
  return new Promise((reslove, reject) => {
    const header = params.useToken
      ? {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + Taro.getStorageSync(StorageNames.TokenAccess),
        }
      : {
          'Content-Type': 'application/json',
        };

    const config = Object.assign(
      {},
      {
        url: `${BASE_URL}${params.url}`,
        header,
        data: body,
        method: params.method,
        timeout: options.timeout,
      }
    );

    Taro.addInterceptor(Taro.interceptors.timeoutInterceptor);
    Taro.request({
      ...config,
      success: async (res) => {
        if (
          res.errMsg.search('request:ok') !== -1 &&
          res.data &&
          res.data.returnCode &&
          res.data.returnCode === ReturnStatus.ERR
        ) {
          const result: any = await options.errHandle(res.data, config);
          if (result.succeed) {
            reslove(result.data);
          } else {
            if (options.showErr) {
              options.showErr(result.data);
            }
            reject(result.data);
          }
        } else {
          reslove(res.data);
        }
      },
      fail: (err) => {
        const netErr = 'request:fail';
        //检查是否网络异常
        if (err.errMsg && err.errMsg.search(netErr) !== -1) {
          if (options.showErr) {
            options.showErr(ERRORS.NETWORK_EXCEPTION);
          }
          reject(ERRORS.NETWORK_EXCEPTION);
        } else {
          reject(err);
        }
      },
    });
  });
};
