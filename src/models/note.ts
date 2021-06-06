import { getFindNotes, getPointNote, getPointNotes } from '@/api/api';
import { NoteAuditStatus } from '../pages/detail/use-topnote';

class Note {
  /**
   * 获取置顶文章
   */
  static async getTopNote(topNoteId: number) {
    return await Note.getNote(topNoteId);
  }
  /**
   * 获取日记详情1: 通过 noteId 获取
   */
  static async getNote(noteId: number) {
    if (!noteId) return;
    const res: any = await getPointNote({ noteId });
    return res.note;
  }

  /**
   * 获取多篇文章
   */
  static async getNotes(ids: string) {
    if (!ids) return;
    const res: any = await getPointNotes({ ids });
    return res.notes;
  }

  /**
   * 获取发现更多
   */
  static async getFindNotes(psaveId: number) {
    if (psaveId <= 0) return;
    const res: any = await getFindNotes({ psaveId });
    return res.notes;
  }
  /**
   * 跟新(未通过审)核的日记: --> 审核中
   * 跟新(已通过审)核的日记: --> 已通过审核
   * 跟新(审核中)的日记: --> 审核中
   */
  static getState(state: string) {
    if (state === NoteAuditStatus.UNPASS) {
      return NoteAuditStatus.AUDITING;
    }
    return state;
  }
}

export default Note;
