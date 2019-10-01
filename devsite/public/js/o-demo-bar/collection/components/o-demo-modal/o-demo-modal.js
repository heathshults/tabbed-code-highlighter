import { MDCDialog } from '@material/dialog/index';
export class DemoModalComponent {
    constructor() {
        this.open = false;
        this.code = '';
    }
    debounce(delay, fn) {
        let timerId;
        return function (...args) {
            if (timerId) {
                clearTimeout(timerId);
            }
            timerId = setTimeout(() => {
                fn(...args);
                timerId = null;
            }, delay);
        };
    }
    contentChanged(arg) {
        console.log('debounceing');
        this.codeEditorChanged.emit(arg.code);
    }
    openDialog() {
        if (!this.open) {
            this.modalEl.open();
            this.open = true;
        }
    }
    closeDialog() {
        if (this.open) {
            this.modalEl.close();
            this.open = false;
        }
    }
    componentDidLoad() {
        const rootEl = this.el.shadowRoot.querySelector('.mdc-dialog');
        this.modalEl = new MDCDialog(rootEl);
        this.modalEl.listen('MDCDialog:opened', () => {
            this.open = true;
        });
        this.modalEl.listen('MDCDialog:closing', () => {
            this.open = false;
        });
    }
    componentDidUnload() {
        this.modalEl.destroy();
    }
    render() {
        return (h("div", { class: "mdc-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "my-dialog-title", "aria-describedby": "my-dialog-content" },
            h("div", { class: "mdc-dialog__container" },
                h("div", { class: "mdc-dialog__surface" },
                    h("h2", { class: "mdc-dialog__title", id: "my-dialog-title" }, "Code Editor"),
                    h("div", { class: "mdc-dialog__content", id: "my-dialog-content" },
                        "Hola ",
                        h("div", { id: "id-modal" })),
                    h("footer", { class: "mdc-dialog__actions" },
                        h("button", { type: "button", class: "mdc-button mdc-dialog__button", "data-mdc-dialog-action": "close" }, "close")))),
            h("div", { class: "mdc-dialog__scrim" })));
    }
    static get is() { return "o-demo-modal"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "closeDialog": {
            "method": true
        },
        "code": {
            "type": "Any",
            "attr": "code"
        },
        "el": {
            "elementRef": true
        },
        "open": {
            "type": Boolean,
            "attr": "open",
            "reflectToAttr": true,
            "mutable": true
        },
        "openDialog": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "code-editor-changed",
            "method": "codeEditorChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:o-demo-modal:**/"; }
}
