import{b as o,j as n,I as u,a7 as d,A as i}from"./index-Bpu-ZP8V.js";import{M as h}from"./index-DOw9Vza5.js";const m=48,M=({options:t})=>{const[s,a]=o.useState(null),r=!!s,c=e=>{a(e.currentTarget)},l=()=>{a(null)};return n.jsxs("div",{children:[n.jsx(u,{"aria-label":"more",id:"long-button","aria-controls":r?"long-menu":void 0,"aria-expanded":r?"true":void 0,"aria-haspopup":"true",onClick:c,children:n.jsx(h,{})}),n.jsx(d,{id:"long-menu",MenuListProps:{"aria-labelledby":"long-button"},anchorEl:s,open:r,onClose:l,PaperProps:{style:{maxHeight:m*4.5,width:"20ch"}},children:t.map(e=>n.jsx(i,{onClick:()=>{e.onPress(),l()},children:e==null?void 0:e.title},e==null?void 0:e.id))})]})};export{M as A};
