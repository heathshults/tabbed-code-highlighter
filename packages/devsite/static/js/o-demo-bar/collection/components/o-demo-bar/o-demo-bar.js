const win = window;
export class DemoBarComponent {
    constructor() {
        this.codeEditor = '';
        this.events = '';
        this.caseOptionSelected = 0;
        this.pattern = true;
        this.device = 'desktop';
        this.deviceSize = '1024';
        this.deviceEmulate = false;
    }
    componentWillLoad() {
        document.body.style.margin = '0';
        this.demoCases = this.el.querySelectorAll('o-demo-case');
        this.casesOptions = this._setSelect();
    }
    componentDidLoad() {
        this.resizeComponent = this.el.shadowRoot.querySelector('o-demo-resizer');
        this._setIframe();
        this.setViewPort();
        this.stencilDevServer();
    }
    componentDidUpdate() {
        this._setIframe();
        this.setViewPort();
    }
    setViewPort() {
        win.requestAnimationFrame(() => this.resizeComponent.setActiveViewPort(this.deviceSize));
    }
    stencilDevServer() {
        if ("WebSocket" in win && win['s-dev-server']) {
            const ws = new WebSocket(`ws://localhost:${win.location.port}/`);
            ws.onopen = () => {
                console.log('reload-content-stencil-server-activated');
                this._setIframe();
                setTimeout(() => {
                    this.el.forceUpdate();
                }, 20);
            };
        }
        ;
    }
    codeEditorChangedHandler(event) {
        console.log('code', event.detail);
        this._setIframe(event.detail);
    }
    selectedCaseChangedHandler(event) {
        this.caseOptionSelected = event.detail;
    }
    toolbarButtonClickedHandler(event) {
        switch (event.detail) {
            case 'code-editor':
                this.el.shadowRoot.querySelector('#modal-id').openDialog();
                document.addEventListener('on-editor-content', () => { console.log(this.codeEditor); });
                break;
            case 'mobile':
                this.device = event.detail;
                this.deviceSize = '412';
                this.deviceEmulate = false;
                break;
            case 'desktop':
                this.device = event.detail;
                this.deviceSize = '1024';
                this.deviceEmulate = false;
                break;
            case 'other-devices':
                this.device = event.detail;
                this.deviceSize = '458';
                this.deviceEmulate = true;
                break;
        }
        this._setIframe();
        if (event.detail !== 'other-devices') {
            setTimeout(() => {
                this.el.forceUpdate();
                this.setViewPort();
            }, 20);
        }
    }
    resizeButtonClickedHandler(event) {
        this.el.shadowRoot.querySelector('iframe').width = event.detail;
        this.deviceSize = event.detail;
    }
    _setSelect() {
        return Array.from(this.demoCases).map(function (item) {
            return item.getAttribute('name');
        });
    }
    _cleanIframe() {
        const oldFrame = this.el.shadowRoot.querySelector('iframe');
        if (oldFrame) {
            oldFrame.remove();
        }
    }
    _setIframe(code) {
        win.requestAnimationFrame(() => {
            this._cleanIframe();
            const iframeContainer = this.el.shadowRoot.querySelector('#iframeContainer');
            const iframe = document.createElement('iframe');
            const frameH = Math.max(document.documentElement.clientHeight);
            const frameW = this.deviceSize;
            const htmlContent = code ? code : this.demoCases[this.caseOptionSelected].querySelector('template').innerHTML;
            const html = code ? code : `<html><head></head><style>body{margin:0}</style><body unresolved ontouchstart id="frameBody">${htmlContent}</body></html>`;
            iframe.height = `${frameH.toString()}px`;
            iframe.width = `${frameW.toString()}px`;
            iframe.style.border = 'none';
            iframeContainer.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
            this.codeEditor = html;
        });
    }
    render() {
        const bgClasses = { pattern: this.pattern && !this.deviceEmulate };
        const deviceClasses = { hide: this.deviceEmulate };
        const defaultView = [h("div", { id: "iframeContainer", class: "defaultView" })];
        const mobileView = [h("o-demo-fab", null), h("o-demo-devices", null,
                h("div", { id: "iframeContainer", class: "pattern", slot: "screen" }))];
        return (h("div", { id: "demo-bar" },
            this.events.length !== 0 ? h("o-demo-snackbar", { events: this.events }) : null,
            h("o-demo-bar-toolbar", { name: this.name },
                h("o-demo-bar-select", { slot: "center", options: this.casesOptions }),
                h("o-demo-bar-buttons", { slot: "right" }),
                h("o-demo-resizer", { class: deviceClasses, size: this.deviceSize, viewport: this.device, slot: "base" })),
            h("div", { id: "frame-wrap", class: bgClasses }, this.deviceEmulate ? mobileView : defaultView)));
    }
    static get is() { return "o-demo-bar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "backgroundColor": {
            "type": String,
            "attr": "background-color"
        },
        "caseOptionSelected": {
            "type": Number,
            "attr": "case-option-selected",
            "mutable": true
        },
        "device": {
            "type": String,
            "attr": "device",
            "mutable": true
        },
        "deviceEmulate": {
            "type": Boolean,
            "attr": "device-emulate",
            "mutable": true
        },
        "deviceSize": {
            "type": String,
            "attr": "device-size",
            "mutable": true
        },
        "el": {
            "elementRef": true
        },
        "events": {
            "type": String,
            "attr": "events"
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "pattern": {
            "type": Boolean,
            "attr": "pattern",
            "mutable": true
        }
    }; }
    static get listeners() { return [{
            "name": "code-editor-changed",
            "method": "codeEditorChangedHandler"
        }, {
            "name": "selectedCaseChanged",
            "method": "selectedCaseChangedHandler"
        }, {
            "name": "toolbarButtonClicked",
            "method": "toolbarButtonClickedHandler"
        }, {
            "name": "resizeButtonClicked",
            "method": "resizeButtonClickedHandler"
        }]; }
    static get style() { return "/**style-placeholder:o-demo-bar:**/"; }
}
