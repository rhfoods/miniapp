import { PointOwnTypes } from '@/common/constants/point.constant';
import { IArticleDetail } from '@/core/interface/nav';
import User, { IUserInfo } from '@/models/user';
import { useMemo, useState } from 'react';

/**
 * 顶部用户信息
 */
function useUserCardInfo(selfInfo: IUserInfo, params: IArticleDetail) {
  const [info, setInfo] = useState(null);

  const isSelf = useMemo(() => {
    return info?.userId === selfInfo?.userId;
  }, [info, selfInfo]);
  /**
   * 
   */
  const showBtn = useMemo(() => {
    if(params?.hideTab) {
      return false
    }
    if(info?.userId === 0) {
      return false
    }
    if(isSelf) {
      return false
    }
    return true
  }, [info, params, isSelf])
  /**
   * 获取顶部卡片用户信息
   */
  async function getInfo(topNote, point) {
    const userId = getUserId(topNote, point);
    
    if (userId === selfInfo.userId) {
      setInfo(selfInfo);
      return selfInfo;
    }
    const userInfo = await User.simpleInfo(userId);
    setInfo(userInfo);
    return userInfo;
  }
  /**
   * 获取顶部卡片用户信息的userid
   */
  function getUserId(topNote, point) {
    if (topNote) {
      return topNote.userId;
    } else {
      if (
        point.noteId === 0 &&
        point.topNoteId === 0 &&
        point.ownType !== PointOwnTypes.MY_CREATE
      ) {
        return point.createrId;
      } else {
        return point.userId;
      }
    }
  }

  return {
    info,
    isSelf,
    showBtn,
    setInfo,
    getInfo,
  };
}

export default useUserCardInfo;
