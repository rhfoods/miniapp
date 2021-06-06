import { createPointNote, deleteMedias, updatePointNote } from '@/api/api';
import { PointNoteLinkTypes } from '@/api/types/api.constant';
import XAlertInput from '@/component/alert/input';
import XAlertPic from '@/component/alert/pic';
import XToast from '@/component/alert/toast';
import XForm from '@/component/form/form';
import XInput from '@/component/form/input';
import XInputLink from '@/component/form/input-link';
import XPics, { IPicsRef } from '@/component/form/pics';
import XPointInfo, { IPointInfoRef } from '@/component/form/point-info';
import XRecommendNote from '@/component/form/recommend-note';
import XTags from '@/component/form/tags';
import XTextarea from '@/component/form/textarea';
import XIcon from '@/component/icon';
import XAddBtn from '@/component/icon-btn';
import XLoading from '@/component/loading';
import XPoster from '@/component/poster';
import { IArticleForm } from '@/core/interface/nav';
import useParams from '@/hooks/use-params';
import Media from '@/models/media';
import Save from '@/models/save';
import Theme from '@/models/theme';
import Tool from '@/utils/tools';
import { Button, View } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import './index.scss';
import useHttp from './use-http';

let success: any;

const PArticleForm: FC = () => {
  const params: IArticleForm = useParams();
  const data = useHttp(params);
  const medias = useRef<IPicsRef>();
  const pointInfo = useRef<IPointInfoRef>();
  const [uploading, setUploading] = useState(false); // 是否真正上传图片/视频
  const newNoteData = useRef(null);
  const pointData = useRef(null); // 如果点位信息被就该了, 这个就有值
  const isOnSub = useRef(false);

  /**
   * 生命周期函数
   */
  useEffect(() => {
    return () => {
      async function action() {
        if (isOnSub.current) {
          if (Save.delMedias.length > 0) {
            await deleteMedias({ medias: Save.delMedias });
          }
        } else {
          if (Save.newMedias.length > 0) {
            await deleteMedias({ medias: Save.newMedias });
          }
        }
        Save.newMedias = [];
        Save.delMedias = [];
      }
      action()
    };
  }, []);
  /**
   * 初始化
   */
  useEffect(() => {
    success = params?.success;
  }, [params]);
  /**
   *
   */
  useEffect(() => {
    if (data.pointInfo) pointData.current = data.pointInfo;
  }, [data.pointInfo]);
  /**
   * unmount
   */
  useEffect(() => {
    return () => {
      success &&
        success({
          form: newNoteData.current,
          point: pointData.current,
        });
    };
  }, []);
  /**
   * 选择点位 --> 添加点位 --> 确定
   */
  useDidShow(() => {
    const point = Save.getSuccessData();
    point && pointInfo.current.setPointInfo(point);
  });
  /**
   * 表单状态
   */
  const isAdd = useMemo(() => {
    if (data?.form?.noteId) {
      return false;
    }
    return true;
  }, [data?.form?.noteId]);
  /**
   * 提交表单
   */
  function onSub(formData: any) {
    async function sub(point: any) {
      if (uploading) {
        Tool.load.hide('图片/视频正在上传中');
        return;
      }
      if (isAdd) {
        await add(formData, point);
      } else {
        await update(formData, point);
      }
    }
    sub(pointInfo.current.point.current);
    isOnSub.current = true;
  }
  /**
   * 添加文章
   */
  async function add(params: any, point: any) {
    Tool.load.show('保存中...');
    let res: any = await createPointNote(params);
    if(params.isRecom) {
      await Tool.load.hide();
      await Taro.showModal({
        content: '推荐已同步到公共地图，审核通过后吃货们就能看到啦！',
        showCancel: false
      })
    }else {
      await Tool.load.hide('保存成功');
    }
    newNoteData.current = res?.note;
    pointData.current = point;
    navTo(point);
  }
  /**
   * 修改文章
   */
  async function update(params: any, point: any) {
    if (!params) {
      Taro.navigateBack();
      return;
    }
    params.noteId = data?.form?.noteId;
    Tool.load.show('保存中...');
    await updatePointNote(params);
    await Tool.load.hide('保存成功');
    newNoteData.current = { ...newNoteData.current, ...params };
    pointData.current = point;
    navTo(point);
  }
  /**
   * 提交表单后返回上一个页面
   * 提交表单后去文章详情页面
   */
  function navTo(point) {
    if (!params.openDetail) {
      Taro.navigateBack();
      return;
    }
    const topNote = newNoteData.current;
    topNote.updatedAt = new Date().toISOString();
    Tool.detail({
      psaveId: point?.psaveId,
      redirectTo: true,
      userId: Tool.userId(),
    });
  }
  /**
   * 添加图片
   */
  async function addPic() {
    await medias.current.addPic();
  }
  /**
   * 添加视频
   */
  async function addVideo() {
    await medias.current.addVideoPart();
  }
  /**
   * 指定点位
   */
  async function choosePoint() {
    const point = await pointInfo.current.choose();
    pointData.current = point;
  }
  /**
   * 更新点位
   */
  async function updataPoint() {
    if(params.cantNotUpdatePoint) {
      return
    }
    const point = await pointInfo.current.update();
    pointData.current = point;
  }
  /**
   * 点击 input-link 问号
   */
  function questionTap(name: PointNoteLinkTypes) {
    name === PointNoteLinkTypes.BILIBILI &&
      Tool.alertPic({ url: Media.staticUrl('explain/bili.png') });
    name === PointNoteLinkTypes.WEIBO &&
      Tool.alertPic({ url: Media.staticUrl('explain/weibo.png') });
    name === PointNoteLinkTypes.REDBOOK &&
      Tool.alertPic({ url: Media.staticUrl('explain/xhs.png') });
  }

  if (!data.form) {
    return <XLoading />;
  }

  return (
    data.form && (
      <XForm form={data.form} className="p-article" onSub={onSub}>
        <XInput
          className="note-title"
          placeholder="标题"
          name="title"
          maxlength={20}
          left={
            <Button className="btn-s" formType="submit">
              发表
            </Button>
          }
        />
        <XTextarea placeholder="输入正文..." name="content" />
        <View className="addBtns">
          <XAddBtn
            icon="zhaopian"
            text="照片"
            iconColor="#ff7505"
            onClick={addPic}
          />
          <XAddBtn
            icon="xiangji"
            text="视频"
            iconColor={Theme.red}
            onClick={addVideo}
          />
          {params?.showChoosePoint && (
            <XAddBtn
              icon="weizhi1"
              text="选择点位"
              iconColor="#061c2d"
              onClick={choosePoint}
            />
          )}
        </View>
        <XPics name="medias" onLoading={setUploading} ref={medias} />
        {
          pointInfo && 
          <XPointInfo
            name="psaveId"
            ref={pointInfo}
            className="point-info"
            onClick={updataPoint}
          />
        }{
          !params.hideRecommend &&
          <XRecommendNote 
            lab='推荐到公共地图' 
            name='isRecom' 
          />
        }
        <XTags lab="适用场景" name="scenes" />
        <View className="title">链接更多</View>
        <XInputLink
          className="input-link"
          name={PointNoteLinkTypes.BILIBILI}
          placeholder="请输入哔哩哔哩相关视频号"
          onTapQuestion={questionTap}
          icon={
            <XIcon name="bilibili" colorFull size="16" className="icon-diy" />
          }
        />
        <XInputLink
          className="input-link"
          name={PointNoteLinkTypes.WEIBO}
          placeholder="请输入微博相关链接"
          onTapQuestion={questionTap}
          icon={<XIcon name="weibo" colorFull size="16" className="icon-diy" />}
        />
        {/* <XInputLink
          className="input-link"
          name={PointNoteLinkTypes.REDBOOK}
          placeholder="请输入小红书相关链接"
          onTapQuestion={questionTap}
          icon={ <XIcon name="xiaohongshu" colorFull size="16" className="icon-diy" /> }
        /> */}
        <XToast />
        <XAlertPic />
        <XAlertInput />
        <XPoster />
      </XForm>
    )
  );
};

export default PArticleForm;
