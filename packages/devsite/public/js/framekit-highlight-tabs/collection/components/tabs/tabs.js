export class FkTabs {
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
                if (this.showMore = 'true' && tab.open) {
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
    static get style() { return "/**style-placeholder:fk-tabs:**/"; }
}
