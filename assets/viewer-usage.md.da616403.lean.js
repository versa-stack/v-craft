import{_ as p}from"./viewer.cb874ec2.js";import{D as o,o as e,f as c,g as s,l as u,y as a,G as l,ah as r}from"./plugin-vue_export-helper.a872f449.js";import"./inputs.b5f920bd.js";import"./resolvermap.7d64ab69.js";const f='{"title":"Viewer Usage","description":"","frontmatter":{},"headers":[{"level":2,"title":"Viewer Usage","slug":"viewer-usage"}],"relativePath":"viewer-usage.md","lastUpdated":1727321752346}',k={},N=Object.assign(k,{__name:"viewer-usage",setup(i){return(q,n)=>{const t=o("DemoContainer");return e(),c("div",null,[n[0]||(n[0]=s("h2",{id:"viewer-usage",tabindex:"-1"},[u("Viewer Usage "),s("a",{class:"header-anchor",href:"#viewer-usage","aria-hidden":"true"},"#")],-1)),a(t,null,{default:l(()=>[a(p)]),_:1}),n[1]||(n[1]=r(`<div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>content<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>CraftFrame</span> <span class="token attr-name">:resolverMap</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>resolverMap<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> useEditor<span class="token punctuation">,</span> EditorStoreType <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@versa-stack/v-craft&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> resolverMap <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./resolvermap&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token literal-property property">editor</span><span class="token operator">:</span> EditorStoreType <span class="token operator">=</span> <span class="token function">useEditor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
editor<span class="token punctuation">.</span><span class="token function">disable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> CraftNode<span class="token punctuation">,</span> CraftNodeResolver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@versa-stack/v-craft&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> resolverMap <span class="token operator">=</span> <span class="token punctuation">{</span>
  paragraph<span class="token operator">:</span> <span class="token punctuation">{</span>
    component<span class="token operator">:</span> <span class="token string">&quot;CraftComponentSimpleText&quot;</span><span class="token punctuation">,</span>
    propsSchema<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;select&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Type&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;tagName&quot;</span><span class="token punctuation">,</span>
        options<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token string">&quot;h1&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;h2&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;h3&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;h4&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;h5&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;h6&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;p&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;span&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;div&quot;</span><span class="token punctuation">,</span>
          <span class="token string">&quot;blockquote&quot;</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;textarea&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Content&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;content&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  container<span class="token operator">:</span> <span class="token punctuation">{</span>
    component<span class="token operator">:</span> <span class="token string">&quot;CraftComponentSimpleContainer&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  canvas<span class="token operator">:</span> <span class="token punctuation">{</span>
    component<span class="token operator">:</span> <span class="token string">&quot;CraftCanvas&quot;</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  graphqlProvider<span class="token operator">:</span> <span class="token punctuation">{</span>
    component<span class="token operator">:</span> <span class="token string">&quot;CraftGraphqlProvider&quot;</span><span class="token punctuation">,</span>
    propsSchema<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Endpoint&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;endpoint&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    rules<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">canMoveIn</span><span class="token punctuation">(</span>
        craftNode<span class="token operator">:</span> CraftNode<span class="token punctuation">,</span>
        targetNode<span class="token operator">:</span> CraftNode<span class="token punctuation">,</span>
        resolver<span class="token operator">:</span> CraftNodeResolver
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>craftNode<span class="token punctuation">.</span>componentName <span class="token operator">===</span> resolverMap<span class="token punctuation">.</span>canvas<span class="token punctuation">.</span>component<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          craftNode <span class="token operator">=</span> resolver<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>craftNode<span class="token punctuation">.</span>props<span class="token punctuation">.</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span>
          craftNode<span class="token punctuation">.</span>component <span class="token operator">===</span> resolverMap<span class="token punctuation">.</span>graphqlQueryWrapper<span class="token punctuation">.</span>component
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  graphqlQueryWrapper<span class="token operator">:</span> <span class="token punctuation">{</span>
    component<span class="token operator">:</span> <span class="token string">&quot;CraftGraphqlQueryWrapper&quot;</span><span class="token punctuation">,</span>
    propsSchema<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;graphql&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;query&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Query&quot;</span><span class="token punctuation">,</span>
        validation<span class="token operator">:</span> <span class="token string">&quot;required&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;graphql&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;variables&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Variables&quot;</span><span class="token punctuation">,</span>
        validation<span class="token operator">:</span> <span class="token string">&quot;required&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;map.fromPath&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;From Path&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;select&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;map.type&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Map Type&quot;</span><span class="token punctuation">,</span>
        options<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span> label<span class="token operator">:</span> <span class="token string">&quot;Single&quot;</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">&quot;single&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span> label<span class="token operator">:</span> <span class="token string">&quot;List&quot;</span><span class="token punctuation">,</span> value<span class="token operator">:</span> <span class="token string">&quot;list&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        validation<span class="token operator">:</span> <span class="token string">&quot;required&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        $formkit<span class="token operator">:</span> <span class="token string">&quot;patches&quot;</span><span class="token punctuation">,</span>
        name<span class="token operator">:</span> <span class="token string">&quot;map.patches&quot;</span><span class="token punctuation">,</span>
        label<span class="token operator">:</span> <span class="token string">&quot;Patches&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    rules<span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">canMoveInto</span><span class="token punctuation">(</span>
        craftNode<span class="token operator">:</span> CraftNode<span class="token punctuation">,</span>
        targetNode<span class="token operator">:</span> CraftNode<span class="token punctuation">,</span>
        resolver<span class="token operator">:</span> CraftNodeResolver
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>targetNode<span class="token punctuation">.</span>componentName <span class="token operator">===</span> resolverMap<span class="token punctuation">.</span>canvas<span class="token punctuation">.</span>component<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          targetNode <span class="token operator">=</span> resolver<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>targetNode<span class="token punctuation">.</span>props<span class="token punctuation">.</span>component<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">return</span> targetNode<span class="token punctuation">.</span>component <span class="token operator">===</span> resolverMap<span class="token punctuation">.</span>graphqlProvider<span class="token punctuation">.</span>component<span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function">canMoveIn</span><span class="token punctuation">(</span>craftNode<span class="token operator">:</span> CraftNode<span class="token punctuation">,</span> targetNode<span class="token operator">:</span> CraftNode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> targetNode<span class="token punctuation">.</span>children <span class="token operator">&lt;</span> <span class="token number">1</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div>`,2))])}}});export{f as __pageData,N as default};
