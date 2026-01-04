import React from 'react';
import { StatusTag } from '@dtjoy/dt-design';
import { Space } from 'antd';

export default () => {
  return (
    <Space direction="horizontal">
      <StatusTag color="blue" />
      <StatusTag color="green" />
      <StatusTag color="purple" />
      <StatusTag color="yellow" />
    </Space>
  );
};
