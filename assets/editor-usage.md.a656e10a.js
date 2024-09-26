import{_ as t}from"./editor.b360739d.js";import{D as p,o,f as e,y as s,G as c,ah as u}from"./plugin-vue_export-helper.a872f449.js";import"./index.b59f9ef0.js";import"./inputs.b5f920bd.js";import"./resolvermap.7d64ab69.js";const f='{"title":"Properties","description":"","frontmatter":{},"headers":[{"level":2,"title":"Properties","slug":"properties"},{"level":2,"title":"Events","slug":"events"},{"level":2,"title":"Resolver Map","slug":"resolver-map"},{"level":2,"title":"Blueprints","slug":"blueprints"}],"relativePath":"editor-usage.md","lastUpdated":1727321183033}',l={},y=Object.assign(l,{__name:"editor-usage",setup(r){return(k,n)=>{const a=p("DemoContainer");return o(),e("div",null,[s(a,null,{default:c(()=>[s(t)]),_:1}),n[0]||(n[0]=u(`<div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>CraftEditor</span> <span class="token attr-name">:config</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>config<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@action-click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>onAction<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>CraftCanvas</span> <span class="token attr-name">component</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>CraftComponentSimpleContainer<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>CraftEditor</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ts<span class="token punctuation">&quot;</span></span> <span class="token attr-name">setup</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> <span class="token punctuation">{</span> fas <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@fortawesome/free-solid-svg-icons&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  CraftEditorActionPayload<span class="token punctuation">,</span>
  CraftEditorConfig<span class="token punctuation">,</span>
  useEditor<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@versa-stack/v-craft&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> blueprints <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./blueprints&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> resolverMap <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./resolvermap&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> BlueprintsLibrary <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../../../../src/lib/model&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> editor <span class="token operator">=</span> <span class="token function">useEditor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
editor<span class="token punctuation">.</span><span class="token function">enable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">removeParentField</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">obj</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> obj<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>removeParentField<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> obj <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> obj <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> newObj <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token punctuation">[</span>key<span class="token punctuation">,</span> value<span class="token punctuation">]</span> <span class="token keyword">of</span> Object<span class="token punctuation">.</span><span class="token function">entries</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>key <span class="token operator">!==</span> <span class="token string">&quot;parent&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        newObj<span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token function">removeParentField</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> newObj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> obj<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">onAction</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">payload</span><span class="token operator">:</span> CraftEditorActionPayload</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>payload<span class="token punctuation">.</span>action<span class="token punctuation">.</span>key <span class="token operator">===</span> <span class="token string">&quot;export&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> cleanedNodes <span class="token operator">=</span> <span class="token function">removeParentField</span><span class="token punctuation">(</span>payload<span class="token punctuation">.</span>editor<span class="token punctuation">.</span>nodes<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">alert</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>cleanedNodes<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token literal-property property">config</span><span class="token operator">:</span> CraftEditorConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">blueprintsLibrary</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">groups</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">&quot;Default&quot;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">metadata</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;default&quot;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        blueprints<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span> <span class="token keyword">as</span> BlueprintsLibrary<span class="token punctuation">,</span>
  resolverMap<span class="token punctuation">,</span>
  <span class="token literal-property property">actions</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">&quot;Export&quot;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">icon</span><span class="token operator">:</span> fas<span class="token punctuation">.</span>faDownload<span class="token punctuation">,</span>
      <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">&quot;export&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><h2 id="properties" tabindex="-1">Properties <a class="header-anchor" href="#properties" aria-hidden="true">#</a></h2><table><thead><tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody><tr><td>config</td><td>EditorAppConfig</td><td>-</td><td>Configures the EditorApp</td></tr></tbody></table><h2 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-hidden="true">#</a></h2><table><thead><tr><th>Name</th><th>Parameters</th><th>Description</th></tr></thead><tbody><tr><td>action-click</td><td>ActionEvent</td><td>Action event fired when an action has been clicked.</td></tr></tbody></table><h2 id="resolver-map" tabindex="-1">Resolver Map <a class="header-anchor" href="#resolver-map" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> CraftNode<span class="token punctuation">,</span> CraftNodeResolver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@versa-stack/v-craft&quot;</span><span class="token punctuation">;</span>

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
</code></pre></div><h2 id="blueprints" tabindex="-1">Blueprints <a class="header-anchor" href="#blueprints" aria-hidden="true">#</a></h2><div class="language-ts"><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Blueprints<span class="token punctuation">,</span> CraftNode <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@versa-stack/v-craft&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> blueprints<span class="token operator">:</span> Blueprints <span class="token operator">=</span> <span class="token punctuation">{</span>
  CraftComponentSimpleContainer<span class="token operator">:</span> <span class="token punctuation">{</span>
    label<span class="token operator">:</span> <span class="token string">&quot;Simple Container&quot;</span><span class="token punctuation">,</span>
    componentName<span class="token operator">:</span> <span class="token string">&quot;CraftCanvas&quot;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span> component<span class="token operator">:</span> <span class="token string">&quot;CraftComponentSimpleContainer&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">as</span> CraftNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  CraftComponentSimpleText<span class="token operator">:</span> <span class="token punctuation">{</span>
    label<span class="token operator">:</span> <span class="token string">&quot;Text&quot;</span><span class="token punctuation">,</span>
    componentName<span class="token operator">:</span> <span class="token string">&quot;CraftComponentSimpleText&quot;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      content<span class="token operator">:</span> <span class="token string">&quot;Change me.&quot;</span><span class="token punctuation">,</span>
      tagName<span class="token operator">:</span> <span class="token string">&quot;p&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">as</span> CraftNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  ContainerWithTextBlueprint<span class="token operator">:</span> <span class="token punctuation">{</span>
    label<span class="token operator">:</span> <span class="token string">&quot;Container with Text&quot;</span><span class="token punctuation">,</span>
    componentName<span class="token operator">:</span> <span class="token string">&quot;CraftCanvas&quot;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      component<span class="token operator">:</span> <span class="token string">&quot;CraftComponentSimpleContainer&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        componentName<span class="token operator">:</span> <span class="token string">&quot;CraftComponentSimpleText&quot;</span><span class="token punctuation">,</span>
        props<span class="token operator">:</span> <span class="token punctuation">{</span>
          content<span class="token operator">:</span> <span class="token string">&quot;Some prefilled text.&quot;</span><span class="token punctuation">,</span>
          tagName<span class="token operator">:</span> <span class="token string">&quot;h1&quot;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  CraftGraphqlProvider<span class="token operator">:</span> <span class="token punctuation">{</span>
    label<span class="token operator">:</span> <span class="token string">&quot;Graphql Provider&quot;</span><span class="token punctuation">,</span>
    componentName<span class="token operator">:</span> <span class="token string">&quot;CraftCanvas&quot;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      component<span class="token operator">:</span> <span class="token string">&quot;CraftGraphqlProvider&quot;</span><span class="token punctuation">,</span>
      endpoint<span class="token operator">:</span> <span class="token string">&quot;https://countries.trevorblades.com/graphql&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">as</span> CraftNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  CraftGraphqlQueryWrapper<span class="token operator">:</span> <span class="token punctuation">{</span>
    label<span class="token operator">:</span> <span class="token string">&quot;Graphql Query Wrapper&quot;</span><span class="token punctuation">,</span>
    componentName<span class="token operator">:</span> <span class="token string">&quot;CraftCanvas&quot;</span><span class="token punctuation">,</span>
    props<span class="token operator">:</span> <span class="token punctuation">{</span>
      component<span class="token operator">:</span> <span class="token string">&quot;CraftGraphqlQueryWrapper&quot;</span><span class="token punctuation">,</span>
      map<span class="token operator">:</span> <span class="token punctuation">{</span>
        type<span class="token operator">:</span> <span class="token string">&quot;list&quot;</span><span class="token punctuation">,</span>
        fromPath<span class="token operator">:</span> <span class="token string">&quot;$.countries[*]&quot;</span><span class="token punctuation">,</span>
        patches<span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            fromPath<span class="token operator">:</span> <span class="token string">&quot;$.emoji&quot;</span><span class="token punctuation">,</span>
            toPath<span class="token operator">:</span> <span class="token string">&quot;$.content&quot;</span><span class="token punctuation">,</span>
            type<span class="token operator">:</span> <span class="token string">&quot;single&quot;</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span>
          <span class="token punctuation">{</span>
            fromPath<span class="token operator">:</span> <span class="token string">&quot;$.props.tagName&quot;</span><span class="token punctuation">,</span>
            toPath<span class="token operator">:</span> <span class="token string">&quot;$.tagName&quot;</span><span class="token punctuation">,</span>
            patchSource<span class="token operator">:</span> <span class="token string">&quot;child&quot;</span><span class="token punctuation">,</span>
            <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">&quot;span&quot;</span><span class="token punctuation">,</span>
            type<span class="token operator">:</span> <span class="token string">&quot;single&quot;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      query<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">query GetCountries {
  countries {
    code
    emoji
  }
}</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    children<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token keyword">as</span> CraftNode<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div>`,9))])}}});export{f as __pageData,y as default};
