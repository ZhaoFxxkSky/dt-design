"use strict";(self.webpackChunk_dtjoy_dt_design=self.webpackChunk_dtjoy_dt_design||[]).push([[7610],{44417:function(r,n,e){e.r(n),e.d(n,{demos:function(){return d}});var t=e(75271),d={"resize-demo-basic":{component:t.memo(t.lazy(function(){return e.e(8281).then(e.bind(e,60464))})),asset:{type:"BLOCK",id:"resize-demo-basic",refAtomIds:["resize"],dependencies:{"index.tsx":{type:"FILE",value:e(38534).Z},react:{type:"NPM",value:"18.3.1"},"@dtjoy/dt-design":{type:"NPM",value:"1.0.3"}},entry:"index.tsx",title:"\u57FA\u672C\u4F7F\u7528",description:"\u8BF7\u8C03\u6574\u7A97\u53E3\u5927\u5C0F\u4EE5\u67E5\u770B\u6548\u679C"},context:void 0,renderOpts:void 0},"resize-demo-observer-ele":{component:t.memo(t.lazy(function(){return e.e(8281).then(e.bind(e,63716))})),asset:{type:"BLOCK",id:"resize-demo-observer-ele",refAtomIds:["resize"],dependencies:{"index.tsx":{type:"FILE",value:e(89493).Z},react:{type:"NPM",value:"18.3.1"},"@dtjoy/dt-design":{type:"NPM",value:"1.0.3"}},entry:"index.tsx",title:"\u76D1\u542C\u81EA\u5B9A\u4E49\u5143\u7D20",description:"\u8BF7\u8C03\u6574\u5143\u7D20\u5927\u5C0F\u4EE5\u67E5\u770B\u6548\u679C\uFF0C\u901A\u8FC7\u8BBE\u7F6EobserverEle\u81EA\u5B9A\u4E49\u76D1\u542C\u5143\u7D20"},context:void 0,renderOpts:void 0}}},6383:function(r,n,e){e.r(n),e.d(n,{texts:function(){return t}});const t=[{value:"\u6309\u94AE\u7528\u4E8E\u5F00\u59CB\u4E00\u4E2A\u5373\u65F6\u64CD\u4F5C\u3002",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:6},{value:"\u8BF4\u660E",paraId:1,tocIndex:6},{value:"\u7C7B\u578B",paraId:1,tocIndex:6},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:6},{value:"children",paraId:1,tocIndex:6},{value:"\u5B50\u5143\u7D20",paraId:1,tocIndex:6},{value:"React.ReactNode",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"observerEle",paraId:1,tocIndex:6},{value:"\u76D1\u542C\u7684\u5143\u7D20,\u4F20\u5165\u5143\u7D20\u4E0D\u5B58\u5728\u9ED8\u8BA4\u76D1\u542C window",paraId:1,tocIndex:6},{value:"HTMLElement",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"onResize",paraId:1,tocIndex:6},{value:"\u91CD\u7F6E\u5143\u7D20\u5927\u5C0F\u7684\u51FD\u6570",paraId:1,tocIndex:6},{value:"() => void",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6}]},38534:function(r,n){n.Z=`import React, { useCallback, useState } from 'react';\r
import { Resize } from '@dtjoy/dt-design';\r
\r
export default () => {\r
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);\r
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);\r
\r
    const onResize = useCallback(() => {\r
        setInnerWidth(window.innerWidth);\r
        setInnerHeight(window.innerHeight);\r
    }, []);\r
\r
    return (\r
        <Resize onResize={onResize}>\r
            <div>\r
                <pre>window\u9AD8\u5EA6: {innerWidth}</pre>\r
                <pre>window\u5BBD\u5EA6: {innerHeight}</pre>\r
            </div>\r
        </Resize>\r
    );\r
};\r
`},89493:function(r,n){n.Z=`import React, { useCallback, useRef, useState } from 'react';\r
import { Resize } from '@dtjoy/dt-design';\r
\r
export default () => {\r
    const [clientWidth, setWidth] = useState(0);\r
    const [clientHegiht, setHegiht] = useState(0);\r
    const textareaRef = useRef<HTMLTextAreaElement>(null);\r
\r
    const onResize = useCallback(() => {\r
        setWidth(textareaRef.current?.clientWidth || 0);\r
        setHegiht(textareaRef.current?.clientHeight || 0);\r
    }, []);\r
\r
    return (\r
        <Resize onResize={onResize} observerEle={textareaRef.current}>\r
            <textarea\r
                ref={textareaRef}\r
                style={{\r
                    resize: 'both',\r
                    maxWidth: '100%',\r
                }}\r
            />\r
            <pre>\u5F53\u524D\u5143\u7D20\u7684\u53EF\u89C6\u5BBD: {clientWidth}</pre>\r
            <pre>\u5F53\u524D\u5143\u7D20\u7684\u53EF\u89C6\u5BBD: {clientHegiht}</pre>\r
        </Resize>\r
    );\r
};\r
`}}]);
