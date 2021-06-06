import { FormCxt } from '@/component/form/form';
import { TPicker } from '@/component/form/picker';
import { useContext, useEffect, useState } from 'react';
import Tool from '@/utils/tools';
import User from '@/models/user';

function usePicker(type: TPicker, name: string) {
  const [value, setValue] = useState('');
  const [text, setText] = useState('');
  const [otherInfo, setOtherInfo] = useState(null);
  const { form } = useContext(FormCxt);

  useEffect(() => {
    setValue(form[name]);
    type === 'catgray' && catgrayInit();
  }, []);
  /**
   * 点击picker
   */
  function handleClick() {
    type === 'catgray' && catgrayUpdate();
  }
  /**
   * 初始化: 选择分类
   */
  function catgrayInit() {
    setText(form['sortName']);
  }
  /**
   * 更新分类
   */
  async function catgrayUpdate() {
    const { promisic, chooseCatgray } = Tool;
    const res: any = await promisic(chooseCatgray)({
      userId: User.userId(),
    });
    setValue(res.sortId);
    setText(res.name);
    setOtherInfo(res.points);
  }

  return {
    value,
    text,
    otherInfo,
    handleClick,
  };
}

export default usePicker;
