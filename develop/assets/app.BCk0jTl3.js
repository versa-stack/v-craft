import{R as i}from"./chunks/theme.BFUWWTII.js";import{ah as s,am as u,an as l,ao as c,ap as f,aq as d,ar as m,as as h,at as g,au as A,av as v,d as w,a2 as y,o as P,e as C,aw as R,ax as b,ay as E,h as S}from"./chunks/framework.DVloFCaL.js";function p(e){if(e.extends){const a=p(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const o=p(i),T=w({name:"VitePressApp",setup(){const{site:e,lang:a,dir:t}=y();return P(()=>{C(()=>{document.documentElement.lang=a.value,document.documentElement.dir=t.value})}),e.value.router.prefetchLinks&&R(),b(),E(),o.setup&&o.setup(),()=>S(o.Layout)}});async function x(){globalThis.__VITEPRESS__=!0;const e=_(),a=D();a.provide(l,e);const t=c(e.route);return a.provide(f,t),a.component("Content",d),a.component("ClientOnly",m),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),o.enhanceApp&&await o.enhanceApp({app:a,router:e,siteData:h}),{app:a,router:e,data:t}}function D(){return g(T)}function _(){let e=s,a;return A(t=>{let n=v(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=import(n)),s&&(e=!1),r},o.NotFound)}s&&x().then(({app:e,router:a,data:t})=>{a.go().then(()=>{u(a.route,t.site),e.mount("#app")})});export{x as createApp};
