var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};function e(e,n){function i(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(i.prototype=n.prototype,new i)}var n=function(){return(n=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++)for(var a in e=arguments[n])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t}).apply(this,arguments)};function i(t){var e="function"==typeof Symbol&&t[Symbol.iterator],n=0;return e?e.call(t):{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}}}function a(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var i,a,r=n.call(t),o=[];try{for(;(void 0===e||e-- >0)&&!(i=r.next()).done;)o.push(i.value)}catch(t){a={error:t}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(a)throw a.error}}return o}var r,o,s=function(){function t(t){void 0===t&&(t={}),this.adapter_=t}return Object.defineProperty(t,"cssClasses",{get:function(){return{}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"strings",{get:function(){return{}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"numbers",{get:function(){return{}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{}},enumerable:!0,configurable:!0}),t.prototype.init=function(){},t.prototype.destroy=function(){},t}(),u=function(){function t(t,e){for(var n=[],i=2;i<arguments.length;i++)n[i-2]=arguments[i];this.root_=t,this.initialize.apply(this,function(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(a(arguments[e]));return t}(n)),this.foundation_=void 0===e?this.getDefaultFoundation():e,this.foundation_.init(),this.initialSyncWithDOM()}return t.attachTo=function(e){return new t(e,new s({}))},t.prototype.initialize=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e]},t.prototype.getDefaultFoundation=function(){throw new Error("Subclasses must override getDefaultFoundation to return a properly configured foundation class")},t.prototype.initialSyncWithDOM=function(){},t.prototype.destroy=function(){this.foundation_.destroy()},t.prototype.listen=function(t,e){this.root_.addEventListener(t,e)},t.prototype.unlisten=function(t,e){this.root_.removeEventListener(t,e)},t.prototype.emit=function(t,e,n){var i;void 0===n&&(n=!1),"function"==typeof CustomEvent?i=new CustomEvent(t,{bubbles:n,detail:e}):(i=document.createEvent("CustomEvent")).initCustomEvent(t,n,!1,e),this.root_.dispatchEvent(i)},t}();function c(t,e){if(t.closest)return t.closest(e);for(var n=t;n;){if(d(n,e))return n;n=n.parentElement}return null}function d(t,e){return(t.matches||t.webkitMatchesSelector||t.msMatchesSelector).call(t,e)}function l(t,e){if(void 0===t&&(t=window),void 0===e&&(e=!1),void 0===o||e){var n=!1;try{t.document.addEventListener("test",function(){},{get passive(){return n=!0}})}catch(t){}o=n}return!!o&&{passive:!0}}var p={BG_FOCUSED:"mdc-ripple-upgraded--background-focused",FG_ACTIVATION:"mdc-ripple-upgraded--foreground-activation",FG_DEACTIVATION:"mdc-ripple-upgraded--foreground-deactivation",ROOT:"mdc-ripple-upgraded",UNBOUNDED:"mdc-ripple-upgraded--unbounded"},f={VAR_FG_SCALE:"--mdc-ripple-fg-scale",VAR_FG_SIZE:"--mdc-ripple-fg-size",VAR_FG_TRANSLATE_END:"--mdc-ripple-fg-translate-end",VAR_FG_TRANSLATE_START:"--mdc-ripple-fg-translate-start",VAR_LEFT:"--mdc-ripple-left",VAR_TOP:"--mdc-ripple-top"},_={DEACTIVATION_TIMEOUT_MS:225,FG_DEACTIVATION_MS:150,INITIAL_ORIGIN_SCALE:.6,PADDING:10,TAP_DELAY_MS:300},v=["touchstart","pointerdown","mousedown","keydown"],h=["touchend","pointerup","mouseup","contextmenu"],m=[],y=function(t){function i(e){var a=t.call(this,n({},i.defaultAdapter,e))||this;return a.activationAnimationHasEnded_=!1,a.activationTimer_=0,a.fgDeactivationRemovalTimer_=0,a.fgScale_="0",a.frame_={width:0,height:0},a.initialSize_=0,a.layoutFrame_=0,a.maxRadius_=0,a.unboundedCoords_={left:0,top:0},a.activationState_=a.defaultActivationState_(),a.activationTimerCallback_=function(){a.activationAnimationHasEnded_=!0,a.runDeactivationUXLogicIfReady_()},a.activateHandler_=function(t){return a.activate_(t)},a.deactivateHandler_=function(){return a.deactivate_()},a.focusHandler_=function(){return a.handleFocus()},a.blurHandler_=function(){return a.handleBlur()},a.resizeHandler_=function(){return a.layout()},a}return e(i,t),Object.defineProperty(i,"cssClasses",{get:function(){return p},enumerable:!0,configurable:!0}),Object.defineProperty(i,"strings",{get:function(){return f},enumerable:!0,configurable:!0}),Object.defineProperty(i,"numbers",{get:function(){return _},enumerable:!0,configurable:!0}),Object.defineProperty(i,"defaultAdapter",{get:function(){return{addClass:function(){},browserSupportsCssVars:function(){return!0},computeBoundingRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},containsEventTarget:function(){return!0},deregisterDocumentInteractionHandler:function(){},deregisterInteractionHandler:function(){},deregisterResizeHandler:function(){},getWindowPageOffset:function(){return{x:0,y:0}},isSurfaceActive:function(){return!0},isSurfaceDisabled:function(){return!0},isUnbounded:function(){return!0},registerDocumentInteractionHandler:function(){},registerInteractionHandler:function(){},registerResizeHandler:function(){},removeClass:function(){},updateCssVariable:function(){}}},enumerable:!0,configurable:!0}),i.prototype.init=function(){var t=this,e=this.supportsPressRipple_();if(this.registerRootHandlers_(e),e){var n=i.cssClasses,a=n.ROOT,r=n.UNBOUNDED;requestAnimationFrame(function(){t.adapter_.addClass(a),t.adapter_.isUnbounded()&&(t.adapter_.addClass(r),t.layoutInternal_())})}},i.prototype.destroy=function(){var t=this;if(this.supportsPressRipple_()){this.activationTimer_&&(clearTimeout(this.activationTimer_),this.activationTimer_=0,this.adapter_.removeClass(i.cssClasses.FG_ACTIVATION)),this.fgDeactivationRemovalTimer_&&(clearTimeout(this.fgDeactivationRemovalTimer_),this.fgDeactivationRemovalTimer_=0,this.adapter_.removeClass(i.cssClasses.FG_DEACTIVATION));var e=i.cssClasses,n=e.ROOT,a=e.UNBOUNDED;requestAnimationFrame(function(){t.adapter_.removeClass(n),t.adapter_.removeClass(a),t.removeCssVars_()})}this.deregisterRootHandlers_(),this.deregisterDeactivationHandlers_()},i.prototype.activate=function(t){this.activate_(t)},i.prototype.deactivate=function(){this.deactivate_()},i.prototype.layout=function(){var t=this;this.layoutFrame_&&cancelAnimationFrame(this.layoutFrame_),this.layoutFrame_=requestAnimationFrame(function(){t.layoutInternal_(),t.layoutFrame_=0})},i.prototype.setUnbounded=function(t){var e=i.cssClasses.UNBOUNDED;t?this.adapter_.addClass(e):this.adapter_.removeClass(e)},i.prototype.handleFocus=function(){var t=this;requestAnimationFrame(function(){return t.adapter_.addClass(i.cssClasses.BG_FOCUSED)})},i.prototype.handleBlur=function(){var t=this;requestAnimationFrame(function(){return t.adapter_.removeClass(i.cssClasses.BG_FOCUSED)})},i.prototype.supportsPressRipple_=function(){return this.adapter_.browserSupportsCssVars()},i.prototype.defaultActivationState_=function(){return{activationEvent:void 0,hasDeactivationUXRun:!1,isActivated:!1,isProgrammatic:!1,wasActivatedByPointer:!1,wasElementMadeActive:!1}},i.prototype.registerRootHandlers_=function(t){var e=this;t&&(v.forEach(function(t){e.adapter_.registerInteractionHandler(t,e.activateHandler_)}),this.adapter_.isUnbounded()&&this.adapter_.registerResizeHandler(this.resizeHandler_)),this.adapter_.registerInteractionHandler("focus",this.focusHandler_),this.adapter_.registerInteractionHandler("blur",this.blurHandler_)},i.prototype.registerDeactivationHandlers_=function(t){var e=this;"keydown"===t.type?this.adapter_.registerInteractionHandler("keyup",this.deactivateHandler_):h.forEach(function(t){e.adapter_.registerDocumentInteractionHandler(t,e.deactivateHandler_)})},i.prototype.deregisterRootHandlers_=function(){var t=this;v.forEach(function(e){t.adapter_.deregisterInteractionHandler(e,t.activateHandler_)}),this.adapter_.deregisterInteractionHandler("focus",this.focusHandler_),this.adapter_.deregisterInteractionHandler("blur",this.blurHandler_),this.adapter_.isUnbounded()&&this.adapter_.deregisterResizeHandler(this.resizeHandler_)},i.prototype.deregisterDeactivationHandlers_=function(){var t=this;this.adapter_.deregisterInteractionHandler("keyup",this.deactivateHandler_),h.forEach(function(e){t.adapter_.deregisterDocumentInteractionHandler(e,t.deactivateHandler_)})},i.prototype.removeCssVars_=function(){var t=this,e=i.strings;Object.keys(e).forEach(function(n){0===n.indexOf("VAR_")&&t.adapter_.updateCssVariable(e[n],null)})},i.prototype.activate_=function(t){var e=this;if(!this.adapter_.isSurfaceDisabled()){var n=this.activationState_;if(!n.isActivated){var i=this.previousActivationEvent_;i&&void 0!==t&&i.type!==t.type||(n.isActivated=!0,n.isProgrammatic=void 0===t,n.activationEvent=t,n.wasActivatedByPointer=!n.isProgrammatic&&void 0!==t&&("mousedown"===t.type||"touchstart"===t.type||"pointerdown"===t.type),void 0!==t&&m.length>0&&m.some(function(t){return e.adapter_.containsEventTarget(t)})?this.resetActivationState_():(void 0!==t&&(m.push(t.target),this.registerDeactivationHandlers_(t)),n.wasElementMadeActive=this.checkElementMadeActive_(t),n.wasElementMadeActive&&this.animateActivation_(),requestAnimationFrame(function(){m=[],n.wasElementMadeActive||void 0===t||" "!==t.key&&32!==t.keyCode||(n.wasElementMadeActive=e.checkElementMadeActive_(t),n.wasElementMadeActive&&e.animateActivation_()),n.wasElementMadeActive||(e.activationState_=e.defaultActivationState_())})))}}},i.prototype.checkElementMadeActive_=function(t){return void 0===t||"keydown"!==t.type||this.adapter_.isSurfaceActive()},i.prototype.animateActivation_=function(){var t=this,e=i.strings,n=e.VAR_FG_TRANSLATE_START,a=e.VAR_FG_TRANSLATE_END,r=i.cssClasses,o=r.FG_DEACTIVATION,s=r.FG_ACTIVATION,u=i.numbers.DEACTIVATION_TIMEOUT_MS;this.layoutInternal_();var c="",d="";if(!this.adapter_.isUnbounded()){var l=this.getFgTranslationCoordinates_(),p=l.startPoint,f=l.endPoint;c=p.x+"px, "+p.y+"px",d=f.x+"px, "+f.y+"px"}this.adapter_.updateCssVariable(n,c),this.adapter_.updateCssVariable(a,d),clearTimeout(this.activationTimer_),clearTimeout(this.fgDeactivationRemovalTimer_),this.rmBoundedActivationClasses_(),this.adapter_.removeClass(o),this.adapter_.computeBoundingRect(),this.adapter_.addClass(s),this.activationTimer_=setTimeout(function(){return t.activationTimerCallback_()},u)},i.prototype.getFgTranslationCoordinates_=function(){var t,e=this.activationState_;return{startPoint:t={x:(t=e.wasActivatedByPointer?function(t,e,n){if(!t)return{x:0,y:0};var i,a,r=e.x+n.left,o=e.y+n.top;return"touchstart"===t.type?(i=t.changedTouches[0].pageX-r,a=t.changedTouches[0].pageY-o):(i=t.pageX-r,a=t.pageY-o),{x:i,y:a}}(e.activationEvent,this.adapter_.getWindowPageOffset(),this.adapter_.computeBoundingRect()):{x:this.frame_.width/2,y:this.frame_.height/2}).x-this.initialSize_/2,y:t.y-this.initialSize_/2},endPoint:{x:this.frame_.width/2-this.initialSize_/2,y:this.frame_.height/2-this.initialSize_/2}}},i.prototype.runDeactivationUXLogicIfReady_=function(){var t=this,e=i.cssClasses.FG_DEACTIVATION,n=this.activationState_;(n.hasDeactivationUXRun||!n.isActivated)&&this.activationAnimationHasEnded_&&(this.rmBoundedActivationClasses_(),this.adapter_.addClass(e),this.fgDeactivationRemovalTimer_=setTimeout(function(){t.adapter_.removeClass(e)},_.FG_DEACTIVATION_MS))},i.prototype.rmBoundedActivationClasses_=function(){this.adapter_.removeClass(i.cssClasses.FG_ACTIVATION),this.activationAnimationHasEnded_=!1,this.adapter_.computeBoundingRect()},i.prototype.resetActivationState_=function(){var t=this;this.previousActivationEvent_=this.activationState_.activationEvent,this.activationState_=this.defaultActivationState_(),setTimeout(function(){return t.previousActivationEvent_=void 0},i.numbers.TAP_DELAY_MS)},i.prototype.deactivate_=function(){var t=this,e=this.activationState_;if(e.isActivated){var i=n({},e);e.isProgrammatic?(requestAnimationFrame(function(){return t.animateDeactivation_(i)}),this.resetActivationState_()):(this.deregisterDeactivationHandlers_(),requestAnimationFrame(function(){t.activationState_.hasDeactivationUXRun=!0,t.animateDeactivation_(i),t.resetActivationState_()}))}},i.prototype.animateDeactivation_=function(t){(t.wasActivatedByPointer||t.wasElementMadeActive)&&this.runDeactivationUXLogicIfReady_()},i.prototype.layoutInternal_=function(){this.frame_=this.adapter_.computeBoundingRect();var t=Math.max(this.frame_.height,this.frame_.width);this.maxRadius_=this.adapter_.isUnbounded()?t:Math.sqrt(Math.pow(this.frame_.width,2)+Math.pow(this.frame_.height,2))+i.numbers.PADDING,this.initialSize_=Math.floor(t*i.numbers.INITIAL_ORIGIN_SCALE),this.fgScale_=""+this.maxRadius_/this.initialSize_,this.updateLayoutCssVars_()},i.prototype.updateLayoutCssVars_=function(){var t=i.strings,e=t.VAR_LEFT,n=t.VAR_TOP,a=t.VAR_FG_SCALE;this.adapter_.updateCssVariable(t.VAR_FG_SIZE,this.initialSize_+"px"),this.adapter_.updateCssVariable(a,this.fgScale_),this.adapter_.isUnbounded()&&(this.unboundedCoords_={left:Math.round(this.frame_.width/2-this.initialSize_/2),top:Math.round(this.frame_.height/2-this.initialSize_/2)},this.adapter_.updateCssVariable(e,this.unboundedCoords_.left+"px"),this.adapter_.updateCssVariable(n,this.unboundedCoords_.top+"px"))},i}(s),g=function(t){function n(){var e=null!==t&&t.apply(this,arguments)||this;return e.disabled=!1,e}return e(n,t),n.attachTo=function(t,e){void 0===e&&(e={isUnbounded:void 0});var i=new n(t);return void 0!==e.isUnbounded&&(i.unbounded=e.isUnbounded),i},n.createAdapter=function(t){return{addClass:function(e){return t.root_.classList.add(e)},browserSupportsCssVars:function(){return function(t,e){void 0===e&&(e=!1);var n,i=t.CSS;if("boolean"==typeof r&&!e)return r;if(!i||"function"!=typeof i.supports)return!1;var a=i.supports("--css-vars","yes"),o=i.supports("(--css-vars: yes)")&&i.supports("color","#00000000");return n=!(!a&&!o||function(t){var e=t.document,n=e.createElement("div");n.className="mdc-ripple-surface--test-edge-var-bug",e.body.appendChild(n);var i=t.getComputedStyle(n),a=null!==i&&"solid"===i.borderTopStyle;return n.remove(),a}(t)),e||(r=n),n}(window)},computeBoundingRect:function(){return t.root_.getBoundingClientRect()},containsEventTarget:function(e){return t.root_.contains(e)},deregisterDocumentInteractionHandler:function(t,e){return document.documentElement.removeEventListener(t,e,l())},deregisterInteractionHandler:function(e,n){return t.root_.removeEventListener(e,n,l())},deregisterResizeHandler:function(t){return window.removeEventListener("resize",t)},getWindowPageOffset:function(){return{x:window.pageXOffset,y:window.pageYOffset}},isSurfaceActive:function(){return d(t.root_,":active")},isSurfaceDisabled:function(){return Boolean(t.disabled)},isUnbounded:function(){return Boolean(t.unbounded)},registerDocumentInteractionHandler:function(t,e){return document.documentElement.addEventListener(t,e,l())},registerInteractionHandler:function(e,n){return t.root_.addEventListener(e,n,l())},registerResizeHandler:function(t){return window.addEventListener("resize",t)},removeClass:function(e){return t.root_.classList.remove(e)},updateCssVariable:function(e,n){return t.root_.style.setProperty(e,n)}}},Object.defineProperty(n.prototype,"unbounded",{get:function(){return Boolean(this.unbounded_)},set:function(t){this.unbounded_=Boolean(t),this.setUnbounded_()},enumerable:!0,configurable:!0}),n.prototype.activate=function(){this.foundation_.activate()},n.prototype.deactivate=function(){this.foundation_.deactivate()},n.prototype.layout=function(){this.foundation_.layout()},n.prototype.getDefaultFoundation=function(){return new y(n.createAdapter(this))},n.prototype.initialSyncWithDOM=function(){this.unbounded="mdcRippleIsUnbounded"in this.root_.dataset},n.prototype.setUnbounded_=function(){this.foundation_.setUnbounded(Boolean(this.unbounded_))},n}(u);export{e as a,n as b,s as c,u as d,c as e,d as f,i as g,g as h,y as i};