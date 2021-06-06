import { USERClock } from '@/api/api';
import XIcon from '@/component/icon';
import MyMap from '@/models/map';
import Theme from '@/models/theme';
import Tool from '@/utils/tools';
import { Text, View } from '@tarojs/components';
import { useDidHide, useDidShow } from '@tarojs/taro';
import classNames from 'classnames';
import React, { FC, useEffect, useRef, useState } from 'react';
import { IGoodOrBad } from '../sheet';
import Taro from '@tarojs/taro' 
import User from '@/models/user';
import { PostUserClock } from '@/api/types/api.interface';

interface IGoodOrBadd {
  className?: string;
}

let success: any;

const XGoodOrBad: FC<IGoodOrBadd> = (props) => {
  const { className } = props;
  const [show, setShow] = useState(false);
  const [maxDis] = useState(500);
  const psaveId = useRef(0);
  const noteId = useRef(null);

  const classes = classNames('c-good-bad', className, {
    none: !show,
  });

  useEffect(() => {
    Tool.goodOrBad = goodOrBad;
  }, []);
  useDidShow(() => {
    Tool.goodOrBad = goodOrBad;
  });
  useDidHide(() => {
    Tool.goodOrBad = null;
  });

  async function goodOrBad(params: IGoodOrBad) {
    const { promisic } = Tool;
    const res: any = await promisic(Taro.getSetting)();
    if (res.authSetting['scope.userLocation']) {
      alert(params);
      return
    }
    MyMap.authorize()
  }

  function alert(params: IGoodOrBad) {
    if (params.distance > maxDis && !User.info().isMarketer ) {
      Tool.load.hide(`亲，你离我太远了！要在${maxDis}米范围内打卡才可以哦！`);
      return;
    }
    if (params?.psaveId) psaveId.current = params.psaveId;
    if (params?.noteId) noteId.current = params.noteId;
    if (params?.success) success = params.success;
    setShow(true);
  }

  function onClose() {
    setShow(false);
  }
  /**
   * 点赞
   */
  async function goodTap(e) {
    e.stopPropagation();
    const param = Tool.cleanObject<PostUserClock>({
      psaveId: psaveId.current,
      noteId: noteId.current,
      feel: 'GOOD'
    })
    await USERClock(param);
    setShow(false);
    success && success('GOOD');
  }
  /**
   * 踩
   */
  async function badTap(e) {
    e.stopPropagation();
    const param = Tool.cleanObject<PostUserClock>({
      psaveId: psaveId.current,
      noteId: noteId.current,
      feel: 'BAD'
    })
    await USERClock(param);
    setShow(false);
    success && success('BAD');
  }

  return (
    <View className={classes} onClick={onClose}>
      <View className="item" onClick={goodTap}>
        <XIcon name="xin" color={Theme.red} size="60" />
        <Text>爱了</Text>
      </View>
      <View className="item" onClick={badTap}>
        <XIcon name="xinsui" color="#333333" size="60" />
        <Text>失望</Text>
      </View>
    </View>
  );
};

export default XGoodOrBad;
