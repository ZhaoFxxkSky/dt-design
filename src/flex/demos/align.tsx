import React from 'react';
import { Button, Flex, FlexProps } from '@dtjoy/dt-design';
import { Segmented } from 'antd';

const boxStyle: React.CSSProperties = {
    width: '100%',
    height: 120,
    borderRadius: 6,
    border: '1px solid #40a9ff',
};

const justifyOptions = [
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
];

const alignOptions = ['flex-start', 'center', 'flex-end'];

export default () => {
    const [justify, setJustify] = React.useState<FlexProps['justify']>(justifyOptions[0]);
    const [alignItems, setAlignItems] = React.useState<FlexProps['align']>(alignOptions[0]);
    return (
        <Flex gap="middle" align="start" vertical>
            <p>Select justify :</p>
            <div>
                <Segmented blcok={false} options={justifyOptions} onChange={setJustify} />
            </div>
            <p>Select align :</p>
            <div>
                <Segmented options={alignOptions} onChange={setAlignItems} />
            </div>
            <Flex style={boxStyle} justify={justify} align={alignItems}>
                <Button type="primary">Primary</Button>
                <Button type="primary">Primary</Button>
                <Button type="primary">Primary</Button>
                <Button type="primary">Primary</Button>
            </Flex>
        </Flex>
    );
};
