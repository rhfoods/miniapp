import { IArticleDetail } from '@/core/interface/nav';
import useApi from '@/hooks/use-api';
import Note from '@/models/note';
import Point from '@/models/point';
import { useMemo, useState } from 'react';

export enum NoteAuditStatus {
  AUDITING = 'AD', //审核中
  PASS = 'PS', //审核通过
  UNPASS = 'UP', //审核未通过
}

function useTopNote(pointInfo) {
  const topNote = useApi(Note.getTopNote);
  const [show, setShow] = useState(true);
  
  /**
   * 顶部文章是否被置顶
   */
  const isToped = useMemo(() => {
    if (topNote.info?.noteId === pointInfo?.topNoteId) {
      return true;
    }
    return false;
  }, [pointInfo, topNote.info]);

  function getTopNoteId(pointInfo, params: IArticleDetail) {
    if (!pointInfo || !params) {
      return 0;
    }
    if (params?.topNoteId) {
      return params.topNoteId;
    }
    return Point.getTopNoteId(pointInfo);
  }

  async function getInfo(pointInfo, params: IArticleDetail) {
    const topNoteId = getTopNoteId(pointInfo, params);
    if (topNoteId) {
      const data = await topNote.getData(topNoteId);
      return data;
    }
  }

  return {
    ...topNote,
    isToped,
    show,
    setShow,
    getInfo,
  };
}

export default useTopNote;
