import{d as c,u as f,i as p}from"./theme.DVv0ocbC.js";import{r as l}from"./resolvermap.B49Zay8M.js";import{d,s as a,x as m,y as u,C,U as _}from"./framework.C9GdOEHb.js";const v={groups:[c]},w=d({__name:"editor",setup(y){f().enable();const n=e=>{if(Array.isArray(e))return e.map(n);if(typeof e=="object"&&e!==null){const t={};for(const[o,r]of Object.entries(e))o!=="parent"&&(t[o]=n(r));return t}return e},s=e=>{if(e.action.key==="save"){const t=n(e.editor.nodes);alert(JSON.stringify(t))}},i={blueprintsLibrary:v,resolverMap:l,actions:[{label:"Save",icon:p.faDownload,key:"save"}]};return(e,t)=>{const o=a("CraftCanvas"),r=a("CraftEditor");return m(),u(r,{config:i,onActionClick:s},{default:C(()=>[_(o,{component:"CraftComponentSimpleContainer"})]),_:1})}}});export{w as _};
