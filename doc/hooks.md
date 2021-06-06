hooks

## useApi
获取数据
```js
const {
    info,
    loading,
    err,
    finish,
    setInfo,
    getData
} = useApi(getCities)

async function getCities() {
    const res: any = await CommonMapCities({})
    return res.citys
}
```
params | 说明
---|---
callback  |   获取数据函数

return | 说明
---|---
info    |   object: 要获取的数据
loading |   boolean: 是否正在获取数据
err     |   string: 获取数据失败后的错误信息
finish  |   boolean:是否获取过数据
setInfo |   fn: 修改本地数据
getData |   fn: 获取数据

## useAuthorize
获取收取信息
```js
const {
    user,
    location,
    refresh
} = useAuthorize();
```
return | 说明
---|---
user    |   boolean: 是否授权了用户信息
location|   boolean: 是否授权了位置信息
refresh |   fn: 重新获取授权信息

## usePageList
分页加载
```js
const {
    list,
    more,
    empty,
    amount,
    hasReq,
    setPage,
    getMore,
    add,
    del,
    refresh,
} = usePageList<GetCommentsParams>(req, data, listName)
```

params | 说明
---|---
req | 获取数据函数
data| 请求携带的参数
listName | 返回列表的名字

return | 说明
---|---
list| 列表数据
more| 是否有更多的数据
empty| 列表是否为空
amount| 列表总数
hasReq| 是否发起过请求
setPage|  fn: 修改列表数据
getMore|  fn: 获取更多列表数据
add|  fn: 往列表中添加数据
del|  fn: 删除列表中的数据
refresh|  fn: 刷新列表

## useLogin
登录
```js
const {
    state,
    info,
    setInfo,    
} = useLogin()
```

return | 说明
---|---
state   |   'loading' ; 'success' ; 'err'
info    |   用户信息
setInfo |   fn: 修改用户信息

state

type | 说明
---|---
loading     |   '正在获取用户信息'
success     |   '获取数据成功'
err         |   '获取数据失败'

## useMap
地图控制
```js
const {
    latitude,
    longitude,
    scale,
    markers,
    isOld,
    mapId,
    update,
    setS,
    init,
    moveTo,
    eventInit,
    renderMap,
} = useMap(points, curPoint, theme, 'PO', true)
```

params | 说明
---|---
points      | 地图上的点 IPoint[]
curPoint    | 被点亮的点 IPoint
theme       | 地图样式 'black';'white'
type        | 点位类型 'PR';'CI';'CO';'PO'
joinCluster | boolean: 是否开启聚合功能


return | 说明
---|---
latitude | 经纬度
longitude | 经纬度
scale | 比例尺
markers | 地图上的点
isOld | 是否为老版本微信
mapId | 地图id
update | fn: 更新地图数据
setS |  fn: 设置地图比例
init |  fn: 初始化地图数据
moveTo | fn: 移动地图中心点
eventInit | fn: 地图组件初始化
renderMap | fn: 渲染地图上的点


## useParams

获取页面参数

```js
const params = useParams()
```

## useSystem
地图控制
```js
const {
    isIphoneFull,
    isIphone,
    model,
    brand
} = useSystem()
```

return | 说明
---|---
isIphoneFull    |   boolean: 是否是全面屏iPhone
isIphone        |   boolean: 是否是iPhone
model           |   string: 手机型号
brand           |   string: 手机品牌


## useUserLocation
地图控制
```js
const {
    distance,
    getDis,
} = useUserLocation()
```

params | 说明
---|---
point    | IPoit: 被计算的点

return | 说明
---|---
distance    | number: 距离该点的距离
getDis      | fn: 计算出距离该点的距离

