class RecommendFormModel {

  static reasonRule(name: string, formData: any) {
    if(!formData[name]) {
      return '请填写推荐理由'
    }
    if(formData[name].length < 16) {
      return '推荐理由不能小于16个字'
    }
  }
  
}

export default RecommendFormModel