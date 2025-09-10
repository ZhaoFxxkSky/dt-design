"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[6635],{14429:function(d,t,n){n.r(t),n.d(t,{demos:function(){return a}});var e=n(75271),a={"src-use-merge-option-demo-basic":{component:e.memo(e.lazy(function(){return Promise.all([n.e(7350),n.e(327),n.e(1270),n.e(3370),n.e(1204),n.e(8704),n.e(1273),n.e(7127),n.e(3350),n.e(3060),n.e(9520),n.e(478),n.e(3493),n.e(168),n.e(8208),n.e(2878),n.e(8327),n.e(770),n.e(8526),n.e(2179),n.e(5053),n.e(27),n.e(7524),n.e(8288),n.e(8460),n.e(7955),n.e(3859),n.e(4920),n.e(732),n.e(2433)]).then(n.bind(n,36770))})),asset:{type:"BLOCK",id:"src-use-merge-option-demo-basic",refAtomIds:[],dependencies:{"index.tsx":{type:"FILE",value:n(49053).Z},react:{type:"NPM",value:"18.3.1"},antd:{type:"NPM",value:"4.22.5"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u57FA\u7840\u4F7F\u7528"},context:void 0,renderOpts:void 0}}},95396:function(d,t,n){n.r(t),n.d(t,{texts:function(){return e}});const e=[{value:"\u9700\u8981\u5408\u5E76\u914D\u7F6E\u9879",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:5},{value:"\u8BF4\u660E",paraId:1,tocIndex:5},{value:"\u7C7B\u578B",paraId:1,tocIndex:5},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:5},{value:"disabled",paraId:1,tocIndex:5},{value:"\u662F\u5426\u7981\u7528",paraId:1,tocIndex:5},{value:"boolean",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5},{value:"options",paraId:1,tocIndex:5},{value:"\u5408\u5E76\u540E\u7684\u914D\u7F6E\u9879",paraId:1,tocIndex:5},{value:"T extends Record<string, any>",paraId:1,tocIndex:5},{value:"-",paraId:1,tocIndex:5}]},49053:function(d,t){t.Z=`import React, { useState } from 'react';
import { Segmented } from 'antd';
import { useMergeOption } from 'dt-design';
import type { MergeOption } from 'dt-design/useMergeOption';

type ExampleState = MergeOption<{ day?: boolean }>;

export default function Basic() {
    const [state, setState] = useState<ExampleState>(false);

    const merged = useMergeOption(state, { day: true });

    const getValue = () => {
        if (state === false) return 0;
        if (state === true) return 2;
        return 1;
    };
    const setValue = (value: number) => {
        setState([false, { day: false }, true][value]);
    };

    return (
        <>
            <label>Change value:</label>
            <Segmented
                value={getValue()}
                options={[
                    {
                        label: 'false',
                        value: 0,
                    },
                    {
                        label: \`{ day: false }\`,
                        value: 1,
                    },
                    {
                        label: 'true',
                        value: 2,
                    },
                ]}
                onChange={(val) => setValue(val as number)}
            />
            <pre style={{ marginTop: 8, border: '1px solid #eee', padding: 8 }}>
                {JSON.stringify(merged, null, 2)}
            </pre>
        </>
    );
}
`}}]);
