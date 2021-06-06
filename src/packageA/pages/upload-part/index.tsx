import { StorageNames } from '@/common/constants/system.constants';
import { ISucFail } from '@/core/interface/nav';
import useParams from '@/hooks/use-params';
import Media from '@/models/media';
import { WebView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, { useEffect, useState } from 'react';

let success: any;

const PUploadPart = () => {
  const [src, setSrc] = useState('');
  const params: ISucFail = useParams();

  /**
   * init
   */
  useEffect(() => {
    success = params?.success;
  }, [params]);

  useEffect(() => {
    const token = Taro.getStorageSync(StorageNames.TokenAccess);
    const bucket = Media.getBucket();
    const url = Media.getUrl();
    let src = 'https://' + url + '/upload/index.html';
    // let src = 'http://localhost:3000/'
    src = `${src}?token=${token}&bucket=${bucket}&url=${url}`;
    // console.log(src)
    setSrc(src);
  }, []);

  const onMessage = (msg) => {
    const result = msg.detail.data[0];
    success && success(result);
  };

  return src && <WebView src={src} onMessage={onMessage}></WebView>;
};

export default PUploadPart;
