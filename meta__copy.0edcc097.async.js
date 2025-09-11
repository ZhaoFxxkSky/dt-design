"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[3896],{72739:function(d,e,t){t.r(e),t.d(e,{demos:function(){return o}});var n=t(75271),o={"copy-demo-basic":{component:n.memo(n.lazy(function(){return Promise.all([t.e(8945),t.e(5136),t.e(5385),t.e(6105),t.e(8704),t.e(3880),t.e(9520),t.e(6409)]).then(t.bind(t,70487))})),asset:{type:"BLOCK",id:"copy-demo-basic",refAtomIds:["copy"],dependencies:{"index.tsx":{type:"FILE",value:t(74052).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.24.16"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u70B9\u51FB\u6309\u94AE\uFF0C\u8FDB\u884C\u590D\u5236",description:"\u4E0D\u540C\u65B9\u5F0F\u7ED9 Tooltip \u8D4B\u503C"},context:void 0,renderOpts:void 0},"copy-demo-custom":{component:n.memo(n.lazy(function(){return Promise.all([t.e(8945),t.e(5136),t.e(5385),t.e(6105),t.e(8704),t.e(3880),t.e(9520),t.e(6409)]).then(t.bind(t,7748))})),asset:{type:"BLOCK",id:"copy-demo-custom",refAtomIds:["copy"],dependencies:{"index.tsx":{type:"FILE",value:t(98979).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u81EA\u5B9A\u4E49\u6309\u94AE",description:"tooltip \u8BBE\u7F6E\u5047\u503C\u4E0D\u5C55\u793A\uFF0C\u9ED8\u8BA4\u5C55\u793A\u590D\u5236"},context:void 0,renderOpts:void 0},"copy-demo-disabled":{component:n.memo(n.lazy(function(){return Promise.all([t.e(8945),t.e(5136),t.e(5385),t.e(6105),t.e(8704),t.e(3880),t.e(9520),t.e(6409)]).then(t.bind(t,91573))})),asset:{type:"BLOCK",id:"copy-demo-disabled",refAtomIds:["copy"],dependencies:{"index.tsx":{type:"FILE",value:t(15902).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u7981\u7528\u590D\u5236\u6309\u94AE",description:"disabled \u8BBE\u7F6E\u7981\u7528\u590D\u5236\u6309\u94AE"},context:void 0,renderOpts:void 0}}},27708:function(d,e,t){t.r(e),t.d(e,{texts:function(){return n}});const n=[{value:"\u590D\u5236\u6587\u672C\u5230\u7C98\u8D34\u7248",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:6},{value:"\u8BF4\u660E",paraId:1,tocIndex:6},{value:"\u7C7B\u578B",paraId:1,tocIndex:6},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:6},{value:"button",paraId:1,tocIndex:6},{value:"\u81EA\u5B9A\u4E49\u6309\u94AE",paraId:1,tocIndex:6},{value:"React.ReactNode",paraId:1,tocIndex:6},{value:"<CopyOutlined />",paraId:1,tocIndex:6},{value:"className",paraId:1,tocIndex:6},{value:"\u6837\u5F0F",paraId:1,tocIndex:6},{value:"string",paraId:1,tocIndex:6},{value:"--",paraId:1,tocIndex:6},{value:"disabled",paraId:1,tocIndex:6},{value:"\u662F\u5426\u7981\u7528",paraId:1,tocIndex:6},{value:"boolean",paraId:1,tocIndex:6},{value:"false",paraId:1,tocIndex:6},{value:"style",paraId:1,tocIndex:6},{value:"\u6837\u5F0F",paraId:1,tocIndex:6},{value:"React.CSSProperties",paraId:1,tocIndex:6},{value:"--",paraId:1,tocIndex:6},{value:"text",paraId:1,tocIndex:6},{value:"\u9700\u8981\u590D\u5236\u7684\u6587\u672C",paraId:1,tocIndex:6},{value:"string",paraId:1,tocIndex:6},{value:"--",paraId:1,tocIndex:6},{value:"tooltip",paraId:1,tocIndex:6},{value:"\u914D\u7F6E\u63D0\u793A\u4FE1\u606F",paraId:1,tocIndex:6},{value:"TooltipProps['title'] | TooltipProps",paraId:1,tocIndex:6},{value:"\u590D\u5236",paraId:1,tocIndex:6},{value:"onCopy",paraId:1,tocIndex:6},{value:"\u590D\u5236\u540E\u7684\u56DE\u8C03\u51FD\u6570",paraId:1,tocIndex:6},{value:"(text: string) => void",paraId:1,tocIndex:6},{value:"() => message.success('\u590D\u5236\u6210\u529F')",paraId:1,tocIndex:6}]},74052:function(d,e){e.Z=`import React from 'react';
import { Space } from 'antd';
import { BlockHeader, Copy } from 'dt-design';

const text =
    '\u57FA\u4E8E ant-design \u7684 React UI \u7EC4\u4EF6\u5E93\u3002 \u4E3B\u8981\u7528\u4E8E\u4E2D\uFF0C\u540E\u53F0\u4EA7\u54C1\u3002\u6211\u4EEC\u7684\u76EE\u6807\u662F\u6EE1\u8DB3\u66F4\u5177\u4F53\u7684\u4E1A\u52A1\u573A\u666F\u7EC4\u4EF6\u3002 \u5F53\u7136\uFF0C\u6211\u4EEC\u4E5F\u6709\u57FA\u4E8E\u539F\u751F javascript \u5B9E\u73B0\u7684\u4E1A\u52A1\u7EC4\u4EF6\uFF0C\u4F8B\u5982ContextMenu\uFF0CKeyEventListener\u7B49.';

export default () => {
    return (
        <Space direction="vertical">
            <div>
                <BlockHeader title="\u4F7F\u7528 tooltip \u5BF9\u8C61" background={false} size="small" />
                <Copy text={text} tooltip={{ title: '\u4F7F\u7528 tooltip \u5BF9\u8C61\uFF0C\u590D\u5236\u8BE5\u6587\u672C' }} />
                <p>{text}</p>
            </div>
            <div>
                <BlockHeader title="\u4F7F\u7528 React.ReactNode" background={false} size="small" />
                <Copy text={text} tooltip="\u4F7F\u7528 React.ReactNode\uFF0C\u590D\u5236\u8BE5\u6587\u672C" />
                <p>{text}</p>
            </div>
            <div>
                <BlockHeader title={\`\u4F7F\u7528 () => React.ReactNode\`} background={false} size="small" />
                <Copy text={text} tooltip={() => \`\u4F7F\u7528 () => React.ReactNode\uFF0C\u590D\u5236\u8BE5\u6587\u672C\`} />
                <p>{text}</p>
            </div>
        </Space>
    );
};
`},98979:function(d,e){e.Z=`import React from 'react';
import { Copy } from 'dt-design';

const text =
    '\u57FA\u4E8E ant-design \u7684 React UI \u7EC4\u4EF6\u5E93\u3002 \u4E3B\u8981\u7528\u4E8E\u4E2D\uFF0C\u540E\u53F0\u4EA7\u54C1\u3002\u6211\u4EEC\u7684\u76EE\u6807\u662F\u6EE1\u8DB3\u66F4\u5177\u4F53\u7684\u4E1A\u52A1\u573A\u666F\u7EC4\u4EF6\u3002 \u5F53\u7136\uFF0C\u6211\u4EEC\u4E5F\u6709\u57FA\u4E8E\u539F\u751F javascript \u5B9E\u73B0\u7684\u4E1A\u52A1\u7EC4\u4EF6\uFF0C\u4F8B\u5982ContextMenu\uFF0CKeyEventListener\u7B49.';

export default () => {
    return (
        <>
            <div>
                <Copy text={text} button="\u590D\u5236\u6587\u672C" />
                <p>{text}</p>
            </div>
            <div>
                <Copy text={text} button="\u590D\u5236\u6587\u672C" tooltip={false} />
                <p>{text}</p>
            </div>
        </>
    );
};
`},15902:function(d,e){e.Z=`import React from 'react';
import { Copy } from 'dt-design';

const text =
    '\u57FA\u4E8E ant-design \u7684 React UI \u7EC4\u4EF6\u5E93\u3002 \u4E3B\u8981\u7528\u4E8E\u4E2D\uFF0C\u540E\u53F0\u4EA7\u54C1\u3002\u6211\u4EEC\u7684\u76EE\u6807\u662F\u6EE1\u8DB3\u66F4\u5177\u4F53\u7684\u4E1A\u52A1\u573A\u666F\u7EC4\u4EF6\u3002 \u5F53\u7136\uFF0C\u6211\u4EEC\u4E5F\u6709\u57FA\u4E8E\u539F\u751F javascript \u5B9E\u73B0\u7684\u4E1A\u52A1\u7EC4\u4EF6\uFF0C\u4F8B\u5982ContextMenu\uFF0CKeyEventListener\u7B49.';

export default () => {
    return (
        <>
            <div>
                <Copy text={text} disabled button="\u590D\u5236\u6587\u672C" />
                <p>{text}</p>
            </div>
            <div>
                <Copy text={text} disabled tooltip={false} />
                <p>{text}</p>
            </div>
        </>
    );
};
`}}]);
