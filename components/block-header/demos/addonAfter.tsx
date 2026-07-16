import React from 'react';
import { BlockHeader } from '@dtjoy/dt-design';
import { Input, Space } from 'antd';

export default () => (
  <Space size={12} direction="vertical" style={{ width: '100%' }}>
    <BlockHeader title="分类标题" addonAfter="这是 addonAfter 内容" />
    <BlockHeader
      background={false}
      title="分类标题"
      addonAfter={<Input placeholder="请输入" />}
      tooltip={{ title: '这里展示问号提示' }}
    />
  </Space>
);
