import { getMedias } from '@/api/api';
import { MediaTypes } from '@/api/types/api.constant';
import { ISts } from '@/core/interface/form';
import Media from '@/models/media';
import Save from '@/models/save';
import Tool from '@/utils/tools';
import { Checkbox, CheckboxGroup, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { AtIcon } from 'taro-ui';
import { FormCxt } from '../form';
import './index.scss';
import XPicItem from './pic-item';
import useLoading from './use-loading';
import XVedioItem from './video-item';

type TType = 'pic' | 'video';

export interface IFile {
  picName: string;
  tmp?: string;
  sts?: ISts;
}
interface IPics {
  name: string;
  onLoading?: (status: boolean) => void;
}
export interface IPicsRef {
  addPic: () => any;
  addVideoPart: () => any;
}

const XPics = forwardRef<IPicsRef, IPics>((props, ref) => {
  const [pics, setPics] = useState<IFile[]>([]);
  const [videos, setVideos] = useState<IFile[]>([]);
  const [type, setType] = useState<TType>('video');
  const { form } = useContext(FormCxt);
  const loadingList = useLoading();

  /**
   * 初始化
   */
  useEffect(() => {
    if (!form?.medias) {
      return;
    }
    const medias = form.medias;
    if (medias.length === 0) {
      return;
    }
    if (Media.isVideo(medias)) {
      const videoes = medias.map((picName: string) => ({ picName }));
      setVideos([...videoes]);
      setType('video');
      return;
    }
    const pics = medias.map((picName: string) => ({ picName }));
    setPics([...pics]);
    setType('pic');
  }, []);
  /**
   * 告诉外界自己是否正在上传图片
   * 如果正在上传禁止提交
   */
  useEffect(() => {
    props.onLoading(loadingList.uploading);
  }, [loadingList.uploading]);
  /**
   *
   */
  const files = useMemo(() => {
    if (type === 'video') return videos;
    if (type === 'pic') return pics;
  }, [pics, videos, type]);
  /**
   *
   */
  const classes = classNames('c-pic', {
    none: files.length <= 0,
  });
  /**
   *
   */
  useImperativeHandle(
    ref,
    () => ({
      addPic,
      addVideoPart,
    }),
    []
  );
  /**
   * 预览图片
   */
  function prePic(index: number) {
    const urls = pics.map((pic: IFile) => {
      if (pic.tmp) return pic.tmp;
      return Media.picUrl(pic.picName);
    });
    Taro.previewImage({
      urls,
      current: urls[index],
    });
  }
  /**
   * 点击删除按钮
   */
  async function del(picName: string, type: TType) {
    if (type === 'pic') {
      const newFiles = pics.filter((pic) => pic.picName !== picName);
      setPics([...newFiles]);
    }
    if (type === 'video') {
      setVideos([]);
    }
    Save.delMedias.push(picName);
  }
  /**
   * 分片上传视频
   */
  async function addVideoPart() {
    const { promisic, uploadVideo } = Tool;
    const res: any = await promisic(uploadVideo)({});
    if (res.returnCode === 'FAILURE') {
      Tool.load.alert(res.reason);
      return;
    }
    const file = {
      picName: res.fileName,
    };

    setVideos((videos: IFile[]) => {
      videos.length > 0 && Save.delMedias.push(videos[0].picName);
      return [file];
    });
    setPics((pics) => {
      pics.map((item) => {
        Save.delMedias.push(item.picName);
      });
      return [];
    });
    setType('video');

    Save.newMedias.push(file.picName);
  }
  /**
   * 添加图片
   */
  async function addPic() {
    const result: any = await Taro.chooseImage({
      sizeType: ['compressed'],
      count: 9 - files.length,
    });
    let filePaths: any[] = await Media.compress(result.tempFiles);
    setVideos((videos) => {
      const fileName = videos[0]?.picName;
      fileName && Save.delMedias.push(fileName);
      return [];
    });
    setType('pic');
    const { medias, sts } = await getName(
      filePaths.length,
      MediaTypes.POINTNOTE_IMAGES
    );
    const newTmps = filePaths.map((item, index) => ({
      picName: medias[index],
      tmp: item,
      sts,
    }));

    setPics((files) => [...files, ...newTmps]);
    Save.newMedias.push(...medias);
  }
  /**
   * 获取图片名, sts
   */
  async function getName(counts: number, type: MediaTypes) {
    const res: any = await getMedias({ type, counts });
    return {
      medias: res.medias,
      sts: res.sts,
    };
  }
  /**
   * 图片列表
   */
  const Pics = (
    <View className="c-pics">
      {pics.map((file: IFile, index: number) => (
        <XPicItem
          file={file}
          onDel={(fileName) => del(fileName, 'pic')}
          onBegin={() => loadingList.add()}
          onFinish={() => loadingList.pop()}
          onClick={() => prePic(index)}
        />
      ))}
      {files.length < 9 && (
        <View onClick={addPic} className="add">
          <AtIcon value="add" size="36" color="#f1f1f1" />
        </View>
      )}
    </View>
  );
  /**
   * <FormItem />
   */
  const FormItem = (
    <CheckboxGroup name={props.name} className="none">
      {files.map((file: IFile) => (
        <Checkbox value={file.picName} checked />
      ))}
    </CheckboxGroup>
  );

  return (
    <View className={classes}>
      {type === 'pic' ? (
        Pics
      ) : (
        <XVedioItem
          file={videos[0]}
          onDel={(fileName) => del(fileName, 'video')}
        />
      )}
      {FormItem}
    </View>
  );
});

export default XPics;
