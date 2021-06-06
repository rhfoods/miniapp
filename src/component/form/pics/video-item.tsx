import XVedio from '@/component/video';
import Media from '@/models/media';
import { View } from '@tarojs/components';
import React, { FC, useState } from 'react';
import { AtIcon } from 'taro-ui';
import { IFile } from '.';

interface IVedioItem {
  file: IFile;
  onDel: (mediaName: string) => void;
}

const XVedioItem: FC<IVedioItem> = (props) => {
  const { file, onDel } = props;
  const [closeShow, setCloseShow] = useState(false);

  return (
    <View className="c-video">
      {file?.picName && (
        <XVedio
          id="formVideo"
          src={Media.picUrl(file.picName)}
          onReady={() => setCloseShow(true)}
        />
      )}
      {closeShow && (
        <View className="v-close" onClick={() => onDel(file.picName)}>
          <AtIcon value="close" color="#fff" size="16" />
        </View>
      )}
    </View>
  );
};

export default XVedioItem;
