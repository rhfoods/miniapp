import Media from "@/models/media"

class PlantFormModel {
  static article = [
    {
      title: '1.嵌入小程序（选择插入小程序）',
      pic: Media.staticUrl('explain/article1.png')
    },{
      title: '2.搜索热活小程序',
      pic: Media.staticUrl('explain/article2.png')
    },{
      title: '3.输入小程序路径、选择展示方式',
      pic: Media.staticUrl('explain/article3.png')
    }
  ]
  static tablist = [
    {
      title: '1.选择小程序管理并添加',
      pic: Media.staticUrl('explain/wx-tab1.png')
    },{
      title: '2.选择关联小程序',
      pic: Media.staticUrl('explain/wx-tab2.png')
    },{
      title: '3.搜索热活小程序',
      pic: Media.staticUrl('explain/wx-tab3.png')
    },{
      title: '4.选择自定义菜单-跳转小程序-选择小程序',
      pic: Media.staticUrl('explain/wx-tab4.png')
    },{
      title: '5.输入小程序路径',
      pic: Media.staticUrl('explain/wx-tab5.png')
    },
  ]
}

export default PlantFormModel