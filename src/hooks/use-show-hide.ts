import { useEffect, useMemo, useState } from 'react';
/**
 * 
 * @param value : 文本类容
 * @param maxLeng :变短时,最大字数
 * @param maxRow : 变短时,最多换行 textarea
 * @param ellipsis : 变短时, 是否显示省略号
 * @param nowrap : 变长时, 是否要回车键
 */
function useShowHide(value: string, maxLeng = 100, maxRow = 3, ellipsis=true) {
  const [txt, setTxt] = useState('');
  const [showTrigger, setShowTrigger] = useState(false);

  const longTxt = useMemo(() => {
    if (!value) return '';
    return value.replace(/↵/g, '\n');
  }, [value]);

  const shortTxt = useMemo(() => {
    let txt = longTxt.substr(0, maxLeng);
    let arr = txt.split('\n');
    arr = arr.splice(0, maxRow);
    txt = arr.join('\n');
    return txt;
  }, [longTxt]);

  const isLong = useMemo(() => {
    if (txt === longTxt) return true;
    return false;
  }, [txt, longTxt]);

  useEffect(() => {
    if (shortTxt === longTxt) {
      setTxt(longTxt);
      setShowTrigger(false);
      return;
    }
    let txt = shortTxt
    ellipsis && txt + '...'
    setTxt(txt);
    setShowTrigger(true);
  }, [shortTxt, longTxt]);

  function triggerTap() {
    if (txt === longTxt) {
      let txt = shortTxt
      ellipsis && txt + '...'
      setTxt(txt);
    }
    else setTxt(longTxt);
  }

  return {
    txt,
    showTrigger,
    isLong,
    triggerTap,
  };
}

export default useShowHide;
