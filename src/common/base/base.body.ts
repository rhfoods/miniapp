import { validate, ValidationError } from 'class-validator';
import { IFormDataError } from '../interfaces/error.validate';

export abstract class BaseBody {
  initData: any = {}; // 表单初始值
  constructor(data: any) {}

  /**
   * check函数仅对数据的属性、值等做检查，无法实现多个值之间的关联检查
   * 本抽象函数实现对数据的关联检查
   * example
   * deepCheck(data?: any):Promise<IFormDataError | null>{
   *  const result = this.check(data);
   *  if(!result){
   *    //对数据进行关联检查
   *  }
   * }
   * */
  abstract deepCheck(data?: any): Promise<string | null>;

  /**
   * 初始化或者重置数据
   */
  public init(data: any) {
    Object.keys(data).map((key) => {
      this[key] = data[key];
      this.initData[key] = data[key];
    });
  }

  /**
   * 对类的数据进行验证
   */
  async check(data?: any): Promise<IFormDataError | null> {
    if (data) {
      Object.keys(data).map((key) => {
        this[key] = data[key];
      });
    }
    const result: ValidationError[] = await validate(this);
    if (result && result.length > 0) {
      return {
        property: result[0].property,
        message: result[0].constraints[Object.keys(result[0].constraints)[0]],
      };
    }
    return null;
  }
  /**
   *
   */
  findDif(newForm: any) {
    let res = {};
    const oldForm = this.initData;
    Object.keys(newForm).map((key) => {
      const newValue = JSON.stringify(newForm[key]);
      const oldValue = JSON.stringify(oldForm[key]);
      if (newValue !== oldValue) {
        res[key] = newForm[key];
      }
    });
    if (Object.keys(res).length === 0) {
      return null;
    }
    return res;
  }
}
