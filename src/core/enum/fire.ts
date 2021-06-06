enum EFire {
  // 个人地图
  updatePointHome = 'updatePointHome', // 更新点位(地图页面)
  delPointHome = 'delPointHome', // 删除点位(地图页面)
  addPointHome = 'addPointHome', // 添加点位
  setCurPHome = 'setCurPHome', // 设置curP
  setSort = 'setSort', // 修改分类名称
  setUser = 'setUser', // 更新用户信息
  // 个人页面
  addPointUser = 'addPointUser',
  delPointUser = 'delPointUser',
  updatePointUser = 'updatePointUser',
  addNoteUser = 'addNoteUser',
  delNoteUser = 'delNoteUser',
  addMap = 'addMap',
  delMap = 'delMap',
  // 地图组件
  setScale = 'setScale',
  // 公共地图
  commonRefresh = 'commonRefresh', // 刷新公共地图
}

export default EFire;
