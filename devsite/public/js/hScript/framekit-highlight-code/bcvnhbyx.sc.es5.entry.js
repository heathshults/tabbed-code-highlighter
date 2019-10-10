var __awaiter=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))(function(o,i){function a(t){try{u(r.next(t))}catch(t){i(t)}}function s(t){try{u(r.throw(t))}catch(t){i(t)}}function u(t){t.done?o(t.value):new n(function(e){e(t.value)}).then(a,s)}u((r=r.apply(t,e||[])).next())})},__generator=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}};FramekitHighlightCode.loadBundle("bcvnhbyx",["exports"],function(t){var e=window.FramekitHighlightCode.h,n=function(){function t(){this.width="100%",this.height="400",this.value=""}return t.prototype.hostData=function(){return this.tabContainerHeight=this.elem.style.setProperty("height",this.height),this.tabContainerHeight},t.prototype.getNewHeight=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){return[2,this.height]})})},t.prototype.componentWillLoad=function(){this.tabs=Array.from(this.elem.querySelectorAll("fk-tab"))},t.prototype.valueChanged=function(){var t=this.getNewHeight();this.elem.style.setProperty("height",t.toString());for(var e=this.elem.shadowRoot.querySelectorAll("div.fk-tab"),n=0;e[n];n++)this.convToHTMLElement=e[n].style.setProperty("height",t.toString())},t.prototype.currentTab=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){return[2,this.tabs.findIndex(function(t){return t.open})]})})},t.prototype.openTab=function(t){this.tabs[t].disabled||(this.tabs=this.tabs.map(function(t){return t.open=!1,t}),this.tabs[t].open=!0,this.onChange.emit({idx:t}))},t.prototype.expand=function(t){this.tabs[t].disabled||this.tabs[t].shadowRoot.querySelector('div[role="tabpanel"]').classList.toggle("c-tabs__expander")},t.prototype.removeFocus=function(t){this.tabs[t].disabled||(this.tabs=this.tabs.map(function(t){return t.blur(),t}))},t.prototype.render=function(){var t=this;return e("div",{id:"theTabContainer",class:"c-tabs"},e("div",{role:"tablist",class:"c-tabs"},e("div",{class:"c-tabs__nav"},e("div",{class:"c-tabs__headings"},this.tabs.map(function(n,r){return e("button",{role:"tab",disabled:n.disabled,class:"c-tab-heading "+(n.type?"c-tab-heading--"+n.type:"")+" "+(n.open?"c-tab-heading--active":""),onClick:function(){return t.openTab(r)},onMouseOut:function(){return t.removeFocus(r)}},n.header)}))),e("slot",null)),e("div",{class:"c-button-container"},this.tabs.map(function(n,r){if(n.open)return e("button",{disabled:n.disabled,class:"c-button c-button--showMore",onClick:function(){return t.expand(r)},onMouseOut:function(){return t.removeFocus(r)}},"Show More")})))},Object.defineProperty(t,"is",{get:function(){return"fk-tabs"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{convToHTMLElement:{type:"Any",attr:"conv-to-h-t-m-l-element"},cssClass:{type:String,attr:"css-class"},currentTab:{method:!0},elem:{elementRef:!0},expand:{method:!0},getNewHeight:{method:!0},height:{type:String,attr:"height",reflectToAttr:!0,mutable:!0},openTab:{method:!0},removeFocus:{method:!0},tabContainerHeight:{type:"Any",attr:"tab-container-height",mutable:!0},tabs:{state:!0},value:{type:String,attr:"value",mutable:!0,watchCallbacks:["valueChanged"]},width:{type:String,attr:"width",reflectToAttr:!0,mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"change",method:"onChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"\@font-face{font-family:Source Code Pro;font-style:normal;font-weight:400;src:local(\"Source Code Pro\"),local(\"SourceCodePro-Regular\"),url(Source-Code-Pro.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\@font-face{font-family:Source Code Pro;font-style:normal;font-weight:700;src:local(\"Source Code Pro Bold\"),local(\"SourceCodePro-Bold\"),url(Source-Code-Pro-bold.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}.sc-fk-tabs:root{--bp-color-core-blue-60:#0c77ba;--bp-color-core-blue-70:#0a649d;--bp-color-core-blue-90:#064063;--bp-color-core-neutral-13:#f2f2f2;--bp-color-core-neutral-17:#ededed;--bp-color-core-neutral-20:#dedede;--bp-color-core-neutral-60:#7a7a7a;--bp-color-core-neutral-90:#2e2e2e;--bp-color-core-muted-yellow-90:#fdbc2c;--bp-color-background-light-layer0-base:#f8f8f8;--bp-color-border-lightest:#dedede;--bp-color-brand-orange-base:#c55422;--bp-color-brand-yellow-darker:#e0ac00;--bp-color-brand-green-base:#2c6937;--bp-color-brand-green-darker:#074512;--bp-color-core-red-50:#bd2b2b;--bp-color-core-red-40:#cc3535;--fk-color-background-code:#282c34;--fk-highlight-code-font-family:\"Source Code Pro\",sans-serif,monospace;--fk-highlight-code-font-size:1.01rem;--fk-highlight-code-line-height:1.75rem;--fk-c-button--showMore-padding:2px 10px 4px 10px}.hydratedWidth.sc-fk-tabs{width:100%}.c-tabs-container.sc-fk-tabs{position:absolute;display:-ms-flexbox;display:flex;width:100%}.c-tabs.sc-fk-tabs{position:relative;top:0;right:0;left:0;-ms-flex:auto;flex:auto;width:100%}.c-tabs[role=tablist].sc-fk-tabs{-webkit-box-sizing:border-box;box-sizing:border-box;display:block;width:100%;overflow:hidden;line-height:normal;background:var(--bp-color-core-neutral-20,#dedede)}.c-tabs[role=tablist].sc-fk-tabs:before{display:block;content:\"\"}.c-tabs__headings.sc-fk-tabs{display:-ms-inline-flexbox;display:inline-flex;font-family:sans-serif;text-align:center}.c-tabs__nav.sc-fk-tabs{width:100%;padding-top:20px;padding-left:20px;margin:-10px -20px 0 -20px;overflow:hidden;background:var(--bp-color-background-light-layer0-base,#f8f8f8)}.c-tabs__nav.sc-fk-tabs   .c-tabs__headings.sc-fk-tabs{padding-bottom:1em;margin-bottom:-1em;overflow-x:auto;overflow-y:hidden}.c-tabs__nav.sc-fk-tabs   .c-tabs__headings.sc-fk-tabs:first-child{margin-left:10px}.c-tab-heading[role=tab].sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:var(--bp-color-background-light-layer0-base,#f8f8f8);border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{background:var(--bp-color-core-neutral-17,#ededed);border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{cursor:pointer;background-color:var(--bp-color-core-neutral-20,#dedede)}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{background-color:var(--bp-color-core-neutral-20,#dedede);border-bottom-color:var(--bp-color-core-neutral-60,#7a7a7a)}.c-tab-heading[role=tab][disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-core-neutral-60,#7a7a7a)}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-neutral-17,#ededed);box-shadow:inset 0 0 0 2px var(--bp-color-core-neutral-17,#ededed)}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-core-neutral-90,#2e2e2e)}.c-tab-heading[role=tab].c-tab-heading--brand[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--brand.c-tab-heading--active.sc-fk-tabs{border-bottom-color:#2c3e50}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--info[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--info.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a)}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{background:var(--bp-color-core-neutral-20,#dedede);border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{background:var(--bp-color-core-neutral-20,#dedede);border-bottom-color:var(--bp-color-brand-yellow-darker,#e0ac00)}.c-tab-heading[role=tab].c-tab-heading--warning[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--warning.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-brand-yellow-darker,#e0ac00)}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-brand-green-base,#2c6937)}.c-tab-heading[role=tab].c-tab-heading--success[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--success.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-brand-green-darker,#074512)}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-core-red-50,#bd2b2b)}.c-tab-heading[role=tab].c-tab-heading--error[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--error.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-core-red-40,#cc3535)}.c-tabs__tab[role=tabpanel].sc-fk-tabs{position:relative;width:100%;height:300px;overflow-x:auto;background:var(--fk-color-background-code,#282c34);border-top:solid 10px var(--bp-color-core-neutral-20,#dedede)}.c-tabs__tab[role=tabpanel].sc-fk-tabs::-webkit-scrollbar{display:none}.c-tabs__tab[role=tabpanel].c-tabs__expander.sc-fk-tabs{height:100%}.c-button-container.sc-fk-tabs{position:relative;height:15px;text-align:center;background:#dedede}.c-button--showMore.sc-fk-tabs{z-index:501;display:inline-block;padding:var(--fk-c-button--showMore-padding,2px 10px 4px 10px);margin:auto;font-size:10px!important;color:var(--bp-color-core-neutral-20,#dedede);background:var(--fk-color-background-code,#282c34);border:2px solid var(--fk-color-background-code,#282c34)}.c-button--showMore.sc-fk-tabs, .c-button--showMore.sc-fk-tabs:before{position:absolute;left:50%;-webkit-box-shadow:none;box-shadow:none;-webkit-transform:translate(-50%);transform:translate(-50%)}.c-button--showMore.sc-fk-tabs:before{bottom:-8px;z-index:500;width:0;height:0;content:\"\";border-color:#282c34 transparent transparent transparent;border-style:solid;border-width:6px 6px 0 6px}.c-button--showMore.sc-fk-tabs:hover{cursor:pointer;background:var(--bp-color-core-blue-90,#064063);border:2px solid var(--bp-color-core-blue-90,#064063);-webkit-box-shadow:none;box-shadow:none}.c-button--showMore.sc-fk-tabs:hover:before{cursor:pointer;border-color:var(--bp-color-core-blue-90,#064063) transparent transparent transparent;-webkit-box-shadow:none;box-shadow:none}.c-button--showMore.sc-fk-tabs:focus{outline-color:var(--bp-color-core-blue-60,#7a7a7a);-webkit-box-shadow:none;box-shadow:none}.sc-fk-tabs-s > [slot=code]{display:none}.fk-highlight-code-container.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs{width:100%;padding:10px 20px 0 20px;overflow-:visible;font-family:var(--fk-highlight-code-font-family,\"Source Code Pro\",sans-serif,monospace);font-size:var(--fk-highlight-code-font-size,1.01rem);color:var(--fk-highlight-code-color,#eaeae9);text-align:var(--fk-highlight-code-text-align,start);-moz-tab-size:2;-o-tab-size:2;tab-size:2;background:var(--fk-color-background-code,#282c34);border-bottom:10px solid var(--fk-color-background-code,#282c34);border-radius:var(--fk-highlight-code-border-radius,0);-webkit-transition:all .2s ease-in-out;transition:all .2s ease-in-out;-webkit-transform:scale(var(--fk-highlight-code-zoom,1));transform:scale(var(--fk-highlight-code-zoom,1));-webkit-transform-origin:bottom left;transform-origin:bottom left;direction:var(--fk-highlight-code-direction,ltr)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs{width:100%;font-family:var(--fk-highlight-code-font-family);font-size:var(--fk-highlight-code-font-size);line-height:var(--fk-highlight-code-line-height,1.75rem);color:var(--bp-color-core-neutral-17,#ededed);-moz-tab-size:2;-o-tab-size:2;tab-size:2}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   div.sc-fk-tabs:empty, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   div.sc-fk-tabs:empty{min-height:1rem}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   span.fk-highlight-code-anchor-hidden.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   span.fk-highlight-code-anchor-hidden.sc-fk-tabs{visibility:hidden}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   span.fk-highlight-code-line.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   span.fk-highlight-code-line.sc-fk-tabs{padding:var(--fk-highlight-code-line-padding,10px);background:var(--fk-highlight-code-line-background);border-top:var(--fk-highlight-code-line-border-top);border-bottom:var(--fk-highlight-code-line-border-bottom)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .language-css.sc-fk-tabs   .token.string.sc-fk-tabs:not(.fk-highlight-code-line), .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .style.sc-fk-tabs   .token.string.sc-fk-tabs:not(.fk-highlight-code-line), .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.entity.sc-fk-tabs:not(.fk-highlight-code-line), .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.operator.sc-fk-tabs:not(.fk-highlight-code-line), .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.url.sc-fk-tabs:not(.fk-highlight-code-line), pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .language-css.sc-fk-tabs   .token.string.sc-fk-tabs:not(.fk-highlight-code-line), pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .style.sc-fk-tabs   .token.string.sc-fk-tabs:not(.fk-highlight-code-line), pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.entity.sc-fk-tabs:not(.fk-highlight-code-line), pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.operator.sc-fk-tabs:not(.fk-highlight-code-line), pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.url.sc-fk-tabs:not(.fk-highlight-code-line){background:inherit}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.cdata.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.comment.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.doctype.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.prolog.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.cdata.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.comment.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.doctype.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.prolog.sc-fk-tabs{color:var(--fk-highlight-code-token-comment,#6f705e)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.punctuation.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.punctuation.sc-fk-tabs{color:var(--fk-highlight-code-token-punctuation,#edede7)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.boolean.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.constant.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.deleted.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.number.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.property.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.symbol.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.tag.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.boolean.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.constant.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.deleted.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.number.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.property.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.symbol.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.tag.sc-fk-tabs{color:var(--fk-highlight-code-token-property,#e25e88)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.attr-name.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.builtin.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.char.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.inserted.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.selector.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.string.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.attr-name.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.builtin.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.char.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.inserted.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.selector.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.string.sc-fk-tabs{color:var(--fk-highlight-code-token-selector,#f3ac9f)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .language-css.sc-fk-tabs   .token.string.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .style.sc-fk-tabs   .token.string.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.entity.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.operator.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.url.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .language-css.sc-fk-tabs   .token.string.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .style.sc-fk-tabs   .token.string.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.entity.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.operator.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.url.sc-fk-tabs{color:var(--fk-highlight-code-token-operator,#a2a2ff)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.keyword.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.keyword.sc-fk-tabs{color:vaf(--fk-highlight-code-token-keyword,#7a7afe)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.atrule.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.attr-value.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.atrule.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.attr-value.sc-fk-tabs{color:var(--fk-highlight-code-token-atrule,#f0e9ab)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.class-name.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.function.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.class-name.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.function.sc-fk-tabs{color:var(--fk-highlight-code-token-function,#eb3c42)}.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.important.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.regex.sc-fk-tabs, .fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.variable.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.important.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.regex.sc-fk-tabs, pre.fk-highlight-code-container.sc-fk-tabs   code.theCodeTag.sc-fk-tabs   .token.variable.sc-fk-tabs{color:var(--fk-highlight-code-token-regex,#e90)}.ps.sc-fk-tabs{overflow:hidden!important;-ms-touch-action:auto;touch-action:auto;overflow-anchor:none}.ps__rail-x.sc-fk-tabs{bottom:0;height:15px}.ps__rail-x.sc-fk-tabs, .ps__rail-y.sc-fk-tabs{position:absolute;display:none;opacity:0;-webkit-transition:background-color .2s linear,opacity .2s linear;transition:background-color .2s linear,opacity .2s linear}.ps__rail-y.sc-fk-tabs{right:0;width:15px}.ps--active-x.sc-fk-tabs > .ps__rail-x.sc-fk-tabs, .ps--active-y.sc-fk-tabs > .ps__rail-y.sc-fk-tabs{display:block;background-color:transparent}.ps--focus.sc-fk-tabs > .ps__rail-x.sc-fk-tabs, .ps--focus.sc-fk-tabs > .ps__rail-y.sc-fk-tabs, .ps--scrolling-x.sc-fk-tabs > .ps__rail-x.sc-fk-tabs, .ps--scrolling-y.sc-fk-tabs > .ps__rail-y.sc-fk-tabs, .ps.sc-fk-tabs:hover > .ps__rail-x.sc-fk-tabs, .ps.sc-fk-tabs:hover > .ps__rail-y.sc-fk-tabs{opacity:.6}.ps.sc-fk-tabs   .ps__rail-x.ps--clicking.sc-fk-tabs, .ps.sc-fk-tabs   .ps__rail-x.sc-fk-tabs:focus, .ps.sc-fk-tabs   .ps__rail-x.sc-fk-tabs:hover, .ps.sc-fk-tabs   .ps__rail-y.ps--clicking.sc-fk-tabs, .ps.sc-fk-tabs   .ps__rail-y.sc-fk-tabs:focus, .ps.sc-fk-tabs   .ps__rail-y.sc-fk-tabs:hover{background-color:#eee;opacity:.9}.ps__thumb-x.sc-fk-tabs{bottom:2px;height:6px;-webkit-transition:background-color .2s linear,height .2s ease-in-out;transition:background-color .2s linear,height .2s ease-in-out}.ps__thumb-x.sc-fk-tabs, .ps__thumb-y.sc-fk-tabs{position:absolute;background-color:#aaa;border-radius:6px}.ps__thumb-y.sc-fk-tabs{right:2px;width:6px;-webkit-transition:background-color .2s linear,width .2s ease-in-out;transition:background-color .2s linear,width .2s ease-in-out}.ps__rail-x.ps--clicking.sc-fk-tabs   .ps__thumb-x.sc-fk-tabs, .ps__rail-x.sc-fk-tabs:focus > .ps__thumb-x.sc-fk-tabs, .ps__rail-x.sc-fk-tabs:hover > .ps__thumb-x.sc-fk-tabs{height:11px;background-color:#999}.ps__rail-y.ps--clicking.sc-fk-tabs   .ps__thumb-y.sc-fk-tabs, .ps__rail-y.sc-fk-tabs:focus > .ps__thumb-y.sc-fk-tabs, .ps__rail-y.sc-fk-tabs:hover > .ps__thumb-y.sc-fk-tabs{width:11px;background-color:#999}\@supports (-ms-overflow-style:none){.ps.sc-fk-tabs{overflow:auto!important}}\@media (-ms-high-contrast:none),screen and (-ms-high-contrast:active){.ps.sc-fk-tabs{overflow:auto!important}}"},enumerable:!0,configurable:!0}),t}();t.FkTabs=n,Object.defineProperty(t,"__esModule",{value:!0})});