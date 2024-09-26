import{_ as s,o as a,f as t,ah as p}from"./plugin-vue_export-helper.a872f449.js";const d='{"title":"@versa-stack/v-craft","description":"","frontmatter":{},"headers":[{"level":3,"title":"Setup","slug":"setup"}],"relativePath":"index.md","lastUpdated":1727321183033}',o={};function e(c,n,u,i,r,l){return a(),t("div",null,n[0]||(n[0]=[p(`<h1 id="versa-stack-v-craft" tabindex="-1">@versa-stack/v-craft <a class="header-anchor" href="#versa-stack-v-craft" aria-hidden="true">#</a></h1><p>An attempt to provide an easily configurable page editor for vue3 components. Originally this project is based on <a href="https://craft.js.org/" target="_blank" rel="noopener noreferrer">https://craft.js.org/</a> and its Vue2 port <a href="https://github.com/yoychen/v-craft" target="_blank" rel="noopener noreferrer">https://github.com/yoychen/v-craft</a>. The core code of <code>@versa-stack/v-craft</code> is derived from <a href="https://github.com/loming/v-craft/tree/vue3" target="_blank" rel="noopener noreferrer">https://github.com/loming/v-craft/tree/vue3</a>.</p><h3 id="setup" tabindex="-1">Setup <a class="header-anchor" href="#setup" aria-hidden="true">#</a></h3><div class="language-js"><div class="highlight-lines"><div class="highlighted">\xA0</div><div class="highlighted">\xA0</div><div class="highlighted">\xA0</div><br><br><br><br><div class="highlighted">\xA0</div><br><br><br><br><br><br><div class="highlighted">\xA0</div><div class="highlighted">\xA0</div><div class="highlighted">\xA0</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><pre><code><span class="token keyword">import</span> <span class="token punctuation">{</span> defaultConfig<span class="token punctuation">,</span> plugin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@formkit/vue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createPinia <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;pinia&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> DefaultTheme <span class="token keyword">from</span> <span class="token string">&quot;vitepress/theme&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> DemoContainer <span class="token keyword">from</span> <span class="token string">&quot;../components/DemoContainer.vue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> FontAwesomeIcon <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@fortawesome/vue-fontawesome&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> VCraft<span class="token punctuation">,</span> <span class="token punctuation">{</span> formkit <span class="token keyword">as</span> vcFormkit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@versa-stack/v-craft&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token string">&quot;./custom.css&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> pinia <span class="token operator">=</span> <span class="token function">createPinia</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>DefaultTheme<span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">enhanceApp</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> app <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    app<span class="token punctuation">.</span>config<span class="token punctuation">.</span>debug <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    app<span class="token punctuation">.</span>config<span class="token punctuation">.</span>devtools <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    app<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&quot;FontAwesomeIcon&quot;</span><span class="token punctuation">,</span> FontAwesomeIcon<span class="token punctuation">)</span><span class="token punctuation">;</span>
    app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>pinia<span class="token punctuation">)</span><span class="token punctuation">;</span>
    app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VCraft<span class="token punctuation">)</span><span class="token punctuation">;</span>
    app<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>
      plugin<span class="token punctuation">,</span>
      <span class="token function">defaultConfig</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">inputs</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token operator">...</span>vcFormkit<span class="token punctuation">.</span>inputs<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    app<span class="token punctuation">.</span><span class="token function">component</span><span class="token punctuation">(</span><span class="token string">&quot;DemoContainer&quot;</span><span class="token punctuation">,</span> DemoContainer<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div>`,4)]))}var f=s(o,[["render",e]]);export{d as __pageData,f as default};
