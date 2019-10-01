import { h } from '../framekit-highlight-code.core.js';

class FkTabs {
    constructor() {
        this.width = '100%';
        this.height = '400';
        this.value = '';
    }
    hostData() {
        this.tabContainerHeight = this.elem.style.setProperty('height', this.height);
        return this.tabContainerHeight;
    }
    ;
    async getNewHeight() {
        return this.height;
    }
    componentWillLoad() {
        this.tabs = Array.from(this.elem.querySelectorAll('fk-tab'));
    }
    valueChanged() {
        let newHeightValue = this.getNewHeight();
        this.elem.style.setProperty('height', newHeightValue.toString());
        let thoseTabs = this.elem.shadowRoot.querySelectorAll('div.fk-tab');
        for (var i = 0; thoseTabs[i]; i++) {
            let nodes = thoseTabs[i];
            this.convToHTMLElement = nodes.style.setProperty('height', newHeightValue.toString());
        }
    }
    async currentTab() {
        return this.tabs.findIndex((tab) => tab.open);
    }
    openTab(tabIndex) {
        if (!this.tabs[tabIndex].disabled) {
            this.tabs = this.tabs.map((tab) => {
                tab.open = false;
                return tab;
            });
            this.tabs[tabIndex].open = true;
            this.onChange.emit({ idx: tabIndex });
        }
    }
    expand(tabIndex) {
        if (!this.tabs[tabIndex].disabled) {
            let openTabPanel = this.tabs[tabIndex];
            openTabPanel.classList.toggle('c-tabs__expander');
            let divTabPanel = openTabPanel.shadowRoot.querySelector('div[role="tabpanel"]');
            divTabPanel.classList.toggle('c-tabs__expander');
            return;
        }
    }
    ;
    removeFocus(tabIndex) {
        if (!this.tabs[tabIndex].disabled) {
            this.tabs = this.tabs.map((tab) => {
                tab.blur();
                return tab;
            });
        }
    }
    render() {
        return (h("div", { id: "theTabContainer", class: "c-tabs" },
            h("div", { role: "tablist", class: "c-tabs" },
                h("div", { class: "c-tabs__nav" },
                    h("div", { class: "c-tabs__headings" }, this.tabs.map((tab, i) => {
                        const openClass = tab.open ? 'c-tab-heading--active' : '';
                        const typeClass = tab.type ? `c-tab-heading--${tab.type}` : '';
                        return (h("button", { role: "tab", disabled: tab.disabled, class: `c-tab-heading ${typeClass} ${openClass}`, onClick: () => this.openTab(i), onMouseOut: () => this.removeFocus(i) }, tab.header));
                    }))),
                h("slot", null)),
            h("div", { class: "c-button-container" }, this.tabs.map((tab, i) => {
                if (this.showMore = tab.open) {
                    return (h("button", { disabled: tab.disabled, class: `c-button c-button--showMore c-tabs--is-hidden`, onClick: () => this.expand(i), onMouseOut: () => this.removeFocus(i) }, "Show More"));
                }
            }))));
    }
    static get is() { return "fk-tabs"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "convToHTMLElement": {
            "type": "Any",
            "attr": "conv-to-h-t-m-l-element"
        },
        "cssClass": {
            "type": String,
            "attr": "css-class"
        },
        "currentTab": {
            "method": true
        },
        "elem": {
            "elementRef": true
        },
        "expand": {
            "method": true
        },
        "getNewHeight": {
            "method": true
        },
        "height": {
            "type": String,
            "attr": "height",
            "reflectToAttr": true,
            "mutable": true
        },
        "openTab": {
            "method": true
        },
        "removeFocus": {
            "method": true
        },
        "showMore": {
            "type": String,
            "attr": "show-more",
            "reflectToAttr": true,
            "mutable": true
        },
        "tabContainerHeight": {
            "type": "Any",
            "attr": "tab-container-height",
            "mutable": true
        },
        "tabs": {
            "state": true
        },
        "value": {
            "type": String,
            "attr": "value",
            "mutable": true,
            "watchCallbacks": ["valueChanged"]
        },
        "width": {
            "type": String,
            "attr": "width",
            "reflectToAttr": true,
            "mutable": true
        }
    }; }
    static get events() { return [{
            "name": "change",
            "method": "onChange",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "\@font-face{font-family:Source Code Pro;font-style:normal;font-weight:400;src:local(\"Source Code Pro\"),local(\"SourceCodePro-Regular\"),url(Source-Code-Pro.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}\@font-face{font-family:Source Code Pro;font-style:normal;font-weight:700;src:local(\"Source Code Pro Bold\"),local(\"SourceCodePro-Bold\"),url(Source-Code-Pro-bold.woff2) format(\"woff2\");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}.sc-fk-tabs:root{--bp-color-core-blue-60:#0c77ba;--bp-color-core-blue-70:#0a649d;--bp-color-core-blue-90:#064063;--bp-color-core-neutral-13:#f2f2f2;--bp-color-core-neutral-17:#ededed;--bp-color-core-neutral-20:#dedede;--bp-color-core-neutral-60:#7a7a7a;--bp-color-core-neutral-90:#2e2e2e;--bp-color-core-muted-yellow-90:#fdbc2c;--bp-color-background-light-layer0-base:#f8f8f8;--bp-color-border-lightest:#dedede;--bp-color-brand-orange-base:#c55422;--bp-color-brand-yellow-darker:#e0ac00;--bp-color-brand-green-base:#2c6937;--bp-color-brand-green-darker:#074512;--bp-color-core-red-50:#bd2b2b;--bp-color-core-red-40:#cc3535;--fk-color-background-code:transparent;--fk-highlight-code-font-family:\"Source Code Pro\",sans-serif,monospace;--fk-highlight-code-font-size:1.01rem;--fk-highlight-code-line-height:1.75rem;--fk-c-button--showMore-padding:0}.c-tabs--is-hidden.sc-fk-tabs{visibility:hidden}.hydratedWidth.sc-fk-tabs{width:100%}.c-tabs-container.sc-fk-tabs{position:absolute;display:-ms-flexbox;display:flex;width:100%}.c-tabs.sc-fk-tabs{position:relative;top:0;right:0;left:0;-ms-flex:auto;flex:auto;width:100%}.c-tabs[role=tablist].sc-fk-tabs{-webkit-box-sizing:border-box;box-sizing:border-box;display:block;width:100%;overflow:hidden;line-height:normal}.c-tabs[role=tablist].sc-fk-tabs:before{display:block;content:\"\"}.c-tabs__headings.sc-fk-tabs{display:-ms-inline-flexbox;display:inline-flex;font-family:sans-serif;text-align:center}.c-tabs__nav.sc-fk-tabs{width:100%;padding-top:20px;padding-left:20px;margin:-10px -20px 0 -20px;overflow:hidden;background:var(--bp-color-background-light-layer0-base,#f8f8f8)}.c-tabs__nav.sc-fk-tabs   .c-tabs__headings.sc-fk-tabs{padding-bottom:1em;margin-bottom:-1em;overflow-x:auto;overflow-y:hidden}.c-tabs__nav.sc-fk-tabs   .c-tabs__headings.sc-fk-tabs:first-child{margin-left:10px}.c-tab-heading[role=tab].sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:var(--bp-color-background-light-layer0-base,#f8f8f8);border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{background:var(--bp-color-core-neutral-17,#ededed);border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{cursor:pointer;background-color:var(--bp-color-core-neutral-20,#dedede)}.c-tab-heading[role=tab].sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{background-color:var(--bp-color-core-neutral-20,#dedede);border-bottom-color:var(--bp-color-core-neutral-60,#7a7a7a)}.c-tab-heading[role=tab][disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-core-neutral-60,#7a7a7a)}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-neutral-17,#ededed);box-shadow:inset 0 0 0 2px var(--bp-color-core-neutral-17,#ededed)}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--brand.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-core-neutral-90,#2e2e2e)}.c-tab-heading[role=tab].c-tab-heading--brand[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--brand.c-tab-heading--active.sc-fk-tabs{border-bottom-color:#2c3e50}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--info.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--info[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--info.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a)}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{background:var(--bp-color-core-neutral-20,#dedede);border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--warning.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{background:var(--bp-color-core-neutral-20,#dedede);border-bottom-color:var(--bp-color-brand-yellow-darker,#e0ac00)}.c-tab-heading[role=tab].c-tab-heading--warning[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--warning.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-brand-yellow-darker,#e0ac00)}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--success.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-brand-green-base,#2c6937)}.c-tab-heading[role=tab].c-tab-heading--success[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--success.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-brand-green-darker,#074512)}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs{display:block;-ms-flex:1;flex:1;width:auto;padding:1em;margin:0;overflow:visible;font:inherit;line-height:normal;color:inherit;text-align:inherit;text-decoration:inherit;white-space:nowrap;vertical-align:inherit;background:inherit;border:0;border-bottom:.25em solid transparent;border-radius:0;outline:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:disabled{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not([disabled]):active{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):focus{border-top-color:var(--bp-color-core-neutral-17,#ededed);border-right-color:var(--bp-color-core-neutral-17,#ededed);border-bottom-color:var(--bp-color-core-blue-60,#7a7a7a);border-left-color:var(--bp-color-core-neutral-17,#ededed);-webkit-box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d);box-shadow:inset 0 0 0 2px var(--bp-color-core-blue-70,#0a649d)}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not([disabled]):not(:active):hover{background-color:transparent}.c-tab-heading[role=tab].c-tab-heading--error.sc-fk-tabs:not(:disabled):not(.c-tab-heading--active):hover{border-bottom-color:var(--bp-color-core-red-50,#bd2b2b)}.c-tab-heading[role=tab].c-tab-heading--error[disabled].sc-fk-tabs{cursor:not-allowed;opacity:.5}.c-tab-heading[role=tab].c-tab-heading--error.c-tab-heading--active.sc-fk-tabs{border-bottom-color:var(--bp-color-core-red-40,#cc3535)}.c-tabs__tab[role=tabpanel].sc-fk-tabs{position:relative;width:100%;overflow-x:auto;border-top:solid 10px var(--bp-color-core-neutral-20,#dedede)}.c-tabs__tab[role=tabpanel].sc-fk-tabs::-webkit-scrollbar{display:none}.c-button-container.sc-fk-tabs{position:relative;text-align:center;background:#dedede}.c-button--showMore.sc-fk-tabs{position:absolute;left:50%;z-index:501;display:inline-block;padding:var(--fk-c-button--showMore-padding,2px 10px 4px 10px);margin:auto;font-size:10px!important;color:var(--bp-color-core-neutral-20,#dedede);background:var(--fk-color-background-code,#282c34);border-top:2px solid var(--fk-color-background-code,#282c34);-webkit-transform:translate(-50%);transform:translate(-50%)}.c-button--showMore.sc-fk-tabs:before{position:absolute;bottom:-8px;left:50%;z-index:500;width:0;height:0;content:\"\";border-color:#282c34 transparent transparent transparent;border-style:solid;border-width:6px 6px 0 6px;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.c-button--showMore.sc-fk-tabs:hover{cursor:pointer;background:var(--bp-color-core-blue-90,#064063);border-top:2px solid var(--bp-color-core-blue-90,#064063)}.c-button--showMore.sc-fk-tabs:hover:before{cursor:pointer;border-color:var(--bp-color-core-blue-90,#064063) transparent transparent transparent}.c-button--showMore.sc-fk-tabs:focus{outline-color:var(--bp-color-core-blue-60,#7a7a7a)}"; }
}

export { FkTabs };
