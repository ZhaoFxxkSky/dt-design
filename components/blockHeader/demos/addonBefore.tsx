import React from 'react';
import { PauseOutlined, PieChartFilled } from '@ant-design/icons';
import { BlockHeader } from '@dtjoy/dt-design';

export default () => {
  return (
    <>
      <BlockHeader title="分类标题" />
      <BlockHeader title="分类标题" addonBefore={''} />
      <BlockHeader title="分类标题" addonBefore={<PieChartFilled />} />
      <BlockHeader title="分类标题" addonBefore={<PauseOutlined />} />
    </>
  );
};
