import React from 'react';
import { StatusTag } from '@dtjoy/dt-design';
import { Space } from 'antd';

export default () => {
  const presets = ['blue', 'yellow', 'green', 'gray', 'red', 'purple', 'cyan', 'pink'];

  return (
    <Space direction="vertical">
      {presets.map((preset) => (
        <StatusTag key={preset} type="fill" color={preset} icon={false}>
          {preset}
        </StatusTag>
      ))}
    </Space>
  );
};
