import Tool from '@/utils/tools';
import { useEffect, useMemo, useState } from 'react';

function useInput(initValue = '', isPrice = false) {
  const [txt, setTxt] = useState('');
  /**
   * formItem的值
   */
  const value = useMemo(() => {
    if (isPrice) {
      let num = Tool.text.priceNum(txt);
      return num === 0 ? '' : String(num);
    }
    return txt;
  }, [txt]);
  /**
   * 初始化
   */
  useEffect(() => {
    if (isPrice) {
      const text = Tool.text.priceStr(Number(initValue));
      setTxt(text);
      return;
    }
    setTxt(initValue);
  }, []);
  /**
   * inputTxt 发生了变化
   */
  function onInput(e: any) {
    let text = e.detail.value;
    setTxt(text);
  }
  /**
   * 失去焦点
   */
  function onBlur(e: any) {
    let text = e.detail.value;
    if (isPrice) {
      text = Tool.text.fix(text);
      setTxt(text);
    }
  }

  return { txt, value, onInput, onBlur, setTxt };
}

export default useInput;
