import { IArticleDetail } from '@/core/interface/nav';
import { useEffect, useState } from 'react';

type TState = 'loading' | 'success' | 'null' | 'err' | 'bug';

function useDetailState(
  point,
  topCard,
  topNote,
  notes,
  forward,
  params: IArticleDetail,
  self
) {
  const [state, setState] = useState<TState>('loading');

  useEffect(() => {

    if (params?.psaveId && self) {
      init(params);
    }
    if (params && !params.psaveId) {
      setState('bug');
    }
  }, [params, self]);

  async function init(params: IArticleDetail) {
    const pointInfo = await point.getInfo(params);
    if (!pointInfo) {
      setState('null');
      return;
    }
    const topNoteInfo = await topNote.getInfo(pointInfo, params);
    topCard.getInfo(topNoteInfo, pointInfo);
    notes.refresh();
    forward.refresh(topNoteInfo, pointInfo);
    setState('success');
  }

  async function refresh() {
    setState('loading');
    await init(params);
  }

  useEffect(() => {
    if (point.finish && point.err) {
      setState('err');
      return;
    }
  }, [point]);

  return {
    state,
    refresh,
  };
}

export default useDetailState;
