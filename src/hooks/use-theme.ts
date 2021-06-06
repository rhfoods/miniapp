import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import { ETheme } from '../core/enum/theme';
import { StorageNames } from '@/common/constants/system.constants';

export default function useTheme() {
  const [theme, setTheme] = useState<ETheme>();

  useEffect(() => {
    const style = Taro.getStorageSync(StorageNames.theme) || ETheme.black;
    setTheme(style);
  }, []);

  function trigger() {
    const style = theme === ETheme.white ? ETheme.black : ETheme.white;
    setTheme(ETheme[style]);
    Taro.setStorageSync(StorageNames.theme, style);
  }

  return {
    theme,
    trigger,
  };
}
