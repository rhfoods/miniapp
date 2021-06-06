import { ICRule } from "."

class CFormModel {
  /**
   * 
   */
  static checkIitem(name: string, rule: ICRule, formData: any): string {
    if(!formData) {
      return '表单内容为空'
    }
    if(!rule) {
      return ''
    }
    if(rule.message) {
      return CFormModel.checkMsg(name, rule, formData)
    }else {
      return CFormModel.checkFn(name, rule, formData)
    }
  }
  /**
   * 检查: {required, message}
   */
  static checkMsg(name: string, rule: ICRule, formData: any): string {
    if(rule.required && !formData[name]) {
      return rule.message
    }
  }
  /**
   * 检查: {required, fn}
   */
  static checkFn(name: string, rule: ICRule, formData: any): string {
    if(rule.required) {
      return rule.fn(name, formData)
    }
    if(!rule.required && formData[name]) {
      return rule.fn(name, formData)
    }
  }
}

export default CFormModel