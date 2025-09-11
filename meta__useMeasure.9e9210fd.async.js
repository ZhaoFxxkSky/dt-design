"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[5748],{1379:function(o,d,t){t.r(d),t.d(d,{demos:function(){return e}});var n=t(75271),e={"src-use-measure-demo-basic":{component:n.memo(n.lazy(function(){return Promise.all([t.e(8945),t.e(5136),t.e(5385),t.e(6455),t.e(9166),t.e(6105),t.e(6082),t.e(8704),t.e(2208),t.e(2276),t.e(3479),t.e(4072),t.e(9520),t.e(4949),t.e(7029),t.e(9448),t.e(2366),t.e(230),t.e(1130),t.e(5512),t.e(9826),t.e(7430),t.e(9575),t.e(9504),t.e(27),t.e(8230),t.e(1966),t.e(7955),t.e(2133),t.e(8484),t.e(2784),t.e(2433)]).then(t.bind(t,98174))})),asset:{type:"BLOCK",id:"src-use-measure-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:t(59976).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528"},context:void 0,renderOpts:void 0}}},10444:function(o,d,t){t.r(d),t.d(d,{texts:function(){return n}});const n=[{value:"\u9700\u8981\u83B7\u53D6\u5143\u7D20\u5C3A\u5BF8",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:5},{value:"\u8BF4\u660E",paraId:1,tocIndex:5},{value:"\u7C7B\u578B",paraId:1,tocIndex:5},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:5},{value:"ref",paraId:1,tocIndex:5},{value:"DOM \u5B9E\u4F8B",paraId:1,tocIndex:5},{value:"HTMLDivElement",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5},{value:"rect",paraId:1,tocIndex:5},{value:"DOMRect",paraId:1,tocIndex:5},{value:"UseMeasureRect",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5},{value:"getElement",paraId:1,tocIndex:5},{value:"\u83B7\u53D6 DOM \u5B9E\u4F8B",paraId:1,tocIndex:5},{value:"() => HTMLDivElement",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5}]},59976:function(o,d){d.Z=`import React from 'react';
import { useMeasure } from 'dt-design';

export default () => {
    const [ref, { x, y, width, height, top, right, bottom, left }] = useMeasure();
    return (
        <div ref={ref}>
            <div>x: {x}</div>
            <div>y: {y}</div>
            <div>width: {width}</div>
            <div>height: {height}</div>
            <div>top: {top}</div>
            <div>right: {right}</div>
            <div>bottom: {bottom}</div>
            <div>left: {left}</div>
        </div>
    );
};
`}}]);
