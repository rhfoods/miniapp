import { MediaTypes } from '@/api/types/api.constant';
import { ISts } from '@/core/interface/form';
import Media from '@/models/media';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import React, {
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AtIcon } from 'taro-ui';
import { FormCtx, ICRule } from '../form';
import XPicItem from './pic-item';
import useLoading from './use-loading';
import './index.scss';
import { deleteMedias } from '@/api/api';

export interface IFile {
  picName: string;
  tmp?: string;
  sts?: ISts;
}
interface IMedias {
  name: string;
  exp: IMediasAction;
  rule: ICRule;
  onLoading?: (status: boolean) => void;
}
export interface IMediasAction {
  addPic: () => any;
  addVideoPart: () => any;
  setNewPics: React.Dispatch<React.SetStateAction<string[]>>;
  newPics: string[];
  newImgs: React.MutableRefObject<string[]>;
}

const CMedias: FC<IMedias> = (props) => {
  const { name, exp, onLoading, rule } = props
  const [pics, setPics] = useState<IFile[]>([]);
  const form = useContext(FormCtx);
  const loadingList = useLoading();
  const classes = classNames('c-medias', {
    none: pics.length <= 0,
  });
  /**
   * 上传规则
   */
  useEffect(() => {
    form.setRules(rules => ({
      ...rules,
      [name]: rule  
    }))
  }, [])
  /**
   * 初始化同步数据pics
   */
  useEffect(() => {
    const medias = form.data[name];
    if (!medias || !medias.length) {
      return;
    }
    if(pics.length===0 && medias.length) {
      const items = medias.map((picName: string) => ({ picName }));
      setMedias(items)
    }
  }, [form.data]);
  /**
   * 告诉外界自己是否正在上传图片
   * 如果正在上传禁止提交
   */
  useEffect(() => {
    onLoading && onLoading(loadingList.uploading);
  }, [loadingList.uploading]);
  /**
   * 添加/删除图片用
   */
  function setMedias(medias: IFile[]) {
    setPics([...medias])
    form.setData(data => ({
      ...data,
      [name]: medias.map(item => item.picName)
    }))
  }
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
  async function del(picName: string) {
    const newFiles = pics.filter((pic) => pic.picName !== picName);
    setMedias(newFiles);
    const target = exp.newPics.find(item => item === picName);
    await deleteMedias({ medias: [target] });
    exp.setNewPics(pics => {
      return [...pics].filter(item => item !== picName);
    })
  }
  /**
   * 添加图片
   */
  exp.addPic = async () => {
    const result: any = await Taro.chooseImage({
      sizeType: ['compressed'],
      count: 9 - pics.length,
    });
    let filePaths: any[] = await Media.compress(result.tempFiles);
    const { medias, sts } = await Media.getName(
      filePaths.length,
      MediaTypes.POINTNOTE_IMAGES
    );
    const newTmps = filePaths.map((item, index) => ({
      picName: medias[index],
      tmp: item,
      sts,
    }));
    setMedias([...pics, ...newTmps])
    exp.setNewPics(pics => {
      return [...pics, ...medias]
    })
    // 添加完图片需要删除已经上传的视频
  }
  /**
   * 图片列表
   */
  const Pics = (
    <View className="c-pics">
      {
        pics.map((file: IFile, index: number) => <XPicItem
          file={file}
          onDel={(fileName) => del(fileName)}
          onBegin={() => loadingList.add()}
          onFinish={() => loadingList.pop()}
          onClick={() => prePic(index)}
        />)
      }{
        pics.length < 9 && 
        <View onClick={exp.addPic} className="add">
          <AtIcon value="add" size="36" color="#f1f1f1" />
        </View>
      }
    </View>
  )
  return (
    <View className={classes}>{Pics}</View>
  );
}

export const useMedias = (): IMediasAction => {

  const [newPics, setNewPics] = useState<string[]>([])
  const newImgs = useRef<string[]>([])

  useEffect(() => {
    newImgs.current = newPics
  }, [newPics])

  return {
    addPic: null,
    addVideoPart: null,
    newImgs,
    newPics,
    setNewPics,
  }
}

export default CMedias;
