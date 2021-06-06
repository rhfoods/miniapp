export interface IError {
  errCode?: number;
  errMsg?: string;
}
class Errrors {
  static unknown: IError = {
    errMsg: '服务器繁忙',
  };
}

export default Errrors;
