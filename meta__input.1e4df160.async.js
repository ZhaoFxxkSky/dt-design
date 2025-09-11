"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[6300],{80282:function(d,t,n){n.r(t),n.d(t,{demos:function(){return e}});var o=n(75271),e={"src-input-index-tab-match-demo-basic":{component:o.memo(o.lazy(function(){return Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(4072),n.e(9520),n.e(4949),n.e(7029),n.e(9448),n.e(2366),n.e(230),n.e(1130),n.e(5512),n.e(9826),n.e(7430),n.e(9575),n.e(9504),n.e(27),n.e(8230),n.e(1966),n.e(7955),n.e(2133),n.e(8484),n.e(2784),n.e(2433)]).then(n.bind(n,51353))})),asset:{type:"BLOCK",id:"src-input-index-tab-match-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(36964).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.24.16"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528",description:"\u901A\u8FC7\u56DE\u8F66\u952E\u89E6\u53D1 onSearch \u4E8B\u4EF6"},context:void 0,renderOpts:void 0},"src-input-index-tab-match-demo-filteroptions":{component:o.memo(o.lazy(function(){return Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(4072),n.e(9520),n.e(4949),n.e(7029),n.e(9448),n.e(2366),n.e(230),n.e(1130),n.e(5512),n.e(9826),n.e(7430),n.e(9575),n.e(9504),n.e(27),n.e(8230),n.e(1966),n.e(7955),n.e(2133),n.e(8484),n.e(2784),n.e(2433)]).then(n.bind(n,80825))})),asset:{type:"BLOCK",id:"src-input-index-tab-match-demo-filteroptions",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(81167).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u63A7\u5236\u5339\u914D\u9879",description:"\u4EC5\u652F\u6301\u5934\u90E8\u5339\u914D"},context:void 0,renderOpts:void 0}}},10014:function(d,t,n){n.r(t),n.d(t,{demos:function(){return e}});var o=n(75271),e={"input-demo-basic":{component:o.memo(o.lazy(function(){return Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(2295)]).then(n.bind(n,47682))})),asset:{type:"BLOCK",id:"input-demo-basic",refAtomIds:["input"],dependencies:{"index.tsx":{type:"FILE",value:n(41385).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.24.16"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528",description:"\u901A\u8FC7\u56DE\u8F66\u952E\u89E6\u53D1 onSearch \u4E8B\u4EF6"},context:void 0,renderOpts:void 0}}},31872:function(d,t,n){n.r(t),n.d(t,{texts:function(){return o}});const o=[{value:"\u9700\u8981\u7528\u6237\u8F93\u5165\u5185\u5BB9\u65F6\u3002",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:5},{value:"\u8BF4\u660E",paraId:1,tocIndex:5},{value:"\u7C7B\u578B",paraId:1,tocIndex:5},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:5},{value:"onPressEnter",paraId:1,tocIndex:5},{value:"\u8F93\u5165\u82F1\u6587\u56DE\u8F66\u7684\u56DE\u8C03\u51FD\u6570",paraId:1,tocIndex:5},{value:"Function",paraId:1,tocIndex:5},{value:"onPressEnterNative",paraId:1,tocIndex:5},{value:"\u8F93\u5165\u4EFB\u610F\u56DE\u8F66\u7684\u56DE\u8C03\u51FD\u6570",paraId:1,tocIndex:5},{value:"Function",paraId:1,tocIndex:5},{value:"\u5176\u4F59\u5C5E\u6027\u5747\u7EE7\u627F\u81EA ",paraId:2,tocIndex:5},{value:"Input",paraId:2,tocIndex:5},{value:" \u7EC4\u4EF6\uFF0C\u53C2\u8003 ",paraId:2,tocIndex:5},{value:"Input API",paraId:2,tocIndex:5}]},41385:function(d,t){t.Z=`import React from 'react';
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
`},36964:function(d,t){t.Z=`import React, { useState } from 'react';
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
`},81167:function(d,t){t.Z=`import React from 'react';
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
