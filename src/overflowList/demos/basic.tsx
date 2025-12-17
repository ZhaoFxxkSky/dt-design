import React, { useState } from 'react';
import {
    AigcOutlined,
    AlarmColored,
    BookOutlined,
    QuestionOutlined,
    StreamTaskColored,
    WorkflowOutlined,
} from '@dtinsight/react-icons';
import { OverflowList } from '@dtjoy/dt-design';
import { Slider, Tag } from 'antd';

export default function () {
    const [width, setWidth] = useState(100);
    const renderOverflow = (items) => {
        return items.length ? (
            <Tag style={{ marginRight: 8, flex: '0 0 auto', fontVariantNumeric: 'tabular-nums' }}>
                +{items.length}
            </Tag>
        ) : null;
    };
    const renderItem = (item, ind) => {
        return (
            <Tag color="blue" key={item.key} style={{ marginRight: 8, flex: '0 0 auto' }}>
                {item.icon}
                {item.key}
            </Tag>
        );
    };

    const items = [
        { icon: <AlarmColored style={{ marginRight: 4 }} />, key: 'alarm' },
        { icon: <BookOutlined style={{ marginRight: 4 }} />, key: 'bookmark' },
        { icon: <QuestionOutlined style={{ marginRight: 4 }} />, key: 'camera' },
        { icon: <AigcOutlined style={{ marginRight: 4 }} />, key: 'duration' },
        { icon: <WorkflowOutlined style={{ marginRight: 4 }} />, key: 'edit' },
        { icon: <StreamTaskColored style={{ marginRight: 4 }} />, key: 'folder' },
    ];

    return (
        <div>
            <Slider step={1} value={width} onChange={(value) => setWidth(value)} />
            <br />
            <br />
            <div style={{ width: `${width}%` }}>
                <OverflowList
                    items={items}
                    overflowRenderer={renderOverflow}
                    visibleItemRenderer={renderItem}
                />
            </div>
        </div>
    );
}
