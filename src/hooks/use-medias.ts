import Media, { PICS_RESIZE_300 } from '@/models/media';
import { useMemo } from 'react';

function useMedias(medias: string[]) {
  /**
   * 是否显示视频
   */
  const showVideo = useMemo(() => {
    if (!medias) return false;
    if (Media.isVideo(medias)) return true;
  }, [medias]);
  /**
   * 是否显示图片
   */
  const showPics = useMemo(() => {
    if (!medias) return false;
    if (medias.length === 0) return false;
    if (Media.isVideo(medias)) return false;
    return true;
  }, [medias]);
  /**
   * 媒体列表
   */
  const mediaList = useMemo(() => {
    if (!medias) return [];
    return medias.map((picName: string) => Media.picUrl(picName));
  }, [medias]);
  /**
   * 媒体列表: small
   */
  const mediaListSmall = useMemo(() => {
    if (!mediaList) return [];
    return mediaList.map((url) => {
      return (url += PICS_RESIZE_300);
    });
  }, [mediaList]);

  return {
    showPics,
    showVideo,
    mediaList,
    mediaListSmall,
  };
}

export default useMedias;
