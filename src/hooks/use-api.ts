import Decorator from '@/models/decorator';
import { useState } from 'react';

/**
 * http 获取icons
 */
function useApi(callback: (params: any) => Promise<any>) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [finish, setFinish] = useState(false);

  async function getData(params = null) {
    const info = await callback(params);
    setInfo(info);
    return info;
  }

  return {
    info,
    loading,
    err,
    finish,
    setInfo,
    getData: Decorator.loading(getData, setLoading, setErr, setFinish),
  };
}

export default useApi;
