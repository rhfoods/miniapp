export default {
  pages: [
    'pages/map/index', // 公共地图
    'pages/home/index', // 个人地图
    'pages/detail/index', // 点位详情/文章详情
    'pages/choose-catgray/index', // 个人地图选择分类
    'pages/choose-point/index', // 选择点位
    'pages/article-form/index', // 创建文章表单
    'pages/point-form/index', // 创建点位表单
    'pages/user/index', // 个人中心
  ],
  subpackages: [
    {
      root: 'packageA',
      name: 'packageA',
      pages: [
        'pages/wx-plantform/index',   // 嵌入到公众号/文章
        'pages/comments/index',   // 评论页面
        'pages/transfer/index', // 二维码迁移点位
        'pages/verification/index',   // 短信验证(二维码迁移点位)
        'pages/message/index',    // 消息中心
        'pages/msg-list/index',   // 消息列表(由消息中心进入)
        'pages/user-form/index',  // 用户信息表单
        'pages/upload-part/index',  // 上传视频
        'pages/recommend-form/index',   // 推荐表单
        'pages/recommend-notes/index',  // 公共地图瀑布流
        'pages/city-catgray/index',     // 公共地图选择分类
        'pages/choose-city/index',      // 选择城市
        'pages/wx-fllow/index',         // 关注公众号
        'pages/success-err/index',      // 成功失败页面(点位迁移用)
      ],
    },
  ],
  preloadRule: {
    "pages/map/index": {
      network: 'all',
      packages: ["packageA"]
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '热活',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f7f7f7',
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序定位',
    },
  },
  usingComponents: {
    // 'nativemap': './component/map/index',
  }
};
