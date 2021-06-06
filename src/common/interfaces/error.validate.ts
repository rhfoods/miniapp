/**
 * 使用class-validator对表单进行验证的错误数据定义
 */
export interface IFormDataError {
  property: string; //表单项
  message: string; //错误信息
}
