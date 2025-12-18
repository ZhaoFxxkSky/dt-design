"use strict";(self.webpackChunk_dtjoy_dt_design=self.webpackChunk_dtjoy_dt_design||[]).push([[36],{82481:function(R,r,e){e.r(r),e.d(r,{demos:function(){return j}});var P=e(90228),v=e.n(P),T=e(48305),h=e.n(T),B=e(87999),g=e.n(B),p=e(75271),j={"collapsibleactionitems-demo-0":{component:p.memo(p.lazy(g()(v()().mark(function D(){var o,t,s,I,m,d,i,l,x,c;return v()().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,Promise.resolve().then(e.t.bind(e,75271,19));case 2:return o=a.sent,t=o.default,s=o.useState,a.next=7,Promise.all([e.e(5959),e.e(6299),e.e(1111),e.e(6104),e.e(1708),e.e(3780),e.e(4755),e.e(1821),e.e(1995),e.e(8848),e.e(4826),e.e(8160),e.e(9298),e.e(4867),e.e(1896),e.e(4016),e.e(3287)]).then(e.bind(e,69364));case 7:return I=a.sent,m=I.CollapsibleActionItems,a.next=11,Promise.all([e.e(7779),e.e(5959),e.e(6299),e.e(6104),e.e(1708),e.e(4957),e.e(4755),e.e(6805),e.e(4826),e.e(5219),e.e(4455),e.e(568),e.e(6933),e.e(7892)]).then(e.bind(e,37892));case 11:return d=a.sent,i=d.Table,l=d.message,x=d.Popconfirm,c=d.Button,a.abrupt("return",{default:function(){var S=s([{id:1,name:"\u6211\u662F\u6D4B\u8BD5\u6570\u636E"},{id:2,name:"\u6211\u662F\u6837\u672C\u6570\u636E"}]),y=h()(S,2),f=y[0],O=y[1],A=function(u){switch(u){case"edit":l.info("\u7F16\u8F91\u88AB\u70B9\u51FB");break;case"close":l.info("\u5173\u95ED\u88AB\u70B9\u51FB");break;case"open":l.info("\u5F00\u542F\u88AB\u70B9\u51FB");default:break}},C=[{title:"id",dataIndex:"id"},{title:"\u540D\u79F0",dataIndex:"name"},{title:"\u64CD\u4F5C",dataIndex:"",width:230,render:function(){var u=[{key:"edit",name:"\u7F16\u8F91"},{key:"delete",name:"\u5220\u9664",render:function(){return t.createElement(x,{title:"\u786E\u8BA4\u5220\u9664\uFF1F"},t.createElement(c,{type:"link",style:{color:"red"}},"\u5220\u9664"))}},{key:"close",name:"\u5173\u95ED"},{key:"open",name:"\u5F00\u542F",disabled:!0}];return t.createElement(m,{maxCount:3,actionItems:u,onItemClick:A})}}];return t.createElement(i,{rowKey:"id",dataSource:f,columns:C})}});case 17:case"end":return a.stop()}},D)})))),asset:{type:"BLOCK",id:"collapsibleactionitems-demo-0",refAtomIds:["collapsibleActionItems"],dependencies:{"index.jsx":{type:"FILE",value:`import React, { useState } from 'react';\r
import { CollapsibleActionItems } from '@dtjoy/dt-design';\r
import { Table, message, Popconfirm, Button } from 'antd';\r
\r
export default () => {\r
    const [dataSource, setDataSource] = useState([\r
        {\r
            id: 1,\r
            name: '\u6211\u662F\u6D4B\u8BD5\u6570\u636E',\r
        },\r
        {\r
            id: 2,\r
            name: '\u6211\u662F\u6837\u672C\u6570\u636E',\r
        },\r
    ]);\r
\r
    const handleClick = (key) => {\r
        switch (key) {\r
            case 'edit':\r
                message.info('\u7F16\u8F91\u88AB\u70B9\u51FB');\r
                break;\r
            case 'close':\r
                message.info('\u5173\u95ED\u88AB\u70B9\u51FB');\r
                break;\r
            case 'open':\r
                message.info('\u5F00\u542F\u88AB\u70B9\u51FB');\r
            default:\r
                break;\r
        }\r
    };\r
\r
    const cols = [\r
        {\r
            title: 'id',\r
            dataIndex: 'id',\r
        },\r
        {\r
            title: '\u540D\u79F0',\r
            dataIndex: 'name',\r
        },\r
        {\r
            title: '\u64CD\u4F5C',\r
            dataIndex: '',\r
            width: 230,\r
            render: () => {\r
                const actions = [\r
                    { key: 'edit', name: '\u7F16\u8F91' },\r
                    {\r
                        key: 'delete',\r
                        name: '\u5220\u9664',\r
                        render: () => (\r
                            <Popconfirm title="\u786E\u8BA4\u5220\u9664\uFF1F">\r
                                <Button type="link" style={{ color: 'red' }}>\r
                                    \u5220\u9664\r
                                </Button>\r
                            </Popconfirm>\r
                        ),\r
                    },\r
                    { key: 'close', name: '\u5173\u95ED' },\r
                    { key: 'open', name: '\u5F00\u542F', disabled: true },\r
                ];\r
                return (\r
                    <CollapsibleActionItems\r
                        maxCount={3}\r
                        actionItems={actions}\r
                        onItemClick={handleClick}\r
                    />\r
                );\r
            },\r
        },\r
    ];\r
\r
    return <Table rowKey="id" dataSource={dataSource} columns={cols} />;\r
};`},react:{type:"NPM",value:"18.3.1"},"@dtjoy/dt-design":{type:"NPM",value:"1.0.3"},antd:{type:"NPM",value:"4.24.16"}},entry:"index.jsx",title:"\u8868\u683C\u5185\u4F7F\u7528"},context:void 0,renderOpts:void 0},"collapsibleactionitems-demo-1":{component:p.memo(p.lazy(g()(v()().mark(function D(){var o,t,s,I,m,d,i,l,x,c,E;return v()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,Promise.resolve().then(e.t.bind(e,75271,19));case 2:return o=n.sent,t=o.default,s=o.useState,n.next=7,Promise.all([e.e(5959),e.e(6299),e.e(1111),e.e(6104),e.e(1708),e.e(3780),e.e(4755),e.e(1821),e.e(1995),e.e(8848),e.e(4826),e.e(8160),e.e(9298),e.e(4867),e.e(1896),e.e(4016),e.e(3287)]).then(e.bind(e,69364));case 7:return I=n.sent,m=I.CollapsibleActionItems,n.next=11,Promise.all([e.e(7779),e.e(5959),e.e(6299),e.e(6104),e.e(1708),e.e(4957),e.e(4755),e.e(6805),e.e(4826),e.e(5219),e.e(4455),e.e(568),e.e(6933),e.e(7892)]).then(e.bind(e,37892));case 11:return d=n.sent,i=d.Table,l=d.message,x=d.Popconfirm,n.next=17,Promise.all([e.e(5959),e.e(6104),e.e(568),e.e(6610)]).then(e.bind(e,66610));case 17:return c=n.sent,E=c.DownOutlined,n.abrupt("return",{default:function(){var y=s([{id:1,name:"\u6211\u662F\u6D4B\u8BD5\u6570\u636E"}]),f=h()(y,2),O=f[0],A=f[1],C=[{title:"id",dataIndex:"id"},{title:"\u540D\u79F0",dataIndex:"name"},{title:"\u64CD\u4F5C",dataIndex:"",width:230,render:function(){var u=[{key:"edit",name:"\u7F16\u8F91"},{key:"delete",name:"\u5220\u9664"},{key:"close",name:"\u5173\u95ED"},{key:"open",name:"\u5F00\u542F"}];return t.createElement(m,{maxCount:3,actionItems:u,divider:t.createElement("span",{style:{color:"#eee"}},"-"),collapseIcon:t.createElement(E,{style:{marginLeft:16}})})}}];return t.createElement(i,{rowKey:"id",dataSource:O,columns:C})}});case 20:case"end":return n.stop()}},D)})))),asset:{type:"BLOCK",id:"collapsibleactionitems-demo-1",refAtomIds:["collapsibleActionItems"],dependencies:{"index.jsx":{type:"FILE",value:`import React, { useState } from 'react';\r
import { CollapsibleActionItems } from '@dtjoy/dt-design';\r
import { Table, message, Popconfirm } from 'antd';\r
import { DownOutlined } from '@ant-design/icons';\r
\r
export default () => {\r
    const [dataSource, setDataSource] = useState([\r
        {\r
            id: 1,\r
            name: '\u6211\u662F\u6D4B\u8BD5\u6570\u636E',\r
        },\r
    ]);\r
\r
    const cols = [\r
        {\r
            title: 'id',\r
            dataIndex: 'id',\r
        },\r
        {\r
            title: '\u540D\u79F0',\r
            dataIndex: 'name',\r
        },\r
        {\r
            title: '\u64CD\u4F5C',\r
            dataIndex: '',\r
            width: 230,\r
            render: () => {\r
                const actions = [\r
                    { key: 'edit', name: '\u7F16\u8F91' },\r
                    { key: 'delete', name: '\u5220\u9664' },\r
                    { key: 'close', name: '\u5173\u95ED' },\r
                    { key: 'open', name: '\u5F00\u542F' },\r
                ];\r
                return (\r
                    <CollapsibleActionItems\r
                        maxCount={3}\r
                        actionItems={actions}\r
                        divider={<span style={{ color: '#eee' }}>-</span>}\r
                        collapseIcon={<DownOutlined style={{ marginLeft: 16 }} />}\r
                    />\r
                );\r
            },\r
        },\r
    ];\r
\r
    return <Table rowKey="id" dataSource={dataSource} columns={cols} />;\r
};`},react:{type:"NPM",value:"18.3.1"},"@dtjoy/dt-design":{type:"NPM",value:"1.0.3"},antd:{type:"NPM",value:"4.24.16"},"@ant-design/icons":{type:"NPM",value:"4.8.3"}},entry:"index.jsx",title:"\u81EA\u5B9A\u4E49\u5206\u5272\u7B26\u4E0E\u4E0B\u62C9\u56FE\u6807"},context:void 0,renderOpts:void 0}}},52208:function(R,r,e){e.r(r),e.d(r,{texts:function(){return P}});const P=[{value:"\u5F53\u64CD\u4F5C\u9879\u8FC7\u591A\u65F6\uFF0C\u5C06\u591A\u4F59\u7684\u64CD\u4F5C\u9879\u5C55\u793A\u5728\u4E0B\u62C9\u83DC\u5355\u4E2D\uFF0C\u4E00\u822C\u7528\u4E8E\u8868\u683C\u7684\u64CD\u4F5C\u680F",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:6},{value:"\u8BF4\u660E",paraId:1,tocIndex:6},{value:"\u7C7B\u578B",paraId:1,tocIndex:6},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:6},{value:"actionItems",paraId:1,tocIndex:6},{value:"\u64CD\u4F5C\u9879",paraId:1,tocIndex:6},{value:"ActionItem",paraId:2,tocIndex:6},{value:"[]",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"maxCount",paraId:1,tocIndex:6},{value:"\u6700\u5927\u5C55\u793A\u6570\u91CF\uFF0C\u8D85\u51FA\u90E8\u5206\u4F1A\u6298\u53E0\u81F3\u4E0B\u62C9\u83DC\u5355\u4E2D",paraId:1,tocIndex:6},{value:"number",paraId:1,tocIndex:6},{value:"3",paraId:1,tocIndex:6},{value:"divider",paraId:1,tocIndex:6},{value:"\u64CD\u4F5C\u9879\u5206\u5272\u7B26",paraId:1,tocIndex:6},{value:"React.ReactNode",paraId:1,tocIndex:6},{value:"<Divider type='vertical'/>",paraId:1,tocIndex:6},{value:"collapseIcon",paraId:1,tocIndex:6},{value:"\u4E0B\u62C9\u83DC\u5355\u6298\u53E0\u56FE\u6807",paraId:1,tocIndex:6},{value:"React.ReactNode",paraId:1,tocIndex:6},{value:"<EllipsisOutlined />",paraId:1,tocIndex:6},{value:"dropdownProps",paraId:1,tocIndex:6},{value:"\u6298\u53E0\u83DC\u5355\u989D\u5916\u7684 Props, \u8BE6\u7EC6\u8BF7\u53C2\u8003 antd \u7684",paraId:1,tocIndex:6},{value:"Dropdown",paraId:1,tocIndex:6},{value:"\u7EC4\u4EF6",paraId:1,tocIndex:6},{value:"DropDownProps",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"buttonProps",paraId:1,tocIndex:6},{value:"\u6309\u94AE\u989D\u5916\u7684 Props, \u8BE6\u7EC6\u8BF7\u53C2\u8003 antd \u7684",paraId:1,tocIndex:6},{value:"Button",paraId:1,tocIndex:6},{value:"\u7EC4\u4EF6",paraId:1,tocIndex:6},{value:"ButtonProps",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"onItemClick",paraId:1,tocIndex:6},{value:"\u64CD\u4F5C\u9879\u70B9\u51FB\u4E8B\u4EF6",paraId:1,tocIndex:6},{value:"(key: React.Key) => void",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"\u53C2\u6570",paraId:3,tocIndex:7},{value:"\u8BF4\u660E",paraId:3,tocIndex:7},{value:"\u7C7B\u578B",paraId:3,tocIndex:7},{value:"\u9ED8\u8BA4\u503C",paraId:3,tocIndex:7},{value:"key",paraId:3,tocIndex:7},{value:"\u552F\u4E00\u6807\u8BC6",paraId:3,tocIndex:7},{value:"React.Key",paraId:3,tocIndex:7},{value:"-",paraId:3,tocIndex:7},{value:"name",paraId:3,tocIndex:7},{value:"\u663E\u793A\u7684\u540D\u79F0",paraId:3,tocIndex:7},{value:"string",paraId:3,tocIndex:7},{value:"-",paraId:3,tocIndex:7},{value:"disabled",paraId:3,tocIndex:7},{value:"\u662F\u5426\u7981\u7528",paraId:3,tocIndex:7},{value:"boolean",paraId:3,tocIndex:7},{value:"false",paraId:3,tocIndex:7},{value:"render",paraId:3,tocIndex:7},{value:"\u81EA\u5B9A\u4E49\u6E32\u67D3\uFF0C\u672A\u6298\u53E0\u7684\u64CD\u4F5C\u9879\u9ED8\u8BA4\u4F1A\u4EE5",paraId:3,tocIndex:7},{value:"link",paraId:3,tocIndex:7},{value:"\u7C7B\u578B\u7684 ",paraId:3,tocIndex:7},{value:"Button",paraId:3,tocIndex:7},{value:"\u5F62\u5F0F\u5C55\u793A",paraId:3,tocIndex:7},{value:"() => React.ReactNode",paraId:3,tocIndex:7},{value:"-",paraId:3,tocIndex:7}]}}]);
