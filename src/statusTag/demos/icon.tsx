import React from 'react';
import { BookOutlined } from '@ant-design/icons';
import { StatusTag } from '@dtjoy/dt-design';
import { Space } from 'antd';

export default () => {
    return (
        <Space direction="vertical">
            <StatusTag color="green" type="outline" icon={<BookOutlined />}>
                成功
            </StatusTag>
            <StatusTag color="blue" icon={<BookOutlined />}>
                运行中
            </StatusTag>
            <StatusTag color="yellow" type="fill" icon={<BookOutlined />}>
                运行中
            </StatusTag>
            <StatusTag color="#2f10fb" type="fill" icon={<BookOutlined />}>
                运行中
            </StatusTag>
        </Space>
    );
};
