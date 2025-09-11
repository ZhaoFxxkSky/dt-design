"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[8966],{37056:function(d,n,e){e.r(n),e.d(n,{demos:function(){return a}});var t=e(75271),a={"markdownrender-demo-basic":{component:t.memo(t.lazy(function(){return Promise.all([e.e(4654),e.e(6426)]).then(e.bind(e,54334))})),asset:{type:"BLOCK",id:"markdownrender-demo-basic",refAtomIds:["markdownRender"],dependencies:{"index.tsx":{type:"FILE",value:e(75720).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u5C55\u793A Markdown \u5185\u5BB9"},context:void 0,renderOpts:void 0},"markdownrender-demo-dark":{component:t.memo(t.lazy(function(){return Promise.all([e.e(4654),e.e(6426)]).then(e.bind(e,85359))})),asset:{type:"BLOCK",id:"markdownrender-demo-dark",refAtomIds:["markdownRender"],dependencies:{"index.tsx":{type:"FILE",value:e(45274).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"\u6697\u9ED1\u6A21\u5F0F\u4E0B"},context:void 0,renderOpts:void 0},"markdownrender-demo-sql":{component:t.memo(t.lazy(function(){return Promise.all([e.e(4654),e.e(6426)]).then(e.bind(e,4346))})),asset:{type:"BLOCK",id:"markdownrender-demo-sql",refAtomIds:["markdownRender"],dependencies:{"index.tsx":{type:"FILE",value:e(64416).Z},react:{type:"NPM",value:"18.3.1"},"dt-design":{type:"NPM",value:"1.0.0"}},entry:"index.tsx",title:"SQL \u8BED\u6CD5\u9AD8\u4EAE"},context:void 0,renderOpts:void 0}}},1619:function(d,n,e){e.r(n),e.d(n,{texts:function(){return t}});const t=[{value:"\u7528\u4E8E Markdown \u8BED\u6CD5\u5728 HTML \u4E0A\u5C55\u793A\uFF0C\u53EA\u8D1F\u8D23\u6E32\u67D3",paraId:0,tocIndex:1},{value:"\u53C2\u6570",paraId:1,tocIndex:6},{value:"\u8BF4\u660E",paraId:1,tocIndex:6},{value:"\u7C7B\u578B",paraId:1,tocIndex:6},{value:"\u9ED8\u8BA4\u503C",paraId:1,tocIndex:6},{value:"value",paraId:1,tocIndex:6},{value:"markdown \u6587\u672C\u6570\u636E",paraId:1,tocIndex:6},{value:"string",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"dark",paraId:1,tocIndex:6},{value:"\u6697\u9ED1\u4E3B\u9898",paraId:1,tocIndex:6},{value:"boolean",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6},{value:"className",paraId:1,tocIndex:6},{value:"\u7C7B\u540D",paraId:1,tocIndex:6},{value:"string",paraId:1,tocIndex:6},{value:"-",paraId:1,tocIndex:6}]},75720:function(d,n){n.Z=`import React, { useEffect, useState } from 'react';
import { MarkdownRender } from 'dt-design';

export default () => {
    const [value, setValue] = useState('');

    useEffect(() => {
        fetch('https://cdn.jsdelivr.net/npm/dt-design@3.0.8/CHANGELOG.md', {
            method: 'get',
        })
            .then((res) => res.text())
            .then(setValue)
            .catch((err) => {
                setValue(err.message);
            });
    }, []);

    return (
        <div style={{ maxHeight: 200, overflow: 'auto', marginBottom: 16 }}>
            <MarkdownRender value={value} />
        </div>
    );
};
`},45274:function(d,n){n.Z=`import React, { useEffect, useState } from 'react';
import { MarkdownRender } from 'dt-design';

const md = \`
\u4EE5\u4E0B\u662F\u4E00\u6BB5 sql \u8BED\u6CD5

\\\`\\\`\\\`sql
 select count(*) from a;
-- name sqltest 
-- type sql 
-- create time 2022-11-09 16:13:45 
-- desc


-- create table employees(name string);
insert into employees values('1111');


select * from employees
\\\`\\\`\\\`
\`;

export default () => {
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(md);
    }, []);

    return (
        <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 16 }}>
            <MarkdownRender dark value={value} />
        </div>
    );
};
`},64416:function(d,n){n.Z=`import React, { useEffect, useState } from 'react';
import { MarkdownRender } from 'dt-design';

const md = \`
\u4EE5\u4E0B\u662F\u4E00\u6BB5 sql \u8BED\u6CD5

\\\`\\\`\\\`sql
 select count(*) from a;
-- name sqltest 
-- type sql 
-- create time 2022-11-09 16:13:45 
-- desc


-- create table employees(name string);
insert into employees values('1111');


select * from employees
\\\`\\\`\\\`
\`;

export default () => {
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue(md);
    }, []);

    return (
        <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 16 }}>
            <MarkdownRender value={value} />
        </div>
    );
};
`}}]);
