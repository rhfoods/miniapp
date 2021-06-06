import {
  createPointSort,
  deletePointSort,
  getPointSorts,
  updatePointSort,
} from '@/api/api';
import XAlertInput from '@/component/alert/input';
import XSheet, { ISheetItemInfo } from '@/component/alert/sheet';
import XChooseCatgrayCard from '@/component/card/catgray-card/index';
import XIcon from '@/component/icon';
import EFire from '@/core/enum/fire';
import { ICatgrayParams } from '@/core/interface/nav';
import useList from '@/hooks/use-list';
import useParams from '@/hooks/use-params';
import User from '@/models/user';
import Throttle from '@/utils/throttle';
import Tool from '@/utils/tools';
import { Button, View } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import React, { FC, useEffect, useMemo, useState } from 'react';
import './index.scss';

let success: any;
enum ESheetOption {
  editor = '编辑',
  del = '删除',
}

const ChooseCatgray: FC = () => {
  const params: ICatgrayParams = useParams();
  const [curSort, setCurSort] = useState(-2);
  const page = useList(getPointSorts, 'sorts', {
    userId: params?.userId,
  });
  /**
   * init
   */
  useEffect(() => {
    success = params?.success;
    params?.userId && page.getMore();
    setCurSort(params?.sortId)
  }, [params]);
  /**
   * 是否是自己的分类列表
   */
  const isMyCategory = useMemo(() => {
    if (params?.userId && params.userId === User.userId()) {
      return true;
    }
    return false;
  }, [params?.userId]);
  /**
   * 最终显示的分类列表
   */
  const categoryList = useMemo(() => {
    const list = [
      { sortId: 0, name: '默认分类', points: page?.response?.defaultPoints },
    ];
    if (params?.showAll) {
      list.unshift({
        sortId: -1,
        name: '全部分类',
        points: page?.response?.totalPoints,
      });
    }
    if (page?.list) {
      return [...list, ...page.list];
    }
    return list;
  }, [page?.list, page?.response, params]);
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    page.refresh().then(() => Taro.stopPullDownRefresh());
  });
  /**
   * 上拉加载
   */
  useReachBottom(() => {
    page.getMore();
  });
  /**
   * 选择某一个分类
   */
  const itemTap = Throttle.delay( async (item: any) => {
    Taro.navigateBack();
    await Tool.sleep(500);
    success && success(item);
  }, 500)
  /**
   *
   */
  async function moreTap(target: any) {
    const { sheet, promisic } = Tool;
    const delOption: ISheetItemInfo = {
      key: ESheetOption.del,
      text: ESheetOption.del,
      icon: 'shanchu',
      type: 'common',
      iconColor: '#666',
      fontColor: '#666',
    };
    const editorOption: ISheetItemInfo = {
      key: ESheetOption.editor,
      text: ESheetOption.editor,
      icon: 'bianji-01',
      type: 'common',
    };
    const options: ISheetItemInfo[] = [editorOption];
    if (target.points === 0) {
      options.push(delOption);
    }
    const res: any = await promisic(sheet)({ options });
    res.key === ESheetOption.del && del(target);
    res.key === ESheetOption.editor && editor(target);
  }
  /**
   * 点击删除按钮
   */
  async function del(target: any) {
    const res = await Taro.showModal({
      title: '提示',
      content: '确定要删除此分类？',
    });
    if (res.confirm) {
      Tool.load.show('删除中...');
      await deletePointSort({ sortId: target.sortId });
      page.del(target, 'sortId');
      Tool.load.hide('删除成功');
    }
  }
  /**
   * 点击编辑按钮
   */
  async function editor(target: any) {
    const { promisic, alertInput } = Tool;
    const name: string = await promisic<string>(alertInput)({
      title: '所属分类名称',
      maxlength: 16,
      value: target.name,
    });
    const sortId: number = target.sortId;
    await updatePointSort({ sortId, name });
    target.name = name;
    page.update(target, 'sortId');
    Tool.onfire.fire(EFire.setSort, {
      sortId: target.sortId,
      sortName: target.name,
      total: target.points,
    })
  }
  /**
   * 点击按钮: 新建分类
   */
  async function addCatgray() {
    const { promisic, alertInput } = Tool;
    const nam = await promisic(alertInput)({
      title: '所属分类名称',
      maxlength: 16,
    });
    const name = nam as string;
    const res: any = await createPointSort({ name });
    page.add(res.sort);
  }

  return (
    <View className="p-choose-catgray">
      {categoryList.map((item: any) => (
        <XChooseCatgrayCard
          info={item}
          className={item.sortId === curSort ? 'card cur' : 'card'}
          onClick={itemTap}
          onRightTap={moreTap}
          right={
            isMyCategory && item?.sortId >= 1 && 
            <XIcon name="gengduo" size="16" className="menu" color="#888888" />
          }
        />
      ))}

      {isMyCategory && (
        <View className="fix-bottom">
          <Button className="btn-long" onClick={addCatgray}>
            +新建分类
          </Button>
        </View>
      )}

      <XSheet />
      <XAlertInput />
    </View>
  );
};

export default ChooseCatgray;
