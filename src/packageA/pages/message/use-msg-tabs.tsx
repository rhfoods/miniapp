import { useState } from "react";
import { IMsgItem } from "./tabs-head";

export enum EMsgTabs {
  news = 'news',
  notes = 'notes',
}

const msgTabs: IMsgItem[] = [
  { title: '最新消息', key: EMsgTabs.news },
  { title: '最新动态', key: EMsgTabs.notes },
];

function useMsgTabs() {

  const [items] = useState(msgTabs)
  const [current, setCurrent] = useState(0)

  return {
    items,
    current,
    setCurrent,
  }
}

export default useMsgTabs