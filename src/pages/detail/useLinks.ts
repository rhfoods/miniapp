import { PointNoteLinkTypes } from '@/api/types/api.constant';
import Tool from '@/utils/tools';
import { useEffect, useMemo, useState } from 'react';
import LinkMini from '@/models/link';

enum ELinks {
  bilibili = 'B站相关',
  weibo = '微博相关',
  redbook = '小红书相关',
}

function useLinks(topNote) {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    let items = [];
    if (!topNote) {
      return;
    }
    if (topNote[PointNoteLinkTypes.BILIBILI]) {
      items.push({
        type: 'common',
        text: ELinks.bilibili,
        icon: 'bilibili',
      });
    }
    if (topNote[PointNoteLinkTypes.WEIBO]) {
      items.push({
        type: 'common',
        text: ELinks.weibo,
        icon: 'weibo',
      });
    }
    if (topNote[PointNoteLinkTypes.REDBOOK]) {
      items.push({
        type: 'common',
        text: ELinks.redbook,
        icon: 'xiaohongshu',
      });
    }
    setLinks(items);
  }, [topNote]);

  const hasLinks = useMemo(() => {
    if (links.length > 0) {
      return true;
    }
    return false;
  }, [links]);

  async function linkTap() {
    const { promisic, sheet } = Tool;
    const res: any = await promisic(sheet)({ options: links });
    if (res?.text === ELinks.bilibili) {
      const bv = topNote[PointNoteLinkTypes.BILIBILI];
      LinkMini.jumpBL(bv);
    }
    if (res?.text === ELinks.weibo) {
      const webUrl = topNote[PointNoteLinkTypes.WEIBO];
      LinkMini.jumpWB(webUrl);
    }
    if (res?.text === ELinks.redbook) {
    }
  }

  return {
    hasLinks,
    linkTap,
  };
}

export default useLinks;
