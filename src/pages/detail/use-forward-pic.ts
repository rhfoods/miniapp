import Media from '@/models/media';
import Tool from '@/utils/tools';
import { useState } from 'react';
import { EPostType } from '@/component/poster';

function useForwardPic() {
  const [pic, setPic] = useState('');

  /**
   * 没有日记时的转发图片
   */
  function noNote(pointInfo) {
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
  /**
   *
   */
  function getPic(topNoteInfo, pointInfo = null) {
    const medias = topNoteInfo?.medias;

    if (medias && Media.isVideo(medias) === true) {
      let notePic = Media.picUrl(
        `${medias[0]}?x-oss-process=video/snapshot,t_1000,f_jpg,m_fast,ar_auto`
      );
      setPic(notePic);
      return;
    }

    if (medias?.length > 0) {
      let notePic = Media.picUrl(`${medias[0]}?x-oss-process=image/format,png`);
      setPic(notePic);
      return;
    }

    noNote(pointInfo);
  }

  return {
    pic,
    refresh: getPic,
  };
}

export default useForwardPic;
