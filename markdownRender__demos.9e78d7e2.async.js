"use strict";(self.webpackChunkdt_design=self.webpackChunkdt_design||[]).push([[6426],{54334:function(M,t,e){e.r(t);var d=e(48305),r=e.n(d),s=e(75271),o=e(8452),n=e(52676);t.default=function(){var m=(0,s.useState)(""),l=r()(m,2),_=l[0],a=l[1];return(0,s.useEffect)(function(){fetch("https://cdn.jsdelivr.net/npm/dt-design@3.0.8/CHANGELOG.md",{method:"get"}).then(function(u){return u.text()}).then(a).catch(function(u){a(u.message)})},[]),(0,n.jsx)("div",{style:{maxHeight:200,overflow:"auto",marginBottom:16},children:(0,n.jsx)(o.Z,{value:_})})}},85359:function(M,t,e){e.r(t);var d=e(48305),r=e.n(d),s=e(75271),o=e(8452),n=e(52676),m=`
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
`;t.default=function(){var l=(0,s.useState)(""),_=r()(l,2),a=_[0],u=_[1];return(0,s.useEffect)(function(){u(m)},[]),(0,n.jsx)("div",{style:{maxHeight:400,overflow:"auto",marginBottom:16},children:(0,n.jsx)(o.Z,{dark:!0,value:a})})}},4346:function(M,t,e){e.r(t);var d=e(48305),r=e.n(d),s=e(75271),o=e(8452),n=e(52676),m=`
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
`;t.default=function(){var l=(0,s.useState)(""),_=r()(l,2),a=_[0],u=_[1];return(0,s.useEffect)(function(){u(m)},[]),(0,n.jsx)("div",{style:{maxHeight:400,overflow:"auto",marginBottom:16},children:(0,n.jsx)(o.Z,{value:a})})}},8452:function(M,t,e){e.d(t,{Z:function(){return y}});var d=e(75271),r=e(82187),s=e.n(r),o=e(26132),n=e.n(o),m=e(88467),l=e.n(m),_=e(74883),a=e.n(_),u=e(36630),c=l();c.registerLanguage("sql",a());function P(){return{type:"output",filter:function(g){return n().helper.replaceRecursiveRegExp(g.replace(/&gt;/g,">").replace(/&lt;/g,"<"),function(O,f,v,h){var E=(v.match(/class=\"([^ \"]+)/)||[])[1],D=v.slice(0,18)+"hljs "+v.slice(18);return E&&c.getLanguage(E)?D+c.highlight(f,{language:E}).value+h:D+c.highlightAuto(f).value+h},"<pre><code\\b[^>]*>","</code></pre>","g")}}}var B=e(52676);function y(i){var g=i.value,O=g===void 0?"":g,f=i.className,v=i.style,h=i.dark,E=(0,d.useMemo)(function(){var D=new(n()).Converter({extensions:[P],emoji:!0});return D.makeHtml(O)},[O]);return(0,B.jsx)("div",{className:s()("dt-markdown-render-body",h?"dt-vs-dark":"dt-vs",f),style:v,dangerouslySetInnerHTML:{__html:E}})}}}]);
