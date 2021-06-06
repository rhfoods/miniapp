import { useEffect, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';

export interface ISystem {
  isIphoneFull: boolean,
  isIphone: boolean,
  model: string,
  brand: string,
}

function useSystem(): ISystem {
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('')

  useEffect(() => {
    Taro.getSystemInfo().then((res) => {
      setModel(res.model);
      setBrand(res.brand);
    });
  }, []);

  const isIphoneFull = useMemo(() => {
    if (model.includes('iPhone')) {
      if (
        model.includes('5') ||
        model.includes('6') ||
        model.includes('7') ||
        model.includes('8')
      ) {
        return false;
      }
      return true;
    }
    return false;
  }, [model]);

  const isIphone = useMemo(() => {
    if (model.includes('iPhone')) {
      return true;
    }
    return false;
  }, [model]);

  return {
    isIphoneFull,
    isIphone,
    model,
    brand
  };
}

export default useSystem;
