export const development = {
  // baseURL: 'http://192.168.5.56:3003/api/v1',
  baseURL: 'https://www.ukshare.cn/api/v1',
  static: 'https://rehuo-icons.oss-cn-chengdu.aliyuncs.com',
  user: 'https://ukshare-s-t.oss-cn-chengdu.aliyuncs.com',
  mapKey: 'xxxx-xxxx-xxxx-xxxx-xxxx'
};

export const production = {
  baseURL: 'https://bfx.kim/api/v1',
  static: 'https://rehuo-app.oss-cn-chengdu.aliyuncs.com',
  user: 'https://rehuo-map.oss-cn-chengdu.aliyuncs.com',
  mapKey: 'xxxx-xxxx-xxxx-xxxx-xxxx'
};

export enum path {
  unclocked = 'unclocked',
  clocked = 'clocked',
}

export const isDev = false;
