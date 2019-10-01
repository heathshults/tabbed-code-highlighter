const t=window.OrangoDemoTools.h;import{a as e,b as n,c as o,g as i,h as a,d as r,f as c,e as s}from"./chunk-1e906afd.js";var u=["input","select","textarea","a[href]","button","[tabindex]","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])'],l=u.join(","),d="undefined"==typeof Element?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector;function f(t,e){e=e||{};var n,o,i,a=[],r=[],c=new v(t.ownerDocument||t),s=t.querySelectorAll(l);for(e.includeContainer&&d.call(t,l)&&(s=Array.prototype.slice.apply(s)).unshift(t),n=0;n<s.length;n++)p(o=s[n],c)&&(0===(i=m(o))?a.push(o):r.push({documentOrder:n,tabIndex:i,node:o}));return r.sort(y).map(function(t){return t.node}).concat(a)}function p(t,e){return!(!h(t,e)||function(t){return function(t){return E(t)&&"radio"===t.type}(t)&&!function(t){if(!t.name)return!0;var e=function(t){for(var e=0;e<t.length;e++)if(t[e].checked)return t[e]}(t.ownerDocument.querySelectorAll('input[type="radio"][name="'+t.name+'"]'));return!e||e===t}(t)}(t)||m(t)<0)}function h(t,e){return e=e||new v(t.ownerDocument||t),!(t.disabled||function(t){return E(t)&&"hidden"===t.type}(t)||e.isUntouchable(t))}f.isTabbable=function(t,e){if(!t)throw new Error("No node provided");return!1!==d.call(t,l)&&p(t,e)},f.isFocusable=function(t,e){if(!t)throw new Error("No node provided");return!1!==d.call(t,_)&&h(t,e)};var _=u.concat("iframe").join(",");function m(t){var e=parseInt(t.getAttribute("tabindex"),10);return isNaN(e)?function(t){return"true"===t.contentEditable}(t)?0:t.tabIndex:e}function y(t,e){return t.tabIndex===e.tabIndex?t.documentOrder-e.documentOrder:t.tabIndex-e.tabIndex}function E(t){return"INPUT"===t.tagName}function v(t){this.doc=t,this.cache=[]}v.prototype.hasDisplayNone=function(t,e){if(t.nodeType!==Node.ELEMENT_NODE)return!1;var n=function(e,n){for(var o=0,i=e.length;o<i;o++)if(e[o]===t)return e[o]}(this.cache);if(n)return n[1];var o=!1;return"none"===(e=e||this.doc.defaultView.getComputedStyle(t)).display?o=!0:t.parentNode&&(o=this.hasDisplayNone(t.parentNode)),this.cache.push([t,o]),o},v.prototype.isUntouchable=function(t){if(t===this.doc.documentElement)return!1;var e=this.doc.defaultView.getComputedStyle(t);return!!this.hasDisplayNone(t,e)||"hidden"===e.visibility};var g,T=f,C=Object.prototype.hasOwnProperty,O=(g=[],{activateTrap:function(t){if(g.length>0){var e=g[g.length-1];e!==t&&e.pause()}var n=g.indexOf(t);-1===n?g.push(t):(g.splice(n,1),g.push(t))},deactivateTrap:function(t){var e=g.indexOf(t);-1!==e&&g.splice(e,1),g.length>0&&g[g.length-1].unpause()}});function b(t){return setTimeout(t,0)}var N=function(t,e){var n=document,o="string"==typeof t?n.querySelector(t):t,i=function(){for(var t={},e=0;e<arguments.length;e++){var n=arguments[e];for(var o in n)C.call(n,o)&&(t[o]=n[o])}return t}({returnFocusOnDeactivate:!0,escapeDeactivates:!0},e),a={firstTabbableNode:null,lastTabbableNode:null,nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1},r={activate:function(t){if(!a.active){m(),a.active=!0,a.paused=!1,a.nodeFocusedBeforeActivation=n.activeElement;var e=t&&t.onActivate?t.onActivate:i.onActivate;return e&&e(),s(),r}},deactivate:c,pause:function(){!a.paused&&a.active&&(a.paused=!0,u())},unpause:function(){a.paused&&a.active&&(a.paused=!1,s())}};return r;function c(t){if(a.active){u(),a.active=!1,a.paused=!1,O.deactivateTrap(r);var e=t&&void 0!==t.onDeactivate?t.onDeactivate:i.onDeactivate;return e&&e(),(t&&void 0!==t.returnFocus?t.returnFocus:i.returnFocusOnDeactivate)&&b(function(){y(a.nodeFocusedBeforeActivation)}),r}}function s(){if(a.active)return O.activateTrap(r),m(),b(function(){y(d())}),n.addEventListener("focusin",p,!0),n.addEventListener("mousedown",f,!0),n.addEventListener("touchstart",f,!0),n.addEventListener("click",_,!0),n.addEventListener("keydown",h,!0),r}function u(){if(a.active)return n.removeEventListener("focusin",p,!0),n.removeEventListener("mousedown",f,!0),n.removeEventListener("touchstart",f,!0),n.removeEventListener("click",_,!0),n.removeEventListener("keydown",h,!0),r}function l(t){var e=i[t],o=e;if(!e)return null;if("string"==typeof e&&!(o=n.querySelector(e)))throw new Error("`"+t+"` refers to no known node");if("function"==typeof e&&!(o=e()))throw new Error("`"+t+"` did not return a node");return o}function d(){var t;if(!(t=null!==l("initialFocus")?l("initialFocus"):o.contains(n.activeElement)?n.activeElement:a.firstTabbableNode||l("fallbackFocus")))throw new Error("You can't have a focus-trap without at least one focusable element");return t}function f(t){o.contains(t.target)||(i.clickOutsideDeactivates?c({returnFocus:!T.isFocusable(t.target)}):t.preventDefault())}function p(t){o.contains(t.target)||t.target instanceof Document||(t.stopImmediatePropagation(),y(a.mostRecentlyFocusedNode||d()))}function h(t){if(!1!==i.escapeDeactivates&&function(t){return"Escape"===t.key||"Esc"===t.key||27===t.keyCode}(t))return t.preventDefault(),void c();(function(t){return"Tab"===t.key||9===t.keyCode})(t)&&function(t){if(m(),t.shiftKey&&t.target===a.firstTabbableNode)return t.preventDefault(),void y(a.lastTabbableNode);t.shiftKey||t.target!==a.lastTabbableNode||(t.preventDefault(),y(a.firstTabbableNode))}(t)}function _(t){i.clickOutsideDeactivates||o.contains(t.target)||(t.preventDefault(),t.stopImmediatePropagation())}function m(){var t=T(o);a.firstTabbableNode=t[0]||d(),a.lastTabbableNode=t[t.length-1]||d()}function y(t){t!==n.activeElement&&(t&&t.focus?(t.focus(),a.mostRecentlyFocusedNode=t,function(t){return t.tagName&&"input"===t.tagName.toLowerCase()&&"function"==typeof t.select}(t)&&t.select()):y(d()))}},S={CLOSING:"mdc-dialog--closing",OPEN:"mdc-dialog--open",OPENING:"mdc-dialog--opening",SCROLLABLE:"mdc-dialog--scrollable",SCROLL_LOCK:"mdc-dialog-scroll-lock",STACKED:"mdc-dialog--stacked"},A={ACTION_ATTRIBUTE:"data-mdc-dialog-action",BUTTON_SELECTOR:".mdc-dialog__button",CLOSED_EVENT:"MDCDialog:closed",CLOSE_ACTION:"close",CLOSING_EVENT:"MDCDialog:closing",CONTAINER_SELECTOR:".mdc-dialog__container",CONTENT_SELECTOR:".mdc-dialog__content",DEFAULT_BUTTON_SELECTOR:".mdc-dialog__button--default",DESTROY_ACTION:"destroy",OPENED_EVENT:"MDCDialog:opened",OPENING_EVENT:"MDCDialog:opening",SCRIM_SELECTOR:".mdc-dialog__scrim",SUPPRESS_DEFAULT_PRESS_SELECTOR:["textarea",".mdc-menu .mdc-list-item"].join(", "),SURFACE_SELECTOR:".mdc-dialog__surface"},L={DIALOG_ANIMATION_CLOSE_TIME_MS:75,DIALOG_ANIMATION_OPEN_TIME_MS:150},D=function(t){function o(e){var i=t.call(this,n({},o.defaultAdapter,e))||this;return i.isOpen_=!1,i.animationFrame_=0,i.animationTimer_=0,i.layoutFrame_=0,i.escapeKeyAction_=A.CLOSE_ACTION,i.scrimClickAction_=A.CLOSE_ACTION,i.autoStackButtons_=!0,i.areButtonsStacked_=!1,i}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return S},enumerable:!0,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return A},enumerable:!0,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return L},enumerable:!0,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addBodyClass:function(){},addClass:function(){},areButtonsStacked:function(){return!1},clickDefaultButton:function(){},eventTargetMatches:function(){return!1},getActionFromEvent:function(){return""},hasClass:function(){return!1},isContentScrollable:function(){return!1},notifyClosed:function(){},notifyClosing:function(){},notifyOpened:function(){},notifyOpening:function(){},releaseFocus:function(){},removeBodyClass:function(){},removeClass:function(){},reverseButtons:function(){},trapFocus:function(){}}},enumerable:!0,configurable:!0}),o.prototype.init=function(){this.adapter_.hasClass(S.STACKED)&&this.setAutoStackButtons(!1)},o.prototype.destroy=function(){this.isOpen_&&this.close(A.DESTROY_ACTION),this.animationTimer_&&(clearTimeout(this.animationTimer_),this.handleAnimationTimerEnd_()),this.layoutFrame_&&(cancelAnimationFrame(this.layoutFrame_),this.layoutFrame_=0)},o.prototype.open=function(){var t=this;this.isOpen_=!0,this.adapter_.notifyOpening(),this.adapter_.addClass(S.OPENING),this.runNextAnimationFrame_(function(){t.adapter_.addClass(S.OPEN),t.adapter_.addBodyClass(S.SCROLL_LOCK),t.layout(),t.animationTimer_=setTimeout(function(){t.handleAnimationTimerEnd_(),t.adapter_.trapFocus(),t.adapter_.notifyOpened()},L.DIALOG_ANIMATION_OPEN_TIME_MS)})},o.prototype.close=function(t){var e=this;void 0===t&&(t=""),this.isOpen_&&(this.isOpen_=!1,this.adapter_.notifyClosing(t),this.adapter_.addClass(S.CLOSING),this.adapter_.removeClass(S.OPEN),this.adapter_.removeBodyClass(S.SCROLL_LOCK),cancelAnimationFrame(this.animationFrame_),this.animationFrame_=0,clearTimeout(this.animationTimer_),this.animationTimer_=setTimeout(function(){e.adapter_.releaseFocus(),e.handleAnimationTimerEnd_(),e.adapter_.notifyClosed(t)},L.DIALOG_ANIMATION_CLOSE_TIME_MS))},o.prototype.isOpen=function(){return this.isOpen_},o.prototype.getEscapeKeyAction=function(){return this.escapeKeyAction_},o.prototype.setEscapeKeyAction=function(t){this.escapeKeyAction_=t},o.prototype.getScrimClickAction=function(){return this.scrimClickAction_},o.prototype.setScrimClickAction=function(t){this.scrimClickAction_=t},o.prototype.getAutoStackButtons=function(){return this.autoStackButtons_},o.prototype.setAutoStackButtons=function(t){this.autoStackButtons_=t},o.prototype.layout=function(){var t=this;this.layoutFrame_&&cancelAnimationFrame(this.layoutFrame_),this.layoutFrame_=requestAnimationFrame(function(){t.layoutInternal_(),t.layoutFrame_=0})},o.prototype.handleInteraction=function(t){var e="click"===t.type,n="Enter"===t.key||13===t.keyCode,o="Space"===t.key||32===t.keyCode,i=this.adapter_.eventTargetMatches(t.target,A.SCRIM_SELECTOR),a=!this.adapter_.eventTargetMatches(t.target,A.SUPPRESS_DEFAULT_PRESS_SELECTOR);if(e&&i&&""!==this.scrimClickAction_)this.close(this.scrimClickAction_);else if(e||o||n){var r=this.adapter_.getActionFromEvent(t);r?this.close(r):n&&a&&this.adapter_.clickDefaultButton()}},o.prototype.handleDocumentKeydown=function(t){("Escape"===t.key||27===t.keyCode)&&""!==this.escapeKeyAction_&&this.close(this.escapeKeyAction_)},o.prototype.layoutInternal_=function(){this.autoStackButtons_&&this.detectStackedButtons_(),this.detectScrollableContent_()},o.prototype.handleAnimationTimerEnd_=function(){this.animationTimer_=0,this.adapter_.removeClass(S.OPENING),this.adapter_.removeClass(S.CLOSING)},o.prototype.runNextAnimationFrame_=function(t){var e=this;cancelAnimationFrame(this.animationFrame_),this.animationFrame_=requestAnimationFrame(function(){e.animationFrame_=0,clearTimeout(e.animationTimer_),e.animationTimer_=setTimeout(t,0)})},o.prototype.detectStackedButtons_=function(){this.adapter_.removeClass(S.STACKED);var t=this.adapter_.areButtonsStacked();t&&this.adapter_.addClass(S.STACKED),t!==this.areButtonsStacked_&&(this.adapter_.reverseButtons(),this.areButtonsStacked_=t)},o.prototype.detectScrollableContent_=function(){this.adapter_.removeClass(S.SCROLLABLE),this.adapter_.isContentScrollable()&&this.adapter_.addClass(S.SCROLLABLE)},o}(o),I=D.strings,k=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return e(n,t),Object.defineProperty(n.prototype,"isOpen",{get:function(){return this.foundation_.isOpen()},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"escapeKeyAction",{get:function(){return this.foundation_.getEscapeKeyAction()},set:function(t){this.foundation_.setEscapeKeyAction(t)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"scrimClickAction",{get:function(){return this.foundation_.getScrimClickAction()},set:function(t){this.foundation_.setScrimClickAction(t)},enumerable:!0,configurable:!0}),Object.defineProperty(n.prototype,"autoStackButtons",{get:function(){return this.foundation_.getAutoStackButtons()},set:function(t){this.foundation_.setAutoStackButtons(t)},enumerable:!0,configurable:!0}),n.attachTo=function(t){return new n(t)},n.prototype.initialize=function(t,e){var n,o,r=this.root_.querySelector(I.CONTAINER_SELECTOR);if(!r)throw new Error("Dialog component requires a "+I.CONTAINER_SELECTOR+" container element");this.container_=r,this.content_=this.root_.querySelector(I.CONTENT_SELECTOR),this.buttons_=[].slice.call(this.root_.querySelectorAll(I.BUTTON_SELECTOR)),this.defaultButton_=this.root_.querySelector(I.DEFAULT_BUTTON_SELECTOR),this.focusTrapFactory_=t,this.initialFocusEl_=e,this.buttonRipples_=[];try{for(var c=i(this.buttons_),s=c.next();!s.done;s=c.next())this.buttonRipples_.push(new a(s.value))}catch(t){n={error:t}}finally{try{s&&!s.done&&(o=c.return)&&o.call(c)}finally{if(n)throw n.error}}},n.prototype.initialSyncWithDOM=function(){var t,e=this;this.focusTrap_=(void 0===(t=this.focusTrapFactory_)&&(t=N),t(this.container_,{clickOutsideDeactivates:!0,escapeDeactivates:!1,initialFocus:this.initialFocusEl_})),this.handleInteraction_=this.foundation_.handleInteraction.bind(this.foundation_),this.handleDocumentKeydown_=this.foundation_.handleDocumentKeydown.bind(this.foundation_),this.handleLayout_=this.layout.bind(this);var n=["resize","orientationchange"];this.handleOpening_=function(){n.forEach(function(t){return window.addEventListener(t,e.handleLayout_)}),document.addEventListener("keydown",e.handleDocumentKeydown_)},this.handleClosing_=function(){n.forEach(function(t){return window.removeEventListener(t,e.handleLayout_)}),document.removeEventListener("keydown",e.handleDocumentKeydown_)},this.listen("click",this.handleInteraction_),this.listen("keydown",this.handleInteraction_),this.listen(I.OPENING_EVENT,this.handleOpening_),this.listen(I.CLOSING_EVENT,this.handleClosing_)},n.prototype.destroy=function(){this.unlisten("click",this.handleInteraction_),this.unlisten("keydown",this.handleInteraction_),this.unlisten(I.OPENING_EVENT,this.handleOpening_),this.unlisten(I.CLOSING_EVENT,this.handleClosing_),this.handleClosing_(),this.buttonRipples_.forEach(function(t){return t.destroy()}),t.prototype.destroy.call(this)},n.prototype.layout=function(){this.foundation_.layout()},n.prototype.open=function(){this.foundation_.open()},n.prototype.close=function(t){void 0===t&&(t=""),this.foundation_.close(t)},n.prototype.getDefaultFoundation=function(){var t=this;return new D({addBodyClass:function(t){return document.body.classList.add(t)},addClass:function(e){return t.root_.classList.add(e)},areButtonsStacked:function(){return e=t.buttons_,n=new Set,[].forEach.call(e,function(t){return n.add(t.offsetTop)}),n.size>1;var e,n},clickDefaultButton:function(){return t.defaultButton_&&t.defaultButton_.click()},eventTargetMatches:function(t,e){return!!t&&c(t,e)},getActionFromEvent:function(t){if(!t.target)return"";var e=s(t.target,"["+I.ACTION_ATTRIBUTE+"]");return e&&e.getAttribute(I.ACTION_ATTRIBUTE)},hasClass:function(e){return t.root_.classList.contains(e)},isContentScrollable:function(){return!!(e=t.content_)&&e.scrollHeight>e.offsetHeight;var e},notifyClosed:function(e){return t.emit(I.CLOSED_EVENT,e?{action:e}:{})},notifyClosing:function(e){return t.emit(I.CLOSING_EVENT,e?{action:e}:{})},notifyOpened:function(){return t.emit(I.OPENED_EVENT,{})},notifyOpening:function(){return t.emit(I.OPENING_EVENT,{})},releaseFocus:function(){return t.focusTrap_.deactivate()},removeBodyClass:function(t){return document.body.classList.remove(t)},removeClass:function(e){return t.root_.classList.remove(e)},reverseButtons:function(){t.buttons_.reverse(),t.buttons_.forEach(function(t){t.parentElement.appendChild(t)})},trapFocus:function(){return t.focusTrap_.activate()}})},n}(r);class F{constructor(){this.open=!1,this.code=""}debounce(t,e){let n;return function(...o){n&&clearTimeout(n),n=setTimeout(()=>{e(...o),n=null},t)}}contentChanged(t){console.log("debounceing"),this.codeEditorChanged.emit(t.code)}openDialog(){this.open||(this.modalEl.open(),this.open=!0)}closeDialog(){this.open&&(this.modalEl.close(),this.open=!1)}componentDidLoad(){const t=this.el.shadowRoot.querySelector(".mdc-dialog");this.modalEl=new k(t),this.modalEl.listen("MDCDialog:opened",()=>{this.open=!0}),this.modalEl.listen("MDCDialog:closing",()=>{this.open=!1})}componentDidUnload(){this.modalEl.destroy()}render(){return t("div",{class:"mdc-dialog",role:"dialog","aria-modal":"true","aria-labelledby":"my-dialog-title","aria-describedby":"my-dialog-content"},t("div",{class:"mdc-dialog__container"},t("div",{class:"mdc-dialog__surface"},t("h2",{class:"mdc-dialog__title",id:"my-dialog-title"},"Code Editor"),t("div",{class:"mdc-dialog__content",id:"my-dialog-content"},"Hola ",t("div",{id:"id-modal"})),t("footer",{class:"mdc-dialog__actions"},t("button",{type:"button",class:"mdc-button mdc-dialog__button","data-mdc-dialog-action":"close"},"close")))),t("div",{class:"mdc-dialog__scrim"}))}static get is(){return"o-demo-modal"}static get encapsulation(){return"shadow"}static get properties(){return{closeDialog:{method:!0},code:{type:"Any",attr:"code"},el:{elementRef:!0},open:{type:Boolean,attr:"open",reflectToAttr:!0,mutable:!0},openDialog:{method:!0}}}static get events(){return[{name:"code-editor-changed",method:"codeEditorChanged",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".mdc-dialog,.mdc-dialog__scrim{position:fixed;top:0;left:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;height:100%}.mdc-dialog{display:none;z-index:7}.mdc-dialog .mdc-dialog__surface{background-color:#fff;background-color:var(--mdc-theme-surface,#fff)}.mdc-dialog .mdc-dialog__scrim{background-color:rgba(0,0,0,.32)}.mdc-dialog .mdc-dialog__title{color:rgba(0,0,0,.87)}.mdc-dialog .mdc-dialog__content{color:rgba(0,0,0,.6)}.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__actions,.mdc-dialog.mdc-dialog--scrollable .mdc-dialog__title{border-color:rgba(0,0,0,.12)}.mdc-dialog .mdc-dialog__surface{min-width:280px}\@media (max-width:592px){.mdc-dialog .mdc-dialog__surface{max-width:calc(100vw - 32px)}}\@media (min-width:592px){.mdc-dialog .mdc-dialog__surface{max-width:560px}}.mdc-dialog .mdc-dialog__surface{max-height:calc(100vh - 32px);border-radius:4px}.mdc-dialog__scrim{opacity:0;z-index:-1}.mdc-dialog__container{-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:distribute;justify-content:space-around;-webkit-transform:scale(.8);transform:scale(.8);opacity:0}.mdc-dialog__container,.mdc-dialog__surface{display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box}.mdc-dialog__surface{-webkit-box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);-ms-flex-direction:column;flex-direction:column;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0;max-width:100%;max-height:100%}.mdc-dialog[dir=rtl] .mdc-dialog__surface,[dir=rtl] .mdc-dialog .mdc-dialog__surface{text-align:right}.mdc-dialog__title{line-height:normal;font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1.25rem;line-height:2rem;font-weight:500;letter-spacing:.0125em;text-decoration:inherit;text-transform:inherit;display:block;position:relative;-ms-flex-negative:0;flex-shrink:0;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:0 24px 9px;border-bottom:1px solid transparent}.mdc-dialog__title:before{display:inline-block;width:0;height:40px;content:\"\";vertical-align:0}.mdc-dialog[dir=rtl] .mdc-dialog__title,[dir=rtl] .mdc-dialog .mdc-dialog__title{text-align:right}.mdc-dialog--scrollable .mdc-dialog__title{padding-bottom:15px}.mdc-dialog__content{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1rem;line-height:1.5rem;font-weight:400;letter-spacing:.03125em;text-decoration:inherit;text-transform:inherit;-ms-flex-positive:1;flex-grow:1;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:20px 24px;overflow:auto;-webkit-overflow-scrolling:touch}.mdc-dialog__content>:first-child{margin-top:0}.mdc-dialog__content>:last-child{margin-bottom:0}.mdc-dialog__title+.mdc-dialog__content{padding-top:0}.mdc-dialog--scrollable .mdc-dialog__content{padding-top:8px;padding-bottom:8px}.mdc-dialog__content .mdc-list:first-child:last-child{padding:6px 0 0}.mdc-dialog--scrollable .mdc-dialog__content .mdc-list:first-child:last-child{padding:0}.mdc-dialog__actions{display:-ms-flexbox;display:flex;position:relative;-ms-flex-negative:0;flex-shrink:0;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center;-ms-flex-pack:end;justify-content:flex-end;-webkit-box-sizing:border-box;box-sizing:border-box;min-height:52px;margin:0;padding:8px;border-top:1px solid transparent}.mdc-dialog--stacked .mdc-dialog__actions{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:end;align-items:flex-end}.mdc-dialog__button{margin-left:8px;margin-right:0;max-width:100%;text-align:right}.mdc-dialog__button[dir=rtl],[dir=rtl] .mdc-dialog__button{margin-left:0;margin-right:8px}.mdc-dialog__button:first-child,.mdc-dialog__button:first-child[dir=rtl],[dir=rtl] .mdc-dialog__button:first-child{margin-left:0;margin-right:0}.mdc-dialog[dir=rtl] .mdc-dialog__button,[dir=rtl] .mdc-dialog .mdc-dialog__button{text-align:left}.mdc-dialog--stacked .mdc-dialog__button:not(:first-child){margin-top:12px}.mdc-dialog--closing,.mdc-dialog--open,.mdc-dialog--opening{display:-ms-flexbox;display:flex}.mdc-dialog--opening .mdc-dialog__scrim{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-dialog--opening .mdc-dialog__container{-webkit-transition:opacity 75ms linear,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;transition:opacity 75ms linear,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;transition:opacity 75ms linear,transform .15s cubic-bezier(0,0,.2,1) 0ms;transition:opacity 75ms linear,transform .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms}.mdc-dialog--closing .mdc-dialog__container,.mdc-dialog--closing .mdc-dialog__scrim{-webkit-transition:opacity 75ms linear;transition:opacity 75ms linear}.mdc-dialog--closing .mdc-dialog__container{-webkit-transform:scale(1);transform:scale(1)}.mdc-dialog--open .mdc-dialog__scrim{opacity:1}.mdc-dialog--open .mdc-dialog__container{-webkit-transform:scale(1);transform:scale(1);opacity:1}.mdc-dialog-scroll-lock{overflow:hidden}:host .mdc-dialog .mdc-dialog__surface{min-width:1024px}"}}export{F as ODemoModal};