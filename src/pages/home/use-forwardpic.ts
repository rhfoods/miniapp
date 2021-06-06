import { EPostType } from '@/component/poster';
import Tool from '@/utils/tools';
import { useEffect, useState } from 'react';

interface useForwardPicParams {
  ready: boolean;
  info: string;
}

function useForwardPic({ ready, info }: useForwardPicParams) {
  const [pic, setPic] = useState('');

  useEffect(() => {
    if (!ready) {
      return;
    }
    setTimeout(() => getPic(info), 100)
  }, [ready, info]);
  
  const getPic = async (info: string) => {
    if (!Tool.getForwardPic) {
      return;
    }
    Tool.alertPoster({ type: EPostType.clear }); // 转发图片重新绘制后海报也需要重新绘制
    const pic = await Tool.getForwardPic({
      type: EPostType.forward,
      info,
      width: 300,
      height: 239,
    });
    setPic(pic);
  };

  return {
    pic,
    getPic,
  };
}

export default useForwardPic;
