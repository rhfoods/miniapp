import { getSortPoints } from '@/api/api';
import { SqlOrderTypes } from '@/api/types/api.constant';
import { GetSortPoints } from '@/api/types/api.interface';
import XEmpty from '@/component/empty';
import XPointInfo, { IShopInfo } from '@/component/form/point-info';
import XIcon from '@/component/icon';
import { IPointParams } from '@/core/interface/nav';
import useList from '@/hooks/use-list';
import useParams from '@/hooks/use-params';
import User from '@/models/user';
import Tool from '@/utils/tools';
import { Button, View } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import React, { FC, useEffect, useMemo, useState } from 'react';
import './index.scss';

let success: any;

const ChoosePoint: FC = () => {
  const params: IPointParams = useParams();
  const [sortId, setSortId] = useState<number>(-1); // 当前分类的id
  const [title, setTitle] = useState('全部类别');
  const [psaveId, setPSaveId] = useState<number>(); // 当前点位的id

  /**
   * 获取列表需要的参数
   */
  const data = useMemo(() => {
    const data: GetSortPoints = {
      userId: User.userId(),
      order: SqlOrderTypes.DESC,
      isNote: false,
    };
    if (sortId >= 0) data.sortId = sortId;
    return data;
  }, [sortId]);
  const list = useList(getSortPoints, 'points', data);
  /**
   * init
   */
  useEffect(() => {
    success = params?.success;
    params?.psaveId && setPSaveId(params.psaveId);
    if (params) {
      list.getMore();
    }
  }, [params]);
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    list.refresh().then(() => Taro.stopPullDownRefresh());
  });
  /**
   * 选择分类
   */
  async function chooseCatgray() {
    const { promisic, chooseCatgray } = Tool;
    const res: any = await promisic(chooseCatgray)({
      userId: User.userId(),
      showAll: true,
    });
    setSortId(res.sortId);
    setTitle(res.name);
    await list.refresh();
    Taro.pageScrollTo({ scrollTop: 0 });
  }
  /**
   * 新建点位
   */
  async function addPoint() {
    const { promisic, pointForm } = Tool
    await promisic(pointForm)({
      redirectTo: true,
      useSuccessData: true,
      sortInfo: {title, sortId}
    })
  }
  /**
   * 选择点位
   */
  async function choosePoint(point: IShopInfo) {
    Taro.navigateBack();
    await Tool.sleep(500);
    success && success(point);
  }
  /**
   * 触底
   */
  useReachBottom(() => {
    list.getMore();
  });

  if(!list.hasReq) {
    return <View></View>
  }
  /**
   * 列表
   */
  const List = list.list.map((item: any) => (
    <XPointInfo
      className="card"
      info={item}
      tapAnimation={true}
      curPointId={psaveId}
      onClick={choosePoint}
    />
  ));

  return (
    <View className="p-choose-point">
      <View className="header" onClick={chooseCatgray}>
        <View>{title}</View>
        <XIcon name="daohang" size="24" color="#1010101" />
      </View>
      {List}
      {
        List.length === 0 && !list.loading && 
        <XEmpty className="empty" info="没有可选点位" />
      }
      <View className="fix-bottom">
        <Button className="btn-long" onClick={addPoint}>
          +新建点位
        </Button>
      </View>
    </View>
  );
};

export default ChoosePoint;
