"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[7056],{90714:function(a,t,n){n.r(t),n.d(t,{demos:function(){return e}});var d=n(75271),e={"tinytag-demo-basic":{component:d.memo(d.lazy(function(){return Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(4072),n.e(4949),n.e(7029),n.e(9448),n.e(2366),n.e(230),n.e(5512),n.e(9826),n.e(7430),n.e(497)]).then(n.bind(n,13822))})),asset:{type:"BLOCK",id:"tinytag-demo-basic",refAtomIds:["tinyTag"],dependencies:{"index.tsx":{type:"FILE",value:n(52957).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.24.16"},"dt-design":{type:"NPM",value:"1.0.0"},"./style.scss":{type:"FILE",value:n(62189).Z}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528"},context:void 0,renderOpts:void 0},"tinytag-demo-table":{component:d.memo(d.lazy(function(){return Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(4072),n.e(4949),n.e(7029),n.e(9448),n.e(2366),n.e(230),n.e(5512),n.e(9826),n.e(7430),n.e(497)]).then(n.bind(n,40973))})),asset:{type:"BLOCK",id:"tinytag-demo-table",refAtomIds:["tinyTag"],dependencies:{"index.tsx":{type:"FILE",value:n(78063).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u8868\u683C\u4F7F\u7528"},context:void 0,renderOpts:void 0}}},85428:function(a,t,n){n.r(t),n.d(t,{texts:function(){return d}});const d=[{value:"TinyTag \u7EC4\u4EF6\u901A\u5E38\u7528\u4E8E\u5728\u67D0\u4E9B\u6587\u6848\u540E\u9762\uFF0C\u7528\u4E8E\u6807\u8BC6\u5F53\u524D\u884C\u6570\u636E\u7684\u5206\u7C7B",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:6},{value:"\u8BF4\u660E",paraId:1,tocIndex:6},{value:"\u7C7B\u578B",paraId:1,tocIndex:6},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:6},{value:"value",paraId:1,tocIndex:6},{value:"\u6807\u7B7E\u6587\u6848",paraId:1,tocIndex:6},{value:"string",paraId:1,tocIndex:6},{value:"className",paraId:1,tocIndex:6},{value:"class \u540D\u79F0",paraId:1,tocIndex:6},{value:"string",paraId:1,tocIndex:6}]},52957:function(a,t){t.Z=`import React from 'react';
import { Space } from 'antd';
import { TinyTag } from 'dt-design';

import './style.scss';

export default () => {
    return (
        <Space size={6}>
            <TinyTag value="\u6570\u5151\u79D1\u6280" />
            <TinyTag className="data-tag" value="\u6570\u636E\u9A71\u52A8" />
            <TinyTag className="ued-tag" value="UED" />
        </Space>
    );
};
`},62189:function(a,t){t.Z=`.data-tag {
    color: #D1D1D1;
    &:hover {
        color: #D56161;
    }
}

.ued-tag {
    color: #D56161;
}
`},78063:function(a,t){t.Z=`import React from 'react';
import { Table, TinyTag } from 'dt-design';

interface DataType {
    id: number;
    name: string;
    age: number;
    type: 0 | 1 | 2;
    address: string;
}

const dataSource = [
    { id: 1, type: 0, name: 'ZhangSan', age: 17, address: 'New York No. 1 Lake Park' },
    { id: 2, type: 1, name: 'LiSi', age: 17, address: 'Bei Jing No. 1 Lake Park' },
    { id: 3, type: 2, name: 'WangWu', age: 17, address: 'Zhe Jiang No. 1 Lake Park' },
] as DataType[];

const typpings = ['\u536B\u751F\u59D4\u5458', '\u73ED\u957F', '\u56E2\u59D4\u4E66\u8BB0'];

export default () => {
    return (
        <Table<DataType>
            rowKey="id"
            columns={[
                {
                    dataIndex: 'name',
                    title: 'Name',
                    render(text, record) {
                        return (
                            <span>
                                {text}
                                <TinyTag value={typpings[record.type]} />
                            </span>
                        );
                    },
                },
                {
                    dataIndex: 'age',
                    title: 'Age',
                },
                { dataIndex: 'address', title: 'Address' },
            ]}
            dataSource={dataSource}
            pagination={false}
            bordered
        />
    );
};
`}}]);
