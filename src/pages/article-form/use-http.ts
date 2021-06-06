import { IArticleForm } from '@/core/interface/nav';
import useApi from '@/hooks/use-api';
import Note from '@/models/note';
import Point from '@/models/point';
import { useEffect, useMemo, useState } from 'react';
import ArticleForm from './models';

function useHttp(params: IArticleForm) {
  const noteInfo = useApi(Note.getNote);
  const pointInfo = useApi(Point.getPointInfoForm);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    params && getData(params);
  }, [params]);

  async function getData(params: IArticleForm) {
    if (!params) {
      return;
    }
    await getPointInfo(params);
    await getNoteInfo(params);
    setFinish(true);
  }
  /**
   * 获取点位信息
   */
  async function getPointInfo(params: IArticleForm) {
    if (params?.pointInfo) {
      pointInfo.setInfo(params?.pointInfo);
      return;
    }
    if (params?.psaveId) {
      await pointInfo.getData({
        psaveId: params?.psaveId,
      });
    }
  }
  /**
   * 获取日记信息
   */
  async function getNoteInfo(params: IArticleForm) {
    if (params?.noteInfo) {
      noteInfo.setInfo(params.noteInfo);
      return;
    }
    if (params?.noteId) {
      await noteInfo.getData(params.noteId);
    }
  }
  /**
   * 加载状态
   */
  const loading = useMemo(() => {
    if (noteInfo.loading) {
      return true;
    }
    return false;
  }, [noteInfo]);
  /**
   *
   */
  const form = useMemo(() => {
    if (!finish) return;
    let form: ArticleForm;
    if (!noteInfo.info) {
      form = new ArticleForm();
    }
    if (noteInfo?.info) {
      const formData = ArticleForm.server2client(noteInfo.info, pointInfo.info);
      form = new ArticleForm(formData);
    }
    if (pointInfo?.info) {
      form.pointInfo = pointInfo.info;
    }
    return form;
  }, [noteInfo, finish, pointInfo]);

  return {
    loading,
    form,
    pointInfo: pointInfo.info,
    noteInfo: noteInfo.info,
    getData,
  };
}

export default useHttp;
