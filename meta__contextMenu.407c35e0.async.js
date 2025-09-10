"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[4503],{49398:function(r,d,n){n.r(d),n.d(d,{demos:function(){return I}});var s=n(90228),m=n.n(s),u=n(87999),v=n.n(u),x=n(75271),I={"contextmenu-demo-0":{component:x.memo(x.lazy(v()(m()().mark(function y(){var f,t,i,l,c,a;return m()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.resolve().then(n.t.bind(n,75271,19));case 2:return f=e.sent,t=f.default,e.next=6,Promise.all([n.e(7350),n.e(1270),n.e(1273),n.e(3350),n.e(478),n.e(3493),n.e(4470),n.e(8208),n.e(1939),n.e(7524),n.e(5219),n.e(6933),n.e(7899)]).then(n.bind(n,47899));case 6:return i=e.sent,l=i.Tree,e.next=10,Promise.all([n.e(7350),n.e(327),n.e(1270),n.e(3370),n.e(1204),n.e(8704),n.e(1273),n.e(7127),n.e(3350),n.e(3060),n.e(9520),n.e(478),n.e(3493),n.e(168),n.e(4470),n.e(8208),n.e(2878),n.e(8327),n.e(770),n.e(8526),n.e(2179),n.e(1939),n.e(5053),n.e(1911),n.e(27),n.e(7524),n.e(8288),n.e(8950),n.e(8460),n.e(6319),n.e(8412),n.e(2320),n.e(4920),n.e(732),n.e(597)]).then(n.bind(n,87763));case 10:return c=e.sent,a=c.ContextMenu,e.abrupt("return",{default:function(){return t.createElement("div",{style:{position:"relative"}},t.createElement(l,{defaultExpandAll:!0},t.createElement(l.TreeNode,{key:"0-0",title:t.createElement(a,{data:[{key:"create",text:"\u65B0\u5EFA\u4EFB\u52A1",cb:function(){}},{key:"createFolder",text:"\u65B0\u5EFA\u6587\u4EF6\u5939",cb:function(){}},{key:"edit",text:"\u7F16\u8F91",cb:function(){}},{key:"remove",text:"\u5220\u9664",confirm:!0,confirmProps:{title:"\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u8D44\u6E90\u5417",okText:"\u786E\u5B9A",cancelText:"\u53D6\u6D88",onConfirm:function(){console.log("\u5220\u9664")}}}]},"folder"),className:"anchor-experiment-root"},t.createElement(l.TreeNode,{key:"0-0-0",title:t.createElement(a,{data:[{key:"edit",text:"\u7F16\u8F91",cb:function(){}},{key:"clone",text:"\u514B\u9686",cb:function(){}},{key:"remove",text:"\u5220\u9664",cb:function(){}}]},"file1"),className:"anchor-experiment-file"}),t.createElement(l.TreeNode,{key:"0-0-1",title:t.createElement(a,{data:[]},"file2"),className:"anchor-experiment-file"}))))}});case 13:case"end":return e.stop()}},y)})))),asset:{type:"BLOCK",id:"contextmenu-demo-0",refAtomIds:["contextMenu"],dependencies:{"index.jsx":{type:"FILE",value:`import React from 'react';
import { Tree } from 'antd';
import { ContextMenu } from 'dt-design';

export default () => {
    return (
        <div style={{ position: 'relative' }}>
            <Tree defaultExpandAll>
                <Tree.TreeNode
                    key="0-0"
                    title={
                        <ContextMenu
                            data={[
                                {
                                    key: 'create',
                                    text: '\u65B0\u5EFA\u4EFB\u52A1',
                                    cb: () => {},
                                },
                                {
                                    key: 'createFolder',
                                    text: '\u65B0\u5EFA\u6587\u4EF6\u5939',
                                    cb: () => {},
                                },
                                {
                                    key: 'edit',
                                    text: '\u7F16\u8F91',
                                    cb: () => {},
                                },
                                {
                                    key: 'remove',
                                    text: '\u5220\u9664',
                                    confirm: true,
                                    confirmProps: {
                                        title: '\u786E\u5B9A\u5220\u9664\u8FD9\u4E2A\u8D44\u6E90\u5417',
                                        okText: '\u786E\u5B9A',
                                        cancelText: '\u53D6\u6D88',
                                        onConfirm: () => {
                                            console.log('\u5220\u9664');
                                        },
                                    },
                                },
                            ]}
                        >
                            folder
                        </ContextMenu>
                    }
                    className="anchor-experiment-root"
                >
                    <Tree.TreeNode
                        key="0-0-0"
                        title={
                            <ContextMenu
                                data={[
                                    {
                                        key: 'edit',
                                        text: '\u7F16\u8F91',
                                        cb: () => {},
                                    },
                                    {
                                        key: 'clone',
                                        text: '\u514B\u9686',
                                        cb: () => {},
                                    },
                                    {
                                        key: 'remove',
                                        text: '\u5220\u9664',
                                        cb: () => {},
                                    },
                                ]}
                            >
                                file1
                            </ContextMenu>
                        }
                        className="anchor-experiment-file"
                    />
                    <Tree.TreeNode
                        key="0-0-1"
                        title={<ContextMenu data={[]}>file2</ContextMenu>}
                        className="anchor-experiment-file"
                    />
                </Tree.TreeNode>
            </Tree>
        </div>
    );
};`},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.22.5"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.jsx"},context:void 0,renderOpts:void 0}}},15862:function(r,d,n){n.r(d),n.d(d,{texts:function(){return s}});const s=[{value:"\u4EFB\u52A1\u680F\u53F3\u952E\u83DC\u5355\u64CD\u4F5C",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:2},{value:"\u8BF4\u660E",paraId:1,tocIndex:2},{value:"\u7C7B\u578B",paraId:1,tocIndex:2},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:2},{value:"data",paraId:1,tocIndex:2},{value:"\u83DC\u5355\u9879\u914D\u7F6E",paraId:1,tocIndex:2},{value:"IMenuProps[]",paraId:1,tocIndex:2},{value:"-",paraId:1,tocIndex:2},{value:"wrapperClassName",paraId:1,tocIndex:2},{value:"\u5916\u5C42\u7EC4\u4EF6\u7684 class \u540D",paraId:1,tocIndex:2},{value:"string",paraId:1,tocIndex:2},{value:"-",paraId:1,tocIndex:2},{value:"\u5176\u4F59\u5C5E\u6027\u53C2\u8003 ant-design \u7684 Dropdown \u7EC4\u4EF6",paraId:2}]}}]);
