(this["webpackJsonpsc-vis"]=this["webpackJsonpsc-vis"]||[]).push([[0],{18:function(e,t,n){},19:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n(3),c=n.n(a),i=n(11),s=n(2),o=n(1),d=function(e){var t=e.data;return Object(o.jsxs)("div",{className:"px-4 py-2 bg-white text-center text-black-400 rounded ring ",style:{width:"160px"},children:[Object(o.jsx)("div",{children:t.label}),Object(o.jsx)(s.b,{type:"source",position:"right",id:"fork-start"}),Object(o.jsx)(s.b,{type:"target",position:"right",id:"fork-end"}),Object(o.jsx)(s.b,{type:"target",position:"top",id:"top"}),Object(o.jsx)(s.b,{type:"source",position:"bottom",id:"bottom"})]})},l=n(8),u=n(9),f=function(){function e(t,n,r){Object(l.a)(this,e),this.id=t,this.lifespan={start:n,end:null},this.loc={col:null},this.children=[],this.parent=null,this.addParent(r)}return Object(u.a)(e,[{key:"addParent",value:function(e){if(null!==e){if(!(e.lifespan.start<=this.lifespan.start))throw Error("Cannot add child start earlier than parent, ","child_start: ".concat(this.lifespan.start),"parent_start: ".concat(e.lifespan.start));this.parent=e,this.parent.children.push(this),this.reportEndTimeToParent()}}},{key:"reportEndTimeToParent",value:function(){null!==this.lifespan.end&&null!==this.parent&&this.parent.addEndTime(this.lifespan.end)}},{key:"addEndTime",value:function(e){(e>this.lifespan.end||null===this.lifespan.end)&&(console.log("update end time of ".concat(this.id," from ").concat(this.lifespan.end," to ").concat(e)),this.lifespan.end=e),this.reportEndTimeToParent()}},{key:"export",value:function(){var e=[];return this.children.forEach((function(t){e.push(t.export())})),{id:this.id,start:this.lifespan.start,end:this.lifespan.end,loc:this.loc,children:e}}}]),e}(),p=[{time:0,id:"t0",desc:"created",parent:null},{time:1,id:"n1",desc:"created",parent:"t0"},{time:2,id:"n2",desc:"created",parent:"t0"},{time:2,id:"t1",desc:"created",parent:"n1"},{time:3,id:"t2",desc:"created",parent:"n1"},{time:4,id:"t1",desc:"exited",parent:"n1"},{time:4,id:"n2",desc:"exited",parent:"t0"},{time:5,id:"t2",desc:"exited",parent:"n1"},{time:5,id:"n1",desc:"exited",parent:"t0"},{time:6,id:"n1",desc:"exited",parent:"t0"}],h=function(e){var t={},n=null,r=function(e){return e&&"null"!==e?t[e]:null};return e.forEach((function(e){if("created"===e.desc){var a=r(e.parent),c=function(e,t){return new f(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:null)}(e.id,e.time,a);t[c.id]=c,null===a&&(n=c)}else if("exited"===e.desc){r(e.id).addEndTime(e.time)}else console.log("unknown desc: ".concat(e))})),n},x=function(e){return"".concat(e.id,"s")},j=function(e){return"".concat(e.id,"e")},b=function(e){var t,n,r=e.id,a=e.desc,c=e.row,i=e.col,s=e.type;return{id:r,type:void 0===s?"parentScope":s,data:{label:a},position:{x:(n=i,150*n),y:(t=c,100*t)}}},m=Object.freeze({startToEnd:{stroke:"#6B7280",strokeWidth:"2"},forkStart:{stroke:"#3B82F6"},forkEnd:{stroke:"#3B82F6"}}),v=function(e){var t=e.source,n=e.target,r=e.sourceHandle,a=e.targetHandle,c=e.style,i=e.animated,s=void 0===i||i;return{id:"e".concat(t,"-").concat(n),source:t,target:n,sourceHandle:r,targetHandle:a,type:"step",animated:s,style:m[c],arrowHeadType:"arrow"}},O=function(e,t){var n=b({id:x(e),desc:"".concat(e.id," start"),row:e.lifespan.start,col:e.loc.col}),r=b({id:j(e),desc:"".concat(e.id," end"),row:e.lifespan.end,col:e.loc.col});t.push(n,r)},g=function(e,t,n){var r=v({source:x(e),target:x(t),sourceHandle:"fork-start",targetHandle:"top",style:"forkStart"}),a=v({source:j(t),target:j(e),sourceHandle:"bottom",targetHandle:"fork-end",style:"forkEnd"});n.push(r,a)},y=function(e,t){var n=v({source:x(e),target:j(e),sourceHandle:"bottom",targetHandle:"top",style:"startToEnd",animated:!1});t.push(n)},k=function(e){return function(e,t,n,r){var a=[];return function e(r){t(r,a),n(r,a),r.children.forEach((function(t){e(t),g(r,t,a)}))}(e),a}(e,O,y)},w={},E={parentScope:d},N=function(e){var t=e.runRecords,n=h(t);!function(e){var t=1;!function e(n){n.loc.col=t,t++,n.children.forEach((function(t){e(t)}))}(e)}(n);var r=k(n);return Object(o.jsx)("div",{className:"border-2 border-blue-200 w-full h-full",children:Object(o.jsxs)(s.d,{edgeTypes:w,nodeTypes:E,elements:r,children:[Object(o.jsx)(s.c,{}),Object(o.jsx)(s.a,{})]})})},T=n(4),H=n.n(T),R=n(10),S=n(7),P=function(e){return Object(o.jsx)("div",{className:"font-black text-extralbold text-4xl antialiased",children:Object(o.jsx)("span",{className:"bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-500",children:e.text})})},B=function(e){var t=e.onRecordsUpdate,n=Object(r.useRef)(null),a=function(){var e=Object(R.a)(H.a.mark((function e(n){var r;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.t0=JSON,e.next=4,n.text();case 4:e.t1=e.sent,r=e.t0.parse.call(e.t0,e.t1),e.next=12;break;case 8:return e.prev=8,e.t2=e.catch(0),console.log("cannot read text of file"),e.abrupt("return");case 12:console.log("start validate"),e.next=15;break;case 15:t(r);case 16:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(t){return e.apply(this,arguments)}}();return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)("button",{className:"px-3 text-2xl hover:text-gray-500 flex",onClick:function(){return n.current.click()},children:Object(o.jsx)(S.a,{})}),Object(o.jsx)("input",{className:"hidden",ref:n,type:"file",onChange:function(e){a(e.target.files[0])}})]})},C=function(){return Object(o.jsx)("a",{className:"hover:text-gray-500 antialiased px-3 text-2xl flex",target:"_blank",rel:"noreferrer",href:"https://github.com/ianchen-tw/sc-vis",children:Object(o.jsx)(S.b,{})})},U=function(e){var t=e.onRecordsUpdate;return Object(o.jsx)("header",{className:"pt-5",children:Object(o.jsxs)("div",{className:"max-w-container flex items-center m-2",children:[Object(o.jsx)("div",{className:"flex-none",children:Object(o.jsx)(P,{text:"SC Visualizer"})}),Object(o.jsxs)("div",{className:"flex-grow flex justify-end",children:[Object(o.jsx)(B,{onRecordsUpdate:t}),Object(o.jsx)(C,{})]})]})})},F=function(){var e=Object(r.useState)(p),t=Object(i.a)(e,2),n=t[0],a=t[1];return Object(o.jsxs)("div",{className:"container mx-auto px-4 h-screen flex flex-col",children:[Object(o.jsx)("div",{className:"flex-none",children:Object(o.jsx)(U,{onRecordsUpdate:function(e){return a(e)}})}),Object(o.jsx)("div",{className:"flex-grow",children:Object(o.jsx)(N,{runRecords:n})})]})};n(18);c.a.render(Object(o.jsx)(F,{}),document.getElementById("root"))}},[[19,1,2]]]);
//# sourceMappingURL=main.0e344497.chunk.js.map