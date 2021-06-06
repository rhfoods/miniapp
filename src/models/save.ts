import { IPageListExp } from "@/hooks/usePageList";

class Save {
  static data: any; // 页面跳转传参用
  static successData: any; // 表单页面传输数据用
  static curSubComment: IPageListExp<any>; // 正则被评论的二级评论列表
  static newMedias: string[] = [];
  static delMedias: string[] = [];

  static setParams(data: any) {
    Save.data = data;
  }

  static getParams() {
    const data = Save.data;
    Save.data = null;
    return data;
  }

  static setSuccessData(data: any) {
    Save.successData = data;
  }

  static getSuccessData() {
    const data = Save.successData;
    Save.successData = null;
    return data;
  }
}

export default Save;
