import React, { useState } from 'react';
import {
  AlibabaOutlined,
  AliyunOutlined,
  BookOutlined,
  QuestionOutlined,
  WechatOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import { OverflowList } from '@dtjoy/dt-design';
import { Slider, Tag } from 'antd';

type Item = {
  icon: React.ReactNode;
  key: string;
};

export default function () {
  const [width, setWidth] = useState(100);
  const renderOverflow = (items: Item[]) => {
    return items.length ? (
      <Tag style={{ flex: '0 0 auto', fontVariantNumeric: 'tabular-nums' }}>+{items.length}</Tag>
    ) : null;
  };
  const renderItem = (item: Item) => {
    return (
      <Tag color="blue" key={item.key} style={{ marginRight: 8, flex: '0 0 auto' }}>
        {item.icon}
        {item.key}
      </Tag>
    );
  };

  const items = [
    { icon: <WechatOutlined style={{ marginRight: 4 }} />, key: 'alarm' },
    { icon: <BookOutlined style={{ marginRight: 4 }} />, key: 'bookmark' },
    { icon: <QuestionOutlined style={{ marginRight: 4 }} />, key: 'camera' },
    { icon: <AliyunOutlined style={{ marginRight: 4 }} />, key: 'duration' },
    { icon: <AlibabaOutlined style={{ marginRight: 4 }} />, key: 'edit' },
    { icon: <YoutubeOutlined style={{ marginRight: 4 }} />, key: 'folder' },
  ];

  return (
    <div>
      <Slider step={1} value={width} onChange={(value) => setWidth(value)} />
      <br />
      <br />
      <div style={{ width: `${width}%` }}>
        <OverflowList
          items={items}
          minVisibleItems={3}
          overflowRenderer={renderOverflow}
          visibleItemRenderer={renderItem}
        />
      </div>
    </div>
  );
}
