export class FkTab {
    render() {
        const typeClass = this.type ? `c-tabs__tab--${this.type}` : '';
        return (h("div", { role: "tabpanel", hidden: !this.open, class: `c-tabs__tab c-tabs__expander ${typeClass}` },
            h("slot", null)));
    }
    static get is() { return "fk-tab"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "header": {
            "type": String,
            "attr": "header"
        },
        "open": {
            "type": Boolean,
            "attr": "open"
        },
        "type": {
            "type": String,
            "attr": "type"
        }
    }; }
    static get style() { return "/**style-placeholder:fk-tab:**/"; }
}
