"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[6426],{10768:function(M,t,e){e.r(t);var _=e(48305),o=e.n(_),s=e(75271),r=e(31338),n=e(52676);t.default=function(){var m=(0,s.useState)(""),a=o()(m,2),l=a[0],u=a[1];return(0,s.useEffect)(function(){fetch("https://cdn.jsdelivr.net/npm/dt-design@3.0.8/CHANGELOG.md",{method:"get"}).then(function(d){return d.text()}).then(u).catch(function(d){u(d.message)})},[]),(0,n.jsx)("div",{style:{maxHeight:200,overflow:"auto",marginBottom:16},children:(0,n.jsx)(r.Z,{value:l})})}},57323:function(M,t,e){e.r(t);var _=e(48305),o=e.n(_),s=e(75271),r=e(31338),n=e(52676),m=`
\u4EE5\u4E0B\u662F\u4E00\u6BB5 sql \u8BED\u6CD5

\`\`\`sql
 select count(*) from a;
-- name sqltest 
-- type sql 
-- create time 2022-11-09 16:13:45 
-- desc


-- create table employees(name string);
insert into employees values('1111');


select * from employees
\`\`\`
`;t.default=function(){var a=(0,s.useState)(""),l=o()(a,2),u=l[0],d=l[1];return(0,s.useEffect)(function(){d(m)},[]),(0,n.jsx)("div",{style:{maxHeight:400,overflow:"auto",marginBottom:16},children:(0,n.jsx)(r.Z,{dark:!0,value:u})})}},44165:function(M,t,e){e.r(t);var _=e(48305),o=e.n(_),s=e(75271),r=e(31338),n=e(52676),m=`
\u4EE5\u4E0B\u662F\u4E00\u6BB5 sql \u8BED\u6CD5

\`\`\`sql
 select count(*) from a;
-- name sqltest 
-- type sql 
-- create time 2022-11-09 16:13:45 
-- desc


-- create table employees(name string);
insert into employees values('1111');


select * from employees
\`\`\`
`;t.default=function(){var a=(0,s.useState)(""),l=o()(a,2),u=l[0],d=l[1];return(0,s.useEffect)(function(){d(m)},[]),(0,n.jsx)("div",{style:{maxHeight:400,overflow:"auto",marginBottom:16},children:(0,n.jsx)(r.Z,{value:u})})}},31338:function(M,t,e){e.d(t,{Z:function(){return y}});var _=e(75271),o=e(82187),s=e.n(o),r=e(26132),n=e.n(r),m=e(88467),a=e.n(m),l=e(74883),u=e.n(l),d=e(90978),c=a();c.registerLanguage("sql",u());function P(){return{type:"output",filter:function(f){return n().helper.replaceRecursiveRegExp(f.replace(/&gt;/g,">").replace(/&lt;/g,"<"),function(O,g,v,D){var E=(v.match(/class=\"([^ \"]+)/)||[])[1],h=v.slice(0,18)+"hljs "+v.slice(18);return E&&c.getLanguage(E)?h+c.highlight(g,{language:E}).value+D:h+c.highlightAuto(g).value+D},"<pre><code\\b[^>]*>","</code></pre>","g")}}}var B=e(52676);function y(i){var f=i.value,O=f===void 0?"":f,g=i.className,v=i.style,D=i.dark,E=(0,_.useMemo)(function(){var h=new(n()).Converter({extensions:[P],emoji:!0});return h.makeHtml(O)},[O]);return(0,B.jsx)("div",{className:s()("dt-markdown-render-body",D?"dt-vs-dark":"dt-vs",g),style:v,dangerouslySetInnerHTML:{__html:E}})}}}]);
