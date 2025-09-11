import React from 'react';
import { EllipsisText } from 'dt-design';

export default () => {
    return (
        <div
            style={{
                width: 200,
            }}
        >
            <span>
                <EllipsisText
                    value={
                        '我是很长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长的文本'
                    }
                />
            </span>
        </div>
    );
};
