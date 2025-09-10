"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[6301],{28249:function(d,e,n){n.r(e),n.d(e,{demos:function(){return s}});var t=n(75271),s={"usewindowswitchlistener-demo-basic":{component:t.memo(t.lazy(function(){return n.e(6439).then(n.bind(n,75719))})),asset:{type:"BLOCK",id:"usewindowswitchlistener-demo-basic",refAtomIds:["useWindowSwitchListener"],dependencies:{"index.tsx":{type:"FILE",value:n(17442).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528"},context:void 0,renderOpts:void 0}}},69862:function(d,e,n){n.r(e),n.d(e,{texts:function(){return t}});const t=[{value:"\u76D1\u542C\u5F53\u524D\u7A97\u53E3\u83B7\u53D6\u7126\u70B9\u65F6\uFF0C\u6267\u884C\u67D0\u4E2A\u56DE\u8C03\u65F6\u4F7F\u7528",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:4},{value:"\u8BF4\u660E",paraId:1,tocIndex:4},{value:"\u7C7B\u578B",paraId:1,tocIndex:4},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:4},{value:"onSwitch",paraId:1,tocIndex:4},{value:"\u5207\u6362\u51FD\u6570",paraId:1,tocIndex:4},{value:"Function",paraId:1,tocIndex:4},{value:"-",paraId:1,tocIndex:4}]},17442:function(d,e){e.Z=`import React, { useState } from 'react';
import { useWindowSwitchListener } from 'dt-design';

export default () => {
    const [msg, setMsg] = useState('hello world');
    const handleSwitch = () => {
        setMsg('window listener');
        console.log('window listener');
    };
    useWindowSwitchListener(() => {
        handleSwitch();
    });

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
            }}
        >
            {msg}
        </div>
    );
};
`}}]);
