"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[36],{55542:function(R,s,n){n.r(s),n.d(s,{demos:function(){return K}});var P=n(90228),x=n.n(P),T=n(48305),C=n.n(T),B=n(87999),D=n.n(B),r=n(75271),K={"collapsibleactionitems-demo-0":{component:r.memo(r.lazy(D()(x()().mark(function h(){var o,t,m,I,i,a,v,l,y,u;return x()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.next=2,Promise.resolve().then(n.t.bind(n,75271,19));case 2:return o=d.sent,t=o.default,m=o.useState,d.next=7,Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(4072),n.e(9520),n.e(4949),n.e(7029),n.e(9448),n.e(3880),n.e(2366),n.e(230),n.e(1130),n.e(5512),n.e(9826),n.e(7430),n.e(9575),n.e(7145),n.e(9504),n.e(1911),n.e(6117),n.e(27),n.e(8230),n.e(1966),n.e(4916),n.e(4654),n.e(9620),n.e(3697),n.e(8484),n.e(2784),n.e(4455)]).then(n.bind(n,64273));case 7:return I=d.sent,i=I.CollapsibleActionItems,d.next=11,Promise.all([n.e(8945),n.e(5385),n.e(6082),n.e(2208),n.e(4072),n.e(7029),n.e(9448),n.e(3880),n.e(2366),n.e(7145),n.e(1699),n.e(7316),n.e(2133),n.e(4464)]).then(n.bind(n,84464));case 11:return a=d.sent,v=a.Table,l=a.message,y=a.Popconfirm,u=a.Button,d.abrupt("return",{default:function(){var S=m([{id:1,name:"\u6211\u662F\u6D4B\u8BD5\u6570\u636E"},{id:2,name:"\u6211\u662F\u6837\u672C\u6570\u636E"}]),f=C()(S,2),p=f[0],O=f[1],A=function(c){switch(c){case"edit":l.info("\u7F16\u8F91\u88AB\u70B9\u51FB");break;case"close":l.info("\u5173\u95ED\u88AB\u70B9\u51FB");break;case"open":l.info("\u5F00\u542F\u88AB\u70B9\u51FB");default:break}},E=[{title:"id",dataIndex:"id"},{title:"\u540D\u79F0",dataIndex:"name"},{title:"\u64CD\u4F5C",dataIndex:"",width:230,render:function(){var c=[{key:"edit",name:"\u7F16\u8F91"},{key:"delete",name:"\u5220\u9664",render:function(){return t.createElement(y,{title:"\u786E\u8BA4\u5220\u9664\uFF1F"},t.createElement(u,{type:"link",style:{color:"red"}},"\u5220\u9664"))}},{key:"close",name:"\u5173\u95ED"},{key:"open",name:"\u5F00\u542F",disabled:!0}];return t.createElement(i,{maxCount:3,actionItems:c,onItemClick:A})}}];return t.createElement(v,{rowKey:"id",dataSource:p,columns:E})}});case 17:case"end":return d.stop()}},h)})))),asset:{type:"BLOCK",id:"collapsibleactionitems-demo-0",refAtomIds:["collapsibleActionItems"],dependencies:{"index.jsx":{type:"FILE",value:`import React, { useState } from 'react';
import { CollapsibleActionItems } from 'dt-design';
import { Table, message, Popconfirm, Button } from 'antd';

export default () => {
    const [dataSource, setDataSource] = useState([
        {
            id: 1,
            name: '\u6211\u662F\u6D4B\u8BD5\u6570\u636E',
        },
        {
            id: 2,
            name: '\u6211\u662F\u6837\u672C\u6570\u636E',
        },
    ]);

    const handleClick = (key) => {
        switch (key) {
            case 'edit':
                message.info('\u7F16\u8F91\u88AB\u70B9\u51FB');
                break;
            case 'close':
                message.info('\u5173\u95ED\u88AB\u70B9\u51FB');
                break;
            case 'open':
                message.info('\u5F00\u542F\u88AB\u70B9\u51FB');
            default:
                break;
        }
    };

    const cols = [
        {
            title: 'id',
            dataIndex: 'id',
        },
        {
            title: '\u540D\u79F0',
            dataIndex: 'name',
        },
        {
            title: '\u64CD\u4F5C',
            dataIndex: '',
            width: 230,
            render: () => {
                const actions = [
                    { key: 'edit', name: '\u7F16\u8F91' },
                    {
                        key: 'delete',
                        name: '\u5220\u9664',
                        render: () => (
                            <Popconfirm title="\u786E\u8BA4\u5220\u9664\uFF1F">
                                <Button type="link" style={{ color: 'red' }}>
                                    \u5220\u9664
                                </Button>
                            </Popconfirm>
                        ),
                    },
                    { key: 'close', name: '\u5173\u95ED' },
                    { key: 'open', name: '\u5F00\u542F', disabled: true },
                ];
                return (
                    <CollapsibleActionItems
                        maxCount={3}
                        actionItems={actions}
                        onItemClick={handleClick}
                    />
                );
            },
        },
    ];

    return <Table rowKey="id" dataSource={dataSource} columns={cols} />;
};`},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"},antd:{type:"NPM",value:"4.24.16"}},entry:"index.jsx",title:"\u8868\u683C\u5185\u4F7F\u7528"},context:void 0,renderOpts:void 0},"collapsibleactionitems-demo-1":{component:r.memo(r.lazy(D()(x()().mark(function h(){var o,t,m,I,i,a,v,l,y,u,g;return x()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.resolve().then(n.t.bind(n,75271,19));case 2:return o=e.sent,t=o.default,m=o.useState,e.next=7,Promise.all([n.e(8945),n.e(5136),n.e(5385),n.e(6455),n.e(9166),n.e(6105),n.e(6082),n.e(8704),n.e(2208),n.e(2276),n.e(3479),n.e(4072),n.e(9520),n.e(4949),n.e(7029),n.e(9448),n.e(3880),n.e(2366),n.e(230),n.e(1130),n.e(5512),n.e(9826),n.e(7430),n.e(9575),n.e(7145),n.e(9504),n.e(1911),n.e(6117),n.e(27),n.e(8230),n.e(1966),n.e(4916),n.e(4654),n.e(9620),n.e(3697),n.e(8484),n.e(2784),n.e(4455)]).then(n.bind(n,64273));case 7:return I=e.sent,i=I.CollapsibleActionItems,e.next=11,Promise.all([n.e(8945),n.e(5385),n.e(6082),n.e(2208),n.e(4072),n.e(7029),n.e(9448),n.e(3880),n.e(2366),n.e(7145),n.e(1699),n.e(7316),n.e(2133),n.e(4464)]).then(n.bind(n,84464));case 11:return a=e.sent,v=a.Table,l=a.message,y=a.Popconfirm,e.next=17,n.e(8704).then(n.bind(n,18704));case 17:return u=e.sent,g=u.DownOutlined,e.abrupt("return",{default:function(){var f=m([{id:1,name:"\u6211\u662F\u6D4B\u8BD5\u6570\u636E"}]),p=C()(f,2),O=p[0],A=p[1],E=[{title:"id",dataIndex:"id"},{title:"\u540D\u79F0",dataIndex:"name"},{title:"\u64CD\u4F5C",dataIndex:"",width:230,render:function(){var c=[{key:"edit",name:"\u7F16\u8F91"},{key:"delete",name:"\u5220\u9664"},{key:"close",name:"\u5173\u95ED"},{key:"open",name:"\u5F00\u542F"}];return t.createElement(i,{maxCount:3,actionItems:c,divider:t.createElement("span",{style:{color:"#eee"}},"-"),collapseIcon:t.createElement(g,{style:{marginLeft:16}})})}}];return t.createElement(v,{rowKey:"id",dataSource:O,columns:E})}});case 20:case"end":return e.stop()}},h)})))),asset:{type:"BLOCK",id:"collapsibleactionitems-demo-1",refAtomIds:["collapsibleActionItems"],dependencies:{"index.jsx":{type:"FILE",value:`import React, { useState } from 'react';
import { CollapsibleActionItems } from 'dt-design';
import { Table, message, Popconfirm } from 'antd';
import { DownOutlined } from '@dtinsight/react-icons';

export default () => {
    const [dataSource, setDataSource] = useState([
        {
            id: 1,
            name: '\u6211\u662F\u6D4B\u8BD5\u6570\u636E',
        },
    ]);

    const cols = [
        {
            title: 'id',
            dataIndex: 'id',
        },
        {
            title: '\u540D\u79F0',
            dataIndex: 'name',
        },
        {
            title: '\u64CD\u4F5C',
            dataIndex: '',
            width: 230,
            render: () => {
                const actions = [
                    { key: 'edit', name: '\u7F16\u8F91' },
                    { key: 'delete', name: '\u5220\u9664' },
                    { key: 'close', name: '\u5173\u95ED' },
                    { key: 'open', name: '\u5F00\u542F' },
                ];
                return (
                    <CollapsibleActionItems
                        maxCount={3}
                        actionItems={actions}
                        divider={<span style={{ color: '#eee' }}>-</span>}
                        collapseIcon={<DownOutlined style={{ marginLeft: 16 }} />}
                    />
                );
            },
        },
    ];

    return <Table rowKey="id" dataSource={dataSource} columns={cols} />;
};`},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"},antd:{type:"NPM",value:"4.24.16"},"@dtinsight/react-icons":{type:"NPM",value:"1.5.0"}},entry:"index.jsx",title:"\u81EA\u5B9A\u4E49\u5206\u5272\u7B26\u4E0E\u4E0B\u62C9\u56FE\u6807"},context:void 0,renderOpts:void 0}}},35519:function(R,s,n){n.r(s),n.d(s,{texts:function(){return P}});const P=[{value:"\u5F53\u64CD\u4F5C\u9879\u8FC7\u591A\u65F6\uFF0C\u5C06\u591A\u4F59\u7684\u64CD\u4F5C\u9879\u5C55\u793A\u5728\u4E0B\u62C9\u83DC\u5355\u4E2D\uFF0C\u4E00\u822C\u7528\u4E8E\u8868\u683C\u7684\u64CD\u4F5C\u680F",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:6},{value:"\u8BF4\u660E",paraId:1,tocIndex:6},{value:"\u7C7B\u578B",paraId:1,tocIndex:6},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:6},{value:"actionItems",paraId:1,tocIndex:6},{value:"\u64CD\u4F5C\u9879",paraId:1,tocIndex:6},{value:"ActionItem",paraId:2,tocIndex:6},{value:"[]",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"maxCount",paraId:1,tocIndex:6},{value:"\u6700\u5927\u5C55\u793A\u6570\u91CF\uFF0C\u8D85\u51FA\u90E8\u5206\u4F1A\u6298\u53E0\u81F3\u4E0B\u62C9\u83DC\u5355\u4E2D",paraId:1,tocIndex:6},{value:"number",paraId:1,tocIndex:6},{value:"3",paraId:1,tocIndex:6},{value:"divider",paraId:1,tocIndex:6},{value:"\u64CD\u4F5C\u9879\u5206\u5272\u7B26",paraId:1,tocIndex:6},{value:"React.ReactNode",paraId:1,tocIndex:6},{value:"<Divider type='vertical'/>",paraId:1,tocIndex:6},{value:"collapseIcon",paraId:1,tocIndex:6},{value:"\u4E0B\u62C9\u83DC\u5355\u6298\u53E0\u56FE\u6807",paraId:1,tocIndex:6},{value:"React.ReactNode",paraId:1,tocIndex:6},{value:"<EllipsisOutlined />",paraId:1,tocIndex:6},{value:"dropdownProps",paraId:1,tocIndex:6},{value:"\u6298\u53E0\u83DC\u5355\u989D\u5916\u7684 Props, \u8BE6\u7EC6\u8BF7\u53C2\u8003 antd \u7684",paraId:1,tocIndex:6},{value:"Dropdown",paraId:1,tocIndex:6},{value:"\u7EC4\u4EF6",paraId:1,tocIndex:6},{value:"DropDownProps",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"buttonProps",paraId:1,tocIndex:6},{value:"\u6309\u94AE\u989D\u5916\u7684 Props, \u8BE6\u7EC6\u8BF7\u53C2\u8003 antd \u7684",paraId:1,tocIndex:6},{value:"Button",paraId:1,tocIndex:6},{value:"\u7EC4\u4EF6",paraId:1,tocIndex:6},{value:"ButtonProps",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"onItemClick",paraId:1,tocIndex:6},{value:"\u64CD\u4F5C\u9879\u70B9\u51FB\u4E8B\u4EF6",paraId:1,tocIndex:6},{value:"(key: React.Key) => void",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"\u53C2\u6570",paraId:3,tocIndex:7},{value:"\u8BF4\u660E",paraId:3,tocIndex:7},{value:"\u7C7B\u578B",paraId:3,tocIndex:7},{value:"\u9ED8\u8BA4\u503C",paraId:3,tocIndex:7},{value:"key",paraId:3,tocIndex:7},{value:"\u552F\u4E00\u6807\u8BC6",paraId:3,tocIndex:7},{value:"React.Key",paraId:3,tocIndex:7},{value:"-",paraId:3,tocIndex:7},{value:"name",paraId:3,tocIndex:7},{value:"\u663E\u793A\u7684\u540D\u79F0",paraId:3,tocIndex:7},{value:"string",paraId:3,tocIndex:7},{value:"-",paraId:3,tocIndex:7},{value:"disabled",paraId:3,tocIndex:7},{value:"\u662F\u5426\u7981\u7528",paraId:3,tocIndex:7},{value:"boolean",paraId:3,tocIndex:7},{value:"false",paraId:3,tocIndex:7},{value:"render",paraId:3,tocIndex:7},{value:"\u81EA\u5B9A\u4E49\u6E32\u67D3\uFF0C\u672A\u6298\u53E0\u7684\u64CD\u4F5C\u9879\u9ED8\u8BA4\u4F1A\u4EE5",paraId:3,tocIndex:7},{value:"link",paraId:3,tocIndex:7},{value:"\u7C7B\u578B\u7684 ",paraId:3,tocIndex:7},{value:"Button",paraId:3,tocIndex:7},{value:"\u5F62\u5F0F\u5C55\u793A",paraId:3,tocIndex:7},{value:"() => React.ReactNode",paraId:3,tocIndex:7},{value:"-",paraId:3,tocIndex:7}]}}]);
