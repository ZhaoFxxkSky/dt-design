import React from 'react';
import { Space } from 'antd';
import { TinyTag } from 'dt-design';

import './style.scss';

export default () => {
    return (
        <Space size={6}>
            <TinyTag value="数兑科技" />
            <TinyTag className="data-tag" value="数据驱动" />
            <TinyTag className="ued-tag" value="UED" />
        </Space>
    );
};
