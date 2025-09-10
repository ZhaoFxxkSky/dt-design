"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[5748],{55097:function(o,d,t){t.r(d),t.d(d,{demos:function(){return e}});var n=t(75271),e={"src-use-measure-demo-basic":{component:n.memo(n.lazy(function(){return Promise.all([t.e(7350),t.e(327),t.e(1270),t.e(3370),t.e(1204),t.e(8704),t.e(1273),t.e(7127),t.e(3350),t.e(3060),t.e(9520),t.e(478),t.e(3493),t.e(168),t.e(8208),t.e(2878),t.e(8327),t.e(770),t.e(8526),t.e(2179),t.e(5053),t.e(27),t.e(7524),t.e(8288),t.e(8460),t.e(7955),t.e(3859),t.e(4920),t.e(732),t.e(2433)]).then(t.bind(t,5594))})),asset:{type:"BLOCK",id:"src-use-measure-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:t(84218).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528"},context:void 0,renderOpts:void 0}}},24233:function(o,d,t){t.r(d),t.d(d,{texts:function(){return n}});const n=[{value:"\u9700\u8981\u83B7\u53D6\u5143\u7D20\u5C3A\u5BF8",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:5},{value:"\u8BF4\u660E",paraId:1,tocIndex:5},{value:"\u7C7B\u578B",paraId:1,tocIndex:5},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:5},{value:"ref",paraId:1,tocIndex:5},{value:"DOM \u5B9E\u4F8B",paraId:1,tocIndex:5},{value:"HTMLDivElement",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5},{value:"rect",paraId:1,tocIndex:5},{value:"DOMRect",paraId:1,tocIndex:5},{value:"UseMeasureRect",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5},{value:"getElement",paraId:1,tocIndex:5},{value:"\u83B7\u53D6 DOM \u5B9E\u4F8B",paraId:1,tocIndex:5},{value:"() => HTMLDivElement",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5}]},84218:function(o,d){d.Z=`import React from 'react';
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
