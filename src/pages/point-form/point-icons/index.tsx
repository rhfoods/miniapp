import { FormCxt } from '@/component/form/form';
import { Input, View } from '@tarojs/components';
import React, { FC, useContext, useEffect, useState } from 'react';
import XIconItem, { IIcon } from './icon';
import './index.scss';

interface IIcons {
  name: string;
  icons: IIcon[];
}

const XIcons: FC<IIcons> = (props) => {
  const { icons, name } = props;
  const [active, setActive] = useState('moren.png');
  const { form } = useContext(FormCxt);

  useEffect(() => {
    setActive(form[name]);
  }, []);

  function onClick(active: string) {
    setActive(active);
  }

  return (
    <View className="c-point-icons">
      <View className="lab">请选择对应图标</View>
      <View className="icons">
        {
          icons && icons.map((info) => <XIconItem 
            onClick={onClick} 
            info={info} 
            active={active} 
          />)
        }
        <View className='icon' >
          <View className='txt'>更多图标</View>
          <View>敬请期待</View>
        </View>
      </View>
      <Input name={name} value={active} className="none" />
    </View>
  );
};

export default XIcons;
