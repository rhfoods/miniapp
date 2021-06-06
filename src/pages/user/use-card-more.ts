import { deletePointNote, pointUnSave } from '@/api/api';
import { ISheetItemInfo } from '@/component/alert/sheet';
import EFire from '@/core/enum/fire';
import Note from '@/models/note';
import Theme from '@/models/theme';
import Tool from '@/utils/tools';
import Taro from '@tarojs/taro';
import { EUserList } from './use-tabheader';

export enum EUserOptions {
  editorNote = 'editorNote',
  delNote = 'delNote',
  editorPoint = 'editorPoint',
  delPoint = 'delPoint',
  addNote = 'addNote',
}

function useCardMore() {
  /**
   * 获取选项列表
   */
  function getOption(cardInfo, key: string): ISheetItemInfo[] {
    if (cardInfo?.noteId && key === EUserList.my) {
      return [
        {
          type: 'common',
          icon: 'bianji-01',
          key: EUserOptions.editorNote,
          text: '编辑',
        },
        {
          type: 'common',
          icon: 'shanchu',
          key: EUserOptions.delNote,
          text: '删除',
          iconColor: '#666',
          fontColor: '#666',
        },
      ];
    }
    return [
      {
        type: 'common',
        icon: 'xiexin',
        key: EUserOptions.addNote,
        text: '发现',
        iconColor: Theme.red,
      },
      {
        type: 'common',
        icon: 'bianji-01',
        key: EUserOptions.editorPoint,
        text: '编辑',
      },
      {
        type: 'common',
        icon: 'shanchu',
        key: EUserOptions.delPoint,
        text: '删除',
        iconColor: '#666',
        fontColor: '#666',
      },
    ];
  }
  /**
   * 添加日记
   */
  async function addNote(cardInfo) {
    const { promisic, articleForm } = Tool;
    const { form, point }: any = await promisic(articleForm)({
      pointInfo: cardInfo,
      openDetail: true,
    });
    if (form) {
      const newData = { ...cardInfo, ...point, ...form };
      Tool.onfire.fire(EFire.addNoteUser, newData);
    }
  }
  /**
   * 编辑日记
   */
  async function editNote(cardInfo) {
    const { promisic, articleForm } = Tool;
    const { form, point }: any = await promisic(articleForm)({
      noteId: cardInfo.noteId, // 获取文章信息用psaveId
      pointInfo: cardInfo,
      hideRecommend: true,
    });
    Tool.onfire.fire(EFire.updatePointUser, {
      ...cardInfo,
      ...point,
      ...form,
      status: Note.getState(cardInfo.status),
    });
  }
  /**
   * 删除日记
   */
  async function delNote(cardInfo) {
    const res = await Taro.showModal({
      title: '提示',
      content: '觅宝难得，创作不易，您真的要删除您的发现吗？',
    });
    if (res.confirm) {
      await deletePointNote({
        noteId: cardInfo.noteId,
      });
      Tool.onfire.fire(EFire.delNoteUser, cardInfo);
    }
  }
  /**
   * 编辑点位
   */
  async function editPoint(cardInfo) {
    const { promisic, pointForm } = Tool;
    const point: any = await promisic(pointForm)({
      psaveId: cardInfo.psaveId,
    });
    const newPoint = { ...cardInfo, ...point };
    Tool.onfire.fire(EFire.updatePointUser, newPoint);
  }
  /**
   * 删除点位
   */
  async function delPoint(cardInfo) {
    await Tool.sleep(300)
    const res = await Taro.showModal({
      title: '提示',
      content: '您真的要删除地图上的这个点吗？',
    });
    if (res.confirm) {
      await pointUnSave({
        psaveId: cardInfo.psaveId,
      });
      Tool.onfire.fire(EFire.delPointUser, cardInfo);
      Tool.onfire.fire(EFire.delPointHome, cardInfo);
    }
  }

  return {
    getOption,
    addNote,
    editNote,
    delNote,
    editPoint,
    delPoint,
  };
}

export default useCardMore;
