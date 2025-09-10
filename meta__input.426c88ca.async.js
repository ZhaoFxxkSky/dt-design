"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[6300],{26644:function(d,t,n){n.r(t),n.d(t,{demos:function(){return e}});var o=n(75271),e={"src-input-index-tab-match-demo-basic":{component:o.memo(o.lazy(function(){return Promise.all([n.e(7350),n.e(327),n.e(1270),n.e(3370),n.e(1204),n.e(8704),n.e(1273),n.e(7127),n.e(3350),n.e(3060),n.e(9520),n.e(478),n.e(3493),n.e(168),n.e(8208),n.e(2878),n.e(8327),n.e(770),n.e(8526),n.e(2179),n.e(5053),n.e(27),n.e(7524),n.e(8288),n.e(8460),n.e(7955),n.e(3859),n.e(4920),n.e(732),n.e(2433)]).then(n.bind(n,8078))})),asset:{type:"BLOCK",id:"src-input-index-tab-match-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(38895).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.22.5"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528",description:"\u901A\u8FC7\u56DE\u8F66\u952E\u89E6\u53D1 onSearch \u4E8B\u4EF6"},context:void 0,renderOpts:void 0},"src-input-index-tab-match-demo-filteroptions":{component:o.memo(o.lazy(function(){return Promise.all([n.e(7350),n.e(327),n.e(1270),n.e(3370),n.e(1204),n.e(8704),n.e(1273),n.e(7127),n.e(3350),n.e(3060),n.e(9520),n.e(478),n.e(3493),n.e(168),n.e(8208),n.e(2878),n.e(8327),n.e(770),n.e(8526),n.e(2179),n.e(5053),n.e(27),n.e(7524),n.e(8288),n.e(8460),n.e(7955),n.e(3859),n.e(4920),n.e(732),n.e(2433)]).then(n.bind(n,3825))})),asset:{type:"BLOCK",id:"src-input-index-tab-match-demo-filteroptions",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(77795).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u63A7\u5236\u5339\u914D\u9879",description:"\u4EC5\u652F\u6301\u5934\u90E8\u5339\u914D"},context:void 0,renderOpts:void 0}}},45505:function(d,t,n){n.r(t),n.d(t,{demos:function(){return e}});var o=n(75271),e={"input-demo-basic":{component:o.memo(o.lazy(function(){return Promise.all([n.e(7350),n.e(327),n.e(1270),n.e(3370),n.e(1204),n.e(8704),n.e(1273),n.e(7127),n.e(2295)]).then(n.bind(n,63531))})),asset:{type:"BLOCK",id:"input-demo-basic",refAtomIds:["input"],dependencies:{"index.tsx":{type:"FILE",value:n(79700).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.22.5"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528",description:"\u901A\u8FC7\u56DE\u8F66\u952E\u89E6\u53D1 onSearch \u4E8B\u4EF6"},context:void 0,renderOpts:void 0}}},79884:function(d,t,n){n.r(t),n.d(t,{texts:function(){return o}});const o=[{value:"\u9700\u8981\u7528\u6237\u8F93\u5165\u5185\u5BB9\u65F6\u3002",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:5},{value:"\u8BF4\u660E",paraId:1,tocIndex:5},{value:"\u7C7B\u578B",paraId:1,tocIndex:5},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:5},{value:"onPressEnter",paraId:1,tocIndex:5},{value:"\u8F93\u5165\u82F1\u6587\u56DE\u8F66\u7684\u56DE\u8C03\u51FD\u6570",paraId:1,tocIndex:5},{value:"Function",paraId:1,tocIndex:5},{value:"onPressEnterNative",paraId:1,tocIndex:5},{value:"\u8F93\u5165\u4EFB\u610F\u56DE\u8F66\u7684\u56DE\u8C03\u51FD\u6570",paraId:1,tocIndex:5},{value:"Function",paraId:1,tocIndex:5},{value:"\u5176\u4F59\u5C5E\u6027\u5747\u7EE7\u627F\u81EA ",paraId:2,tocIndex:5},{value:"Input",paraId:2,tocIndex:5},{value:" \u7EC4\u4EF6\uFF0C\u53C2\u8003 ",paraId:2,tocIndex:5},{value:"Input API",paraId:2,tocIndex:5}]},79700:function(d,t){t.Z=`import React from 'react';
import { Space } from 'antd';
import { Input } from 'dt-design';

export default () => {
    return (
        <Space direction="vertical">
            <Input
                style={{ width: 500 }}
                placeholder="\u8F93\u5165\u4E2D\u6587\u56DE\u8F66\u4E0D\u4F1A\u89E6\u53D1 onPressEnter \u4E8B\u4EF6"
                onPressEnter={() => alert('\u89E6\u53D1')}
            />
            <Input
                style={{ width: 500 }}
                placeholder="\u4EFB\u610F\u56DE\u8F66\u5747\u89E6\u53D1 onPressEnterNative \u4E8B\u4EF6"
                onPressEnterNative={() => alert('\u89E6\u53D1')}
            />
        </Space>
    );
};
`},38895:function(d,t){t.Z=`import React, { useState } from 'react';
import { Radio } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { Input } from 'dt-design';

export default () => {
    const [size, setSize] = useState<SizeType>('middle');
    return (
        <>
            <Radio.Group
                optionType="button"
                value={size}
                options={[
                    { label: 'small', value: 'small' },
                    { label: 'middle', value: 'middle' },
                    { label: 'large', value: 'large' },
                ]}
                onChange={(e) => setSize(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Input.Match
                size={size}
                placeholder="\u6309\u540D\u79F0\u641C\u7D22"
                onChange={(e) => console.log('e', e.target.value)}
                onTypeChange={(type) => console.log('onTypeChange:', type)}
                onSearch={(value, searchType) => console.log('onSearch:', value, searchType)}
            />
        </>
    );
};
`},77795:function(d,t){t.Z=`import React from 'react';
import { Input } from 'dt-design';

export default () => {
    return (
        <Input.Match
            filterOptions={['front']}
            placeholder="\u6309\u540D\u79F0\u641C\u7D22"
            onChange={(e) => console.log('e', e.target.value)}
            onTypeChange={(type) => console.log('onTypeChange:', type)}
            onSearch={(value, searchType) => console.log('onSearch:', value, searchType)}
        />
    );
};
`}}]);
