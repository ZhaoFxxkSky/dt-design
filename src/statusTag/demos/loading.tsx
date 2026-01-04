import React, { useState } from 'react';
import { StatusTag } from '@dtjoy/dt-design';
import { Radio, Space } from 'antd';

export default () => {
    const [loading, setLoading] = useState(true);

    return (
        <>
            <Radio.Group value={loading} onChange={(e) => setLoading(e.target.value)}>
                <Radio value>开启加载</Radio>
                <Radio value={false}>关闭加载</Radio>
            </Radio.Group>

            <div style={{ marginTop: 8 }}>
                <Space>
                    <StatusTag color="green" type="outline" loading={loading}>
                        成功
                    </StatusTag>
                    <StatusTag color="blue" type="outline" loading={loading}>
                        运行中
                    </StatusTag>
                </Space>
            </div>
        </>
    );
};
