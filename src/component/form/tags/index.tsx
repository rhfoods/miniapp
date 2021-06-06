import Tool from '@/utils/tools';
import { Checkbox, CheckboxGroup, View } from '@tarojs/components';
import React, { FC, useContext, useEffect, useState } from 'react';
import { AtTag } from 'taro-ui';
import { FormCxt } from '../form';
import './index.scss';
import XTag from './tag';

interface ITags {
  lab: string;
  name: string;
}

const TAG_MAX_LENGTH = 3;
const defaultTags: string[] = [
  '家庭聚会',
  '闺蜜聚会',
  '同学聚会',
  '独自享受',
  '公司团建',
  '二人世界',
  '生日派对',
];
const XTags: FC<ITags> = (props) => {
  const { lab, name } = props;
  const [tags, setTags] = useState(defaultTags);
  const [chooseList, setChooseList] = useState([]);
  const { form } = useContext(FormCxt);
  /**
   * 初始化
   */
  useEffect(() => {
    if (!form[name]) {
      return;
    }
    const tags = [...defaultTags]
    form[name].forEach((tag: string) => {
      !tags.includes(tag) && tags.push(tag);
    });
    setTags(tags);
    setChooseList(form[name]);
  }, []);
  /**
   * 点击按钮: 添加标签
   */
  async function add() {
    const { alertInput, promisic } = Tool;
    Tool.areaShowHid && Tool.areaShowHid({show: false})
    const newOne: any = await promisic(alertInput)({
      title: '自定义场景',
      placeholder: '请输入最多六个字',
      maxlength: 6,
      showTextArea: true
    });
    const has = tags?.some((tag) => tag === newOne);
    if (!has && newOne) {
      setTags((tags) => [...tags, newOne]);
      chooseList.length < TAG_MAX_LENGTH &&
        setChooseList((list) => [...list, newOne]);
    }
  }
  /**
   * 点击标签
   */
  function tap(target: string) {
    const has = chooseList?.some((tag) => tag === target);
    if (has) {
      const list = chooseList.filter((tag) => tag !== target);
      setChooseList([...list]);
      return;
    }
    if (chooseList.length < TAG_MAX_LENGTH) {
      setChooseList((list) => [...list, target]);
    }
  }
  const FormItem = (
    <CheckboxGroup name={name} className="none">
      {chooseList.map((tag: string) => (
        <Checkbox value={tag} checked />
      ))}
    </CheckboxGroup>
  );

  return (
    <View className="c-scene">
      <View className="title">{lab}</View>
      <View className="tags">
        {tags.map((tag) => (
          <XTag value={tag} chooseList={chooseList} onClick={tap} />
        ))}
        <AtTag className="tag" circle onClick={add}>
          +添加
        </AtTag>
      </View>
      {FormItem}
    </View>
  );
};

export default XTags;
