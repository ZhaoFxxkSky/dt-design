import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { FilterRules } from 'dt-design';
import { IComponentProps } from 'dt-design/filterRules';

import { INIT_DATA, INIT_ROW_VALUES, IRow } from './constants';

const MyInput = ({ rowValues: { input }, rowKey, onChange }: IComponentProps<IRow>) => (
    <Input value={input} onChange={(e) => onChange?.(rowKey, { input: e.target.value })} />
);

export default () => {
    const [data, setData] = useState(INIT_DATA);

    return (
        <>
            <FilterRules<IRow>
                component={(props) => <MyInput {...props} />}
                value={data}
                onChange={(value: any) => setData(value)}
                initValues={INIT_ROW_VALUES}
            />

            <Button onClick={() => console.log(data)}>控制台查看数据</Button>
        </>
    );
};
