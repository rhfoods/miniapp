import { PointOwnTypes } from '@/common/constants/point.constant';
import EFire from '@/core/enum/fire';
import { IUseList } from '@/hooks/use-list';
import Tool from '@/utils/tools';
import { useEffect, useRef } from 'react';

function useFire(
  user,
  maps: IUseList,
  myNotes: IUseList,
  savePoints: IUseList,
  cur: number,
  setCur: any
) {
  /**
   * 解决获取不到最新值
   */
  const mapList = useRef([]);
  const myList = useRef([]);
  const saveList = useRef([]);
  useEffect(() => {
    mapList.current = maps.list || [];
    myList.current = myNotes.list || [];
    saveList.current = savePoints.list || [];
  }, [maps.list, myNotes.list, savePoints.list]);

  useEffect(() => {
    onfire();
  }, []);

  function onfire() {
    /**
     * 添加某一个点位
     */
    Tool.onfire.on(EFire.addPointUser, (item: any, cur: number) => {
      if (cur === 1) {
        myNotes.add(item);
        user.setInfo((info) => {
          info.createPoints++;
          return { ...info };
        });
      }
      if (cur === 2) {
        savePoints.add(item);
        user.setInfo((info) => {
          info.savePoints++;
          return { ...info };
        });
      }
    });
    /**
     * 删除某一个点位
     */
    Tool.onfire.on(EFire.delPointUser, (item: any) => {
      if (
        item.ownType === PointOwnTypes.MY_CREATE ||
        item.ownType === PointOwnTypes.SAVE_FIND
      ) {
        myNotes.del(item, 'psaveId');
        user.setInfo((info) => {
          info.createPoints--;
          return { ...info };
        });
      }
      if (item.ownType === PointOwnTypes.ONLY_SAVE) {
        savePoints.del(item, 'psaveId');
        user.setInfo((info) => {
          info.savePoints--;
          return { ...info };
        });
      }
    });
    /**
     * 更新某一个点位(文章)
     */
    Tool.onfire.on(EFire.updatePointUser, (item: any) => {
      if (item.ownType === PointOwnTypes.MY_CREATE)
        myNotes.update(item, 'psaveId');
      if (item.ownType === PointOwnTypes.SAVE_FIND)
        myNotes.update(item, 'psaveId');
      if (item.ownType === PointOwnTypes.ONLY_SAVE) {
        savePoints.update(item, 'psaveId');
      }
    });
    /**
     * 添加文章
     */
    Tool.onfire.on(EFire.addNoteUser, (item: any) => {
      savePoints.del(item, 'psaveId');
      const has = myList.current?.some(
        (someone) => someone.psaveId === item.psaveId
      );
      item.ownType = PointOwnTypes.SAVE_FIND;
      if (has) {
        myNotes.update(item, 'psaveId');
        return;
      }
      myNotes.add(item);
      setCur(1);
      user.setInfo((info) => {
        info.savePoints--;
        info.createPoints++;
        return { ...info };
      });
    });
    /**
     * 删除某文章
     */
    Tool.onfire.on(EFire.delNoteUser, (item: any) => {
      savePoints.del(item, 'psaveId');
      delete item.content;
      delete item.medias;
      delete item.title;
      delete item.tops;
      delete item.views;
      item.noteId = 0;
      myNotes.update(item, 'psaveId');
    });
    /**
     * 添加地图card
     */
    Tool.onfire.on(EFire.addMap, (item: any) => {
      maps.add(item);
      user.setInfo((info) => {
        info.saveMaps++;
        return { ...info };
      });
    });
    /**
     * 删除地图card
     */
    Tool.onfire.on(EFire.delMap, (item: any) => {
      maps.del(item, 'createrId');
      user.setInfo((info) => {
        info.saveMaps--;
        return { ...info };
      });
    });
  }
}

export default useFire;
