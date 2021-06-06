import { IPointForm } from '@/core/interface/nav';
import useApi from '@/hooks/use-api';
import Point from '@/models/point';
import { useEffect, useMemo, useState } from 'react';
import CreateMapPoint from './models';

const icons = [
  { name: 'moren.png', desc: '默认' },
  { name: 'kaixin.png', desc: '还不错' },
  { name: 'xingfen.png', desc: '非常棒' },
  { name: 'yiban.png', desc: '一般般' },
  { name: 'ku.png', desc: 'ku' },
  { name: 'tule.png', desc: '比较差' },
  { name: 'shengtian.png', desc: '非常差' },
  { name: 'shengqi.png', desc: 'shengqi' },
  { name: 'bingqilin.png', desc: '优质冰品' },
  { name: 'dangao.png', desc: '蛋糕点心' },
  { name: 'hanbao.png', desc: '汉堡披萨' },
  { name: 'huoguo.png', desc: '火锅串串' },
  { name: 'jiaozi.png', desc: '饺子馄饨' },
  { name: 'jiu.png', desc: '畅饮小酒' },
  { name: 'kafei.png', desc: '咖啡热饮' },
  { name: 'lajiao.png', desc: '麻辣川菜' },
  { name: 'mian.png', desc: '米粉面食' },
  { name: 'naicha.png', desc: '奶茶果汁' },
  { name: 'shaokao.png', desc: '热辣烧烤' },
  { name: 'shousi.png', desc: '日料寿司' },
  { name: 'zhongcan.png', desc: '休闲西餐' },
  { name: 'zhou.png', desc: '包子粥店' },
  { name: 'aoligei.png', desc: '奥利给' },
  { name: 'kaoyu.png', desc: 'kaoyu' },
];

function useHttp(params: IPointForm) {
  const pointInfo = useApi(Point.getPointInfoForm);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    params && getData(params);
  }, [params]);

  /**
   * 加载状态
   */
  const loading = useMemo(() => {
    if (pointInfo.loading) {
      return true;
    }
    return false;
  }, [pointInfo.loading]);
  /**
   * 获取数据
   */
  async function getData(params: any) {
    if (params?.pointInfo) {
      pointInfo.setInfo(params.pointInfo);
    } else if (params?.psaveId) {
      await pointInfo.getData({
        psaveId: params.psaveId,
      });
    }
    setFinish(true);
  }
  /**
   * 生成form
   */
  const form = useMemo(() => {
    if (!finish) return;
    if (!pointInfo.info) {
      const form = new CreateMapPoint();
      const sortId = Number(params?.sortInfo?.sortId);
      const sortName = params?.sortInfo?.title
      form.sortId = sortId > 0 ? String(sortId) : '0';
      form.sortName = sortId > 0 ? sortName : '默认分类';
      form.logo = 'moren.png';
      return form;
    }
    const formData = CreateMapPoint.server2client(pointInfo.info);
    return new CreateMapPoint(formData);
  }, [pointInfo.info, finish]);

  return {
    icons,
    point: pointInfo.info,
    form,
    loading,
    getData,
  };
}

export default useHttp;
