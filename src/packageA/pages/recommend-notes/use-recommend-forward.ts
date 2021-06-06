import Tool from '@/utils/tools';
import { useState } from 'react';
import { EPostType } from '@/component/poster';

function useRecommendForward() {
  const [pic, setPic] = useState('');

  /**
   * 没有日记时的转发图片
   */
  function getPic(pointInfo) {
    setTimeout(() => {
      if (!Tool.getForwardPic) {
        return;
      }
      Tool.getForwardPic({
        type: EPostType.forward,
        info: Tool.text.ellipsis(pointInfo.address, 20),
        width: 300,
        height: 239,
      }).then((pic) => setPic(pic));
    }, 500);
  }

  return {
    pic,
    refresh: getPic,
  };
}

export default useRecommendForward;
