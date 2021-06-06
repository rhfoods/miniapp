import { View } from '@tarojs/components';
import React, { FC, useEffect, useMemo } from 'react';
import XMsgNav from './msg-nav';
import useNavs, { IMsgNavItem } from './use-navs';
import { AtTabs, AtTabsPane } from 'taro-ui';
import useMsgTabs, { EMsgTabs } from './use-msg-tabs';
import XTabsHead from './tabs-head';
import classNames from 'classnames';
import XEmpty from '@/component/empty';
import XMsgCard from '@/component/card/msg-card';
import Tool from '@/utils/tools';
import { IMsgItemInfo, MessageReturnTypes, useMsg } from '@/context/message-ctx';
import XFindCard from '@/component/card/find-card';
import usePageList from '@/hooks/usePageList';
import { GETMessageParams, GetNewNotesParams } from '@/api/types/api.interface';
import { GETMessage, GetNewNotes } from '@/api/api';
import MessageModel from './model';
import XAlertCommentInput from '@/component/alert/comment-input';
import { usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import XSystemMsgCard from '../msg-list/system-card';
import './index.scss';

const Message: FC = () => {
  const nav = useNavs()
  const {current, setCurrent, items} = useMsgTabs()
  const message = useMsg()
  const msgList = usePageList<GETMessageParams>(GETMessage, {
    order: 'DESC',
    take: 10
  }, 'messages')
  const noteList = usePageList<GetNewNotesParams>(GetNewNotes, {
    order: 'DESC',
    take: 10
  }, 'notes')

  useEffect(() => {
    if(current === 0) {
      msgList.getMore()
    }
    if(current === 1) {
      noteList.getMore()
    }
  }, [current])
  /**
   * 下拉刷新
   */
  usePullDownRefresh(() => {
    message.refresh()
    if(current === 0) {
      msgList.refresh().then(() => {
        Taro.stopPullDownRefresh()
      });
    }
    if(current === 1) {
      noteList.refresh().then(() => {
        Taro.stopPullDownRefresh()
      });
    }
  });
  /**
   * 上拉加载
   */
  useReachBottom(() => {
    msgList.getMore()
  });  

  const tabPanes = useMemo(() => {
    return items.map(item => {
      if(item.key === EMsgTabs.news) {
        item.className='news'
      }
      if(item.key === EMsgTabs.notes) {
        item.className='notes'
      }
      return item
    })
  }, [items])
  /**
   * 退出页面触发
   */
  useEffect(() => {
    return () => {
      message.refresh()
    }
  }, [])
  /**
   * 点击顶部导航
   */
  const navTap = (item: IMsgNavItem) => {
    Tool.openMsgList({msgType: item.msgType})
  }
  /**
   * 点击第二排导航
   */
  const tabsTap = (index: number) => setCurrent(index)
  /**
   * 点击日记卡片 
   */
  const noteTap = (userInfo, noteInfo, pointInfo) => {
    Tool.detail({
      psaveId: pointInfo.psaveId,
      userId: pointInfo.userId,
      topNoteId: pointInfo.noteId, // 指定置顶文章
    });
  }
  /**
   * 
   */
  const MSGS = <View>
    {
      msgList.empty &&
      <XEmpty className='empty' info='还没有消息哦' />
    }{
      msgList.list.map((item: IMsgItemInfo) => {
        const CARD = item.type === MessageReturnTypes.SYSTEM
        ? <XSystemMsgCard className='card' info={item} titleLength={13} />
        : <XMsgCard className='card' info={item} type={MessageModel.getMsgType(item.type)} />
        return CARD
      })
    }
  </View>

  const NOTES = <View>
    {
      noteList.empty &&
      <XEmpty className='empty' info='还没有新动态哦' />
    }{
      noteList.list.map((item, index) => <XFindCard
        className="point-card"
        index={index}
        leng={noteList.list.length}
        userInfo={item}
        noteInfo={item}
        pointInfo={item}
        showMore={false}
        onClick={noteTap}
      />)
    }
  </View>

  const TABPANES = tabPanes.map((item, index) => {
    const classPane = classNames('tab-pane', item.className)
    return <AtTabsPane current={current} index={index}>
      <View className={classPane} >
        {
          item.key === EMsgTabs.news && MSGS
        }{
          item.key === EMsgTabs.notes && NOTES
        }
      </View>
    </AtTabsPane>
  })

  return <View className='p-msg'>

    <View className='fix' >
      <XMsgNav 
        className='nav' 
        items={nav.items} 
        onClick={navTap}
      />
      <XTabsHead 
        className='tab-head'
        items={items}
        onClick={tabsTap}
        current={current}
      />
    </View>

    <AtTabs
      current={current}
      tabList={items}
      swipeable={false}
      onClick={tabsTap}>
      {TABPANES}
    </AtTabs>
    
    <XAlertCommentInput />

  </View>;
};

export default Message;
