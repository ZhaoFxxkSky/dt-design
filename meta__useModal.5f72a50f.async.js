"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[5768],{73174:function(o,e,n){n.r(e),n.d(e,{demos:function(){return a}});var d=n(75271),a={"src-use-modal-demo-basic":{component:d.memo(d.lazy(function(){return Promise.all([n.e(7350),n.e(327),n.e(1270),n.e(3370),n.e(1204),n.e(8704),n.e(1273),n.e(7127),n.e(3350),n.e(3060),n.e(9520),n.e(478),n.e(3493),n.e(168),n.e(8208),n.e(2878),n.e(8327),n.e(770),n.e(8526),n.e(2179),n.e(5053),n.e(27),n.e(7524),n.e(8288),n.e(8460),n.e(7955),n.e(3859),n.e(4920),n.e(732),n.e(2433)]).then(n.bind(n,17302))})),asset:{type:"BLOCK",id:"src-use-modal-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(88455).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.22.5"},"...ts":{type:"FILE",value:n(42813).Z}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528"},context:void 0,renderOpts:void 0}}},53446:function(o,e,n){n.r(e),n.d(e,{texts:function(){return d}});const d=[{value:"\u4FDD\u5B58\u5F53\u524D\u6570\u636E\u5E76\u6253\u5F00\u5F39\u6846",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:5},{value:"\u8BF4\u660E",paraId:1,tocIndex:5},{value:"\u7C7B\u578B",paraId:1,tocIndex:5},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:5},{value:"visible",paraId:1,tocIndex:5},{value:"\u662F\u5426\u53EF\u89C1",paraId:1,tocIndex:5},{value:"boolean",paraId:1,tocIndex:5},{value:"false",paraId:1,tocIndex:5},{value:"record",paraId:1,tocIndex:5},{value:"\u9009\u4E2D\u6570\u636E",paraId:1,tocIndex:5},{value:"T | undefined",paraId:1,tocIndex:5},{value:"undefined",paraId:1,tocIndex:5},{value:"open",paraId:1,tocIndex:5},{value:"\u6253\u5F00",paraId:1,tocIndex:5},{value:"(record?: T) => void",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5},{value:"close",paraId:1,tocIndex:5},{value:"\u5173\u95ED",paraId:1,tocIndex:5},{value:"() => void",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5}]},88455:function(o,e){e.Z=`import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Table } from 'antd';
import type { ColumnType } from 'antd/lib/table';

import useModal from '..';

interface IDataSource {
    id: string;
    name: string;
    age: number;
    address: string;
}

const data: IDataSource[] = [
    {
        id: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        id: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        id: '3',
        name: 'Joe Black',
        age: 52,
        address: 'Sydney No. 1 Lake Park',
    },
    {
        id: '4',
        name: 'Jim Red',
        age: 62,
        address: 'London No. 2 Lake Park',
    },
];

export default () => {
    const modal = useModal<IDataSource>();
    const [form] = Form.useForm<IDataSource>();

    const columns: ColumnType<IDataSource>[] = [
        {
            key: 'name',
            title: 'name',
            dataIndex: 'name',
        },
        {
            key: 'age',
            title: 'age',
            dataIndex: 'age',
        },
        {
            key: 'address',
            title: 'address',
            dataIndex: 'address',
        },
        {
            key: 'operation',
            title: '\u64CD\u4F5C',
            render: (_, record) => {
                return (
                    <Button
                        type="link"
                        onClick={() => {
                            modal.open(record);
                        }}
                    >
                        \u7F16\u8F91
                    </Button>
                );
            },
        },
    ];

    useEffect(() => {
        if (modal.visible) {
            form.setFieldsValue({
                name: modal.record?.name,
                age: modal.record?.age,
                address: modal.record?.address,
            });
        } else {
            form.resetFields();
        }
    }, [modal.record, modal.visible]);

    return (
        <>
            <Table
                columns={columns}
                size="small"
                scroll={{ y: 200 }}
                dataSource={data}
                rowKey="uuid"
                bordered
            />
            <Modal
                title="\u4FEE\u6539\u4FE1\u606F"
                visible={modal.visible}
                onOk={modal.close}
                onCancel={modal.close}
            >
                <Form form={form}>
                    <Form.Item label="\u59D3\u540D" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="\u5E74\u9F84" name="age">
                        <Input />
                    </Form.Item>
                    <Form.Item label="\u5730\u5740" name="address">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
`},42813:function(o,e){e.Z=`import { useState } from 'react';

const useModal = <T>() => {
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState<T | undefined>(undefined);

    const open = (record?: T) => {
        setRecord(record);
        setVisible(true);
    };

    const close = () => {
        setRecord(undefined);
        setVisible(false);
    };

    return { visible, record, open, close };
};

export default useModal;
`}}]);
