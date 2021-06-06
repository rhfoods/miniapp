import { createMapPoint, updatePointSave } from '@/api/api';
import XToast from '@/component/alert/toast';
import XForm from '@/component/form/form';
import XInput, { IInputRef } from '@/component/form/input';
import XLocation, { ILocationInfo } from '@/component/form/location';
import XPicker from '@/component/form/picker';
import XLoading from '@/component/loading';
import EFire from '@/core/enum/fire';
import { IPointForm } from '@/core/interface/nav';
import useParams from '@/hooks/use-params';
import MyMap from '@/models/map';
import Save from '@/models/save';
import Tool from '@/utils/tools';
import { Button, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import './index.scss';
import XIcons from './point-icons';
import useHttp from './use-http';

let success: any;

const AddPoint: FC = () => {
  const params: IPointForm = useParams();
  const pointName = useRef<IInputRef>();
  const data = useHttp(params);
  const sortName = useRef(null); // 如果分类被改变就一定有值
  /**
   * 初始化
   */
  useEffect(() => {
    success = params?.success;
  }, [params]);
  /**
   * add or update
   */
  const isAdd = useMemo(() => {
    if (params?.psaveId) {
      return false;
    }
    if (params?.pointInfo) {
      return false;
    }
    return true;
  }, [params]);

  useEffect(() => {
    if (!isAdd) {
      Taro.setNavigationBarTitle({ title: '修改点位' });
    }
  }, [isAdd]);
  /**
   * 点击提交按钮
   */
  async function submit(formData: any) {
    Tool.load.show('保存中...');
    let res = null;
    if (isAdd) {
      res = await addForm(formData);
      await Tool.load.hide('太好了，标记成功！');
    } else {
      res = await updateForm(formData);
      await Tool.load.hide('保存成功');
    }
    res && params?.useSuccessData && Save.setSuccessData(res);
    Taro.navigateBack();
    await Tool.sleep(500);
    res && success && success(res);
  }
  /**
   * 分类发生了改变
   */
  function sortChange(data) {
    sortName.current = data?.text;
  }
  /**
   * 添加点位
   */
  async function addForm(params: any) {
    const res: any = await createMapPoint(params);
    const point = res.point
    if(sortName.current) point.sortName = sortName.current
    Tool.onfire.fire(EFire.addPointHome, point)
    return point
  }
  /**
   * 更新点位
   */
  async function updateForm(params: any) {
    if (!params) {
      Taro.navigateBack();
      return;
    }
    params.psaveId = data.form.psaveId;
    await updatePointSave(params);
    if(sortName.current) params.sortName = sortName.current
    Tool.onfire.fire(EFire.updatePointHome, params)
    return params;
  }
  /**
   * 点位地址发生改变, 自动修改shopName
   */
  function locationChange(data: ILocationInfo) {
    pointName.current.setInput(data.name);
  }
  if (!data.form) {
    return <XLoading />;
  }

  return (
    <XForm form={data.form} onSub={submit} className="p-point">
      <XLocation 
        onChange={locationChange} 
        dis={isAdd === false} 
      />
      <XInput
        name="name"
        label="点位名称"
        ref={pointName}
        maxlength={32}
        placeholder="请输入名称"
      />
      <XInput
        name="price"
        isPrice={true}
        label="我的人均价（选填）"
        type="number"
        maxlength={6}
        unit="元"
      />
      <XInput
        name="tag"
        label="展示标签"
        placeholder="如：好吃得板的火锅！等个性描述（不超过10个字）"
        maxlength={30}
      />
      <XPicker
        name="sortId"
        label="所属分类"
        type="catgray"
        onChange={sortChange}
      />
      <XIcons name="logo" icons={data.icons} />

      <View className="fix-bottom">
        <Button className="btn-long" formType="submit">
          确定
        </Button>
      </View>

      <XToast />
    </XForm>
  );
};

export default AddPoint;
