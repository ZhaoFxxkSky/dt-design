import React, { useState } from 'react';
import type { StatusTagType } from '@dtjoy/dt-design';
import { StatusTag } from '@dtjoy/dt-design';
import { Divider, Radio, Space, Switch } from 'antd';

export default () => {
  const presets = ['blue', 'yellow', 'green', 'gray', 'red', 'purple', 'cyan', 'pink'];

  const [type, setType] = useState<StatusTagType>('default');
  const [rounded, setRounded] = useState<boolean>(false);

  return (
    <>
      <Radio.Group value={type} onChange={(e) => setType(e.target.value)}>
        <Radio.Button value="default">无外边框</Radio.Button>
        <Radio.Button value="outline">有外边框</Radio.Button>
        <Radio.Button value="fill">有背景色</Radio.Button>
      </Radio.Group>
      <div style={{ marginTop: 8 }}>
        {['outline', 'fill'].includes(type) && (
          <Switch
            onChange={setRounded}
            checked={rounded}
            checkedChildren="开启圆角"
            unCheckedChildren="关闭圆角"
          />
        )}
      </div>
      <Divider orientation="left">Presets</Divider>
      <Space direction="vertical">
        {presets.map((preset) => (
          <StatusTag key={preset} type={type} color={preset} rounded={rounded}>
            {preset}
          </StatusTag>
        ))}
      </Space>
      <Divider orientation="left">Custom</Divider>
      <Space direction="vertical">
        <StatusTag type={type} color="#f50">
          #f50
        </StatusTag>
        <StatusTag type={type} color="rgb(45, 183, 245)">
          rgb(45, 183, 245)
        </StatusTag>
        <StatusTag type={type} color="#a31980">
          #a31980
        </StatusTag>
        <StatusTag type={type} color="#0fd5e8">
          #0fd5e8
        </StatusTag>
        <StatusTag type={type} color="#3D446E" background="#EBECF0">
          #3D446E
        </StatusTag>
      </Space>
    </>
  );
};
