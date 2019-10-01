import { h } from '../orango-demo-tools.core.js';

import { a as __extends, b as __assign, c as MDCFoundation, d as MDCComponent, e as closest, f as matches, g as __values, h as MDCRipple, i as MDCRippleFoundation } from './chunk-1e906afd.js';

const win = window;
class DemoBarComponent {
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
    static get style() { return ":host #iframe-wrap{-ms-flex:1;flex:1;display:-ms-flexbox;display:flex;position:relative;vertical-align:middle;z-index:0}:host .hide{display:none}:host o-demo-bar{z-index:999}:host o-demo-devices{margin-top:auto}:host #iframeContainer,:host o-demo-devices{position:relative;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}:host #iframeContainer{margin:auto}:host #iframeContainer iframe{margin:0;border:0;position:relative;background-color:transparent;z-index:1}:host #iframeContainer.defaultView iframe{height:100vh}:host .oo-bgcolor{background-color:rgba(0,0,0,.04)}:host .oo-pattern{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;width:100%;height:100%;border:none;font:normal 100%/normal Arial,Helvetica,sans-serif;color:#fff;-o-text-overflow:clip;text-overflow:clip;background:-webkit-linear-gradient(45deg,rgba(0,0,0,.0980392) 25%,transparent 0,transparent 75%,rgba(0,0,0,.0980392) 0,rgba(0,0,0,.0980392) 0),-webkit-linear-gradient(45deg,rgba(0,0,0,.0980392) 25%,transparent 0,transparent 75%,rgba(0,0,0,.0980392) 0,rgba(0,0,0,.0980392) 0),#fff;background:-moz-linear-gradient(45deg,rgba(0,0,0,.0980392) 25%,transparent 25%,transparent 75%,rgba(0,0,0,.0980392) 75%,rgba(0,0,0,.0980392) 0),-moz-linear-gradient(45deg,rgba(0,0,0,.0980392) 25%,transparent 25%,transparent 75%,rgba(0,0,0,.0980392) 75%,rgba(0,0,0,.0980392) 0),#fff;background:linear-gradient(45deg,rgba(0,0,0,.0980392) 25%,transparent 0,transparent 75%,rgba(0,0,0,.0980392) 0,rgba(0,0,0,.0980392) 0),linear-gradient(45deg,rgba(0,0,0,.0980392) 25%,transparent 0,transparent 75%,rgba(0,0,0,.0980392) 0,rgba(0,0,0,.0980392) 0),#fff;background-position:0 0,8px 8px;-webkit-background-origin:padding-box;background-origin:padding-box;-webkit-background-clip:border-box;background-clip:border-box;-webkit-background-size:16px 16px;background-size:16px 16px}"; }
}

class DemoButtonsComponent {
    handleClick(event) {
        let evt = event.currentTarget.getAttribute('data-btn');
        this.toolbarButtonClicked.emit(evt);
    }
    render() {
        return (h("div", { class: "toolbar-icons" },
            h("button", { "data-btn": "other-devices", onClick: (event) => this.handleClick(event), class: "toolbar-button" },
                h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                    h("path", { d: "M0 0h24v24H0z", fill: "none" }),
                    h("path", { d: "M3 6h18V4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v-2H3V6zm10 6H9v1.78c-.61.55-1 1.33-1 2.22s.39 1.67 1 2.22V20h4v-1.78c.61-.55 1-1.34 1-2.22s-.39-1.67-1-2.22V12zm-2 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM22 8h-6c-.5 0-1 .5-1 1v10c0 .5.5 1 1 1h6c.5 0 1-.5 1-1V9c0-.5-.5-1-1-1zm-1 10h-4v-8h4v8z" }))),
            h("button", { "data-btn": "mobile", onClick: (event) => this.handleClick(event), class: "toolbar-button" },
                h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                    h("path", { d: "M0 0h24v24H0z", fill: "none" }),
                    h("path", { d: "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" }))),
            h("button", { "data-btn": "desktop", onClick: (event) => this.handleClick(event), class: "toolbar-button" },
                h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                    h("path", { d: "M0 0h24v24H0z", fill: "none" }),
                    h("path", { d: "M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z" })))));
    }
    static get is() { return "o-demo-bar-buttons"; }
    static get encapsulation() { return "shadow"; }
    static get events() { return [{
            "name": "toolbarButtonClicked",
            "method": "toolbarButtonClicked",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "\@-moz-document url-prefix(){:host .oo-toolbar-icons{margin-top:1em}}:host .oo-toolbar-button:focus{outline:none}:host .oo-toolbar-button{-webkit-transition:all .2s ease;transition:all .2s ease;cursor:pointer;outline:none;background:none;border:none}:host .oo-toolbar-button svg{fill:var(--o-demo-bar-buttons-color,#494949)}:host .oo-toolbar-button.active svg{fill:var(--o-demo-bar-buttons-color,#8e8e8e)}"; }
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses = {
    LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',
    LABEL_SHAKE: 'mdc-floating-label--shake',
    ROOT: 'mdc-floating-label',
};

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFloatingLabelFoundation = /** @class */ (function (_super) {
    __extends(MDCFloatingLabelFoundation, _super);
    function MDCFloatingLabelFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCFloatingLabelFoundation.defaultAdapter, adapter)) || this;
        _this.shakeAnimationEndHandler_ = function () { return _this.handleShakeAnimationEnd_(); };
        return _this;
    }
    Object.defineProperty(MDCFloatingLabelFoundation, "cssClasses", {
        get: function () {
            return cssClasses;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCFloatingLabelFoundation, "defaultAdapter", {
        /**
         * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                getWidth: function () { return 0; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCFloatingLabelFoundation.prototype.init = function () {
        this.adapter_.registerInteractionHandler('animationend', this.shakeAnimationEndHandler_);
    };
    MDCFloatingLabelFoundation.prototype.destroy = function () {
        this.adapter_.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler_);
    };
    /**
     * Returns the width of the label element.
     */
    MDCFloatingLabelFoundation.prototype.getWidth = function () {
        return this.adapter_.getWidth();
    };
    /**
     * Styles the label to produce a shake animation to indicate an error.
     * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.
     */
    MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        if (shouldShake) {
            this.adapter_.addClass(LABEL_SHAKE);
        }
        else {
            this.adapter_.removeClass(LABEL_SHAKE);
        }
    };
    /**
     * Styles the label to float or dock.
     * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.
     */
    MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {
        var _a = MDCFloatingLabelFoundation.cssClasses, LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE, LABEL_SHAKE = _a.LABEL_SHAKE;
        if (shouldFloat) {
            this.adapter_.addClass(LABEL_FLOAT_ABOVE);
        }
        else {
            this.adapter_.removeClass(LABEL_FLOAT_ABOVE);
            this.adapter_.removeClass(LABEL_SHAKE);
        }
    };
    MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd_ = function () {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        this.adapter_.removeClass(LABEL_SHAKE);
    };
    return MDCFloatingLabelFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFloatingLabel = /** @class */ (function (_super) {
    __extends(MDCFloatingLabel, _super);
    function MDCFloatingLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCFloatingLabel.attachTo = function (root) {
        return new MDCFloatingLabel(root);
    };
    /**
     * Styles the label to produce the label shake for errors.
     * @param shouldShake If true, shakes the label by adding a CSS class; otherwise, stops shaking by removing the class.
     */
    MDCFloatingLabel.prototype.shake = function (shouldShake) {
        this.foundation_.shake(shouldShake);
    };
    /**
     * Styles the label to float/dock.
     * @param shouldFloat If true, floats the label by adding a CSS class; otherwise, docks it by removing the class.
     */
    MDCFloatingLabel.prototype.float = function (shouldFloat) {
        this.foundation_.float(shouldFloat);
    };
    MDCFloatingLabel.prototype.getWidth = function () {
        return this.foundation_.getWidth();
    };
    MDCFloatingLabel.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            getWidth: function () { return _this.root_.scrollWidth; },
            registerInteractionHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterInteractionHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCFloatingLabelFoundation(adapter);
    };
    return MDCFloatingLabel;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$1 = {
    LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',
    LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCLineRippleFoundation = /** @class */ (function (_super) {
    __extends(MDCLineRippleFoundation, _super);
    function MDCLineRippleFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCLineRippleFoundation.defaultAdapter, adapter)) || this;
        _this.transitionEndHandler_ = function (evt) { return _this.handleTransitionEnd(evt); };
        return _this;
    }
    Object.defineProperty(MDCLineRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCLineRippleFoundation, "defaultAdapter", {
        /**
         * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                setStyle: function () { return undefined; },
                registerEventHandler: function () { return undefined; },
                deregisterEventHandler: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCLineRippleFoundation.prototype.init = function () {
        this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);
    };
    MDCLineRippleFoundation.prototype.destroy = function () {
        this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);
    };
    MDCLineRippleFoundation.prototype.activate = function () {
        this.adapter_.removeClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
        this.adapter_.addClass(cssClasses$1.LINE_RIPPLE_ACTIVE);
    };
    MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {
        this.adapter_.setStyle('transform-origin', xCoordinate + "px center");
    };
    MDCLineRippleFoundation.prototype.deactivate = function () {
        this.adapter_.addClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
    };
    MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {
        // Wait for the line ripple to be either transparent or opaque
        // before emitting the animation end event
        var isDeactivating = this.adapter_.hasClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
        if (evt.propertyName === 'opacity') {
            if (isDeactivating) {
                this.adapter_.removeClass(cssClasses$1.LINE_RIPPLE_ACTIVE);
                this.adapter_.removeClass(cssClasses$1.LINE_RIPPLE_DEACTIVATING);
            }
        }
    };
    return MDCLineRippleFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCLineRipple = /** @class */ (function (_super) {
    __extends(MDCLineRipple, _super);
    function MDCLineRipple() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCLineRipple.attachTo = function (root) {
        return new MDCLineRipple(root);
    };
    /**
     * Activates the line ripple
     */
    MDCLineRipple.prototype.activate = function () {
        this.foundation_.activate();
    };
    /**
     * Deactivates the line ripple
     */
    MDCLineRipple.prototype.deactivate = function () {
        this.foundation_.deactivate();
    };
    /**
     * Sets the transform origin given a user's click location.
     * The `rippleCenter` is the x-coordinate of the middle of the ripple.
     */
    MDCLineRipple.prototype.setRippleCenter = function (xCoordinate) {
        this.foundation_.setRippleCenter(xCoordinate);
    };
    MDCLineRipple.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setStyle: function (propertyName, value) { return _this.root_.style.setProperty(propertyName, value); },
            registerEventHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterEventHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCLineRippleFoundation(adapter);
    };
    return MDCLineRipple;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$2 = {
    ANCHOR: 'mdc-menu-surface--anchor',
    ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
    ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
    FIXED: 'mdc-menu-surface--fixed',
    OPEN: 'mdc-menu-surface--open',
    ROOT: 'mdc-menu-surface',
};
// tslint:disable:object-literal-sort-keys
var strings = {
    CLOSED_EVENT: 'MDCMenuSurface:closed',
    OPENED_EVENT: 'MDCMenuSurface:opened',
    FOCUSABLE_ELEMENTS: [
        'button:not(:disabled)', '[href]:not([aria-disabled="true"])', 'input:not(:disabled)',
        'select:not(:disabled)', 'textarea:not(:disabled)', '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
    ].join(', '),
};
// tslint:enable:object-literal-sort-keys
var numbers = {
    /** Total duration of menu-surface open animation. */
    TRANSITION_OPEN_DURATION: 120,
    /** Total duration of menu-surface close animation. */
    TRANSITION_CLOSE_DURATION: 75,
    /** Margin left to the edge of the viewport when menu-surface is at maximum possible height. */
    MARGIN_TO_EDGE: 32,
    /** Ratio of anchor width to menu-surface width for switching from corner positioning to center positioning. */
    ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,
};
/**
 * Enum for bits in the {@see Corner) bitmap.
 */
var CornerBit;
(function (CornerBit) {
    CornerBit[CornerBit["BOTTOM"] = 1] = "BOTTOM";
    CornerBit[CornerBit["CENTER"] = 2] = "CENTER";
    CornerBit[CornerBit["RIGHT"] = 4] = "RIGHT";
    CornerBit[CornerBit["FLIP_RTL"] = 8] = "FLIP_RTL";
})(CornerBit || (CornerBit = {}));
/**
 * Enum for representing an element corner for positioning the menu-surface.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 */
var Corner;
(function (Corner) {
    Corner[Corner["TOP_LEFT"] = 0] = "TOP_LEFT";
    Corner[Corner["TOP_RIGHT"] = 4] = "TOP_RIGHT";
    Corner[Corner["BOTTOM_LEFT"] = 1] = "BOTTOM_LEFT";
    Corner[Corner["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
    Corner[Corner["TOP_START"] = 8] = "TOP_START";
    Corner[Corner["TOP_END"] = 12] = "TOP_END";
    Corner[Corner["BOTTOM_START"] = 9] = "BOTTOM_START";
    Corner[Corner["BOTTOM_END"] = 13] = "BOTTOM_END";
})(Corner || (Corner = {}));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$3 = {
    MENU_SELECTED_LIST_ITEM: 'mdc-menu-item--selected',
    MENU_SELECTION_GROUP: 'mdc-menu__selection-group',
    ROOT: 'mdc-menu',
};
var strings$1 = {
    ARIA_SELECTED_ATTR: 'aria-selected',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    LIST_SELECTOR: '.mdc-list',
    SELECTED_EVENT: 'MDCMenu:selected',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$4 = {
    LIST_ITEM_ACTIVATED_CLASS: 'mdc-list-item--activated',
    LIST_ITEM_CLASS: 'mdc-list-item',
    LIST_ITEM_SELECTED_CLASS: 'mdc-list-item--selected',
    ROOT: 'mdc-list',
};
var strings$2 = {
    ACTION_EVENT: 'MDCList:action',
    ARIA_CHECKED: 'aria-checked',
    ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
    ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
    ARIA_CURRENT: 'aria-current',
    ARIA_ORIENTATION: 'aria-orientation',
    ARIA_ORIENTATION_HORIZONTAL: 'horizontal',
    ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
    ARIA_SELECTED: 'aria-selected',
    CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"]:not(:disabled), input[type="radio"]:not(:disabled)',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]:not(:disabled)',
    CHILD_ELEMENTS_TO_TOGGLE_TABINDEX: "\n    ." + cssClasses$4.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses$4.LIST_ITEM_CLASS + " a\n  ",
    ENABLED_ITEMS_SELECTOR: '.mdc-list-item:not(.mdc-list-item--disabled)',
    FOCUSABLE_CHILD_ELEMENTS: "\n    ." + cssClasses$4.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses$4.LIST_ITEM_CLASS + " a,\n    ." + cssClasses$4.LIST_ITEM_CLASS + " input[type=\"radio\"]:not(:disabled),\n    ." + cssClasses$4.LIST_ITEM_CLASS + " input[type=\"checkbox\"]:not(:disabled)\n  ",
    RADIO_SELECTOR: 'input[type="radio"]:not(:disabled)',
};
var numbers$1 = {
    UNSET_INDEX: -1,
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];
function isNumberArray(selectedIndex) {
    return selectedIndex instanceof Array;
}
var MDCListFoundation = /** @class */ (function (_super) {
    __extends(MDCListFoundation, _super);
    function MDCListFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCListFoundation.defaultAdapter, adapter)) || this;
        _this.wrapFocus_ = false;
        _this.isVertical_ = true;
        _this.isSingleSelectionList_ = false;
        _this.selectedIndex_ = numbers$1.UNSET_INDEX;
        _this.focusedItemIndex_ = numbers$1.UNSET_INDEX;
        _this.useActivatedClass_ = false;
        _this.ariaCurrentAttrValue_ = null;
        _this.isCheckboxList_ = false;
        _this.isRadioList_ = false;
        return _this;
    }
    Object.defineProperty(MDCListFoundation, "strings", {
        get: function () {
            return strings$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "cssClasses", {
        get: function () {
            return cssClasses$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "numbers", {
        get: function () {
            return numbers$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCListFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClassForElementIndex: function () { return undefined; },
                focusItemAtIndex: function () { return undefined; },
                getAttributeForElementIndex: function () { return null; },
                getFocusedElementIndex: function () { return 0; },
                getListItemCount: function () { return 0; },
                hasCheckboxAtIndex: function () { return false; },
                hasRadioAtIndex: function () { return false; },
                isCheckboxCheckedAtIndex: function () { return false; },
                isFocusInsideList: function () { return false; },
                notifyAction: function () { return undefined; },
                removeClassForElementIndex: function () { return undefined; },
                setAttributeForElementIndex: function () { return undefined; },
                setCheckedCheckboxOrRadioAtIndex: function () { return undefined; },
                setTabIndexForListItemChildren: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCListFoundation.prototype.layout = function () {
        if (this.adapter_.getListItemCount() === 0) {
            return;
        }
        if (this.adapter_.hasCheckboxAtIndex(0)) {
            this.isCheckboxList_ = true;
        }
        else if (this.adapter_.hasRadioAtIndex(0)) {
            this.isRadioList_ = true;
        }
    };
    /**
     * Sets the private wrapFocus_ variable.
     */
    MDCListFoundation.prototype.setWrapFocus = function (value) {
        this.wrapFocus_ = value;
    };
    /**
     * Sets the isVertical_ private variable.
     */
    MDCListFoundation.prototype.setVerticalOrientation = function (value) {
        this.isVertical_ = value;
    };
    /**
     * Sets the isSingleSelectionList_ private variable.
     */
    MDCListFoundation.prototype.setSingleSelection = function (value) {
        this.isSingleSelectionList_ = value;
    };
    /**
     * Sets the useActivatedClass_ private variable.
     */
    MDCListFoundation.prototype.setUseActivatedClass = function (useActivated) {
        this.useActivatedClass_ = useActivated;
    };
    MDCListFoundation.prototype.getSelectedIndex = function () {
        return this.selectedIndex_;
    };
    MDCListFoundation.prototype.setSelectedIndex = function (index) {
        if (!this.isIndexValid_(index)) {
            return;
        }
        if (this.isCheckboxList_) {
            this.setCheckboxAtIndex_(index);
        }
        else if (this.isRadioList_) {
            this.setRadioAtIndex_(index);
        }
        else {
            this.setSingleSelectionAtIndex_(index);
        }
    };
    /**
     * Focus in handler for the list items.
     */
    MDCListFoundation.prototype.handleFocusIn = function (_, listItemIndex) {
        if (listItemIndex >= 0) {
            this.adapter_.setTabIndexForListItemChildren(listItemIndex, '0');
        }
    };
    /**
     * Focus out handler for the list items.
     */
    MDCListFoundation.prototype.handleFocusOut = function (_, listItemIndex) {
        var _this = this;
        if (listItemIndex >= 0) {
            this.adapter_.setTabIndexForListItemChildren(listItemIndex, '-1');
        }
        /**
         * Between Focusout & Focusin some browsers do not have focus on any element. Setting a delay to wait till the focus
         * is moved to next element.
         */
        setTimeout(function () {
            if (!_this.adapter_.isFocusInsideList()) {
                _this.setTabindexToFirstSelectedItem_();
            }
        }, 0);
    };
    /**
     * Key handler for the list.
     */
    MDCListFoundation.prototype.handleKeydown = function (evt, isRootListItem, listItemIndex) {
        var arrowLeft = evt.key === 'ArrowLeft' || evt.keyCode === 37;
        var arrowUp = evt.key === 'ArrowUp' || evt.keyCode === 38;
        var arrowRight = evt.key === 'ArrowRight' || evt.keyCode === 39;
        var arrowDown = evt.key === 'ArrowDown' || evt.keyCode === 40;
        var isHome = evt.key === 'Home' || evt.keyCode === 36;
        var isEnd = evt.key === 'End' || evt.keyCode === 35;
        var isEnter = evt.key === 'Enter' || evt.keyCode === 13;
        var isSpace = evt.key === 'Space' || evt.keyCode === 32;
        var currentIndex = this.adapter_.getFocusedElementIndex();
        var nextIndex = numbers$1.UNSET_INDEX;
        if (currentIndex === numbers$1.UNSET_INDEX) {
            currentIndex = listItemIndex;
            if (currentIndex < 0) {
                // If this event doesn't have a mdc-list-item ancestor from the
                // current list (not from a sublist), return early.
                return;
            }
        }
        if ((this.isVertical_ && arrowDown) || (!this.isVertical_ && arrowRight)) {
            this.preventDefaultEvent_(evt);
            nextIndex = this.focusNextElement(currentIndex);
        }
        else if ((this.isVertical_ && arrowUp) || (!this.isVertical_ && arrowLeft)) {
            this.preventDefaultEvent_(evt);
            nextIndex = this.focusPrevElement(currentIndex);
        }
        else if (isHome) {
            this.preventDefaultEvent_(evt);
            nextIndex = this.focusFirstElement();
        }
        else if (isEnd) {
            this.preventDefaultEvent_(evt);
            nextIndex = this.focusLastElement();
        }
        else if (isEnter || isSpace) {
            if (isRootListItem) {
                // Return early if enter key is pressed on anchor element which triggers synthetic MouseEvent event.
                var target = evt.target;
                if (target && target.tagName === 'A' && isEnter) {
                    return;
                }
                this.preventDefaultEvent_(evt);
                if (this.isSelectableList_()) {
                    this.setSelectedIndexOnAction_(currentIndex);
                }
                this.adapter_.notifyAction(currentIndex);
            }
        }
        this.focusedItemIndex_ = currentIndex;
        if (nextIndex >= 0) {
            this.setTabindexAtIndex_(nextIndex);
            this.focusedItemIndex_ = nextIndex;
        }
    };
    /**
     * Click handler for the list.
     */
    MDCListFoundation.prototype.handleClick = function (index, toggleCheckbox) {
        if (index === numbers$1.UNSET_INDEX) {
            return;
        }
        if (this.isSelectableList_()) {
            this.setSelectedIndexOnAction_(index, toggleCheckbox);
        }
        this.adapter_.notifyAction(index);
        this.setTabindexAtIndex_(index);
        this.focusedItemIndex_ = index;
    };
    /**
     * Focuses the next element on the list.
     */
    MDCListFoundation.prototype.focusNextElement = function (index) {
        var count = this.adapter_.getListItemCount();
        var nextIndex = index + 1;
        if (nextIndex >= count) {
            if (this.wrapFocus_) {
                nextIndex = 0;
            }
            else {
                // Return early because last item is already focused.
                return index;
            }
        }
        this.adapter_.focusItemAtIndex(nextIndex);
        return nextIndex;
    };
    /**
     * Focuses the previous element on the list.
     */
    MDCListFoundation.prototype.focusPrevElement = function (index) {
        var prevIndex = index - 1;
        if (prevIndex < 0) {
            if (this.wrapFocus_) {
                prevIndex = this.adapter_.getListItemCount() - 1;
            }
            else {
                // Return early because first item is already focused.
                return index;
            }
        }
        this.adapter_.focusItemAtIndex(prevIndex);
        return prevIndex;
    };
    MDCListFoundation.prototype.focusFirstElement = function () {
        this.adapter_.focusItemAtIndex(0);
        return 0;
    };
    MDCListFoundation.prototype.focusLastElement = function () {
        var lastIndex = this.adapter_.getListItemCount() - 1;
        this.adapter_.focusItemAtIndex(lastIndex);
        return lastIndex;
    };
    /**
     * Ensures that preventDefault is only called if the containing element doesn't
     * consume the event, and it will cause an unintended scroll.
     */
    MDCListFoundation.prototype.preventDefaultEvent_ = function (evt) {
        var target = evt.target;
        var tagName = ("" + target.tagName).toLowerCase();
        if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
            evt.preventDefault();
        }
    };
    MDCListFoundation.prototype.setSingleSelectionAtIndex_ = function (index) {
        if (this.selectedIndex_ === index) {
            return;
        }
        var selectedClassName = cssClasses$4.LIST_ITEM_SELECTED_CLASS;
        if (this.useActivatedClass_) {
            selectedClassName = cssClasses$4.LIST_ITEM_ACTIVATED_CLASS;
        }
        if (this.selectedIndex_ !== numbers$1.UNSET_INDEX) {
            this.adapter_.removeClassForElementIndex(this.selectedIndex_, selectedClassName);
        }
        this.adapter_.addClassForElementIndex(index, selectedClassName);
        this.setAriaForSingleSelectionAtIndex_(index);
        this.selectedIndex_ = index;
    };
    /**
     * Sets aria attribute for single selection at given index.
     */
    MDCListFoundation.prototype.setAriaForSingleSelectionAtIndex_ = function (index) {
        // Detect the presence of aria-current and get the value only during list initialization when it is in unset state.
        if (this.selectedIndex_ === numbers$1.UNSET_INDEX) {
            this.ariaCurrentAttrValue_ =
                this.adapter_.getAttributeForElementIndex(index, strings$2.ARIA_CURRENT);
        }
        var isAriaCurrent = this.ariaCurrentAttrValue_ !== null;
        var ariaAttribute = isAriaCurrent ? strings$2.ARIA_CURRENT : strings$2.ARIA_SELECTED;
        if (this.selectedIndex_ !== numbers$1.UNSET_INDEX) {
            this.adapter_.setAttributeForElementIndex(this.selectedIndex_, ariaAttribute, 'false');
        }
        var ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue_ : 'true';
        this.adapter_.setAttributeForElementIndex(index, ariaAttribute, ariaAttributeValue);
    };
    /**
     * Toggles radio at give index. Radio doesn't change the checked state if it is already checked.
     */
    MDCListFoundation.prototype.setRadioAtIndex_ = function (index) {
        this.adapter_.setCheckedCheckboxOrRadioAtIndex(index, true);
        if (this.selectedIndex_ !== numbers$1.UNSET_INDEX) {
            this.adapter_.setAttributeForElementIndex(this.selectedIndex_, strings$2.ARIA_CHECKED, 'false');
        }
        this.adapter_.setAttributeForElementIndex(index, strings$2.ARIA_CHECKED, 'true');
        this.selectedIndex_ = index;
    };
    MDCListFoundation.prototype.setCheckboxAtIndex_ = function (index) {
        for (var i = 0; i < this.adapter_.getListItemCount(); i++) {
            var isChecked = false;
            if (index.indexOf(i) >= 0) {
                isChecked = true;
            }
            this.adapter_.setCheckedCheckboxOrRadioAtIndex(i, isChecked);
            this.adapter_.setAttributeForElementIndex(i, strings$2.ARIA_CHECKED, isChecked ? 'true' : 'false');
        }
        this.selectedIndex_ = index;
    };
    MDCListFoundation.prototype.setTabindexAtIndex_ = function (index) {
        if (this.focusedItemIndex_ === numbers$1.UNSET_INDEX && index !== 0) {
            // If no list item was selected set first list item's tabindex to -1.
            // Generally, tabindex is set to 0 on first list item of list that has no preselected items.
            this.adapter_.setAttributeForElementIndex(0, 'tabindex', '-1');
        }
        else if (this.focusedItemIndex_ >= 0 && this.focusedItemIndex_ !== index) {
            this.adapter_.setAttributeForElementIndex(this.focusedItemIndex_, 'tabindex', '-1');
        }
        this.adapter_.setAttributeForElementIndex(index, 'tabindex', '0');
    };
    /**
     * @return Return true if it is single selectin list, checkbox list or radio list.
     */
    MDCListFoundation.prototype.isSelectableList_ = function () {
        return this.isSingleSelectionList_ || this.isCheckboxList_ || this.isRadioList_;
    };
    MDCListFoundation.prototype.setTabindexToFirstSelectedItem_ = function () {
        var targetIndex = 0;
        if (this.isSelectableList_()) {
            if (typeof this.selectedIndex_ === 'number' && this.selectedIndex_ !== numbers$1.UNSET_INDEX) {
                targetIndex = this.selectedIndex_;
            }
            else if (isNumberArray(this.selectedIndex_) && this.selectedIndex_.length > 0) {
                targetIndex = this.selectedIndex_.reduce(function (currentIndex, minIndex) { return Math.min(currentIndex, minIndex); });
            }
        }
        this.setTabindexAtIndex_(targetIndex);
    };
    MDCListFoundation.prototype.isIndexValid_ = function (index) {
        var _this = this;
        if (index instanceof Array) {
            if (!this.isCheckboxList_) {
                throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
            }
            if (index.length === 0) {
                return true;
            }
            else {
                return index.some(function (i) { return _this.isIndexInRange_(i); });
            }
        }
        else if (typeof index === 'number') {
            if (this.isCheckboxList_) {
                throw new Error('MDCListFoundation: Expected array of index for checkbox based list but got number: ' + index);
            }
            return this.isIndexInRange_(index);
        }
        else {
            return false;
        }
    };
    MDCListFoundation.prototype.isIndexInRange_ = function (index) {
        var listSize = this.adapter_.getListItemCount();
        return index >= 0 && index < listSize;
    };
    MDCListFoundation.prototype.setSelectedIndexOnAction_ = function (index, toggleCheckbox) {
        if (toggleCheckbox === void 0) { toggleCheckbox = true; }
        if (this.isCheckboxList_) {
            this.toggleCheckboxAtIndex_(index, toggleCheckbox);
        }
        else {
            this.setSelectedIndex(index);
        }
    };
    MDCListFoundation.prototype.toggleCheckboxAtIndex_ = function (index, toggleCheckbox) {
        var isChecked = this.adapter_.isCheckboxCheckedAtIndex(index);
        if (toggleCheckbox) {
            isChecked = !isChecked;
            this.adapter_.setCheckedCheckboxOrRadioAtIndex(index, isChecked);
        }
        this.adapter_.setAttributeForElementIndex(index, strings$2.ARIA_CHECKED, isChecked ? 'true' : 'false');
        // If none of the checkbox items are selected and selectedIndex is not initialized then provide a default value.
        var selectedIndexes = this.selectedIndex_ === numbers$1.UNSET_INDEX ? [] : this.selectedIndex_.slice();
        if (isChecked) {
            selectedIndexes.push(index);
        }
        else {
            selectedIndexes = selectedIndexes.filter(function (i) { return i !== index; });
        }
        this.selectedIndex_ = selectedIndexes;
    };
    return MDCListFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCList = /** @class */ (function (_super) {
    __extends(MDCList, _super);
    function MDCList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MDCList.prototype, "vertical", {
        set: function (value) {
            this.foundation_.setVerticalOrientation(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "listElements", {
        get: function () {
            return [].slice.call(this.root_.querySelectorAll(strings$2.ENABLED_ITEMS_SELECTOR));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "wrapFocus", {
        set: function (value) {
            this.foundation_.setWrapFocus(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "singleSelection", {
        set: function (isSingleSelectionList) {
            this.foundation_.setSingleSelection(isSingleSelectionList);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCList.prototype, "selectedIndex", {
        get: function () {
            return this.foundation_.getSelectedIndex();
        },
        set: function (index) {
            this.foundation_.setSelectedIndex(index);
        },
        enumerable: true,
        configurable: true
    });
    MDCList.attachTo = function (root) {
        return new MDCList(root);
    };
    MDCList.prototype.initialSyncWithDOM = function () {
        this.handleClick_ = this.handleClickEvent_.bind(this);
        this.handleKeydown_ = this.handleKeydownEvent_.bind(this);
        this.focusInEventListener_ = this.handleFocusInEvent_.bind(this);
        this.focusOutEventListener_ = this.handleFocusOutEvent_.bind(this);
        this.listen('keydown', this.handleKeydown_);
        this.listen('click', this.handleClick_);
        this.listen('focusin', this.focusInEventListener_);
        this.listen('focusout', this.focusOutEventListener_);
        this.layout();
        this.initializeListType();
    };
    MDCList.prototype.destroy = function () {
        this.unlisten('keydown', this.handleKeydown_);
        this.unlisten('click', this.handleClick_);
        this.unlisten('focusin', this.focusInEventListener_);
        this.unlisten('focusout', this.focusOutEventListener_);
    };
    MDCList.prototype.layout = function () {
        var direction = this.root_.getAttribute(strings$2.ARIA_ORIENTATION);
        this.vertical = direction !== strings$2.ARIA_ORIENTATION_HORIZONTAL;
        // List items need to have at least tabindex=-1 to be focusable.
        [].slice.call(this.root_.querySelectorAll('.mdc-list-item:not([tabindex])'))
            .forEach(function (el) {
            el.setAttribute('tabindex', '-1');
        });
        // Child button/a elements are not tabbable until the list item is focused.
        [].slice.call(this.root_.querySelectorAll(strings$2.FOCUSABLE_CHILD_ELEMENTS))
            .forEach(function (el) { return el.setAttribute('tabindex', '-1'); });
        this.foundation_.layout();
    };
    /**
     * Initialize selectedIndex value based on pre-selected checkbox list items, single selection or radio.
     */
    MDCList.prototype.initializeListType = function () {
        var _this = this;
        var checkboxListItems = this.root_.querySelectorAll(strings$2.ARIA_ROLE_CHECKBOX_SELECTOR);
        var singleSelectedListItem = this.root_.querySelector("\n      ." + cssClasses$4.LIST_ITEM_ACTIVATED_CLASS + ",\n      ." + cssClasses$4.LIST_ITEM_SELECTED_CLASS + "\n    ");
        var radioSelectedListItem = this.root_.querySelector(strings$2.ARIA_CHECKED_RADIO_SELECTOR);
        if (checkboxListItems.length) {
            var preselectedItems = this.root_.querySelectorAll(strings$2.ARIA_CHECKED_CHECKBOX_SELECTOR);
            this.selectedIndex =
                [].map.call(preselectedItems, function (listItem) { return _this.listElements.indexOf(listItem); });
        }
        else if (singleSelectedListItem) {
            if (singleSelectedListItem.classList.contains(cssClasses$4.LIST_ITEM_ACTIVATED_CLASS)) {
                this.foundation_.setUseActivatedClass(true);
            }
            this.singleSelection = true;
            this.selectedIndex = this.listElements.indexOf(singleSelectedListItem);
        }
        else if (radioSelectedListItem) {
            this.selectedIndex = this.listElements.indexOf(radioSelectedListItem);
        }
    };
    MDCList.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClassForElementIndex: function (index, className) {
                var element = _this.listElements[index];
                if (element) {
                    element.classList.add(className);
                }
            },
            focusItemAtIndex: function (index) {
                var element = _this.listElements[index];
                if (element) {
                    element.focus();
                }
            },
            getAttributeForElementIndex: function (index, attr) { return _this.listElements[index].getAttribute(attr); },
            getFocusedElementIndex: function () { return _this.listElements.indexOf(document.activeElement); },
            getListItemCount: function () { return _this.listElements.length; },
            hasCheckboxAtIndex: function (index) {
                var listItem = _this.listElements[index];
                return !!listItem.querySelector(strings$2.CHECKBOX_SELECTOR);
            },
            hasRadioAtIndex: function (index) {
                var listItem = _this.listElements[index];
                return !!listItem.querySelector(strings$2.RADIO_SELECTOR);
            },
            isCheckboxCheckedAtIndex: function (index) {
                var listItem = _this.listElements[index];
                var toggleEl = listItem.querySelector(strings$2.CHECKBOX_SELECTOR);
                return toggleEl.checked;
            },
            isFocusInsideList: function () {
                return _this.root_.contains(document.activeElement);
            },
            notifyAction: function (index) {
                _this.emit(strings$2.ACTION_EVENT, { index: index }, /** shouldBubble */ true);
            },
            removeClassForElementIndex: function (index, className) {
                var element = _this.listElements[index];
                if (element) {
                    element.classList.remove(className);
                }
            },
            setAttributeForElementIndex: function (index, attr, value) {
                var element = _this.listElements[index];
                if (element) {
                    element.setAttribute(attr, value);
                }
            },
            setCheckedCheckboxOrRadioAtIndex: function (index, isChecked) {
                var listItem = _this.listElements[index];
                var toggleEl = listItem.querySelector(strings$2.CHECKBOX_RADIO_SELECTOR);
                toggleEl.checked = isChecked;
                var event = document.createEvent('Event');
                event.initEvent('change', true, true);
                toggleEl.dispatchEvent(event);
            },
            setTabIndexForListItemChildren: function (listItemIndex, tabIndexValue) {
                var element = _this.listElements[listItemIndex];
                var listItemChildren = [].slice.call(element.querySelectorAll(strings$2.CHILD_ELEMENTS_TO_TOGGLE_TABINDEX));
                listItemChildren.forEach(function (el) { return el.setAttribute('tabindex', tabIndexValue); });
            },
        };
        return new MDCListFoundation(adapter);
    };
    /**
     * Used to figure out which list item this event is targetting. Or returns -1 if
     * there is no list item
     */
    MDCList.prototype.getListItemIndex_ = function (evt) {
        var eventTarget = evt.target;
        var nearestParent = closest(eventTarget, "." + cssClasses$4.LIST_ITEM_CLASS + ", ." + cssClasses$4.ROOT);
        // Get the index of the element if it is a list item.
        if (nearestParent && matches(nearestParent, "." + cssClasses$4.LIST_ITEM_CLASS)) {
            return this.listElements.indexOf(nearestParent);
        }
        return -1;
    };
    /**
     * Used to figure out which element was clicked before sending the event to the foundation.
     */
    MDCList.prototype.handleFocusInEvent_ = function (evt) {
        var index = this.getListItemIndex_(evt);
        this.foundation_.handleFocusIn(evt, index);
    };
    /**
     * Used to figure out which element was clicked before sending the event to the foundation.
     */
    MDCList.prototype.handleFocusOutEvent_ = function (evt) {
        var index = this.getListItemIndex_(evt);
        this.foundation_.handleFocusOut(evt, index);
    };
    /**
     * Used to figure out which element was focused when keydown event occurred before sending the event to the
     * foundation.
     */
    MDCList.prototype.handleKeydownEvent_ = function (evt) {
        var index = this.getListItemIndex_(evt);
        var target = evt.target;
        if (index >= 0) {
            this.foundation_.handleKeydown(evt, target.classList.contains(cssClasses$4.LIST_ITEM_CLASS), index);
        }
    };
    /**
     * Used to figure out which element was clicked before sending the event to the foundation.
     */
    MDCList.prototype.handleClickEvent_ = function (evt) {
        var index = this.getListItemIndex_(evt);
        var target = evt.target;
        // Toggle the checkbox only if it's not the target of the event, or the checkbox will have 2 change events.
        var toggleCheckbox = !matches(target, strings$2.CHECKBOX_RADIO_SELECTOR);
        this.foundation_.handleClick(index, toggleCheckbox);
    };
    return MDCList;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCMenuSurfaceFoundation = /** @class */ (function (_super) {
    __extends(MDCMenuSurfaceFoundation, _super);
    function MDCMenuSurfaceFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCMenuSurfaceFoundation.defaultAdapter, adapter)) || this;
        _this.isOpen_ = false;
        _this.isQuickOpen_ = false;
        _this.isHoistedElement_ = false;
        _this.isFixedPosition_ = false;
        _this.openAnimationEndTimerId_ = 0;
        _this.closeAnimationEndTimerId_ = 0;
        _this.animationRequestId_ = 0;
        _this.anchorCorner_ = Corner.TOP_START;
        _this.anchorMargin_ = { top: 0, right: 0, bottom: 0, left: 0 };
        _this.position_ = { x: 0, y: 0 };
        return _this;
    }
    Object.defineProperty(MDCMenuSurfaceFoundation, "cssClasses", {
        get: function () {
            return cssClasses$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "strings", {
        get: function () {
            return strings;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "numbers", {
        get: function () {
            return numbers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "Corner", {
        get: function () {
            return Corner;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "defaultAdapter", {
        /**
         * @see {@link MDCMenuSurfaceAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                hasAnchor: function () { return false; },
                isElementInContainer: function () { return false; },
                isFocused: function () { return false; },
                isFirstElementFocused: function () { return false; },
                isLastElementFocused: function () { return false; },
                isRtl: function () { return false; },
                getInnerDimensions: function () { return ({ height: 0, width: 0 }); },
                getAnchorDimensions: function () { return null; },
                getWindowDimensions: function () { return ({ height: 0, width: 0 }); },
                getBodyDimensions: function () { return ({ height: 0, width: 0 }); },
                getWindowScroll: function () { return ({ x: 0, y: 0 }); },
                setPosition: function () { return undefined; },
                setMaxHeight: function () { return undefined; },
                setTransformOrigin: function () { return undefined; },
                saveFocus: function () { return undefined; },
                restoreFocus: function () { return undefined; },
                focusFirstElement: function () { return undefined; },
                focusLastElement: function () { return undefined; },
                notifyClose: function () { return undefined; },
                notifyOpen: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCMenuSurfaceFoundation.prototype.init = function () {
        var _a = MDCMenuSurfaceFoundation.cssClasses, ROOT = _a.ROOT, OPEN = _a.OPEN;
        if (!this.adapter_.hasClass(ROOT)) {
            throw new Error(ROOT + " class required in root element.");
        }
        if (this.adapter_.hasClass(OPEN)) {
            this.isOpen_ = true;
        }
    };
    MDCMenuSurfaceFoundation.prototype.destroy = function () {
        clearTimeout(this.openAnimationEndTimerId_);
        clearTimeout(this.closeAnimationEndTimerId_);
        // Cancel any currently running animations.
        cancelAnimationFrame(this.animationRequestId_);
    };
    /**
     * @param corner Default anchor corner alignment of top-left menu surface corner.
     */
    MDCMenuSurfaceFoundation.prototype.setAnchorCorner = function (corner) {
        this.anchorCorner_ = corner;
    };
    /**
     * @param margin Set of margin values from anchor.
     */
    MDCMenuSurfaceFoundation.prototype.setAnchorMargin = function (margin) {
        this.anchorMargin_.top = margin.top || 0;
        this.anchorMargin_.right = margin.right || 0;
        this.anchorMargin_.bottom = margin.bottom || 0;
        this.anchorMargin_.left = margin.left || 0;
    };
    /** Used to indicate if the menu-surface is hoisted to the body. */
    MDCMenuSurfaceFoundation.prototype.setIsHoisted = function (isHoisted) {
        this.isHoistedElement_ = isHoisted;
    };
    /** Used to set the menu-surface calculations based on a fixed position menu. */
    MDCMenuSurfaceFoundation.prototype.setFixedPosition = function (isFixedPosition) {
        this.isFixedPosition_ = isFixedPosition;
    };
    /** Sets the menu-surface position on the page. */
    MDCMenuSurfaceFoundation.prototype.setAbsolutePosition = function (x, y) {
        this.position_.x = this.isFinite_(x) ? x : 0;
        this.position_.y = this.isFinite_(y) ? y : 0;
    };
    MDCMenuSurfaceFoundation.prototype.setQuickOpen = function (quickOpen) {
        this.isQuickOpen_ = quickOpen;
    };
    MDCMenuSurfaceFoundation.prototype.isOpen = function () {
        return this.isOpen_;
    };
    /**
     * Open the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.open = function () {
        var _this = this;
        this.adapter_.saveFocus();
        if (!this.isQuickOpen_) {
            this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
        }
        this.animationRequestId_ = requestAnimationFrame(function () {
            _this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            _this.dimensions_ = _this.adapter_.getInnerDimensions();
            _this.autoPosition_();
            if (_this.isQuickOpen_) {
                _this.adapter_.notifyOpen();
            }
            else {
                _this.openAnimationEndTimerId_ = setTimeout(function () {
                    _this.openAnimationEndTimerId_ = 0;
                    _this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
                    _this.adapter_.notifyOpen();
                }, numbers.TRANSITION_OPEN_DURATION);
            }
        });
        this.isOpen_ = true;
    };
    /**
     * Closes the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.close = function () {
        var _this = this;
        if (!this.isQuickOpen_) {
            this.adapter_.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
        }
        requestAnimationFrame(function () {
            _this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            if (_this.isQuickOpen_) {
                _this.adapter_.notifyClose();
            }
            else {
                _this.closeAnimationEndTimerId_ = setTimeout(function () {
                    _this.closeAnimationEndTimerId_ = 0;
                    _this.adapter_.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
                    _this.adapter_.notifyClose();
                }, numbers.TRANSITION_CLOSE_DURATION);
            }
        });
        this.isOpen_ = false;
        this.maybeRestoreFocus_();
    };
    /** Handle clicks and close if not within menu-surface element. */
    MDCMenuSurfaceFoundation.prototype.handleBodyClick = function (evt) {
        var el = evt.target;
        if (this.adapter_.isElementInContainer(el)) {
            return;
        }
        this.close();
    };
    /** Handle keys that close the surface. */
    MDCMenuSurfaceFoundation.prototype.handleKeydown = function (evt) {
        var keyCode = evt.keyCode, key = evt.key, shiftKey = evt.shiftKey;
        var isEscape = key === 'Escape' || keyCode === 27;
        var isTab = key === 'Tab' || keyCode === 9;
        if (isEscape) {
            this.close();
        }
        else if (isTab) {
            if (this.adapter_.isLastElementFocused() && !shiftKey) {
                this.adapter_.focusFirstElement();
                evt.preventDefault();
            }
            else if (this.adapter_.isFirstElementFocused() && shiftKey) {
                this.adapter_.focusLastElement();
                evt.preventDefault();
            }
        }
    };
    MDCMenuSurfaceFoundation.prototype.autoPosition_ = function () {
        var _a;
        // Compute measurements for autoposition methods reuse.
        this.measurements_ = this.getAutoLayoutMeasurements_();
        var corner = this.getOriginCorner_();
        var maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight_(corner);
        var verticalAlignment = this.hasBit_(corner, CornerBit.BOTTOM) ? 'bottom' : 'top';
        var horizontalAlignment = this.hasBit_(corner, CornerBit.RIGHT) ? 'right' : 'left';
        var horizontalOffset = this.getHorizontalOriginOffset_(corner);
        var verticalOffset = this.getVerticalOriginOffset_(corner);
        var _b = this.measurements_, anchorSize = _b.anchorSize, surfaceSize = _b.surfaceSize;
        var position = (_a = {},
            _a[horizontalAlignment] = horizontalOffset,
            _a[verticalAlignment] = verticalOffset,
            _a);
        // Center align when anchor width is comparable or greater than menu surface, otherwise keep corner.
        if (anchorSize.width / surfaceSize.width > numbers.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
            horizontalAlignment = 'center';
        }
        // If the menu-surface has been hoisted to the body, it's no longer relative to the anchor element
        if (this.isHoistedElement_ || this.isFixedPosition_) {
            this.adjustPositionForHoistedElement_(position);
        }
        this.adapter_.setTransformOrigin(horizontalAlignment + " " + verticalAlignment);
        this.adapter_.setPosition(position);
        this.adapter_.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');
    };
    /**
     * @return Measurements used to position menu surface popup.
     */
    MDCMenuSurfaceFoundation.prototype.getAutoLayoutMeasurements_ = function () {
        var anchorRect = this.adapter_.getAnchorDimensions();
        var bodySize = this.adapter_.getBodyDimensions();
        var viewportSize = this.adapter_.getWindowDimensions();
        var windowScroll = this.adapter_.getWindowScroll();
        if (!anchorRect) {
            // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
            anchorRect = {
                top: this.position_.y,
                right: this.position_.x,
                bottom: this.position_.y,
                left: this.position_.x,
                width: 0,
                height: 0,
            };
            // tslint:enable:object-literal-sort-keys
        }
        return {
            anchorSize: anchorRect,
            bodySize: bodySize,
            surfaceSize: this.dimensions_,
            viewportDistance: {
                // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
                top: anchorRect.top,
                right: viewportSize.width - anchorRect.right,
                bottom: viewportSize.height - anchorRect.bottom,
                left: anchorRect.left,
            },
            viewportSize: viewportSize,
            windowScroll: windowScroll,
        };
    };
    /**
     * Computes the corner of the anchor from which to animate and position the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.getOriginCorner_ = function () {
        // Defaults: open from the top left.
        var corner = Corner.TOP_LEFT;
        var _a = this.measurements_, viewportDistance = _a.viewportDistance, anchorSize = _a.anchorSize, surfaceSize = _a.surfaceSize;
        var isBottomAligned = this.hasBit_(this.anchorCorner_, CornerBit.BOTTOM);
        var availableTop = isBottomAligned ? viewportDistance.top + anchorSize.height + this.anchorMargin_.bottom
            : viewportDistance.top + this.anchorMargin_.top;
        var availableBottom = isBottomAligned ? viewportDistance.bottom - this.anchorMargin_.bottom
            : viewportDistance.bottom + anchorSize.height - this.anchorMargin_.top;
        var topOverflow = surfaceSize.height - availableTop;
        var bottomOverflow = surfaceSize.height - availableBottom;
        if (bottomOverflow > 0 && topOverflow < bottomOverflow) {
            corner = this.setBit_(corner, CornerBit.BOTTOM);
        }
        var isRtl = this.adapter_.isRtl();
        var isFlipRtl = this.hasBit_(this.anchorCorner_, CornerBit.FLIP_RTL);
        var avoidHorizontalOverlap = this.hasBit_(this.anchorCorner_, CornerBit.RIGHT);
        var isAlignedRight = (avoidHorizontalOverlap && !isRtl) ||
            (!avoidHorizontalOverlap && isFlipRtl && isRtl);
        var availableLeft = isAlignedRight ? viewportDistance.left + anchorSize.width + this.anchorMargin_.right :
            viewportDistance.left + this.anchorMargin_.left;
        var availableRight = isAlignedRight ? viewportDistance.right - this.anchorMargin_.right :
            viewportDistance.right + anchorSize.width - this.anchorMargin_.left;
        var leftOverflow = surfaceSize.width - availableLeft;
        var rightOverflow = surfaceSize.width - availableRight;
        if ((leftOverflow < 0 && isAlignedRight && isRtl) ||
            (avoidHorizontalOverlap && !isAlignedRight && leftOverflow < 0) ||
            (rightOverflow > 0 && leftOverflow < rightOverflow)) {
            corner = this.setBit_(corner, CornerBit.RIGHT);
        }
        return corner;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Maximum height of the menu surface, based on available space. 0 indicates should not be set.
     */
    MDCMenuSurfaceFoundation.prototype.getMenuSurfaceMaxHeight_ = function (corner) {
        var viewportDistance = this.measurements_.viewportDistance;
        var maxHeight = 0;
        var isBottomAligned = this.hasBit_(corner, CornerBit.BOTTOM);
        var isBottomAnchored = this.hasBit_(this.anchorCorner_, CornerBit.BOTTOM);
        var MARGIN_TO_EDGE = MDCMenuSurfaceFoundation.numbers.MARGIN_TO_EDGE;
        // When maximum height is not specified, it is handled from CSS.
        if (isBottomAligned) {
            maxHeight = viewportDistance.top + this.anchorMargin_.top - MARGIN_TO_EDGE;
            if (!isBottomAnchored) {
                maxHeight += this.measurements_.anchorSize.height;
            }
        }
        else {
            maxHeight =
                viewportDistance.bottom - this.anchorMargin_.bottom + this.measurements_.anchorSize.height - MARGIN_TO_EDGE;
            if (isBottomAnchored) {
                maxHeight -= this.measurements_.anchorSize.height;
            }
        }
        return maxHeight;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Horizontal offset of menu surface origin corner from corresponding anchor corner.
     */
    MDCMenuSurfaceFoundation.prototype.getHorizontalOriginOffset_ = function (corner) {
        var anchorSize = this.measurements_.anchorSize;
        // isRightAligned corresponds to using the 'right' property on the surface.
        var isRightAligned = this.hasBit_(corner, CornerBit.RIGHT);
        var avoidHorizontalOverlap = this.hasBit_(this.anchorCorner_, CornerBit.RIGHT);
        if (isRightAligned) {
            var rightOffset = avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin_.left : this.anchorMargin_.right;
            // For hoisted or fixed elements, adjust the offset by the difference between viewport width and body width so
            // when we calculate the right value (`adjustPositionForHoistedElement_`) based on the element position,
            // the right property is correct.
            if (this.isHoistedElement_ || this.isFixedPosition_) {
                return rightOffset - (this.measurements_.viewportSize.width - this.measurements_.bodySize.width);
            }
            return rightOffset;
        }
        return avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin_.right : this.anchorMargin_.left;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Vertical offset of menu surface origin corner from corresponding anchor corner.
     */
    MDCMenuSurfaceFoundation.prototype.getVerticalOriginOffset_ = function (corner) {
        var anchorSize = this.measurements_.anchorSize;
        var isBottomAligned = this.hasBit_(corner, CornerBit.BOTTOM);
        var avoidVerticalOverlap = this.hasBit_(this.anchorCorner_, CornerBit.BOTTOM);
        var y = 0;
        if (isBottomAligned) {
            y = avoidVerticalOverlap ? anchorSize.height - this.anchorMargin_.top : -this.anchorMargin_.bottom;
        }
        else {
            y = avoidVerticalOverlap ? (anchorSize.height + this.anchorMargin_.bottom) : this.anchorMargin_.top;
        }
        return y;
    };
    /** Calculates the offsets for positioning the menu-surface when the menu-surface has been hoisted to the body. */
    MDCMenuSurfaceFoundation.prototype.adjustPositionForHoistedElement_ = function (position) {
        var e_1, _a;
        var _b = this.measurements_, windowScroll = _b.windowScroll, viewportDistance = _b.viewportDistance;
        var props = Object.keys(position);
        try {
            for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
                var prop = props_1_1.value;
                var value = position[prop] || 0;
                // Hoisted surfaces need to have the anchor elements location on the page added to the
                // position properties for proper alignment on the body.
                value += viewportDistance[prop];
                // Surfaces that are absolutely positioned need to have additional calculations for scroll
                // and bottom positioning.
                if (!this.isFixedPosition_) {
                    if (prop === 'top') {
                        value += windowScroll.y;
                    }
                    else if (prop === 'bottom') {
                        value -= windowScroll.y;
                    }
                    else if (prop === 'left') {
                        value += windowScroll.x;
                    }
                    else { // prop === 'right'
                        value -= windowScroll.x;
                    }
                }
                position[prop] = value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * The last focused element when the menu surface was opened should regain focus, if the user is
     * focused on or within the menu surface when it is closed.
     */
    MDCMenuSurfaceFoundation.prototype.maybeRestoreFocus_ = function () {
        var isRootFocused = this.adapter_.isFocused();
        var childHasFocus = document.activeElement && this.adapter_.isElementInContainer(document.activeElement);
        if (isRootFocused || childHasFocus) {
            this.adapter_.restoreFocus();
        }
    };
    MDCMenuSurfaceFoundation.prototype.hasBit_ = function (corner, bit) {
        return Boolean(corner & bit); // tslint:disable-line:no-bitwise
    };
    MDCMenuSurfaceFoundation.prototype.setBit_ = function (corner, bit) {
        return corner | bit; // tslint:disable-line:no-bitwise
    };
    /**
     * isFinite that doesn't force conversion to number type.
     * Equivalent to Number.isFinite in ES2015, which is not supported in IE.
     */
    MDCMenuSurfaceFoundation.prototype.isFinite_ = function (num) {
        return typeof num === 'number' && isFinite(num);
    };
    return MDCMenuSurfaceFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cachedCssTransformPropertyName_;
/**
 * Returns the name of the correct transform property to use on the current browser.
 */
function getTransformPropertyName(globalObj, forceRefresh) {
    if (forceRefresh === void 0) { forceRefresh = false; }
    if (cachedCssTransformPropertyName_ === undefined || forceRefresh) {
        var el = globalObj.document.createElement('div');
        cachedCssTransformPropertyName_ = 'transform' in el.style ? 'transform' : 'webkitTransform';
    }
    return cachedCssTransformPropertyName_;
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCMenuSurface = /** @class */ (function (_super) {
    __extends(MDCMenuSurface, _super);
    function MDCMenuSurface() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCMenuSurface.attachTo = function (root) {
        return new MDCMenuSurface(root);
    };
    MDCMenuSurface.prototype.initialSyncWithDOM = function () {
        var _this = this;
        var parentEl = this.root_.parentElement;
        this.anchorElement = parentEl && parentEl.classList.contains(cssClasses$2.ANCHOR) ? parentEl : null;
        if (this.root_.classList.contains(cssClasses$2.FIXED)) {
            this.setFixedPosition(true);
        }
        this.handleKeydown_ = function (evt) { return _this.foundation_.handleKeydown(evt); };
        this.handleBodyClick_ = function (evt) { return _this.foundation_.handleBodyClick(evt); };
        this.registerBodyClickListener_ = function () { return document.body.addEventListener('click', _this.handleBodyClick_); };
        this.deregisterBodyClickListener_ = function () { return document.body.removeEventListener('click', _this.handleBodyClick_); };
        this.listen('keydown', this.handleKeydown_);
        this.listen(strings.OPENED_EVENT, this.registerBodyClickListener_);
        this.listen(strings.CLOSED_EVENT, this.deregisterBodyClickListener_);
    };
    MDCMenuSurface.prototype.destroy = function () {
        this.unlisten('keydown', this.handleKeydown_);
        this.unlisten(strings.OPENED_EVENT, this.registerBodyClickListener_);
        this.unlisten(strings.CLOSED_EVENT, this.deregisterBodyClickListener_);
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCMenuSurface.prototype, "open", {
        get: function () {
            return this.foundation_.isOpen();
        },
        set: function (value) {
            if (value) {
                var focusableElements = this.root_.querySelectorAll(strings.FOCUSABLE_ELEMENTS);
                this.firstFocusableElement_ = focusableElements[0];
                this.lastFocusableElement_ = focusableElements[focusableElements.length - 1];
                this.foundation_.open();
            }
            else {
                this.foundation_.close();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurface.prototype, "quickOpen", {
        set: function (quickOpen) {
            this.foundation_.setQuickOpen(quickOpen);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Removes the menu-surface from it's current location and appends it to the
     * body to overcome any overflow:hidden issues.
     */
    MDCMenuSurface.prototype.hoistMenuToBody = function () {
        document.body.appendChild(this.root_);
        this.setIsHoisted(true);
    };
    /** Sets the foundation to use page offsets for an positioning when the menu is hoisted to the body. */
    MDCMenuSurface.prototype.setIsHoisted = function (isHoisted) {
        this.foundation_.setIsHoisted(isHoisted);
    };
    /** Sets the element that the menu-surface is anchored to. */
    MDCMenuSurface.prototype.setMenuSurfaceAnchorElement = function (element) {
        this.anchorElement = element;
    };
    /** Sets the menu-surface to position: fixed. */
    MDCMenuSurface.prototype.setFixedPosition = function (isFixed) {
        if (isFixed) {
            this.root_.classList.add(cssClasses$2.FIXED);
        }
        else {
            this.root_.classList.remove(cssClasses$2.FIXED);
        }
        this.foundation_.setFixedPosition(isFixed);
    };
    /** Sets the absolute x/y position to position based on. Requires the menu to be hoisted. */
    MDCMenuSurface.prototype.setAbsolutePosition = function (x, y) {
        this.foundation_.setAbsolutePosition(x, y);
        this.setIsHoisted(true);
    };
    /**
     * @param corner Default anchor corner alignment of top-left surface corner.
     */
    MDCMenuSurface.prototype.setAnchorCorner = function (corner) {
        this.foundation_.setAnchorCorner(corner);
    };
    MDCMenuSurface.prototype.setAnchorMargin = function (margin) {
        this.foundation_.setAnchorMargin(margin);
    };
    MDCMenuSurface.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            hasAnchor: function () { return !!_this.anchorElement; },
            notifyClose: function () { return _this.emit(MDCMenuSurfaceFoundation.strings.CLOSED_EVENT, {}); },
            notifyOpen: function () { return _this.emit(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, {}); },
            isElementInContainer: function (el) { return _this.root_.contains(el); },
            isRtl: function () { return getComputedStyle(_this.root_).getPropertyValue('direction') === 'rtl'; },
            setTransformOrigin: function (origin) {
                var propertyName = getTransformPropertyName(window) + "-origin";
                _this.root_.style.setProperty(propertyName, origin);
            },
            isFocused: function () { return document.activeElement === _this.root_; },
            saveFocus: function () {
                _this.previousFocus_ = document.activeElement;
            },
            restoreFocus: function () {
                if (_this.root_.contains(document.activeElement)) {
                    if (_this.previousFocus_ && _this.previousFocus_.focus) {
                        _this.previousFocus_.focus();
                    }
                }
            },
            isFirstElementFocused: function () {
                return _this.firstFocusableElement_ ? _this.firstFocusableElement_ === document.activeElement : false;
            },
            isLastElementFocused: function () {
                return _this.lastFocusableElement_ ? _this.lastFocusableElement_ === document.activeElement : false;
            },
            focusFirstElement: function () {
                return _this.firstFocusableElement_ && _this.firstFocusableElement_.focus && _this.firstFocusableElement_.focus();
            },
            focusLastElement: function () {
                return _this.lastFocusableElement_ && _this.lastFocusableElement_.focus && _this.lastFocusableElement_.focus();
            },
            getInnerDimensions: function () {
                return { width: _this.root_.offsetWidth, height: _this.root_.offsetHeight };
            },
            getAnchorDimensions: function () { return _this.anchorElement ? _this.anchorElement.getBoundingClientRect() : null; },
            getWindowDimensions: function () {
                return { width: window.innerWidth, height: window.innerHeight };
            },
            getBodyDimensions: function () {
                return { width: document.body.clientWidth, height: document.body.clientHeight };
            },
            getWindowScroll: function () {
                return { x: window.pageXOffset, y: window.pageYOffset };
            },
            setPosition: function (position) {
                _this.root_.style.left = 'left' in position ? position.left + "px" : '';
                _this.root_.style.right = 'right' in position ? position.right + "px" : '';
                _this.root_.style.top = 'top' in position ? position.top + "px" : '';
                _this.root_.style.bottom = 'bottom' in position ? position.bottom + "px" : '';
            },
            setMaxHeight: function (height) {
                _this.root_.style.maxHeight = height;
            },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCMenuSurfaceFoundation(adapter);
    };
    return MDCMenuSurface;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCMenuFoundation = /** @class */ (function (_super) {
    __extends(MDCMenuFoundation, _super);
    function MDCMenuFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCMenuFoundation.defaultAdapter, adapter)) || this;
        _this.closeAnimationEndTimerId_ = 0;
        return _this;
    }
    Object.defineProperty(MDCMenuFoundation, "cssClasses", {
        get: function () {
            return cssClasses$3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "strings", {
        get: function () {
            return strings$1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "defaultAdapter", {
        /**
         * @see {@link MDCMenuAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClassToElementAtIndex: function () { return undefined; },
                removeClassFromElementAtIndex: function () { return undefined; },
                addAttributeToElementAtIndex: function () { return undefined; },
                removeAttributeFromElementAtIndex: function () { return undefined; },
                elementContainsClass: function () { return false; },
                closeSurface: function () { return undefined; },
                getElementIndex: function () { return -1; },
                getParentElement: function () { return null; },
                getSelectedElementIndex: function () { return -1; },
                notifySelected: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCMenuFoundation.prototype.destroy = function () {
        if (this.closeAnimationEndTimerId_) {
            clearTimeout(this.closeAnimationEndTimerId_);
        }
        this.adapter_.closeSurface();
    };
    MDCMenuFoundation.prototype.handleKeydown = function (evt) {
        var key = evt.key, keyCode = evt.keyCode;
        var isTab = key === 'Tab' || keyCode === 9;
        if (isTab) {
            this.adapter_.closeSurface();
        }
    };
    MDCMenuFoundation.prototype.handleItemAction = function (listItem) {
        var _this = this;
        var index = this.adapter_.getElementIndex(listItem);
        if (index < 0) {
            return;
        }
        this.adapter_.notifySelected({ index: index });
        this.adapter_.closeSurface();
        // Wait for the menu to close before adding/removing classes that affect styles.
        this.closeAnimationEndTimerId_ = setTimeout(function () {
            var selectionGroup = _this.getSelectionGroup_(listItem);
            if (selectionGroup) {
                _this.handleSelectionGroup_(selectionGroup, index);
            }
        }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
    };
    /**
     * Handles toggling the selected classes in a selection group when a selection is made.
     */
    MDCMenuFoundation.prototype.handleSelectionGroup_ = function (selectionGroup, index) {
        // De-select the previous selection in this group.
        var selectedIndex = this.adapter_.getSelectedElementIndex(selectionGroup);
        if (selectedIndex >= 0) {
            this.adapter_.removeAttributeFromElementAtIndex(selectedIndex, strings$1.ARIA_SELECTED_ATTR);
            this.adapter_.removeClassFromElementAtIndex(selectedIndex, cssClasses$3.MENU_SELECTED_LIST_ITEM);
        }
        // Select the new list item in this group.
        this.adapter_.addClassToElementAtIndex(index, cssClasses$3.MENU_SELECTED_LIST_ITEM);
        this.adapter_.addAttributeToElementAtIndex(index, strings$1.ARIA_SELECTED_ATTR, 'true');
    };
    /**
     * Returns the parent selection group of an element if one exists.
     */
    MDCMenuFoundation.prototype.getSelectionGroup_ = function (listItem) {
        var parent = this.adapter_.getParentElement(listItem);
        if (!parent) {
            return null;
        }
        var isGroup = this.adapter_.elementContainsClass(parent, cssClasses$3.MENU_SELECTION_GROUP);
        // Iterate through ancestors until we find the group or get to the list.
        while (!isGroup && parent && !this.adapter_.elementContainsClass(parent, MDCListFoundation.cssClasses.ROOT)) {
            parent = this.adapter_.getParentElement(parent);
            isGroup = parent ? this.adapter_.elementContainsClass(parent, cssClasses$3.MENU_SELECTION_GROUP) : false;
        }
        if (isGroup) {
            return parent;
        }
        else {
            return null;
        }
    };
    return MDCMenuFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCMenu = /** @class */ (function (_super) {
    __extends(MDCMenu, _super);
    function MDCMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCMenu.attachTo = function (root) {
        return new MDCMenu(root);
    };
    MDCMenu.prototype.initialize = function (menuSurfaceFactory, listFactory) {
        if (menuSurfaceFactory === void 0) { menuSurfaceFactory = function (el) { return new MDCMenuSurface(el); }; }
        if (listFactory === void 0) { listFactory = function (el) { return new MDCList(el); }; }
        this.menuSurfaceFactory_ = menuSurfaceFactory;
        this.listFactory_ = listFactory;
    };
    MDCMenu.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.menuSurface_ = this.menuSurfaceFactory_(this.root_);
        var list = this.root_.querySelector(strings$1.LIST_SELECTOR);
        if (list) {
            this.list_ = this.listFactory_(list);
            this.list_.wrapFocus = true;
        }
        else {
            this.list_ = null;
        }
        this.handleKeydown_ = function (evt) { return _this.foundation_.handleKeydown(evt); };
        this.handleItemAction_ = function (evt) { return _this.foundation_.handleItemAction(_this.items[evt.detail.index]); };
        this.afterOpenedCallback_ = function () { return _this.handleAfterOpened_(); };
        this.menuSurface_.listen(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
        this.listen('keydown', this.handleKeydown_);
        this.listen(MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction_);
    };
    MDCMenu.prototype.destroy = function () {
        if (this.list_) {
            this.list_.destroy();
        }
        this.menuSurface_.destroy();
        this.menuSurface_.unlisten(MDCMenuSurfaceFoundation.strings.OPENED_EVENT, this.afterOpenedCallback_);
        this.unlisten('keydown', this.handleKeydown_);
        this.unlisten(MDCListFoundation.strings.ACTION_EVENT, this.handleItemAction_);
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCMenu.prototype, "open", {
        get: function () {
            return this.menuSurface_.open;
        },
        set: function (value) {
            this.menuSurface_.open = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "wrapFocus", {
        get: function () {
            return this.list_ ? this.list_.wrapFocus : false;
        },
        set: function (value) {
            if (this.list_) {
                this.list_.wrapFocus = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "items", {
        /**
         * Return the items within the menu. Note that this only contains the set of elements within
         * the items container that are proper list items, and not supplemental / presentational DOM
         * elements.
         */
        get: function () {
            return this.list_ ? this.list_.listElements : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCMenu.prototype, "quickOpen", {
        set: function (quickOpen) {
            this.menuSurface_.quickOpen = quickOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param corner Default anchor corner alignment of top-left menu corner.
     */
    MDCMenu.prototype.setAnchorCorner = function (corner) {
        this.menuSurface_.setAnchorCorner(corner);
    };
    MDCMenu.prototype.setAnchorMargin = function (margin) {
        this.menuSurface_.setAnchorMargin(margin);
    };
    /**
     * @return The item within the menu at the index specified.
     */
    MDCMenu.prototype.getOptionByIndex = function (index) {
        var items = this.items;
        if (index < items.length) {
            return this.items[index];
        }
        else {
            return null;
        }
    };
    MDCMenu.prototype.setFixedPosition = function (isFixed) {
        this.menuSurface_.setFixedPosition(isFixed);
    };
    MDCMenu.prototype.hoistMenuToBody = function () {
        this.menuSurface_.hoistMenuToBody();
    };
    MDCMenu.prototype.setIsHoisted = function (isHoisted) {
        this.menuSurface_.setIsHoisted(isHoisted);
    };
    MDCMenu.prototype.setAbsolutePosition = function (x, y) {
        this.menuSurface_.setAbsolutePosition(x, y);
    };
    /**
     * Sets the element that the menu-surface is anchored to.
     */
    MDCMenu.prototype.setAnchorElement = function (element) {
        this.menuSurface_.anchorElement = element;
    };
    MDCMenu.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClassToElementAtIndex: function (index, className) {
                var list = _this.items;
                list[index].classList.add(className);
            },
            removeClassFromElementAtIndex: function (index, className) {
                var list = _this.items;
                list[index].classList.remove(className);
            },
            addAttributeToElementAtIndex: function (index, attr, value) {
                var list = _this.items;
                list[index].setAttribute(attr, value);
            },
            removeAttributeFromElementAtIndex: function (index, attr) {
                var list = _this.items;
                list[index].removeAttribute(attr);
            },
            elementContainsClass: function (element, className) { return element.classList.contains(className); },
            closeSurface: function () { return _this.open = false; },
            getElementIndex: function (element) { return _this.items.indexOf(element); },
            getParentElement: function (element) { return element.parentElement; },
            getSelectedElementIndex: function (selectionGroup) {
                var selectedListItem = selectionGroup.querySelector("." + cssClasses$3.MENU_SELECTED_LIST_ITEM);
                return selectedListItem ? _this.items.indexOf(selectedListItem) : -1;
            },
            notifySelected: function (evtData) { return _this.emit(strings$1.SELECTED_EVENT, {
                index: evtData.index,
                item: _this.items[evtData.index],
            }); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCMenuFoundation(adapter);
    };
    MDCMenu.prototype.handleAfterOpened_ = function () {
        var list = this.items;
        if (list.length > 0) {
            list[0].focus();
        }
    };
    return MDCMenu;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$3 = {
    NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch',
};
var numbers$2 = {
    // This should stay in sync with $mdc-notched-outline-padding * 2.
    NOTCH_ELEMENT_PADDING: 8,
};
var cssClasses$5 = {
    NO_LABEL: 'mdc-notched-outline--no-label',
    OUTLINE_NOTCHED: 'mdc-notched-outline--notched',
    OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded',
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCNotchedOutlineFoundation = /** @class */ (function (_super) {
    __extends(MDCNotchedOutlineFoundation, _super);
    function MDCNotchedOutlineFoundation(adapter) {
        return _super.call(this, __assign({}, MDCNotchedOutlineFoundation.defaultAdapter, adapter)) || this;
    }
    Object.defineProperty(MDCNotchedOutlineFoundation, "strings", {
        get: function () {
            return strings$3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "cssClasses", {
        get: function () {
            return cssClasses$5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "numbers", {
        get: function () {
            return numbers$2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "defaultAdapter", {
        /**
         * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                setNotchWidthProperty: function () { return undefined; },
                removeNotchWidthProperty: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.
     */
    MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        if (notchWidth > 0) {
            notchWidth += numbers$2.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
        }
        this.adapter_.setNotchWidthProperty(notchWidth);
        this.adapter_.addClass(OUTLINE_NOTCHED);
    };
    /**
     * Removes notched outline selector to close the notch in the outline.
     */
    MDCNotchedOutlineFoundation.prototype.closeNotch = function () {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        this.adapter_.removeClass(OUTLINE_NOTCHED);
        this.adapter_.removeNotchWidthProperty();
    };
    return MDCNotchedOutlineFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCNotchedOutline = /** @class */ (function (_super) {
    __extends(MDCNotchedOutline, _super);
    function MDCNotchedOutline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCNotchedOutline.attachTo = function (root) {
        return new MDCNotchedOutline(root);
    };
    MDCNotchedOutline.prototype.initialSyncWithDOM = function () {
        this.notchElement_ = this.root_.querySelector(strings$3.NOTCH_ELEMENT_SELECTOR);
        var label = this.root_.querySelector('.' + MDCFloatingLabelFoundation.cssClasses.ROOT);
        if (label) {
            label.style.transitionDuration = '0s';
            this.root_.classList.add(cssClasses$5.OUTLINE_UPGRADED);
            requestAnimationFrame(function () {
                label.style.transitionDuration = '';
            });
        }
        else {
            this.root_.classList.add(cssClasses$5.NO_LABEL);
        }
    };
    /**
     * Updates classes and styles to open the notch to the specified width.
     * @param notchWidth The notch width in the outline.
     */
    MDCNotchedOutline.prototype.notch = function (notchWidth) {
        this.foundation_.notch(notchWidth);
    };
    /**
     * Updates classes and styles to close the notch.
     */
    MDCNotchedOutline.prototype.closeNotch = function () {
        this.foundation_.closeNotch();
    };
    MDCNotchedOutline.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            setNotchWidthProperty: function (width) { return _this.notchElement_.style.setProperty('width', width + 'px'); },
            removeNotchWidthProperty: function () { return _this.notchElement_.style.removeProperty('width'); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCNotchedOutlineFoundation(adapter);
    };
    return MDCNotchedOutline;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$6 = {
    DISABLED: 'mdc-select--disabled',
    FOCUSED: 'mdc-select--focused',
    INVALID: 'mdc-select--invalid',
    OUTLINED: 'mdc-select--outlined',
    REQUIRED: 'mdc-select--required',
    ROOT: 'mdc-select',
    SELECTED_ITEM_CLASS: 'mdc-list-item--selected',
    WITH_LEADING_ICON: 'mdc-select--with-leading-icon',
};
var strings$4 = {
    ARIA_CONTROLS: 'aria-controls',
    ARIA_SELECTED_ATTR: 'aria-selected',
    CHANGE_EVENT: 'MDCSelect:change',
    ENHANCED_VALUE_ATTR: 'data-value',
    HIDDEN_INPUT_SELECTOR: 'input[type="hidden"]',
    LABEL_SELECTOR: '.mdc-floating-label',
    LEADING_ICON_SELECTOR: '.mdc-select__icon',
    LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
    MENU_SELECTOR: '.mdc-select__menu',
    NATIVE_CONTROL_SELECTOR: '.mdc-select__native-control',
    OUTLINE_SELECTOR: '.mdc-notched-outline',
    SELECTED_ITEM_SELECTOR: "." + cssClasses$6.SELECTED_ITEM_CLASS,
    SELECTED_TEXT_SELECTOR: '.mdc-select__selected-text',
};
var numbers$3 = {
    LABEL_SCALE: 0.75,
};

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCSelectFoundation = /** @class */ (function (_super) {
    __extends(MDCSelectFoundation, _super);
    /* istanbul ignore next: optional argument is not a branch statement */
    /**
     * @param adapter
     * @param foundationMap Map from subcomponent names to their subfoundations.
     */
    function MDCSelectFoundation(adapter, foundationMap) {
        if (foundationMap === void 0) { foundationMap = {}; }
        var _this = _super.call(this, __assign({}, MDCSelectFoundation.defaultAdapter, adapter)) || this;
        _this.leadingIcon_ = foundationMap.leadingIcon;
        _this.helperText_ = foundationMap.helperText;
        return _this;
    }
    Object.defineProperty(MDCSelectFoundation, "cssClasses", {
        get: function () {
            return cssClasses$6;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "numbers", {
        get: function () {
            return numbers$3;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "strings", {
        get: function () {
            return strings$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                activateBottomLine: function () { return undefined; },
                deactivateBottomLine: function () { return undefined; },
                setValue: function () { return undefined; },
                getValue: function () { return ''; },
                floatLabel: function () { return undefined; },
                getLabelWidth: function () { return 0; },
                hasOutline: function () { return false; },
                notchOutline: function () { return undefined; },
                closeOutline: function () { return undefined; },
                openMenu: function () { return undefined; },
                closeMenu: function () { return undefined; },
                isMenuOpen: function () { return false; },
                setSelectedIndex: function () { return undefined; },
                setDisabled: function () { return undefined; },
                setRippleCenter: function () { return undefined; },
                notifyChange: function () { return undefined; },
                checkValidity: function () { return false; },
                setValid: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectFoundation.prototype.setSelectedIndex = function (index) {
        this.adapter_.setSelectedIndex(index);
        this.adapter_.closeMenu();
        var didChange = true;
        this.handleChange(didChange);
    };
    MDCSelectFoundation.prototype.setValue = function (value) {
        this.adapter_.setValue(value);
        var didChange = true;
        this.handleChange(didChange);
    };
    MDCSelectFoundation.prototype.getValue = function () {
        return this.adapter_.getValue();
    };
    MDCSelectFoundation.prototype.setDisabled = function (isDisabled) {
        if (isDisabled) {
            this.adapter_.addClass(cssClasses$6.DISABLED);
        }
        else {
            this.adapter_.removeClass(cssClasses$6.DISABLED);
        }
        this.adapter_.setDisabled(isDisabled);
        this.adapter_.closeMenu();
        if (this.leadingIcon_) {
            this.leadingIcon_.setDisabled(isDisabled);
        }
    };
    /**
     * @param content Sets the content of the helper text.
     */
    MDCSelectFoundation.prototype.setHelperTextContent = function (content) {
        if (this.helperText_) {
            this.helperText_.setContent(content);
        }
    };
    MDCSelectFoundation.prototype.layout = function () {
        var openNotch = this.getValue().length > 0;
        this.notchOutline(openNotch);
    };
    /**
     * Handles value changes, via change event or programmatic updates.
     */
    MDCSelectFoundation.prototype.handleChange = function (didChange) {
        if (didChange === void 0) { didChange = true; }
        var value = this.getValue();
        var optionHasValue = value.length > 0;
        var isRequired = this.adapter_.hasClass(cssClasses$6.REQUIRED);
        this.notchOutline(optionHasValue);
        if (!this.adapter_.hasClass(cssClasses$6.FOCUSED)) {
            this.adapter_.floatLabel(optionHasValue);
        }
        if (didChange) {
            this.adapter_.notifyChange(value);
            if (isRequired) {
                this.setValid(this.isValid());
                if (this.helperText_) {
                    this.helperText_.setValidity(this.isValid());
                }
            }
        }
    };
    /**
     * Handles focus events from select element.
     */
    MDCSelectFoundation.prototype.handleFocus = function () {
        this.adapter_.addClass(cssClasses$6.FOCUSED);
        this.adapter_.floatLabel(true);
        this.notchOutline(true);
        this.adapter_.activateBottomLine();
        if (this.helperText_) {
            this.helperText_.showToScreenReader();
        }
    };
    /**
     * Handles blur events from select element.
     */
    MDCSelectFoundation.prototype.handleBlur = function () {
        if (this.adapter_.isMenuOpen()) {
            return;
        }
        this.adapter_.removeClass(cssClasses$6.FOCUSED);
        this.handleChange(false);
        this.adapter_.deactivateBottomLine();
        var isRequired = this.adapter_.hasClass(cssClasses$6.REQUIRED);
        if (isRequired) {
            this.setValid(this.isValid());
            if (this.helperText_) {
                this.helperText_.setValidity(this.isValid());
            }
        }
    };
    MDCSelectFoundation.prototype.handleClick = function (normalizedX) {
        if (this.adapter_.isMenuOpen()) {
            return;
        }
        this.adapter_.setRippleCenter(normalizedX);
        this.adapter_.openMenu();
    };
    MDCSelectFoundation.prototype.handleKeydown = function (event) {
        if (this.adapter_.isMenuOpen()) {
            return;
        }
        var isEnter = event.key === 'Enter' || event.keyCode === 13;
        var isSpace = event.key === 'Space' || event.keyCode === 32;
        var arrowUp = event.key === 'ArrowUp' || event.keyCode === 38;
        var arrowDown = event.key === 'ArrowDown' || event.keyCode === 40;
        if (this.adapter_.hasClass(cssClasses$6.FOCUSED) && (isEnter || isSpace || arrowUp || arrowDown)) {
            this.adapter_.openMenu();
            event.preventDefault();
        }
    };
    /**
     * Opens/closes the notched outline.
     */
    MDCSelectFoundation.prototype.notchOutline = function (openNotch) {
        if (!this.adapter_.hasOutline()) {
            return;
        }
        var isFocused = this.adapter_.hasClass(cssClasses$6.FOCUSED);
        if (openNotch) {
            var labelScale = numbers$3.LABEL_SCALE;
            var labelWidth = this.adapter_.getLabelWidth() * labelScale;
            this.adapter_.notchOutline(labelWidth);
        }
        else if (!isFocused) {
            this.adapter_.closeOutline();
        }
    };
    /**
     * Sets the aria label of the leading icon.
     */
    MDCSelectFoundation.prototype.setLeadingIconAriaLabel = function (label) {
        if (this.leadingIcon_) {
            this.leadingIcon_.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the leading icon.
     */
    MDCSelectFoundation.prototype.setLeadingIconContent = function (content) {
        if (this.leadingIcon_) {
            this.leadingIcon_.setContent(content);
        }
    };
    MDCSelectFoundation.prototype.setValid = function (isValid) {
        this.adapter_.setValid(isValid);
    };
    MDCSelectFoundation.prototype.isValid = function () {
        return this.adapter_.checkValidity();
    };
    return MDCSelectFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$5 = {
    ARIA_HIDDEN: 'aria-hidden',
    ROLE: 'role',
};
var cssClasses$7 = {
    HELPER_TEXT_PERSISTENT: 'mdc-select-helper-text--persistent',
    HELPER_TEXT_VALIDATION_MSG: 'mdc-select-helper-text--validation-msg',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCSelectHelperTextFoundation = /** @class */ (function (_super) {
    __extends(MDCSelectHelperTextFoundation, _super);
    function MDCSelectHelperTextFoundation(adapter) {
        return _super.call(this, __assign({}, MDCSelectHelperTextFoundation.defaultAdapter, adapter)) || this;
    }
    Object.defineProperty(MDCSelectHelperTextFoundation, "cssClasses", {
        get: function () {
            return cssClasses$7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "strings", {
        get: function () {
            return strings$5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectHelperTextFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectHelperTextAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                setAttr: function () { return undefined; },
                removeAttr: function () { return undefined; },
                setContent: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the content of the helper text field.
     */
    MDCSelectHelperTextFoundation.prototype.setContent = function (content) {
        this.adapter_.setContent(content);
    };
    /**
     *  Sets the persistency of the helper text.
     */
    MDCSelectHelperTextFoundation.prototype.setPersistent = function (isPersistent) {
        if (isPersistent) {
            this.adapter_.addClass(cssClasses$7.HELPER_TEXT_PERSISTENT);
        }
        else {
            this.adapter_.removeClass(cssClasses$7.HELPER_TEXT_PERSISTENT);
        }
    };
    /**
     * @param isValidation True to make the helper text act as an error validation message.
     */
    MDCSelectHelperTextFoundation.prototype.setValidation = function (isValidation) {
        if (isValidation) {
            this.adapter_.addClass(cssClasses$7.HELPER_TEXT_VALIDATION_MSG);
        }
        else {
            this.adapter_.removeClass(cssClasses$7.HELPER_TEXT_VALIDATION_MSG);
        }
    };
    /**
     * Makes the helper text visible to screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.showToScreenReader = function () {
        this.adapter_.removeAttr(strings$5.ARIA_HIDDEN);
    };
    /**
     * Sets the validity of the helper text based on the select validity.
     */
    MDCSelectHelperTextFoundation.prototype.setValidity = function (selectIsValid) {
        var helperTextIsPersistent = this.adapter_.hasClass(cssClasses$7.HELPER_TEXT_PERSISTENT);
        var helperTextIsValidationMsg = this.adapter_.hasClass(cssClasses$7.HELPER_TEXT_VALIDATION_MSG);
        var validationMsgNeedsDisplay = helperTextIsValidationMsg && !selectIsValid;
        if (validationMsgNeedsDisplay) {
            this.adapter_.setAttr(strings$5.ROLE, 'alert');
        }
        else {
            this.adapter_.removeAttr(strings$5.ROLE);
        }
        if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {
            this.hide_();
        }
    };
    /**
     * Hides the help text from screen readers.
     */
    MDCSelectHelperTextFoundation.prototype.hide_ = function () {
        this.adapter_.setAttr(strings$5.ARIA_HIDDEN, 'true');
    };
    return MDCSelectHelperTextFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCSelectHelperText = /** @class */ (function (_super) {
    __extends(MDCSelectHelperText, _super);
    function MDCSelectHelperText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelectHelperText.attachTo = function (root) {
        return new MDCSelectHelperText(root);
    };
    Object.defineProperty(MDCSelectHelperText.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectHelperText.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setAttr: function (attr, value) { return _this.root_.setAttribute(attr, value); },
            removeAttr: function (attr) { return _this.root_.removeAttribute(attr); },
            setContent: function (content) {
                _this.root_.textContent = content;
            },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCSelectHelperTextFoundation(adapter);
    };
    return MDCSelectHelperText;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$6 = {
    ICON_EVENT: 'MDCSelect:icon',
    ICON_ROLE: 'button',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var INTERACTION_EVENTS = ['click', 'keydown'];
var MDCSelectIconFoundation = /** @class */ (function (_super) {
    __extends(MDCSelectIconFoundation, _super);
    function MDCSelectIconFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCSelectIconFoundation.defaultAdapter, adapter)) || this;
        _this.savedTabIndex_ = null;
        _this.interactionHandler_ = function (evt) { return _this.handleInteraction(evt); };
        return _this;
    }
    Object.defineProperty(MDCSelectIconFoundation, "strings", {
        get: function () {
            return strings$6;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelectIconFoundation, "defaultAdapter", {
        /**
         * See {@link MDCSelectIconAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                getAttr: function () { return null; },
                setAttr: function () { return undefined; },
                removeAttr: function () { return undefined; },
                setContent: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                notifyIconAction: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectIconFoundation.prototype.init = function () {
        var _this = this;
        this.savedTabIndex_ = this.adapter_.getAttr('tabindex');
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.adapter_.registerInteractionHandler(evtType, _this.interactionHandler_);
        });
    };
    MDCSelectIconFoundation.prototype.destroy = function () {
        var _this = this;
        INTERACTION_EVENTS.forEach(function (evtType) {
            _this.adapter_.deregisterInteractionHandler(evtType, _this.interactionHandler_);
        });
    };
    MDCSelectIconFoundation.prototype.setDisabled = function (disabled) {
        if (!this.savedTabIndex_) {
            return;
        }
        if (disabled) {
            this.adapter_.setAttr('tabindex', '-1');
            this.adapter_.removeAttr('role');
        }
        else {
            this.adapter_.setAttr('tabindex', this.savedTabIndex_);
            this.adapter_.setAttr('role', strings$6.ICON_ROLE);
        }
    };
    MDCSelectIconFoundation.prototype.setAriaLabel = function (label) {
        this.adapter_.setAttr('aria-label', label);
    };
    MDCSelectIconFoundation.prototype.setContent = function (content) {
        this.adapter_.setContent(content);
    };
    MDCSelectIconFoundation.prototype.handleInteraction = function (evt) {
        var isEnterKey = evt.key === 'Enter' || evt.keyCode === 13;
        if (evt.type === 'click' || isEnterKey) {
            this.adapter_.notifyIconAction();
        }
    };
    return MDCSelectIconFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCSelectIcon = /** @class */ (function (_super) {
    __extends(MDCSelectIcon, _super);
    function MDCSelectIcon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelectIcon.attachTo = function (root) {
        return new MDCSelectIcon(root);
    };
    Object.defineProperty(MDCSelectIcon.prototype, "foundation", {
        get: function () {
            return this.foundation_;
        },
        enumerable: true,
        configurable: true
    });
    MDCSelectIcon.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            getAttr: function (attr) { return _this.root_.getAttribute(attr); },
            setAttr: function (attr, value) { return _this.root_.setAttribute(attr, value); },
            removeAttr: function (attr) { return _this.root_.removeAttribute(attr); },
            setContent: function (content) {
                _this.root_.textContent = content;
            },
            registerInteractionHandler: function (evtType, handler) { return _this.listen(evtType, handler); },
            deregisterInteractionHandler: function (evtType, handler) { return _this.unlisten(evtType, handler); },
            notifyIconAction: function () { return _this.emit(MDCSelectIconFoundation.strings.ICON_EVENT, {} /* evtData */, true /* shouldBubble */); },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCSelectIconFoundation(adapter);
    };
    return MDCSelectIcon;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var POINTER_EVENTS = ['mousedown', 'touchstart'];
var VALIDATION_ATTR_WHITELIST = ['required', 'aria-required'];
var MDCSelect = /** @class */ (function (_super) {
    __extends(MDCSelect, _super);
    function MDCSelect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSelect.attachTo = function (root) {
        return new MDCSelect(root);
    };
    MDCSelect.prototype.initialize = function (labelFactory, lineRippleFactory, outlineFactory, menuFactory, iconFactory, helperTextFactory) {
        if (labelFactory === void 0) { labelFactory = function (el) { return new MDCFloatingLabel(el); }; }
        if (lineRippleFactory === void 0) { lineRippleFactory = function (el) { return new MDCLineRipple(el); }; }
        if (outlineFactory === void 0) { outlineFactory = function (el) { return new MDCNotchedOutline(el); }; }
        if (menuFactory === void 0) { menuFactory = function (el) { return new MDCMenu(el); }; }
        if (iconFactory === void 0) { iconFactory = function (el) { return new MDCSelectIcon(el); }; }
        if (helperTextFactory === void 0) { helperTextFactory = function (el) { return new MDCSelectHelperText(el); }; }
        this.isMenuOpen_ = false;
        this.nativeControl_ = this.root_.querySelector(strings$4.NATIVE_CONTROL_SELECTOR);
        this.selectedText_ = this.root_.querySelector(strings$4.SELECTED_TEXT_SELECTOR);
        var targetElement = this.nativeControl_ || this.selectedText_;
        if (!targetElement) {
            throw new Error('MDCSelect: Missing required element: Exactly one of the following selectors must be present: ' +
                ("'" + strings$4.NATIVE_CONTROL_SELECTOR + "' or '" + strings$4.SELECTED_TEXT_SELECTOR + "'"));
        }
        this.targetElement_ = targetElement;
        if (this.targetElement_.hasAttribute(strings$4.ARIA_CONTROLS)) {
            var helperTextElement = document.getElementById(this.targetElement_.getAttribute(strings$4.ARIA_CONTROLS));
            if (helperTextElement) {
                this.helperText_ = helperTextFactory(helperTextElement);
            }
        }
        if (this.selectedText_) {
            this.enhancedSelectSetup_(menuFactory);
        }
        var labelElement = this.root_.querySelector(strings$4.LABEL_SELECTOR);
        this.label_ = labelElement ? labelFactory(labelElement) : null;
        var lineRippleElement = this.root_.querySelector(strings$4.LINE_RIPPLE_SELECTOR);
        this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;
        var outlineElement = this.root_.querySelector(strings$4.OUTLINE_SELECTOR);
        this.outline_ = outlineElement ? outlineFactory(outlineElement) : null;
        var leadingIcon = this.root_.querySelector(strings$4.LEADING_ICON_SELECTOR);
        if (leadingIcon) {
            this.root_.classList.add(cssClasses$6.WITH_LEADING_ICON);
            this.leadingIcon_ = iconFactory(leadingIcon);
            if (this.menuElement_) {
                this.menuElement_.classList.add(cssClasses$6.WITH_LEADING_ICON);
            }
        }
        if (!this.root_.classList.contains(cssClasses$6.OUTLINED)) {
            this.ripple = this.createRipple_();
        }
        // The required state needs to be sync'd before the mutation observer is added.
        this.initialSyncRequiredState_();
        this.addMutationObserverForRequired_();
    };
    /**
     * Initializes the select's event listeners and internal state based
     * on the environment's state.
     */
    MDCSelect.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.handleChange_ = function () { return _this.foundation_.handleChange(/* didChange */ true); };
        this.handleFocus_ = function () { return _this.foundation_.handleFocus(); };
        this.handleBlur_ = function () { return _this.foundation_.handleBlur(); };
        this.handleClick_ = function (evt) {
            if (_this.selectedText_) {
                _this.selectedText_.focus();
            }
            _this.foundation_.handleClick(_this.getNormalizedXCoordinate_(evt));
        };
        this.handleKeydown_ = function (evt) { return _this.foundation_.handleKeydown(evt); };
        this.handleMenuSelected_ = function (evtData) { return _this.selectedIndex = evtData.detail.index; };
        this.handleMenuOpened_ = function () {
            // Menu should open to the last selected element.
            if (_this.selectedIndex >= 0) {
                var selectedItemEl = _this.menu_.items[_this.selectedIndex];
                selectedItemEl.focus();
            }
        };
        this.handleMenuClosed_ = function () {
            // isMenuOpen_ is used to track the state of the menu opening or closing since the menu.open function
            // will return false if the menu is still closing and this method listens to the closed event which
            // occurs after the menu is already closed.
            _this.isMenuOpen_ = false;
            _this.selectedText_.removeAttribute('aria-expanded');
            if (document.activeElement !== _this.selectedText_) {
                _this.foundation_.handleBlur();
            }
        };
        this.targetElement_.addEventListener('change', this.handleChange_);
        this.targetElement_.addEventListener('focus', this.handleFocus_);
        this.targetElement_.addEventListener('blur', this.handleBlur_);
        POINTER_EVENTS.forEach(function (evtType) {
            _this.targetElement_.addEventListener(evtType, _this.handleClick_);
        });
        if (this.menuElement_) {
            this.selectedText_.addEventListener('keydown', this.handleKeydown_);
            this.menu_.listen(strings.CLOSED_EVENT, this.handleMenuClosed_);
            this.menu_.listen(strings.OPENED_EVENT, this.handleMenuOpened_);
            this.menu_.listen(strings$1.SELECTED_EVENT, this.handleMenuSelected_);
            if (this.hiddenInput_ && this.hiddenInput_.value) {
                // If the hidden input already has a value, use it to restore the select's value.
                // This can happen e.g. if the user goes back or (in some browsers) refreshes the page.
                var enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
                enhancedAdapterMethods.setValue(this.hiddenInput_.value);
            }
            else if (this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR)) {
                // If an element is selected, the select should set the initial selected text.
                var enhancedAdapterMethods = this.getEnhancedSelectAdapterMethods_();
                enhancedAdapterMethods.setValue(enhancedAdapterMethods.getValue());
            }
        }
        // Initially sync floating label
        this.foundation_.handleChange(/* didChange */ false);
        if (this.root_.classList.contains(cssClasses$6.DISABLED)
            || (this.nativeControl_ && this.nativeControl_.disabled)) {
            this.disabled = true;
        }
    };
    MDCSelect.prototype.destroy = function () {
        var _this = this;
        this.targetElement_.removeEventListener('change', this.handleChange_);
        this.targetElement_.removeEventListener('focus', this.handleFocus_);
        this.targetElement_.removeEventListener('blur', this.handleBlur_);
        this.targetElement_.removeEventListener('keydown', this.handleKeydown_);
        POINTER_EVENTS.forEach(function (evtType) {
            _this.targetElement_.removeEventListener(evtType, _this.handleClick_);
        });
        if (this.menu_) {
            this.menu_.unlisten(strings.CLOSED_EVENT, this.handleMenuClosed_);
            this.menu_.unlisten(strings.OPENED_EVENT, this.handleMenuOpened_);
            this.menu_.unlisten(strings$1.SELECTED_EVENT, this.handleMenuSelected_);
            this.menu_.destroy();
        }
        if (this.ripple) {
            this.ripple.destroy();
        }
        if (this.outline_) {
            this.outline_.destroy();
        }
        if (this.leadingIcon_) {
            this.leadingIcon_.destroy();
        }
        if (this.helperText_) {
            this.helperText_.destroy();
        }
        if (this.validationObserver_) {
            this.validationObserver_.disconnect();
        }
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCSelect.prototype, "value", {
        get: function () {
            return this.foundation_.getValue();
        },
        set: function (value) {
            this.foundation_.setValue(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "selectedIndex", {
        get: function () {
            var selectedIndex = -1;
            if (this.menuElement_ && this.menu_) {
                var selectedEl = this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR);
                selectedIndex = this.menu_.items.indexOf(selectedEl);
            }
            else if (this.nativeControl_) {
                selectedIndex = this.nativeControl_.selectedIndex;
            }
            return selectedIndex;
        },
        set: function (selectedIndex) {
            this.foundation_.setSelectedIndex(selectedIndex);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "disabled", {
        get: function () {
            return this.root_.classList.contains(cssClasses$6.DISABLED) ||
                (this.nativeControl_ ? this.nativeControl_.disabled : false);
        },
        set: function (disabled) {
            this.foundation_.setDisabled(disabled);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "leadingIconAriaLabel", {
        set: function (label) {
            this.foundation_.setLeadingIconAriaLabel(label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "leadingIconContent", {
        /**
         * Sets the text content of the leading icon.
         */
        set: function (content) {
            this.foundation_.setLeadingIconContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "helperTextContent", {
        /**
         * Sets the text content of the helper text.
         */
        set: function (content) {
            this.foundation_.setHelperTextContent(content);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "valid", {
        /**
         * Checks if the select is in a valid state.
         */
        get: function () {
            return this.foundation_.isValid();
        },
        /**
         * Sets the current invalid state of the select.
         */
        set: function (isValid) {
            this.foundation_.setValid(isValid);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSelect.prototype, "required", {
        /**
         * Returns whether the select is required.
         */
        get: function () {
            if (this.nativeControl_) {
                return this.nativeControl_.required;
            }
            else {
                return this.selectedText_.getAttribute('aria-required') === 'true';
            }
        },
        /**
         * Sets the control to the required state.
         */
        set: function (isRequired) {
            if (this.nativeControl_) {
                this.nativeControl_.required = isRequired;
            }
            else {
                if (isRequired) {
                    this.selectedText_.setAttribute('aria-required', isRequired.toString());
                }
                else {
                    this.selectedText_.removeAttribute('aria-required');
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Recomputes the outline SVG path for the outline element.
     */
    MDCSelect.prototype.layout = function () {
        this.foundation_.layout();
    };
    MDCSelect.prototype.getDefaultFoundation = function () {
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = __assign({}, (this.nativeControl_ ? this.getNativeSelectAdapterMethods_() : this.getEnhancedSelectAdapterMethods_()), this.getCommonAdapterMethods_(), this.getOutlineAdapterMethods_(), this.getLabelAdapterMethods_());
        return new MDCSelectFoundation(adapter, this.getFoundationMap_());
    };
    /**
     * Handles setup for the enhanced menu.
     */
    MDCSelect.prototype.enhancedSelectSetup_ = function (menuFactory) {
        var isDisabled = this.root_.classList.contains(cssClasses$6.DISABLED);
        this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this.hiddenInput_ = this.root_.querySelector(strings$4.HIDDEN_INPUT_SELECTOR);
        this.menuElement_ = this.root_.querySelector(strings$4.MENU_SELECTOR);
        this.menu_ = menuFactory(this.menuElement_);
        this.menu_.hoistMenuToBody();
        this.menu_.setAnchorElement(this.root_);
        this.menu_.setAnchorCorner(Corner.BOTTOM_START);
        this.menu_.wrapFocus = false;
    };
    MDCSelect.prototype.createRipple_ = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = __assign({}, MDCRipple.createAdapter(this), { registerInteractionHandler: function (evtType, handler) { return _this.targetElement_.addEventListener(evtType, handler); }, deregisterInteractionHandler: function (evtType, handler) { return _this.targetElement_.removeEventListener(evtType, handler); } });
        // tslint:enable:object-literal-sort-keys
        return new MDCRipple(this.root_, new MDCRippleFoundation(adapter));
    };
    MDCSelect.prototype.getNativeSelectAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            getValue: function () { return _this.nativeControl_.value; },
            setValue: function (value) {
                _this.nativeControl_.value = value;
            },
            openMenu: function () { return undefined; },
            closeMenu: function () { return undefined; },
            isMenuOpen: function () { return false; },
            setSelectedIndex: function (index) {
                _this.nativeControl_.selectedIndex = index;
            },
            setDisabled: function (isDisabled) {
                _this.nativeControl_.disabled = isDisabled;
            },
            setValid: function (isValid) {
                if (isValid) {
                    _this.root_.classList.remove(cssClasses$6.INVALID);
                }
                else {
                    _this.root_.classList.add(cssClasses$6.INVALID);
                }
            },
            checkValidity: function () { return _this.nativeControl_.checkValidity(); },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getEnhancedSelectAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            getValue: function () {
                var listItem = _this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR);
                if (listItem && listItem.hasAttribute(strings$4.ENHANCED_VALUE_ATTR)) {
                    return listItem.getAttribute(strings$4.ENHANCED_VALUE_ATTR) || '';
                }
                return '';
            },
            setValue: function (value) {
                var element = _this.menuElement_.querySelector("[" + strings$4.ENHANCED_VALUE_ATTR + "=\"" + value + "\"]");
                _this.setEnhancedSelectedIndex_(element ? _this.menu_.items.indexOf(element) : -1);
            },
            openMenu: function () {
                if (_this.menu_ && !_this.menu_.open) {
                    _this.menu_.open = true;
                    _this.isMenuOpen_ = true;
                    _this.selectedText_.setAttribute('aria-expanded', 'true');
                }
            },
            closeMenu: function () {
                if (_this.menu_ && _this.menu_.open) {
                    _this.menu_.open = false;
                }
            },
            isMenuOpen: function () { return Boolean(_this.menu_) && _this.isMenuOpen_; },
            setSelectedIndex: function (index) { return _this.setEnhancedSelectedIndex_(index); },
            setDisabled: function (isDisabled) {
                _this.selectedText_.setAttribute('tabindex', isDisabled ? '-1' : '0');
                _this.selectedText_.setAttribute('aria-disabled', isDisabled.toString());
                if (_this.hiddenInput_) {
                    _this.hiddenInput_.disabled = isDisabled;
                }
            },
            checkValidity: function () {
                var classList = _this.root_.classList;
                if (classList.contains(cssClasses$6.REQUIRED) && !classList.contains(cssClasses$6.DISABLED)) {
                    // See notes for required attribute under https://www.w3.org/TR/html52/sec-forms.html#the-select-element
                    // TL;DR: Invalid if no index is selected, or if the first index is selected and has an empty value.
                    return _this.selectedIndex !== -1 && (_this.selectedIndex !== 0 || Boolean(_this.value));
                }
                else {
                    return true;
                }
            },
            setValid: function (isValid) {
                _this.selectedText_.setAttribute('aria-invalid', (!isValid).toString());
                if (isValid) {
                    _this.root_.classList.remove(cssClasses$6.INVALID);
                }
                else {
                    _this.root_.classList.add(cssClasses$6.INVALID);
                }
            },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getCommonAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            setRippleCenter: function (normalizedX) { return _this.lineRipple_ && _this.lineRipple_.setRippleCenter(normalizedX); },
            activateBottomLine: function () { return _this.lineRipple_ && _this.lineRipple_.activate(); },
            deactivateBottomLine: function () { return _this.lineRipple_ && _this.lineRipple_.deactivate(); },
            notifyChange: function (value) {
                var index = _this.selectedIndex;
                _this.emit(strings$4.CHANGE_EVENT, { value: value, index: index }, true /* shouldBubble  */);
            },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getOutlineAdapterMethods_ = function () {
        var _this = this;
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        return {
            hasOutline: function () { return Boolean(_this.outline_); },
            notchOutline: function (labelWidth) { return _this.outline_ && _this.outline_.notch(labelWidth); },
            closeOutline: function () { return _this.outline_ && _this.outline_.closeNotch(); },
        };
        // tslint:enable:object-literal-sort-keys
    };
    MDCSelect.prototype.getLabelAdapterMethods_ = function () {
        var _this = this;
        return {
            floatLabel: function (shouldFloat) { return _this.label_ && _this.label_.float(shouldFloat); },
            getLabelWidth: function () { return _this.label_ ? _this.label_.getWidth() : 0; },
        };
    };
    /**
     * Calculates where the line ripple should start based on the x coordinate within the component.
     */
    MDCSelect.prototype.getNormalizedXCoordinate_ = function (evt) {
        var targetClientRect = evt.target.getBoundingClientRect();
        var xCoordinate = this.isTouchEvent_(evt) ? evt.touches[0].clientX : evt.clientX;
        return xCoordinate - targetClientRect.left;
    };
    MDCSelect.prototype.isTouchEvent_ = function (evt) {
        return Boolean(evt.touches);
    };
    /**
     * Returns a map of all subcomponents to subfoundations.
     */
    MDCSelect.prototype.getFoundationMap_ = function () {
        return {
            helperText: this.helperText_ ? this.helperText_.foundation : undefined,
            leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,
        };
    };
    MDCSelect.prototype.setEnhancedSelectedIndex_ = function (index) {
        var selectedItem = this.menu_.items[index];
        this.selectedText_.textContent = selectedItem ? selectedItem.textContent.trim() : '';
        var previouslySelected = this.menuElement_.querySelector(strings$4.SELECTED_ITEM_SELECTOR);
        if (previouslySelected) {
            previouslySelected.classList.remove(cssClasses$6.SELECTED_ITEM_CLASS);
            previouslySelected.removeAttribute(strings$4.ARIA_SELECTED_ATTR);
        }
        if (selectedItem) {
            selectedItem.classList.add(cssClasses$6.SELECTED_ITEM_CLASS);
            selectedItem.setAttribute(strings$4.ARIA_SELECTED_ATTR, 'true');
        }
        // Synchronize hidden input's value with data-value attribute of selected item.
        // This code path is also followed when setting value directly, so this covers all cases.
        if (this.hiddenInput_) {
            this.hiddenInput_.value = selectedItem ? selectedItem.getAttribute(strings$4.ENHANCED_VALUE_ATTR) || '' : '';
        }
        this.layout();
    };
    MDCSelect.prototype.initialSyncRequiredState_ = function () {
        var isRequired = this.targetElement_.required
            || this.targetElement_.getAttribute('aria-required') === 'true'
            || this.root_.classList.contains(cssClasses$6.REQUIRED);
        if (isRequired) {
            if (this.nativeControl_) {
                this.nativeControl_.required = true;
            }
            else {
                this.selectedText_.setAttribute('aria-required', 'true');
            }
            this.root_.classList.add(cssClasses$6.REQUIRED);
        }
    };
    MDCSelect.prototype.addMutationObserverForRequired_ = function () {
        var _this = this;
        var observerHandler = function (attributesList) {
            attributesList.some(function (attributeName) {
                if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) === -1) {
                    return false;
                }
                if (_this.selectedText_) {
                    if (_this.selectedText_.getAttribute('aria-required') === 'true') {
                        _this.root_.classList.add(cssClasses$6.REQUIRED);
                    }
                    else {
                        _this.root_.classList.remove(cssClasses$6.REQUIRED);
                    }
                }
                else {
                    if (_this.nativeControl_.required) {
                        _this.root_.classList.add(cssClasses$6.REQUIRED);
                    }
                    else {
                        _this.root_.classList.remove(cssClasses$6.REQUIRED);
                    }
                }
                return true;
            });
        };
        var getAttributesList = function (mutationsList) {
            return mutationsList
                .map(function (mutation) { return mutation.attributeName; })
                .filter(function (attributeName) { return attributeName; });
        };
        var observer = new MutationObserver(function (mutationsList) { return observerHandler(getAttributesList(mutationsList)); });
        observer.observe(this.targetElement_, { attributes: true });
        this.validationObserver_ = observer;
    };
    return MDCSelect;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class DemoSelectComponent {
    componentDidLoad() {
        const rootEl = this.el.shadowRoot.querySelector('.mdc-select');
        this.select = new MDCSelect(rootEl);
        this.select.selectedIndex = sessionStorage.getItem('o-demo-key') <= this.options.length ? sessionStorage.getItem('o-demo-key') : 0;
        this.emitChange();
        this.select.listen('change', () => {
            this.emitChange();
        });
    }
    emitChange() {
        document.title = this.options[this.select.selectedIndex];
        sessionStorage.setItem('o-demo-key', this.select.selectedIndex);
        this.selectedCaseChanged.emit(this.select.selectedIndex);
    }
    componentDidUnload() {
        this.select.destroy();
    }
    render() {
        return (h("div", { class: "mdc-select" },
            h("select", { class: "mdc-select__native-control" }, this.options.map((option, index) => (h("option", { value: index, id: index, role: "option", tabindex: "0" }, option)))),
            h("label", { class: "mdc-floating-label" }, "Select Demo:"),
            h("div", { class: "mdc-line-ripple" })));
    }
    static get is() { return "o-demo-bar-select"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "options": {
            "type": "Any",
            "attr": "options"
        }
    }; }
    static get events() { return [{
            "name": "selectedCaseChanged",
            "method": "selectedCaseChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "\@-webkit-keyframes mdc-select-float-native-control{0%{-webkit-transform:translateY(8px);transform:translateY(8px);opacity:0}to{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}\@keyframes mdc-select-float-native-control{0%{-webkit-transform:translateY(8px);transform:translateY(8px);opacity:0}to{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}.mdc-line-ripple{position:absolute;bottom:0;left:0;width:100%;height:2px;-webkit-transform:scaleX(0);transform:scaleX(0);-webkit-transition:opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);transition:opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1);transition:transform .18s cubic-bezier(.4,0,.2,1),opacity .18s cubic-bezier(.4,0,.2,1),-webkit-transform .18s cubic-bezier(.4,0,.2,1);opacity:0;z-index:2}.mdc-line-ripple--active{-webkit-transform:scaleX(1);transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating{opacity:0}.mdc-notched-outline{display:-ms-flexbox;display:flex;position:absolute;right:0;left:0;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}.mdc-notched-outline[dir=rtl],[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;-webkit-transition:border .15s cubic-bezier(.4,0,.2,1);transition:border .15s cubic-bezier(.4,0,.2,1);border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}.mdc-notched-outline__leading[dir=rtl],.mdc-notched-outline__trailing,[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{-ms-flex-positive:1;flex-grow:1}.mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{-ms-flex:0 0 auto;flex:0 0 auto;width:auto;max-width:calc(100% - 24px)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:133.33333%}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl],[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{padding:0}.mdc-floating-label{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1rem;line-height:1.75rem;font-weight:400;letter-spacing:.00937em;text-decoration:inherit;text-transform:inherit;position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;-webkit-transition:color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);transition:color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);transition:transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1);transition:transform .15s cubic-bezier(.4,0,.2,1),color .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform}.mdc-floating-label[dir=rtl],[dir=rtl] .mdc-floating-label{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto;-webkit-transform:translateY(-50%) scale(.75);transform:translateY(-50%) scale(.75)}.mdc-floating-label--shake{-webkit-animation:mdc-floating-label-shake-float-above-standard .25s 1;animation:mdc-floating-label-shake-float-above-standard .25s 1}\@-webkit-keyframes mdc-floating-label-shake-float-above-standard{0%{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(4%) translateY(-50%) scale(.75);transform:translateX(4%) translateY(-50%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(-4%) translateY(-50%) scale(.75);transform:translateX(-4%) translateY(-50%) scale(.75)}to{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}}\@keyframes mdc-floating-label-shake-float-above-standard{0%{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(4%) translateY(-50%) scale(.75);transform:translateX(4%) translateY(-50%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(-4%) translateY(-50%) scale(.75);transform:translateX(-4%) translateY(-50%) scale(.75)}to{-webkit-transform:translateX(0) translateY(-50%) scale(.75);transform:translateX(0) translateY(-50%) scale(.75)}}\@-webkit-keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}\@keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}\@-webkit-keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}\@keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}\@-webkit-keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}\@keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var:1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug:before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-select--with-leading-icon:not(.mdc-select--disabled) .mdc-select__icon{color:#000;color:var(--mdc-theme-on-surface,#000)}.mdc-select--with-leading-icon .mdc-select__icon{display:inline-block;position:absolute;bottom:16px;-webkit-box-sizing:border-box;box-sizing:border-box;width:24px;height:24px;border:none;background-color:transparent;fill:currentColor;opacity:.54;text-decoration:none;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.mdc-select__icon:not([tabindex]),.mdc-select__icon[tabindex=\"-1\"]{cursor:default;pointer-events:none}.mdc-select-helper-text{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.75rem;line-height:1.25rem;font-weight:400;letter-spacing:.03333em;text-decoration:inherit;text-transform:inherit;display:block;line-height:normal;margin:0;-webkit-transition:opacity .18s cubic-bezier(.4,0,.2,1);transition:opacity .18s cubic-bezier(.4,0,.2,1);opacity:0;will-change:opacity}.mdc-select-helper-text:before{display:inline-block;width:0;height:16px;content:\"\";vertical-align:0}.mdc-select-helper-text--persistent{-webkit-transition:none;transition:none;opacity:1;will-change:auto}.mdc-select{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;display:-ms-inline-flexbox;display:inline-flex;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;height:56px;overflow:hidden;will-change:opacity,transform,color}.mdc-select:not(.mdc-select--disabled){background-color:#f5f5f5}.mdc-select:after,.mdc-select:before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\"}.mdc-select:before{-webkit-transition:opacity 15ms linear,background-color 15ms linear;transition:opacity 15ms linear,background-color 15ms linear;z-index:1}.mdc-select.mdc-ripple-upgraded:before{-webkit-transform:scale(var(--mdc-ripple-fg-scale,1));transform:scale(var(--mdc-ripple-fg-scale,1))}.mdc-select.mdc-ripple-upgraded:after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-select.mdc-ripple-upgraded--unbounded:after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-select.mdc-ripple-upgraded--foreground-activation:after{-webkit-animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-select.mdc-ripple-upgraded--foreground-deactivation:after{-webkit-animation:mdc-ripple-fg-opacity-out .15s;animation:mdc-ripple-fg-opacity-out .15s;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-select:after,.mdc-select:before{top:-50%;left:-50%;width:200%;height:200%}.mdc-select.mdc-ripple-upgraded:after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-select:after,.mdc-select:before{background-color:rgba(0,0,0,.87)}.mdc-select:hover:before{opacity:.04}.mdc-select.mdc-ripple-upgraded--background-focused:before,.mdc-select:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0,0,0,.87)}.mdc-select:not(.mdc-select--disabled) .mdc-floating-label{color:rgba(0,0,0,.6)}.mdc-select:not(.mdc-select--disabled) .mdc-select__native-control,.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{border-bottom-color:rgba(0,0,0,.42)}.mdc-select:not(.mdc-select--disabled)+.mdc-select-helper-text{color:rgba(0,0,0,.6)}.mdc-select,.mdc-select__native-control{border-radius:4px 4px 0 0}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple{background-color:#6200ee;background-color:var(--mdc-theme-primary,#6200ee)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:rgba(98,0,238,.87)}.mdc-select:not(.mdc-select--disabled) .mdc-select__native-control:hover{border-bottom-color:rgba(0,0,0,.87)}.mdc-select .mdc-floating-label--float-above{-webkit-transform:translateY(-70%) scale(.75);transform:translateY(-70%) scale(.75)}.mdc-select .mdc-floating-label{left:16px;right:auto;top:21px;pointer-events:none}.mdc-select .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select .mdc-floating-label{left:auto;right:16px}.mdc-select.mdc-select--with-leading-icon .mdc-floating-label{left:48px;right:auto}.mdc-select.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-floating-label{left:auto;right:48px}.mdc-select.mdc-select--outlined .mdc-floating-label{left:4px;right:auto;top:17px}.mdc-select.mdc-select--outlined .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select.mdc-select--outlined .mdc-floating-label{left:auto;right:4px}.mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label{left:36px;right:auto}.mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl],[dir=rtl] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label{left:auto;right:36px}.mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{left:36px;right:auto}.mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-select.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{left:auto;right:36px}.mdc-select__dropdown-icon{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' opacity='.54' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\") no-repeat 50%;left:auto;right:8px;position:absolute;bottom:16px;width:24px;height:24px;-webkit-transition:-webkit-transform .15s cubic-bezier(.4,0,.2,1);transition:-webkit-transform .15s cubic-bezier(.4,0,.2,1);transition:transform .15s cubic-bezier(.4,0,.2,1);transition:transform .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1);pointer-events:none}.mdc-select__dropdown-icon[dir=rtl],[dir=rtl] .mdc-select__dropdown-icon{left:8px;right:auto}.mdc-select--focused .mdc-select__dropdown-icon{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236200ee' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\") no-repeat 50%;-webkit-transform:rotate(180deg) translateY(-5px);transform:rotate(180deg) translateY(-5px);-webkit-transition:-webkit-transform .15s cubic-bezier(.4,0,.2,1);transition:-webkit-transform .15s cubic-bezier(.4,0,.2,1);transition:transform .15s cubic-bezier(.4,0,.2,1);transition:transform .15s cubic-bezier(.4,0,.2,1),-webkit-transform .15s cubic-bezier(.4,0,.2,1)}.mdc-select__native-control{padding-top:20px}.mdc-select.mdc-select--focused .mdc-line-ripple:after{-webkit-transform:scaleY(2);transform:scaleY(2);opacity:1}.mdc-select+.mdc-select-helper-text{margin-right:12px;margin-left:12px}.mdc-select--outlined+.mdc-select-helper-text{margin-right:16px;margin-left:16px}.mdc-select--focused+.mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg){opacity:1}.mdc-select__selected-text{min-width:200px;padding-top:22px}.mdc-select__native-control,.mdc-select__selected-text{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1rem;line-height:1.75rem;font-weight:400;letter-spacing:.00937em;text-decoration:inherit;text-transform:inherit;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;height:56px;padding:20px 52px 4px 16px;border:none;border-bottom:1px solid;outline:none;background-color:transparent;color:inherit;white-space:nowrap;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none}.mdc-select__native-control[dir=rtl],.mdc-select__selected-text[dir=rtl],[dir=rtl] .mdc-select__native-control,[dir=rtl] .mdc-select__selected-text{padding-left:52px;padding-right:16px}.mdc-select__native-control::-ms-expand,.mdc-select__selected-text::-ms-expand{display:none}.mdc-select__native-control::-ms-value,.mdc-select__selected-text::-ms-value{background-color:transparent;color:inherit}\@-moz-document url-prefix(\"\"){.mdc-select__native-control,.mdc-select__selected-text{text-indent:-2px}}.mdc-select--outlined{border:none;overflow:visible}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:rgba(0,0,0,.24)}.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0,0,0,.87)}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px;border-color:#6200ee;border-color:var(--mdc-theme-primary,#6200ee)}.mdc-select--outlined .mdc-floating-label--shake{-webkit-animation:mdc-floating-label-shake-float-above-text-field-outlined .25s 1;animation:mdc-floating-label-shake-float-above-text-field-outlined .25s 1}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-radius:4px 0 0 4px}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl],.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing,[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-radius:0 4px 4px 0}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl],[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-radius:4px 0 0 4px}.mdc-select--outlined .mdc-select__native-control{border-radius:4px}.mdc-select--outlined:after,.mdc-select--outlined:before{content:none}.mdc-select--outlined:not(.mdc-select--disabled){background-color:transparent}.mdc-select--outlined .mdc-floating-label--float-above{-webkit-transform:translateY(-144%) scale(1);transform:translateY(-144%) scale(1);font-size:.75rem}.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{-webkit-transform:translateY(-130%) scale(.75);transform:translateY(-130%) scale(.75);font-size:1rem}.mdc-select--outlined .mdc-select__native-control,.mdc-select--outlined .mdc-select__selected-text{display:-ms-flexbox;display:flex;padding:12px 52px 12px 16px;border:none;background-color:transparent;z-index:1}.mdc-select--outlined .mdc-select__native-control[dir=rtl],.mdc-select--outlined .mdc-select__selected-text[dir=rtl],[dir=rtl] .mdc-select--outlined .mdc-select__native-control,[dir=rtl] .mdc-select--outlined .mdc-select__selected-text{padding-left:52px;padding-right:16px}.mdc-select--outlined .mdc-select__selected-text{padding-top:14px}.mdc-select--outlined .mdc-select__icon{z-index:2}.mdc-select--outlined .mdc-floating-label{line-height:1.15rem;pointer-events:auto}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control,.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__selected-text{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-line-ripple{background-color:#b00020;background-color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:#b00020}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid+.mdc-select-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__native-control:hover{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__native-control:hover~.mdc-notched-outline .mdc-notched-outline__trailing,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__selected-text:hover~.mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--invalid.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px;border-color:#b00020;border-color:var(--mdc-theme-error,#b00020)}.mdc-select--invalid .mdc-select__dropdown-icon{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23b00020' fill-rule='evenodd' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\") no-repeat 50%}.mdc-select--invalid+.mdc-select-helper-text--validation-msg{opacity:1}.mdc-select--required .mdc-floating-label:after{content:\"*\"}.mdc-select--disabled{background-color:#fafafa;cursor:default;pointer-events:none}.mdc-select--disabled .mdc-floating-label{color:rgba(0,0,0,.37)}.mdc-select--disabled .mdc-select__dropdown-icon{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='5' viewBox='7 10 10 5' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' opacity='.37' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\") no-repeat 50%}.mdc-select--disabled .mdc-line-ripple{display:none}.mdc-select--disabled .mdc-select__icon{color:rgba(0,0,0,.37)}.mdc-select--disabled .mdc-select__native-control,.mdc-select--disabled .mdc-select__selected-text{color:rgba(0,0,0,.37);border-bottom-style:dotted}.mdc-select--disabled .mdc-select__selected-text{pointer-events:none}.mdc-select--disabled.mdc-select--outlined{background-color:transparent}.mdc-select--disabled.mdc-select--outlined .mdc-select__native-control,.mdc-select--disabled.mdc-select--outlined .mdc-select__selected-text{border-bottom-style:none}.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__leading,.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__notch,.mdc-select--disabled.mdc-select--outlined .mdc-notched-outline__trailing{border-color:rgba(0,0,0,.16)}.mdc-select--with-leading-icon .mdc-select__icon{left:16px;right:auto}.mdc-select--with-leading-icon .mdc-select__icon[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon{left:auto;right:16px}.mdc-select--with-leading-icon .mdc-select__native-control,.mdc-select--with-leading-icon .mdc-select__selected-text{padding-left:48px;padding-right:32px}.mdc-select--with-leading-icon .mdc-select__native-control[dir=rtl],.mdc-select--with-leading-icon .mdc-select__selected-text[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon .mdc-select__native-control,[dir=rtl] .mdc-select--with-leading-icon .mdc-select__selected-text{padding-left:32px;padding-right:48px}.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above{-webkit-transform:translateY(-144%) translateX(-32px) scale(1);transform:translateY(-144%) translateX(-32px) scale(1)}.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above{-webkit-transform:translateY(-144%) translateX(32px) scale(1);transform:translateY(-144%) translateX(32px) scale(1)}.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{-webkit-transform:translateY(-130%) translateX(-32px) scale(.75);transform:translateY(-130%) translateX(-32px) scale(.75)}.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{-webkit-transform:translateY(-130%) translateX(32px) scale(.75);transform:translateY(-130%) translateX(32px) scale(.75)}.mdc-select--with-leading-icon.mdc-select--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--with-leading-icon.mdc-select--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake{-webkit-animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon .25s 1;animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon .25s 1}.mdc-select--with-leading-icon.mdc-select--outlined[dir=rtl] .mdc-floating-label--shake,[dir=rtl] .mdc-select--with-leading-icon.mdc-select--outlined .mdc-floating-label--shake{-webkit-animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl .25s 1;animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl .25s 1}.mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text,.mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text[dir=rtl],[dir=rtl] .mdc-select--with-leading-icon.mdc-select__menu .mdc-list-item__text{padding-left:32px;padding-right:32px}.mdc-select__menu .mdc-list .mdc-list-item--selected{color:#000;color:var(--mdc-theme-on-surface,#000)}.mdc-select__menu .mdc-list .mdc-list-item--selected:after,.mdc-select__menu .mdc-list .mdc-list-item--selected:before{background-color:#000}\@supports not (-ms-ime-align:auto){.mdc-select__menu .mdc-list .mdc-list-item--selected:after,.mdc-select__menu .mdc-list .mdc-list-item--selected:before{background-color:var(--mdc-theme-on-surface,#000)}}.mdc-select__menu .mdc-list .mdc-list-item--selected:hover:before{opacity:.04}.mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded--background-focused:before,.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-select__menu .mdc-list .mdc-list-item--selected:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.12}.mdc-select__menu .mdc-list .mdc-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.12}\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon{0%{-webkit-transform:translateX(-32px) translateY(-130%) scale(.75);transform:translateX(-32px) translateY(-130%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(calc(4% - 32px)) translateY(-130%) scale(.75);transform:translateX(calc(4% - 32px)) translateY(-130%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(calc(-4% - 32px)) translateY(-130%) scale(.75);transform:translateX(calc(-4% - 32px)) translateY(-130%) scale(.75)}to{-webkit-transform:translateX(-32px) translateY(-130%) scale(.75);transform:translateX(-32px) translateY(-130%) scale(.75)}}\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon{0%{-webkit-transform:translateX(-32px) translateY(-130%) scale(.75);transform:translateX(-32px) translateY(-130%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(calc(4% - 32px)) translateY(-130%) scale(.75);transform:translateX(calc(4% - 32px)) translateY(-130%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(calc(-4% - 32px)) translateY(-130%) scale(.75);transform:translateX(calc(-4% - 32px)) translateY(-130%) scale(.75)}to{-webkit-transform:translateX(-32px) translateY(-130%) scale(.75);transform:translateX(-32px) translateY(-130%) scale(.75)}}\@-webkit-keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl{0%{-webkit-transform:translateX(32px) translateY(-130%) scale(.75);transform:translateX(32px) translateY(-130%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(calc(4% - -32px)) translateY(-130%) scale(.75);transform:translateX(calc(4% - -32px)) translateY(-130%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(calc(-4% - -32px)) translateY(-130%) scale(.75);transform:translateX(calc(-4% - -32px)) translateY(-130%) scale(.75)}to{-webkit-transform:translateX(32px) translateY(-130%) scale(.75);transform:translateX(32px) translateY(-130%) scale(.75)}}\@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-rtl{0%{-webkit-transform:translateX(32px) translateY(-130%) scale(.75);transform:translateX(32px) translateY(-130%) scale(.75)}33%{-webkit-animation-timing-function:cubic-bezier(.5,0,.70173,.49582);animation-timing-function:cubic-bezier(.5,0,.70173,.49582);-webkit-transform:translateX(calc(4% - -32px)) translateY(-130%) scale(.75);transform:translateX(calc(4% - -32px)) translateY(-130%) scale(.75)}66%{-webkit-animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);animation-timing-function:cubic-bezier(.30244,.38135,.55,.95635);-webkit-transform:translateX(calc(-4% - -32px)) translateY(-130%) scale(.75);transform:translateX(calc(-4% - -32px)) translateY(-130%) scale(.75)}to{-webkit-transform:translateX(32px) translateY(-130%) scale(.75);transform:translateX(32px) translateY(-130%) scale(.75)}}:host{z-index:9999}:host label.mdc-floating-label.mdc-floating-label--float-above{color:grey!important}:host .mdc-floating-label{color:grey}:host .mdc-select{min-width:25em}\@media only screen and (max-width:780px){:host .mdc-select{min-width:20em;width:80%}}"; }
}

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$8 = {
    FIXED: 'mdc-toolbar--fixed',
    FIXED_AT_LAST_ROW: 'mdc-toolbar--fixed-at-last-row',
    FIXED_LASTROW: 'mdc-toolbar--fixed-lastrow-only',
    FLEXIBLE_DEFAULT_BEHAVIOR: 'mdc-toolbar--flexible-default-behavior',
    FLEXIBLE_MAX: 'mdc-toolbar--flexible-space-maximized',
    FLEXIBLE_MIN: 'mdc-toolbar--flexible-space-minimized',
    TOOLBAR_ROW_FLEXIBLE: 'mdc-toolbar--flexible',
};
var strings$7 = {
    CHANGE_EVENT: 'MDCToolbar:change',
    FIRST_ROW_SELECTOR: '.mdc-toolbar__row:first-child',
    ICON_SELECTOR: '.mdc-toolbar__icon',
    TITLE_SELECTOR: '.mdc-toolbar__title',
};
var numbers$4 = {
    MAX_TITLE_SIZE: 2.125,
    MIN_TITLE_SIZE: 1.25,
    TOOLBAR_MOBILE_BREAKPOINT: 600,
    TOOLBAR_ROW_HEIGHT: 64,
    TOOLBAR_ROW_MOBILE_HEIGHT: 56,
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCToolbarFoundation = /** @class */ (function (_super) {
    __extends(MDCToolbarFoundation, _super);
    function MDCToolbarFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCToolbarFoundation.defaultAdapter, adapter)) || this;
        _this.checkRowHeightFrame_ = 0;
        _this.scrollFrame_ = 0;
        _this.executedLastChange_ = false;
        _this.isFixed_ = false;
        _this.isFixedLastRow_ = false;
        _this.hasFlexibleFirstRow_ = false;
        _this.useFlexDefaultBehavior_ = false;
        _this.calculations_ = {
            flexibleExpansionHeight: 0,
            flexibleExpansionRatio: 0,
            maxTranslateYDistance: 0,
            maxTranslateYRatio: 0,
            scrollThreshold: 0,
            scrollThresholdRatio: 0,
            toolbarHeight: 0,
            toolbarRatio: 0,
            toolbarRowHeight: 0,
        };
        return _this;
    }
    Object.defineProperty(MDCToolbarFoundation, "cssClasses", {
        get: function () {
            return cssClasses$8;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCToolbarFoundation, "strings", {
        get: function () {
            return strings$7;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCToolbarFoundation, "numbers", {
        get: function () {
            return numbers$4;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCToolbarFoundation, "defaultAdapter", {
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                hasClass: function () { return false; },
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                registerScrollHandler: function () { return undefined; },
                deregisterScrollHandler: function () { return undefined; },
                registerResizeHandler: function () { return undefined; },
                deregisterResizeHandler: function () { return undefined; },
                getViewportWidth: function () { return 0; },
                getViewportScrollY: function () { return 0; },
                getOffsetHeight: function () { return 0; },
                getFirstRowElementOffsetHeight: function () { return 0; },
                notifyChange: function () { return undefined; },
                setStyle: function () { return undefined; },
                setStyleForTitleElement: function () { return undefined; },
                setStyleForFlexibleRowElement: function () { return undefined; },
                setStyleForFixedAdjustElement: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: true,
        configurable: true
    });
    MDCToolbarFoundation.prototype.init = function () {
        var _this = this;
        this.isFixed_ = this.adapter_.hasClass(cssClasses$8.FIXED);
        this.isFixedLastRow_ = this.adapter_.hasClass(cssClasses$8.FIXED_LASTROW) && this.isFixed_;
        this.hasFlexibleFirstRow_ = this.adapter_.hasClass(cssClasses$8.TOOLBAR_ROW_FLEXIBLE);
        if (this.hasFlexibleFirstRow_) {
            this.useFlexDefaultBehavior_ = this.adapter_.hasClass(cssClasses$8.FLEXIBLE_DEFAULT_BEHAVIOR);
        }
        this.resizeHandler_ = function () { return _this.checkRowHeight_(); };
        this.scrollHandler_ = function () { return _this.updateToolbarStyles_(); };
        this.adapter_.registerResizeHandler(this.resizeHandler_);
        this.adapter_.registerScrollHandler(this.scrollHandler_);
        this.initKeyRatio_();
        this.setKeyHeights_();
    };
    MDCToolbarFoundation.prototype.destroy = function () {
        this.adapter_.deregisterResizeHandler(this.resizeHandler_);
        this.adapter_.deregisterScrollHandler(this.scrollHandler_);
    };
    MDCToolbarFoundation.prototype.updateAdjustElementStyles = function () {
        if (this.isFixed_) {
            this.adapter_.setStyleForFixedAdjustElement('margin-top', this.calculations_.toolbarHeight + "px");
        }
    };
    MDCToolbarFoundation.prototype.getFlexibleExpansionRatio_ = function (scrollTop) {
        // To prevent division by zero when there is no flexibleExpansionHeight
        var delta = 0.0001;
        return Math.max(0, 1 - scrollTop / (this.calculations_.flexibleExpansionHeight + delta));
    };
    MDCToolbarFoundation.prototype.checkRowHeight_ = function () {
        var _this = this;
        cancelAnimationFrame(this.checkRowHeightFrame_);
        this.checkRowHeightFrame_ = requestAnimationFrame(function () { return _this.setKeyHeights_(); });
    };
    MDCToolbarFoundation.prototype.setKeyHeights_ = function () {
        var newToolbarRowHeight = this.getRowHeight_();
        if (newToolbarRowHeight !== this.calculations_.toolbarRowHeight) {
            this.calculations_.toolbarRowHeight = newToolbarRowHeight;
            this.calculations_.toolbarHeight = this.calculations_.toolbarRatio * this.calculations_.toolbarRowHeight;
            this.calculations_.flexibleExpansionHeight =
                this.calculations_.flexibleExpansionRatio * this.calculations_.toolbarRowHeight;
            this.calculations_.maxTranslateYDistance =
                this.calculations_.maxTranslateYRatio * this.calculations_.toolbarRowHeight;
            this.calculations_.scrollThreshold =
                this.calculations_.scrollThresholdRatio * this.calculations_.toolbarRowHeight;
            this.updateAdjustElementStyles();
            this.updateToolbarStyles_();
        }
    };
    MDCToolbarFoundation.prototype.updateToolbarStyles_ = function () {
        var _this = this;
        cancelAnimationFrame(this.scrollFrame_);
        this.scrollFrame_ = requestAnimationFrame(function () {
            var scrollTop = _this.adapter_.getViewportScrollY();
            var hasScrolledOutOfThreshold = _this.scrolledOutOfThreshold_(scrollTop);
            if (hasScrolledOutOfThreshold && _this.executedLastChange_) {
                return;
            }
            var flexibleExpansionRatio = _this.getFlexibleExpansionRatio_(scrollTop);
            _this.updateToolbarFlexibleState_(flexibleExpansionRatio);
            if (_this.isFixedLastRow_) {
                _this.updateToolbarFixedState_(scrollTop);
            }
            if (_this.hasFlexibleFirstRow_) {
                _this.updateFlexibleRowElementStyles_(flexibleExpansionRatio);
            }
            _this.executedLastChange_ = hasScrolledOutOfThreshold;
            _this.adapter_.notifyChange({ flexibleExpansionRatio: flexibleExpansionRatio });
        });
    };
    MDCToolbarFoundation.prototype.scrolledOutOfThreshold_ = function (scrollTop) {
        return scrollTop > this.calculations_.scrollThreshold;
    };
    MDCToolbarFoundation.prototype.initKeyRatio_ = function () {
        var toolbarRowHeight = this.getRowHeight_();
        var firstRowMaxRatio = this.adapter_.getFirstRowElementOffsetHeight() / toolbarRowHeight;
        this.calculations_.toolbarRatio = this.adapter_.getOffsetHeight() / toolbarRowHeight;
        this.calculations_.flexibleExpansionRatio = firstRowMaxRatio - 1;
        this.calculations_.maxTranslateYRatio =
            this.isFixedLastRow_ ? this.calculations_.toolbarRatio - firstRowMaxRatio : 0;
        this.calculations_.scrollThresholdRatio =
            (this.isFixedLastRow_ ? this.calculations_.toolbarRatio : firstRowMaxRatio) - 1;
    };
    MDCToolbarFoundation.prototype.getRowHeight_ = function () {
        var breakpoint = numbers$4.TOOLBAR_MOBILE_BREAKPOINT;
        return this.adapter_.getViewportWidth() < breakpoint ?
            numbers$4.TOOLBAR_ROW_MOBILE_HEIGHT : numbers$4.TOOLBAR_ROW_HEIGHT;
    };
    MDCToolbarFoundation.prototype.updateToolbarFlexibleState_ = function (flexibleExpansionRatio) {
        this.adapter_.removeClass(cssClasses$8.FLEXIBLE_MAX);
        this.adapter_.removeClass(cssClasses$8.FLEXIBLE_MIN);
        if (flexibleExpansionRatio === 1) {
            this.adapter_.addClass(cssClasses$8.FLEXIBLE_MAX);
        }
        else if (flexibleExpansionRatio === 0) {
            this.adapter_.addClass(cssClasses$8.FLEXIBLE_MIN);
        }
    };
    MDCToolbarFoundation.prototype.updateToolbarFixedState_ = function (scrollTop) {
        var translateDistance = Math.max(0, Math.min(scrollTop - this.calculations_.flexibleExpansionHeight, this.calculations_.maxTranslateYDistance));
        this.adapter_.setStyle('transform', "translateY(" + -translateDistance + "px)");
        if (translateDistance === this.calculations_.maxTranslateYDistance) {
            this.adapter_.addClass(cssClasses$8.FIXED_AT_LAST_ROW);
        }
        else {
            this.adapter_.removeClass(cssClasses$8.FIXED_AT_LAST_ROW);
        }
    };
    MDCToolbarFoundation.prototype.updateFlexibleRowElementStyles_ = function (flexibleExpansionRatio) {
        if (this.isFixed_) {
            var height = this.calculations_.flexibleExpansionHeight * flexibleExpansionRatio;
            this.adapter_.setStyleForFlexibleRowElement('height', height + this.calculations_.toolbarRowHeight + "px");
        }
        if (this.useFlexDefaultBehavior_) {
            this.updateElementStylesDefaultBehavior_(flexibleExpansionRatio);
        }
    };
    MDCToolbarFoundation.prototype.updateElementStylesDefaultBehavior_ = function (flexibleExpansionRatio) {
        var maxTitleSize = numbers$4.MAX_TITLE_SIZE;
        var minTitleSize = numbers$4.MIN_TITLE_SIZE;
        var currentTitleSize = (maxTitleSize - minTitleSize) * flexibleExpansionRatio + minTitleSize;
        this.adapter_.setStyleForTitleElement('font-size', currentTitleSize + "rem");
    };
    return MDCToolbarFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$8 = MDCToolbarFoundation.strings;
var MDCToolbar = /** @class */ (function (_super) {
    __extends(MDCToolbar, _super);
    function MDCToolbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCToolbar.attachTo = function (root) {
        return new MDCToolbar(root);
    };
    MDCToolbar.prototype.initialize = function () {
        var _this = this;
        this.ripples_ = [];
        this.fixedAdjustElement_ = null;
        this.titleElement_ = this.root_.querySelector(strings$8.TITLE_SELECTOR);
        var firstRowElement = this.root_.querySelector(strings$8.FIRST_ROW_SELECTOR);
        if (!firstRowElement) {
            throw new Error("MDCToolbar: Required sub-element '" + strings$8.FIRST_ROW_SELECTOR + "' is missing");
        }
        this.firstRowElement_ = firstRowElement;
        [].forEach.call(this.root_.querySelectorAll(strings$8.ICON_SELECTOR), function (icon) {
            var ripple = MDCRipple.attachTo(icon);
            ripple.unbounded = true;
            _this.ripples_.push(ripple);
        });
    };
    MDCToolbar.prototype.destroy = function () {
        this.ripples_.forEach(function (ripple) {
            ripple.destroy();
        });
        _super.prototype.destroy.call(this);
    };
    Object.defineProperty(MDCToolbar.prototype, "fixedAdjustElement", {
        get: function () {
            return this.fixedAdjustElement_;
        },
        set: function (element) {
            this.fixedAdjustElement_ = element;
            this.foundation_.updateAdjustElementStyles();
        },
        enumerable: true,
        configurable: true
    });
    MDCToolbar.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
        var adapter = {
            hasClass: function (className) { return _this.root_.classList.contains(className); },
            addClass: function (className) { return _this.root_.classList.add(className); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
            registerScrollHandler: function (handler) { return window.addEventListener('scroll', handler); },
            deregisterScrollHandler: function (handler) { return window.removeEventListener('scroll', handler); },
            registerResizeHandler: function (handler) { return window.addEventListener('resize', handler); },
            deregisterResizeHandler: function (handler) { return window.removeEventListener('resize', handler); },
            getViewportWidth: function () { return window.innerWidth; },
            getViewportScrollY: function () { return window.pageYOffset; },
            getOffsetHeight: function () { return _this.root_.offsetHeight; },
            getFirstRowElementOffsetHeight: function () { return _this.firstRowElement_.offsetHeight; },
            notifyChange: function (evtData) { return _this.emit(strings$8.CHANGE_EVENT, evtData); },
            setStyle: function (property, value) { return _this.root_.style.setProperty(property, value); },
            setStyleForTitleElement: function (property, value) {
                if (_this.titleElement_) {
                    _this.titleElement_.style.setProperty(property, value);
                }
            },
            setStyleForFlexibleRowElement: function (property, value) { return _this.firstRowElement_.style.setProperty(property, value); },
            setStyleForFixedAdjustElement: function (property, value) {
                if (_this.fixedAdjustElement) {
                    _this.fixedAdjustElement.style.setProperty(property, value);
                }
            },
        };
        // tslint:enable:object-literal-sort-keys
        return new MDCToolbarFoundation(adapter);
    };
    return MDCToolbar;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class DemoToolbarComponent {
    componentDidLoad() {
        this.rootEl = this.el.shadowRoot.querySelector('.mdc-toolbar');
        this.toolbar = new MDCToolbar(this.rootEl);
        const elResizer = this.el.parentElement;
        this.toolbar.fixedAdjustElement = elResizer;
    }
    componentDidUnload() {
        this.toolbar.destroy();
    }
    render() {
        return (h("div", { class: "mdc-typography" },
            h("header", { class: "mdc-toolbar mdc-toolbar--fixed" },
                h("div", { class: "mdc-toolbar__row" },
                    h("section", { id: "left-panel", class: "mdc-toolbar__section mdc-toolbar__section--align-start" },
                        h("h3", { class: "mdc-typography--subheading2" }, this.name),
                        h("slot", { name: "left" })),
                    h("section", { id: "center-panel", class: "mdc-toolbar__section" },
                        h("slot", { name: "center" })),
                    h("section", { id: "right-panel", class: "mdc-toolbar__section mdc-toolbar__section--align-end", role: "toolbar" },
                        h("slot", { name: "right" }))),
                h("slot", { name: "base" }))));
    }
    static get is() { return "o-demo-bar-toolbar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "name": {
            "type": String,
            "attr": "name"
        },
        "options": {
            "type": "Any",
            "attr": "options"
        }
    }; }
    static get style() { return ".mdc-toolbar{background-color:#6200ee;background-color:var(--mdc-theme-primary,#6200ee);color:#fff;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%}.mdc-toolbar .mdc-toolbar__icon{color:#fff}.mdc-toolbar .mdc-toolbar__icon:after,.mdc-toolbar .mdc-toolbar__icon:before{background-color:#fff}.mdc-toolbar .mdc-toolbar__icon:hover:before{opacity:.08}.mdc-toolbar .mdc-toolbar__icon.mdc-ripple-upgraded--background-focused:before,.mdc-toolbar .mdc-toolbar__icon:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-toolbar .mdc-toolbar__icon:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-toolbar .mdc-toolbar__icon:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-toolbar .mdc-toolbar__icon.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.24}.mdc-toolbar__row{display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;height:auto;min-height:64px}\@media (max-width:959px) and (orientation:landscape){.mdc-toolbar__row{min-height:48px}}\@media (max-width:599px){.mdc-toolbar__row{min-height:56px}}.mdc-toolbar__section{display:-ms-inline-flexbox;display:inline-flex;-ms-flex:1;flex:1;-ms-flex-align:start;align-items:start;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;min-width:0;height:100%;padding:8px;z-index:1}\@media (max-width:959px) and (orientation:landscape){.mdc-toolbar__section{padding:0}}\@media (max-width:599px){.mdc-toolbar__section{padding:4px 0}}.mdc-toolbar__section--align-start{padding-left:12px;padding-right:0;-ms-flex-pack:start;justify-content:flex-start;-ms-flex-order:-1;order:-1}.mdc-toolbar__section--align-start[dir=rtl],[dir=rtl] .mdc-toolbar__section--align-start{padding-left:0;padding-right:12px}\@media (max-width:959px) and (orientation:landscape){.mdc-toolbar__section--align-start{padding-left:4px;padding-right:0}.mdc-toolbar__section--align-start[dir=rtl],[dir=rtl] .mdc-toolbar__section--align-start{padding-left:0;padding-right:4px}}\@media (max-width:599px){.mdc-toolbar__section--align-start{padding-left:4px;padding-right:0}.mdc-toolbar__section--align-start[dir=rtl],[dir=rtl] .mdc-toolbar__section--align-start{padding-left:0;padding-right:4px}}.mdc-toolbar__section--align-end{padding-left:0;padding-right:12px;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-order:1;order:1}.mdc-toolbar__section--align-end[dir=rtl],[dir=rtl] .mdc-toolbar__section--align-end{padding-left:12px;padding-right:0}\@media (max-width:959px) and (orientation:landscape){.mdc-toolbar__section--align-end{padding-left:0;padding-right:4px}.mdc-toolbar__section--align-end[dir=rtl],[dir=rtl] .mdc-toolbar__section--align-end{padding-left:4px;padding-right:0}}\@media (max-width:599px){.mdc-toolbar__section--align-end{padding-left:0;padding-right:4px}.mdc-toolbar__section--align-end[dir=rtl],[dir=rtl] .mdc-toolbar__section--align-end{padding-left:4px;padding-right:0}}.mdc-toolbar__title{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1.25rem;line-height:2rem;font-weight:500;letter-spacing:.0125em;text-decoration:inherit;text-transform:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;margin-left:24px;margin-right:0;-ms-flex-item-align:center;align-self:center;padding:12px 0;line-height:1.5rem;z-index:1}.mdc-toolbar__title[dir=rtl],[dir=rtl] .mdc-toolbar__title{margin-left:0;margin-right:24px}.mdc-toolbar__icon,.mdc-toolbar__menu-icon{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:start;align-items:start;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:48px;height:48px;padding:12px;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer}.mdc-toolbar__icon:after,.mdc-toolbar__icon:before,.mdc-toolbar__menu-icon:after,.mdc-toolbar__menu-icon:before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\"}.mdc-toolbar__icon:before,.mdc-toolbar__menu-icon:before{-webkit-transition:opacity 15ms linear,background-color 15ms linear;transition:opacity 15ms linear,background-color 15ms linear;z-index:1}.mdc-toolbar__icon.mdc-ripple-upgraded:before,.mdc-toolbar__menu-icon.mdc-ripple-upgraded:before{-webkit-transform:scale(var(--mdc-ripple-fg-scale,1));transform:scale(var(--mdc-ripple-fg-scale,1))}.mdc-toolbar__icon.mdc-ripple-upgraded:after,.mdc-toolbar__menu-icon.mdc-ripple-upgraded:after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-toolbar__icon.mdc-ripple-upgraded--unbounded:after,.mdc-toolbar__menu-icon.mdc-ripple-upgraded--unbounded:after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-toolbar__icon.mdc-ripple-upgraded--foreground-activation:after,.mdc-toolbar__menu-icon.mdc-ripple-upgraded--foreground-activation:after{-webkit-animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-toolbar__icon.mdc-ripple-upgraded--foreground-deactivation:after,.mdc-toolbar__menu-icon.mdc-ripple-upgraded--foreground-deactivation:after{-webkit-animation:mdc-ripple-fg-opacity-out .15s;animation:mdc-ripple-fg-opacity-out .15s;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-toolbar__icon:after,.mdc-toolbar__icon:before,.mdc-toolbar__menu-icon:after,.mdc-toolbar__menu-icon:before{top:0;left:0;width:100%;height:100%}.mdc-toolbar__icon.mdc-ripple-upgraded:after,.mdc-toolbar__icon.mdc-ripple-upgraded:before,.mdc-toolbar__menu-icon.mdc-ripple-upgraded:after,.mdc-toolbar__menu-icon.mdc-ripple-upgraded:before{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0);width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-toolbar__icon.mdc-ripple-upgraded:after,.mdc-toolbar__menu-icon.mdc-ripple-upgraded:after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-toolbar__menu-icon+.mdc-toolbar__title{margin-left:8px;margin-right:0}.mdc-toolbar__menu-icon+.mdc-toolbar__title[dir=rtl],[dir=rtl] .mdc-toolbar__menu-icon+.mdc-toolbar__title{margin-left:0;margin-right:8px}\@media (max-width:599px){.mdc-toolbar__title{margin-left:16px;margin-right:0}.mdc-toolbar__title[dir=rtl],[dir=rtl] .mdc-toolbar__title{margin-left:0;margin-right:16px}}.mdc-toolbar--fixed{-webkit-box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);position:fixed;top:0;left:0;z-index:4}.mdc-toolbar--flexible{--mdc-toolbar-ratio-to-extend-flexible:4}.mdc-toolbar--flexible .mdc-toolbar__row:first-child{height:256px;height:calc(64px*var(--mdc-toolbar-ratio-to-extend-flexible, 4))}\@media (max-width:599px){.mdc-toolbar--flexible .mdc-toolbar__row:first-child{height:224px;height:calc(56px*var(--mdc-toolbar-ratio-to-extend-flexible, 4))}}.mdc-toolbar--flexible .mdc-toolbar__row:first-child:after{position:absolute;content:\"\"}.mdc-toolbar--flexible-default-behavior .mdc-toolbar__title{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:1.25rem;line-height:2rem;font-weight:500;letter-spacing:.0125em;text-decoration:inherit;text-transform:inherit;-ms-flex-item-align:end;align-self:flex-end;line-height:1.5rem}.mdc-toolbar--flexible-default-behavior .mdc-toolbar__row:first-child:after{top:0;left:0;width:100%;height:100%;-webkit-transition:opacity .2s ease;transition:opacity .2s ease;opacity:1}.mdc-toolbar--flexible-default-behavior.mdc-toolbar--flexible-space-minimized .mdc-toolbar__row:first-child:after{opacity:0}.mdc-toolbar--flexible-default-behavior.mdc-toolbar--flexible-space-minimized .mdc-toolbar__title{font-weight:500}.mdc-toolbar--waterfall.mdc-toolbar--fixed{-webkit-box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);-webkit-transition:-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);transition:box-shadow .28s cubic-bezier(.4,0,.2,1);transition:box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1);will-change:box-shadow}.mdc-toolbar--waterfall.mdc-toolbar--fixed.mdc-toolbar--flexible-space-minimized{-webkit-box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.mdc-toolbar--waterfall.mdc-toolbar--fixed.mdc-toolbar--fixed-lastrow-only.mdc-toolbar--flexible-space-minimized{-webkit-box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)}.mdc-toolbar--waterfall.mdc-toolbar--fixed.mdc-toolbar--fixed-lastrow-only.mdc-toolbar--fixed-at-last-row{-webkit-box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);box-shadow:0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)}.mdc-toolbar-fixed-adjust{padding-top:64px}\@media (max-width:959px) and (max-height:599px){.mdc-toolbar-fixed-adjust{padding-top:48px}}\@media (max-width:599px){.mdc-toolbar-fixed-adjust{padding-top:56px}}.mdc-toolbar__section--shrink-to-fit{-ms-flex:none;flex:none}\@font-face{font-family:Source Code Pro;font-style:normal;font-weight:400;src:local(\"Source Code Pro\"),local(\"SourceCodePro-Regular\"),url(https://fonts.gstatic.com/s/sourcecodepro/v9/HI_SiYsKILxRpg3hIP6sJ7fM7PqlPevWnsUnxg.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:300;src:local(\"Source Sans Pro Light Italic\"),local(\"SourceSansPro-LightItalic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKwdSBYKcSV-LCoeQqfX1RYOo3qPZZMkids18S0xR41.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:400;src:local(\"Source Sans Pro Italic\"),local(\"SourceSansPro-Italic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xK1dSBYKcSV-LCoeQqfX1RYOo3qPZ7nsDJB9cme.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:600;src:local(\"Source Sans Pro SemiBold Italic\"),local(\"SourceSansPro-SemiBoldItalic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKwdSBYKcSV-LCoeQqfX1RYOo3qPZY4lCds18S0xR41.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:700;src:local(\"Source Sans Pro Bold Italic\"),local(\"SourceSansPro-BoldItalic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKwdSBYKcSV-LCoeQqfX1RYOo3qPZZclSds18S0xR41.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:normal;font-weight:300;src:local(\"Source Sans Pro Light\"),local(\"SourceSansPro-Light\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKydSBYKcSV-LCoeQqfX1RYOo3ik4zwlxdu3cOWxw.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:normal;font-weight:400;src:local(\"Source Sans Pro Regular\"),local(\"SourceSansPro-Regular\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7lujVj9w.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}:host{--mdc-theme-primary:#fff;--mdc-theme-text-primary-on-primary:#494949;--mdc-theme-background:#c3c3c3;--vh:1vh;font-family:Source Sans Pro Regular,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}h1{margin:.67em 0;font-size:2em}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible}main{display:block}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,select{margin:0}button{overflow:visible;text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}fieldset{padding:.35em .75em .625em}input{overflow:visible}legend{-webkit-box-sizing:border-box;box-sizing:border-box;display:table;max-width:100%;color:inherit;white-space:normal}progress{display:inline-block;vertical-align:baseline}select{text-transform:none}textarea{margin:0;overflow:auto}[type=checkbox],[type=radio]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-input-placeholder{color:inherit;opacity:.54}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}::-moz-focus-inner{padding:0;border-style:none}:-moz-focusring{outline:1px dotted ButtonText}details,dialog{display:block}dialog{position:absolute;right:0;left:0;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;padding:1em;margin:auto;color:#000;background-color:#fff;border:solid}dialog:not([open]){display:none}summary{display:list-item}canvas{display:inline-block}[hidden],template{display:none}*,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box;background-repeat:no-repeat}:after,:before{text-decoration:inherit;vertical-align:inherit}nav ol,nav ul{padding:0;margin:0;list-style:none}audio,canvas,iframe,img,svg,video{vertical-align:middle}svg:not([fill]){fill:currentColor}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}textarea{resize:vertical}[tabindex],a,area,button,input,label,select,summary,textarea{-ms-touch-action:manipulation;touch-action:manipulation}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true],[disabled]{cursor:not-allowed}[aria-hidden=false][hidden]:not(:focus){position:absolute;display:inherit;clip:rect(0,0,0,0)}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,legend,ol,p,pre,ul{padding:0;margin:0}li>ol,li>ul{margin-bottom:0}table{border-spacing:0;border-collapse:collapse}fieldset{min-width:0;border:0}code{font-family:Source Code Pro,monospace}figcaption{font-style:italic}h1,h2,h3,h4,h5,h6{line-height:1.25}table{width:100%}img{max-width:100%;font-style:italic;vertical-align:middle}img[height],img[width]{max-width:none}a{text-decoration:none;color:#0c77ba}a:hover{text-decoration:underline;-webkit-transition:opacity .15s ease-in;transition:opacity .15s ease-in}label{max-width:100%;word-wrap:break-word}[type=checkbox]+label[for],[type=radio]+label[for],[type=text]+label[for],label[for]{cursor:pointer}ul{list-style:disc outside}ul ul{list-style-type:circle}ul ul ul{list-style-type:square}ol{list-style:inherit outside}ol ol{list-style-type:lower-alpha}dl dt{font-weight:600}dd,ol,ul{margin-left:24px}.o-media{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;text-align:left}.o-media .o-media:first-of-type{margin-top:1rem}.o-media__content{-ms-flex-preferred-size:auto;flex-basis:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;text-align:left;-ms-flex-negative:1;flex-shrink:1}.o-media__left,.o-media__right{-ms-flex-preferred-size:auto;flex-basis:auto;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0}.o-list--divided>li+li:before{margin-right:12px;background:red;border-top:2px solid #000}.o-list-bare{list-style:none}.o-list-bare,.o-list-bare__item{margin-left:0}.o-list-inline{margin-left:0;list-style:none}.o-list-inline__item{display:inline-block}.o-list-inline__item:not(:last-child){margin-right:12px}.o-list-inline--divided>li+li:before{margin-right:12px;content:\"|\"}.o-columns{-ms-flex-wrap:wrap;flex-wrap:wrap;margin-top:-12px;margin-right:-12px;margin-left:-12px}\@media screen and (min-width:768px){.o-columns{display:-ms-flexbox;display:flex}}.o-columns:last-child{margin-bottom:-12px}.o-columns:not(:last-child){margin-bottom:12px}.o-columns--centered{-ms-flex-pack:center;justify-content:center}.o-columns--row{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.o-columns--gapless{margin:0}.o-columns--gapless>.o-column{padding:0!important;margin:0}.o-columns--gapless:last-child{margin-bottom:0}.o-column{display:block;-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1;padding:12px;margin:0}[class*=u-width-],[class*=u-width-]>.o-column{-ms-flex:none;flex:none}.o-section{padding:24px 0}.o-container{margin:0 auto}\@media screen and (max-width:959px){.o-container{width:100%;padding:0 16px}}\@media screen and (min-width:960px) and (max-width:1377px){.o-container{width:960px;padding:0 24px}}\@media screen and (min-width:1378px) and (max-width:1740px){.o-container{width:1272px;padding:0 24px}}\@media screen and (min-width:1741px){.o-container{width:1680px;padding:0 24px}}.l-fluid .o-container,.o-container-fluid{width:100%;max-width:100%;padding:0 24px}.c-accordion{width:100%;border:0;margin:0 0 16px}.c-accordion__control{display:block;position:relative;width:100%;left:0;border:0;padding:12px 0 12px 56px;text-align:left;background:none;-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;border-top:1px solid rgba(18,18,18,.15);font-size:20px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-accordion__control:focus,.c-accordion__control:hover{outline:0}.is-open .c-accordion__control:after{-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.c-accordion__icon{color:#0a649d}.c-accordion__icon:after,.c-accordion__icon:before{content:\"\";display:block;left:16px;position:absolute;top:50%;-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.c-accordion__icon:before{border:3px solid;border-bottom:0;border-right:0;height:12px;width:12px;-webkit-transform:translate(-50%,-75%) rotate(225deg);transform:translate(-50%,-75%) rotate(225deg)}.c-accordion__item.is-open .c-accordion__control .c-accordion__icon:before{-webkit-transform:translate(-50%,-25%) rotate(45deg);transform:translate(-50%,-25%) rotate(45deg)}.c-accordion__headline{font-size:24px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;margin:0 0 16px}.c-accordion__content{display:none;padding:0 56px 24px}.is-open .c-accordion__content{display:block}.c-accordion--lg .c-accordion__headline{font-size:32px}.c-accordion--lg .c-accordion__control,.c-accordion--lg .c-accordion__headline{font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-accordion--lg .c-accordion__control{font-size:24px}.c-breadcrumb{display:block;font-size:16px;line-height:24px;white-space:nowrap}.c-breadcrumb a{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;padding:0 .5em;color:rgba(18,18,18,.75);text-decoration:none;letter-spacing:.06rem}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb a,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb a,[class*=t-mode--dark] .c-breadcrumb a,[class*=t-mode--light] .c-breadcrumb a{color:hsla(0,0%,100%,.75)}.c-breadcrumb a:hover{color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb a:hover,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb a:hover,[class*=t-mode--dark] .c-breadcrumb a:hover,[class*=t-mode--light] .c-breadcrumb a:hover{color:#fff}.c-breadcrumb li{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.c-breadcrumb li:first-child a{padding-left:0}.c-breadcrumb li.is-active a{pointer-events:none;cursor:default;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb li.is-active a,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb li.is-active a,[class*=t-mode--dark] .c-breadcrumb li.is-active a,[class*=t-mode--light] .c-breadcrumb li.is-active a{color:#fff}.c-breadcrumb li+li:before{color:rgba(18,18,18,.5);content:\"/\"}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb li+li:before,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb li+li:before,[class*=t-mode--dark] .c-breadcrumb li+li:before,[class*=t-mode--light] .c-breadcrumb li+li:before{color:hsla(0,0%,100%,.5)}.c-breadcrumb ol,.c-breadcrumb ul{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:start;justify-content:flex-start;margin-left:0}.c-breadcrumb .icon:first-child{margin-right:.5em}.c-breadcrumb .icon:last-child{margin-left:.5em}.c-breadcrumb--centered ol,.c-breadcrumb--centered ul{-ms-flex-pack:center;justify-content:center}.c-breadcrumb--right ol,.c-breadcrumb--right ul{-ms-flex-pack:end;justify-content:flex-end}.c-breadcrumb--sm{font-size:12px}.c-breadcrumb--lg{font-size:24px}.c-breadcrumb--compressed li+li:before{color:rgba(18,18,18,.25);content:\"/\"}.c-breadcrumb--compressed a{padding:0 4px;letter-spacing:0}.c-badge{position:relative;display:inline-block;margin:0;padding:.2em .5em .25em;border-radius:30em;min-width:1em;font-weight:600;font-size:16px;line-height:1;text-align:center;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle;background-color:#05314d;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-badge,[class*=t-mode--] [class*=t-mode--light] .c-badge,[class*=t-mode--dark] .c-badge,[class*=t-mode--light] .c-badge{background-color:#fff;color:#2e2e2e}.c-badge--subtle{color:#2e2e2e;background-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-badge--subtle,[class*=t-mode--] [class*=t-mode--light] .c-badge--subtle,[class*=t-mode--dark] .c-badge--subtle,[class*=t-mode--light] .c-badge--subtle{color:#fff;background-color:rgba(18,18,18,.75)}.c-badge--sm{font-size:12px;padding:.1em .45em}.c-badge:empty{display:none}.c-badge-notification{position:relative;white-space:nowrap}.c-badge-notification:not([data-badge]) :after,.c-badge-notification[data-badge]:after{display:inline-block;color:#fff;content:attr(data-badge);background-color:#bd2b2b;background-clip:padding-box;font-size:14px;border-radius:.5rem;padding:2px;-webkit-box-shadow:0 0 0 .1rem #fff;box-shadow:0 0 0 .1rem #fff;-webkit-transform:translate(-.05rem,-.5rem);-ms-transform:translate(-.05rem,-.5rem);transform:translate(-.05rem,-.5rem);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.c-badge-notification[data-badge]:after{min-width:.9rem;height:.9rem;padding:0 .2rem;font-size:12px;font-weight:700;line-height:1;text-align:center;white-space:nowrap}.c-badge-notification:not([data-badge]) :after,.c-badge-notification[data-badge=\"\"]:after{width:6px;min-width:6px;height:6px;padding:0}.c-badge-notification.c-button{overflow:inherit}.c-badge-notification.c-button:after{top:0;right:0}.c-badge-notification.c-button:after,.c-badge-notification.c-sticker:after{position:absolute;-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.c-badge-notification.c-sticker:after{top:14.64%;right:14.64%;z-index:1}.c-badge-notification--success{background-color:#008719;color:#fff;-webkit-box-shadow:0 0 0 .1rem #008719;box-shadow:0 0 0 .1rem #008719}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--success,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--success,[class*=t-mode--dark] .c-badge-notification--success,[class*=t-mode--light] .c-badge-notification--success{background-color:#008719}.c-badge-notification:not([data-badge]) ::after--danger,.c-badge-notification[data-badge]::after--danger{background-color:#bd2b2b;color:#fff;-webkit-box-shadow:0 0 0 .1rem #cc3535;box-shadow:0 0 0 .1rem #cc3535}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification:not([data-badge])::after--danger,[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification[data-badge]::after--danger,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification:not([data-badge])::after--danger,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification[data-badge]::after--danger,[class*=t-mode--dark] .c-badge-notification:not([data-badge]) ::after--danger,[class*=t-mode--dark] .c-badge-notification[data-badge]::after--danger,[class*=t-mode--light] .c-badge-notification:not([data-badge]) ::after--danger,[class*=t-mode--light] .c-badge-notification[data-badge]::after--danger{background-color:#bd2b2b}.c-badge-notification--warning{background-color:#ff9a0d;color:#2e2e2e;-webkit-box-shadow:0 0 0 .1rem #000;box-shadow:0 0 0 .1rem #000}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--warning,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--warning,[class*=t-mode--dark] .c-badge-notification--warning,[class*=t-mode--light] .c-badge-notification--warning{background-color:#ff9a0d;color:rgba(18,18,18,.75)}.c-badge-notification--info{background-color:#2e2e2e;color:#fff;-webkit-box-shadow:0 0 0 .1rem hsla(0,0%,100%,.1);box-shadow:0 0 0 .1rem hsla(0,0%,100%,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--info,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--info,[class*=t-mode--dark] .c-badge-notification--info,[class*=t-mode--light] .c-badge-notification--info{background-color:#fff;color:#2e2e2e}.c-badge-notification--secondary{background-color:transparent;border:1px solid rgba(18,18,18,.25);color:rgba(18,18,18,.75);-webkit-box-shadow:0 0 0 .1rem hsla(0,0%,100%,.25);box-shadow:0 0 0 .1rem hsla(0,0%,100%,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary,[class*=t-mode--dark] .c-badge-notification--secondary,[class*=t-mode--light] .c-badge-notification--secondary{background-color:transparent;color:hsla(0,0%,100%,.75)}.c-badge-notification--secondary.c-badge--success{color:#008719;border-color:#008719;-webkit-box-shadow:0 0 0 .1rem fk-theme-switcher(\"background-color\");box-shadow:0 0 0 .1rem fk-theme-switcher(\"background-color\")}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary.c-badge--success,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary.c-badge--success,[class*=t-mode--dark] .c-badge-notification--secondary.c-badge--success,[class*=t-mode--light] .c-badge-notification--secondary.c-badge--success{color:#45c15c;border-color:#45c15c}.c-badge-notification--secondary.c-tag--danger{color:#bd2b2b;border-color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary.c-tag--danger,[class*=t-mode--dark] .c-badge-notification--secondary.c-tag--danger,[class*=t-mode--light] .c-badge-notification--secondary.c-tag--danger{color:#fa6464;border-color:#fa6464}.c-badge-notification--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary.c-tag--warning,[class*=t-mode--dark] .c-badge-notification--secondary.c-tag--warning,[class*=t-mode--light] .c-badge-notification--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}\@-webkit-keyframes spinAround{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}\@keyframes spinAround{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.c-button{display:inline-block;position:relative;background:transparent;-webkit-box-shadow:none;box-shadow:none;border:1px solid transparent;border-radius:4px;margin:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;overflow:hidden;text-overflow:ellipsis;text-transform:inherit;vertical-align:middle;font-size:16px;padding:.5em .75em;font-weight:400;-webkit-transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,-webkit-box-shadow .25s ease-in-out;transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,-webkit-box-shadow .25s ease-in-out;transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,box-shadow .25s ease-in-out;transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,box-shadow .25s ease-in-out,-webkit-box-shadow .25s ease-in-out;min-width:24px;max-width:none;-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25);border:1px solid rgba(18,18,18,.1);background-color:#fff;color:#0c77ba}.c-button.is-hovered,.c-button:hover{text-decoration:none}.c-button.is-disabled,.c-button:disabled,.c-button[disabled]{border-color:transparent;cursor:not-allowed}[class*=t-mode--] [class*=t-mode--dark] .c-button,[class*=t-mode--] [class*=t-mode--light] .c-button,[class*=t-mode--dark] .c-button,[class*=t-mode--light] .c-button{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-button.is-hovered,.c-button:hover{-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button:hover,[class*=t-mode--] [class*=t-mode--light] .c-button.is-hovered,[class*=t-mode--] [class*=t-mode--light] .c-button:hover,[class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--dark] .c-button:hover,[class*=t-mode--light] .c-button.is-hovered,[class*=t-mode--light] .c-button:hover{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-button.is-active,.c-button:active{-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button:active,[class*=t-mode--] [class*=t-mode--light] .c-button.is-active,[class*=t-mode--] [class*=t-mode--light] .c-button:active,[class*=t-mode--dark] .c-button.is-active,[class*=t-mode--dark] .c-button:active,[class*=t-mode--light] .c-button.is-active,[class*=t-mode--light] .c-button:active{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-button.is-disabled,.c-button:disabled,.c-button[disabled]{-webkit-box-shadow:none;box-shadow:none}.c-button.is-hovered,.c-button:hover{background-color:#fafafa}.c-button.is-active,.c-button:active{background-color:#e6e6e6}.c-button.is-disabled,.c-button:disabled,.c-button[disabled]{background-color:rgba(18,18,18,.1)}.c-button:focus{-webkit-box-shadow:0 0 0 3px hsla(0,0%,80%,.5);box-shadow:0 0 0 3px hsla(0,0%,80%,.5)}.c-button.is-loading.is-hovered,.c-button.is-loading:hover{background-color:#fff}.c-button.is-loading:after{color:#0c77ba}[class*=t-mode--] [class*=t-mode--dark] .c-button,[class*=t-mode--dark] .c-button{background-color:#616161;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button:hover,[class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--dark] .c-button:hover{background-color:#575757}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button:active,[class*=t-mode--dark] .c-button.is-active,[class*=t-mode--dark] .c-button:active{background-color:#484848}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button[disabled],[class*=t-mode--dark] .c-button.is-disabled,[class*=t-mode--dark] .c-button:disabled,[class*=t-mode--dark] .c-button[disabled]{background-color:hsla(0,0%,100%,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button:focus,[class*=t-mode--dark] .c-button:focus{-webkit-box-shadow:0 0 0 3px rgba(97,97,97,.4);box-shadow:0 0 0 3px rgba(97,97,97,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button.is-loading:hover,[class*=t-mode--dark] .c-button.is-loading.is-hovered,[class*=t-mode--dark] .c-button.is-loading:hover{background-color:#616161}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-loading:after,[class*=t-mode--dark] .c-button.is-loading:after{color:#fff}.c-button--primary{background-color:#0a649d;color:#fff}.c-button--primary.is-hovered,.c-button--primary:hover{background-color:#09588a}.c-button--primary.is-active,.c-button--primary:active{background-color:#07456d}.c-button--primary.is-disabled,.c-button--primary:disabled,.c-button--primary[disabled]{background-color:rgba(18,18,18,.1)}.c-button--primary:focus{-webkit-box-shadow:0 0 0 3px rgba(10,100,157,.4);box-shadow:0 0 0 3px rgba(10,100,157,.4)}.c-button--primary.is-loading.is-hovered,.c-button--primary.is-loading:hover{background-color:#0a649d}.c-button--primary.is-loading:after{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary,[class*=t-mode--dark] .c-button--primary{background-color:#0a649d;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:active,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:hover,[class*=t-mode--dark] .c-button--primary.is-active,[class*=t-mode--dark] .c-button--primary.is-hovered,[class*=t-mode--dark] .c-button--primary:active,[class*=t-mode--dark] .c-button--primary:hover{background-color:#09588a}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary[disabled],[class*=t-mode--dark] .c-button--primary.is-disabled,[class*=t-mode--dark] .c-button--primary:disabled,[class*=t-mode--dark] .c-button--primary[disabled]{background-color:hsla(0,0%,100%,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:focus,[class*=t-mode--dark] .c-button--primary:focus{-webkit-box-shadow:0 0 0 3px rgba(10,100,157,.4);box-shadow:0 0 0 3px rgba(10,100,157,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-loading:hover,[class*=t-mode--dark] .c-button--primary.is-loading.is-hovered,[class*=t-mode--dark] .c-button--primary.is-loading:hover{background-color:#0a649d}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-loading:after,[class*=t-mode--dark] .c-button--primary.is-loading:after{color:#fff}.c-button--primary-alt{background-color:#0c7b91;color:#fff}.c-button--primary-alt.is-hovered,.c-button--primary-alt:hover{background-color:#0a6b7e}.c-button--primary-alt.is-active,.c-button--primary-alt:active{background-color:#085362}.c-button--primary-alt.is-disabled,.c-button--primary-alt:disabled,.c-button--primary-alt[disabled]{background-color:rgba(18,18,18,.1)}.c-button--primary-alt:focus{-webkit-box-shadow:0 0 0 3px rgba(12,123,145,.4);box-shadow:0 0 0 3px rgba(12,123,145,.4)}.c-button--primary-alt.is-loading.is-hovered,.c-button--primary-alt.is-loading:hover{background-color:#0c7b91}.c-button--primary-alt.is-loading:after{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt,[class*=t-mode--dark] .c-button--primary-alt{background-color:#0c7b91;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:hover,[class*=t-mode--dark] .c-button--primary-alt.is-hovered,[class*=t-mode--dark] .c-button--primary-alt:hover{background-color:#0a6b7e}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:active,[class*=t-mode--dark] .c-button--primary-alt.is-active,[class*=t-mode--dark] .c-button--primary-alt:active{background-color:#085362}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt[disabled],[class*=t-mode--dark] .c-button--primary-alt.is-disabled,[class*=t-mode--dark] .c-button--primary-alt:disabled,[class*=t-mode--dark] .c-button--primary-alt[disabled]{background-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:focus,[class*=t-mode--dark] .c-button--primary-alt:focus{-webkit-box-shadow:0 0 0 3px rgba(12,123,145,.4);box-shadow:0 0 0 3px rgba(12,123,145,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-loading:hover,[class*=t-mode--dark] .c-button--primary-alt.is-loading.is-hovered,[class*=t-mode--dark] .c-button--primary-alt.is-loading:hover{background-color:#0c7b91}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-loading:after,[class*=t-mode--dark] .c-button--primary-alt.is-loading:after{color:#fff}.c-button--destructive{background-color:#ad2323;color:#fff}.c-button--destructive.is-hovered,.c-button--destructive:hover{background-color:#9c2020}.c-button--destructive.is-active,.c-button--destructive:active{background-color:#831a1a}.c-button--destructive.is-disabled,.c-button--destructive:disabled,.c-button--destructive[disabled]{background-color:rgba(18,18,18,.1)}.c-button--destructive:focus{-webkit-box-shadow:0 0 0 3px rgba(173,35,35,.4);box-shadow:0 0 0 3px rgba(173,35,35,.4)}.c-button--destructive.is-loading.is-hovered,.c-button--destructive.is-loading:hover{background-color:#ad2323}.c-button--destructive.is-loading:after{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive,[class*=t-mode--dark] .c-button--destructive{background-color:#ad2323;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:hover,[class*=t-mode--dark] .c-button--destructive.is-hovered,[class*=t-mode--dark] .c-button--destructive:hover{background-color:#9c2020}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:active,[class*=t-mode--dark] .c-button--destructive.is-active,[class*=t-mode--dark] .c-button--destructive:active{background-color:#831a1a}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive[disabled],[class*=t-mode--dark] .c-button--destructive.is-disabled,[class*=t-mode--dark] .c-button--destructive:disabled,[class*=t-mode--dark] .c-button--destructive[disabled]{background-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:focus,[class*=t-mode--dark] .c-button--destructive:focus{-webkit-box-shadow:0 0 0 3px rgba(173,35,35,.4);box-shadow:0 0 0 3px rgba(173,35,35,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-loading:hover,[class*=t-mode--dark] .c-button--destructive.is-loading.is-hovered,[class*=t-mode--dark] .c-button--destructive.is-loading:hover{background-color:#ad2323}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-loading:after,[class*=t-mode--dark] .c-button--destructive.is-loading:after{color:#fff}.c-button--sm{font-size:14px;padding:.1em .75em}.c-button--lg{font-size:20px;padding:.57em .75em}.c-button--xl{font-size:22px;padding:.75em 2em}.c-button.is-loading{opacity:.6;color:transparent;cursor:not-allowed}.c-button.is-loading.c-button--sm:after{width:8px;height:8px;margin-left:-4px;margin-top:-4px;border-width:1px}.c-button.is-loading.c-button--xl:after{width:24px;height:24px;margin-left:-12px;margin-top:-12px}.c-button.is-loading:after{position:absolute;width:24px;height:24px;display:block;-webkit-animation:spinAround .5s linear infinite;animation:spinAround .5s linear infinite;top:0;left:0;border-radius:4rem;border-color:transparent transparent currentcolor currentcolor;border-style:solid;border-width:1px;content:\"\";top:50%;left:50%;margin-left:-6px;margin-top:-6px;width:12px;height:12px}.c-button.c-button--fullwidth{display:block;width:100%;max-width:100%}.c-button-row .c-button:not(:last-child),.c-dialog__actions .c-button:not(:last-child){margin-right:16px}.c-button-row--right{text-align:right}.c-button-row--center{text-align:center}.hljs-comment,.hljs-quote{font-style:italic;color:#5c6370}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-built_in,.hljs-class .hljs-title{color:#e6c07b}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}.c-docs-example{position:relative;padding:1rem;margin:0 0 24px;background-color:#fff;color:#2e2e2e;border:1px solid brand-color(\"magenta\",\"light\")}[class*=t-mode--] [class*=t-mode--dark] .c-docs-example,[class*=t-mode--dark] .c-docs-example{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-docs-example,[class*=t-mode--light] .c-docs-example{background-color:#fff;color:#2e2e2e}.c-docs-example--contrast{background-color:#f8f8f8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-docs-example--contrast,[class*=t-mode--dark] .c-docs-example--contrast{background-color:#262626;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-docs-example--contrast,[class*=t-mode--light] .c-docs-example--contrast{background-color:#f8f8f8;color:#2e2e2e}.c-docs-example:before{position:absolute;top:0;right:-1px;bottom:100%;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch;height:24px;padding:0 8px;margin-left:-1px;font-size:9px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;vertical-align:top;content:\"Example\";background:brand-color(\"magenta\",\"light\");border-radius:2px 2px 0 0}.c-docs-code{position:relative;display:block;padding:16px;margin:0 0 24px;overflow-x:auto;color:#abb2bf;background-color:rgba(18,18,18,.9)}.c-docs-example+.c-docs-code{margin-top:-24px}.c-docs-code pre{padding:0;margin:0}.c-docs-code code:before{position:absolute;top:8px;right:12px;font-family:Source Code Pro,Verdana;font-weight:text-weight(\"semibold\");content:attr(data-lang)}.c-docs-code figure,.c-docs-code figure pre{margin:0}.c-close{color:#fff;font:14px/100% arial,sans-serif;border-radius:4px;text-decoration:none;font-size:24px;padding:0;cursor:pointer;border:0;background:transparent}.c-close--sm{font-size:20px}.c-close--lg{font-size:48px}.c-datalist{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding:0;margin:0}.c-datalist__item{display:inline-block;padding:16px 0;list-style-type:none;border-bottom:1px solid #ccc}.c-datalist__item:last-child{border-bottom:0}.c-datalist__label{display:inline-block;width:35%;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px;vertical-align:top;text-rendering:optimizeLegibility}\@media screen and (max-width:767px){.c-datalist__label{width:100%}}.c-datalist__value{display:inline-block;width:55%;color:#333;vertical-align:top;margin-right:5%}.c-datalist--columns{-ms-flex-direction:row;flex-direction:row;-ms-flex-flow:row wrap;flex-flow:row wrap}\@media screen and (max-width:767px){.c-datalist--columns{-ms-flex-direction:column;flex-direction:column}}.c-datalist--columns>.c-datalist__item{width:50%;-ms-flex-line-pack:justify;align-content:space-between}.c-dialog{width:450px;text-align:left;border-radius:4px;background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3);box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3)}[class*=t-mode--] [class*=t-mode--dark] .c-dialog,[class*=t-mode--dark] .c-dialog{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-dialog,[class*=t-mode--light] .c-dialog{background-color:#fff;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-dialog,[class*=t-mode--] [class*=t-mode--light] .c-dialog,[class*=t-mode--dark] .c-dialog,[class*=t-mode--light] .c-dialog{-webkit-box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3);box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3)}.c-dialog__message{padding:24px;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column}.c-dialog__title{font-size:20px;font-weight:600}.c-dialog__text,.c-dialog__title{line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-dialog__text{color:#2e2e2e;font-size:16px;font-weight:400}[class*=t-mode--] [class*=t-mode--dark] .c-dialog__text,[class*=t-mode--] [class*=t-mode--light] .c-dialog__text,[class*=t-mode--dark] .c-dialog__text,[class*=t-mode--light] .c-dialog__text{color:#fff}.c-dialog__title+.c-dialog__text{color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-dialog__title+.c-dialog__text,[class*=t-mode--] [class*=t-mode--light] .c-dialog__title+.c-dialog__text,[class*=t-mode--dark] .c-dialog__title+.c-dialog__text,[class*=t-mode--light] .c-dialog__title+.c-dialog__text{color:hsla(0,0%,100%,.75)}.c-dialog__actions{padding:0 24px 24px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;text-align:right}.c-dialog--graphic,.c-dialog--graphic>.c-dialog__actions{text-align:center}.c-dialog__graphic{-ms-flex-item-align:center;align-self:center;margin:0 0 12px}.c-dialog__graphic svg{position:relative;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);color:#bd2b2b;width:72px;height:72px}[class*=c-divider]{border:0;margin-bottom:24px}.c-divider{height:1px}.c-divider:after{content:\"\";display:inline-block;width:100%;max-width:100%;border-top:1px solid #333;vertical-align:top}.c-footer{display:block;width:100%;padding:24px;background-color:#f8f8f8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--light] .c-footer,[class*=t-mode--light] .c-footer{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-footer,[class*=t-mode--dark] .c-footer{background-color:#262626;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-footer,[class*=t-mode--light] .c-footer{background-color:#f8f8f8;color:#2e2e2e}.c-footer--fluid>.o-container{width:100%;max-width:none}.c-footer--centered{text-align:center}.c-image-responsive{display:block;height:auto;max-width:100%}.c-image-fit-cover{-o-object-fit:cover;object-fit:cover}.c-image-fit-contain{-o-object-fit:contain;object-fit:contain}.c-video-responsive{display:block;overflow:hidden;padding:0;position:relative;width:100%}.c-video-responsive:before{content:\"\";display:block;padding-bottom:56.25%}.c-video-responsive embed,.c-video-responsive iframe,.c-video-responsive object{border:0;bottom:0;height:100%;left:0;position:absolute;right:0;top:0;width:100%}video.c-video-responsive{height:auto;max-width:100%}video.c-video-responsive:before{content:none}.c-video-responsive-4-3:before{padding-bottom:75%}.c-video-responsive-1-1:before{padding-bottom:100%}.c-figure{margin:0 0 24px}.c-figure__caption{font-size:16px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-figure__caption,[class*=t-mode--] [class*=t-mode--light] .c-figure__caption,[class*=t-mode--dark] .c-figure__caption,[class*=t-mode--light] .c-figure__caption{color:hsla(0,0%,100%,.75)}.c-modal{position:fixed;top:0;right:0;bottom:0;left:0;width:auto;z-index:500;pointer-events:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.c-modal__container{position:relative;margin:1.75rem auto;outline:0}.c-modal__container .is-closed{-webkit-transform:translateY(-25%);transform:translateY(-25%)}.c-modal__container .is-open{-webkit-transform:translate(0);transform:translate(0)}.c-modal--centered .c-modal__container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.c-modal__dialog{display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;width:640px;height:100%;max-height:100%;pointer-events:auto;background-color:#fff;color:#2e2e2e;background-clip:padding-box;overflow:hidden;outline:0}[class*=t-mode--] [class*=t-mode--dark] .c-modal__dialog,[class*=t-mode--dark] .c-modal__dialog{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-modal__dialog,[class*=t-mode--light] .c-modal__dialog{background-color:#fff;color:#2e2e2e}.c-modal__header{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between}.c-image{position:relative;display:block}.c-image img{display:block;width:100%;height:auto}.c-image.c-image--1by1 img,.c-image.c-image--1by2 img,.c-image.c-image--1by3 img,.c-image.c-image--2by1 img,.c-image.c-image--2by3 img,.c-image.c-image--3by1 img,.c-image.c-image--3by2 img,.c-image.c-image--3by4 img,.c-image.c-image--3by5 img,.c-image.c-image--4by3 img,.c-image.c-image--4by5 img,.c-image.c-image--5by3 img,.c-image.c-image--5by4 img,.c-image.c-image--9by16 img,.c-image.c-image--16by9 img,.c-image.c-image--square img{bottom:0;left:0;position:absolute;right:0;top:0;width:100%;height:100%}.c-image.c-image--1by1,.c-image.c-image--square{padding-top:100%}.c-image.c-image--5by4{padding-top:80%}.c-image.c-image--4by3{padding-top:75%}.c-image.c-image--3by2{padding-top:66.6666%}.c-image.c-image--5by3{padding-top:60%}.c-image.c-image--16by9{padding-top:56.25%}.c-image.c-image--2by1{padding-top:50%}.c-image.c-image--3by1{padding-top:33.3333%}.c-image.c-image--4by5{padding-top:125%}.c-image.c-image--3by4{padding-top:133.3333%}.c-image.c-image--2by3{padding-top:150%}.c-image.c-image--3by5{padding-top:166.6666%}.c-image.c-image--9by16{padding-top:177.7777%}.c-image.c-image--1by2{padding-top:200%}.c-image.c-image--1by3{padding-top:300%}.c-form-input,.c-form-select{position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start;display:-ms-inline-flexbox;display:inline-flex;font-size:16px;line-height:24px;width:100%;max-width:100%;padding:.5em .75em;text-transform:unset;background-clip:padding-box;cursor:text;border-radius:4px;border-color:rgba(18,18,18,.25);border-style:solid;-webkit-box-shadow:none;box-shadow:none;-webkit-transition:1s cubic-bezier(.4,0,.2,1);transition:1s cubic-bezier(.4,0,.2,1);-webkit-transition-property:color,background-color,border;transition-property:color,background-color,border;vertical-align:top}.c-form-input+.c-help,.c-form-select+.c-help{padding-top:8px}.c-form-input+.c-button,.c-form-select+.c-button{margin-right:8px}.c-form-input+.c-button--fullwidth,.c-form-select+.c-button--fullwidth{margin-top:8px}.c-form-input:not(:last-child),.c-form-select:not(:last-child){margin:0}.c-form-input::-webkit-input-placeholder,.c-form-select::-webkit-input-placeholder{color:rgba(18,18,18,.75)}.c-form-input:-ms-input-placeholder,.c-form-select:-ms-input-placeholder{color:rgba(18,18,18,.75)}.c-form-input::-ms-input-placeholder,.c-form-select::-ms-input-placeholder{color:rgba(18,18,18,.75)}.c-form-input::placeholder,.c-form-select::placeholder{color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input::-webkit-input-placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select::-webkit-input-placeholder,[class*=t-mode--light] .c-form-input::-webkit-input-placeholder,[class*=t-mode--light] .c-form-select::-webkit-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input:-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select:-ms-input-placeholder,[class*=t-mode--light] .c-form-input:-ms-input-placeholder,[class*=t-mode--light] .c-form-select:-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input::-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select::-ms-input-placeholder,[class*=t-mode--light] .c-form-input::-ms-input-placeholder,[class*=t-mode--light] .c-form-select::-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input::placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select::placeholder,[class*=t-mode--light] .c-form-input::placeholder,[class*=t-mode--light] .c-form-select::placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input::-webkit-input-placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select::-webkit-input-placeholder,[class*=t-mode--dark] .c-form-input::-webkit-input-placeholder,[class*=t-mode--dark] .c-form-select::-webkit-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input:-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select:-ms-input-placeholder,[class*=t-mode--dark] .c-form-input:-ms-input-placeholder,[class*=t-mode--dark] .c-form-select:-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input::-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select::-ms-input-placeholder,[class*=t-mode--dark] .c-form-input::-ms-input-placeholder,[class*=t-mode--dark] .c-form-select::-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input::placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select::placeholder,[class*=t-mode--dark] .c-form-input::placeholder,[class*=t-mode--dark] .c-form-select::placeholder{color:hsla(0,0%,100%,.75)}.c-form-input:active,.c-form-input:focus,.c-form-select:active,.c-form-select:focus,.is-active.c-form-input,.is-active.c-form-select,.is-focused.c-form-input,.is-focused.c-form-select{color:inherit;border-color:#1887cc;outline:0;-webkit-box-shadow:0 0 0 1px rgba(24,135,204,.4);box-shadow:0 0 0 1px rgba(24,135,204,.4)}.c-form-input:disabled,.c-form-input[disabled],.c-form-select:disabled,.c-form-select[disabled],.is-disabled.c-form-input,.is-disabled.c-form-select{color:rgba(18,18,18,.5);background-color:hsla(0,0%,100%,.05);border-color:hsla(0,0%,100%,.1);-webkit-box-shadow:none;box-shadow:none;cursor:not-allowed}.is-error.c-form-input,.is-error.c-form-select{color:inherit;border-color:#bd2b2b}.is-error.c-form-input:active,.is-error.c-form-input:focus,.is-error.c-form-select:active,.is-error.c-form-select:focus,.is-error.is-active.c-form-input,.is-error.is-active.c-form-select,.is-error.is-focused.c-form-input,.is-error.is-focused.c-form-select{-webkit-box-shadow:0 0 0 1px rgba(189,43,43,.4);box-shadow:0 0 0 1px rgba(189,43,43,.4)}.is-success.c-form-input,.is-success.c-form-select{color:inherit;border-color:#006e14}.is-success.c-form-input:active,.is-success.c-form-input:focus,.is-success.c-form-select:active,.is-success.c-form-select:focus,.is-success.is-active.c-form-input,.is-success.is-active.c-form-select,.is-success.is-focused.c-form-input,.is-success.is-focused.c-form-select{-webkit-box-shadow:0 0 0 1px rgba(0,110,20,.4);box-shadow:0 0 0 1px rgba(0,110,20,.4)}.c-form-input{background-color:#fff;color:#2e2e2e;border-width:1px;-webkit-box-shadow:none;box-shadow:none}[class*=t-mode--] [class*=t-mode--dark] .c-form-input,[class*=t-mode--dark] .c-form-input{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-form-input,[class*=t-mode--light] .c-form-input{background-color:#fff;color:#2e2e2e}.c-form-input--sm{padding:.1em .75em;font-size:14px;line-height:24px}.c-form-input--lg{padding:.57em .75em;font-size:20px;max-height:none}.c-form-textarea{min-height:80px}.c-help{font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-help,[class*=t-mode--] [class*=t-mode--light] .c-help,[class*=t-mode--dark] .c-help,[class*=t-mode--light] .c-help{color:hsla(0,0%,100%,.75)}.c-help+.c-help{margin-top:4px}.c-help .c-ucon{margin:0 8px 0 0}.c-help.is-error{color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .c-help.is-error,[class*=t-mode--] [class*=t-mode--light] .c-help.is-error,[class*=t-mode--dark] .c-help.is-error,[class*=t-mode--light] .c-help.is-error{color:#f26868}.c-help.is-success{color:#008719}[class*=t-mode--] [class*=t-mode--dark] .c-help.is-success,[class*=t-mode--] [class*=t-mode--light] .c-help.is-success,[class*=t-mode--dark] .c-help.is-success,[class*=t-mode--light] .c-help.is-success{color:#45c15c}.c-form-check input,.c-form-radio input{margin:0 8px 0 0}.c-form-label{line-height:1.4;display:block;margin:0 0 12px;font-weight:600}.c-form-label:after,.c-form-label:before{content:\"\";display:block;height:0;width:0}.c-form-label:before{margin-bottom:-.41875em}.c-form-label:after{margin-top:-.35625em}.c-form-label--lg{font-size:18px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-form-label--xl{font-size:22px}.c-form-inline,.c-form-inline>.c-form-item{display:inline-block;margin:0 16px 0 0}.c-form-item{margin-bottom:24px}.c-form-row{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.c-form-row .c-form-item{position:relative;-ms-flex-preferred-size:auto;flex-basis:auto;-ms-flex-direction:row;flex-direction:row;-ms-flex-positive:1;flex-grow:1;min-width:24px;-ms-flex-negative:1;flex-shrink:1}.c-form-row .c-form-item:not(:last-of-type){margin:0 16px 0 0}.c-form-row .c-form-item--fit{width:auto;max-width:100%;-ms-flex-negative:0;flex-shrink:0}.c-form-select:not([multiple]) :not([size]){padding-right:2em;background:#fff url(\"data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23667189'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E\") no-repeat right .5em center/.75em .75em}.c-form-select::-ms-expand{display:none}.c-form-group{margin-bottom:24px}.c-form-group .c-form-item{margin-bottom:0}.c-form--horizontal .c-form-group,.c-form--horizontal .c-form-item{display:-ms-flexbox;display:flex}.c-ucon{position:relative;display:inline-block;vertical-align:middle;stroke-width:0;width:24px;height:24px}.c-ucon svg{vertical-align:top}.c-ucon--lg{width:48px;height:48px}.c-help .c-ucon,.c-ucon--sm{width:16px;height:16px}.c-ucon--mirrored{-webkit-filter:FlipH;filter:FlipH;-webkit-transform:scaleX(-1);transform:scaleX(-1)}.c-ucon--lg.c-ucon-loader:after{width:36px;height:36px}.c-help .c-ucon-loader.c-ucon:after,.c-ucon--sm.c-ucon-loader:after{width:16px;height:16px}.c-ucon-loader:after{width:24px;height:24px;display:block;-webkit-animation:spinAround .5s linear infinite;animation:spinAround .5s linear infinite;top:0;left:0;border-radius:4rem;border-color:transparent transparent currentcolor currentcolor;border-style:solid;border-width:1px;content:\"\"}.c-keyvalue{text-align:center}.c-keyvalue__label{font-size:14px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase;color:rgba(18,18,18,.75);line-height:1.4}[class*=t-mode--] [class*=t-mode--dark] .c-keyvalue__label,[class*=t-mode--] [class*=t-mode--light] .c-keyvalue__label,[class*=t-mode--dark] .c-keyvalue__label,[class*=t-mode--light] .c-keyvalue__label{color:hsla(0,0%,100%,.75)}.c-keyvalue__label:after,.c-keyvalue__label:before{content:\"\";display:block;height:0;width:0}.c-keyvalue__label:before{margin-bottom:-.41875em}.c-keyvalue__label:after{margin-top:-.35625em}.c-keyvalue__value{font-size:18px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;line-height:1.4}.c-keyvalue__value:after,.c-keyvalue__value:before{content:\"\";display:block;height:0;width:0}.c-keyvalue__value:before{margin-bottom:-.41875em}.c-keyvalue__value:after{margin-top:-.35625em}.c-keyvalue--lg .c-keyvalue__label{font-size:16px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase}.c-keyvalue--lg .c-keyvalue__value{font-size:32px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-keyvalue--xl>.c-keyvalue__label{font-size:16px;text-transform:uppercase}.c-keyvalue--xl>.c-keyvalue__label,.c-keyvalue--xl>.c-keyvalue__value{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit}.c-keyvalue--xl>.c-keyvalue__value{font-size:48px;text-transform:inherit}.c-keyvalue__label+.c-keyvalue__value,.c-keyvalue__value+.c-keyvalue__label{margin-top:4px}.c-link,.c-link-underlined{cursor:pointer}.c-link-underlined:visited,.c-link:visited{color:inherit}.c-link,.c-link-underlined{color:#0c77ba}[class*=t-mode--] [class*=t-mode--dark] .c-link,[class*=t-mode--] [class*=t-mode--dark] .c-link-underlined,[class*=t-mode--] [class*=t-mode--light] .c-link,[class*=t-mode--] [class*=t-mode--light] .c-link-underlined,[class*=t-mode--dark] .c-link,[class*=t-mode--dark] .c-link-underlined,[class*=t-mode--light] .c-link,[class*=t-mode--light] .c-link-underlined{color:#2594d9}.c-link-article{color:#0c77ba;background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(12,119,186,.15)),color-stop(rgba(12,119,186,.15)),to(rgba(12,119,186,.15)));background-image:linear-gradient(rgba(12,119,186,.15),rgba(12,119,186,.15),rgba(12,119,186,.15));background-repeat:repeat-x;background-position:1px 1.1em;background-size:1em 2px}[class*=t-mode--] [class*=t-mode--dark] .c-link-article,[class*=t-mode--] [class*=t-mode--light] .c-link-article,[class*=t-mode--dark] .c-link-article,[class*=t-mode--light] .c-link-article{color:#2594d9}.c-link-article:hover{text-decoration:none;background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(12,119,186,.45)),color-stop(rgba(12,119,186,.45)),to(rgba(12,119,186,.45)));background-image:linear-gradient(rgba(12,119,186,.45),rgba(12,119,186,.45),rgba(12,119,186,.45))}.c-link-info{border-bottom:1px dashed rgba(10,100,157,.6);color:#0c77ba}[class*=t-mode--] [class*=t-mode--dark] .c-link-info,[class*=t-mode--] [class*=t-mode--light] .c-link-info,[class*=t-mode--dark] .c-link-info,[class*=t-mode--light] .c-link-info{color:#2594d9}.c-link-implied,.c-link-info:hover{text-decoration:none}.c-link-implied{color:currentColor}.c-link-implied:hover,.c-link-underlined{text-decoration:underline}.c-list{padding:8px 0;margin:0;line-height:1.25;list-style-type:none}.c-list--large.c-list--two-line,.c-list--two-line>.c-list-item{height:72px}.c-list--lg{padding:8px 0}.c-list--lg>.c-list-item{height:48px;font-size:18px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-list .c-divider{margin:12px 0}.c-list-item{position:relative;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start;height:36px;padding:0 24px;font-size:16px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-list-item,[class*=t-mode--] [class*=t-mode--light] .c-list-item,[class*=t-mode--dark] .c-list-item,[class*=t-mode--light] .c-list-item{color:#fff}.c-list-item,.c-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.c-list-item__text{-ms-flex-positive:1;flex-grow:1}.c-list-item__secondary{display:block;font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-list-item__secondary,[class*=t-mode--] [class*=t-mode--light] .c-list-item__secondary,[class*=t-mode--dark] .c-list-item__secondary,[class*=t-mode--light] .c-list-item__secondary{color:hsla(0,0%,100%,.75)}.c-list-item__primary-text,.c-list-item__secondary-text,.c-list-item__text{line-height:1.25}.c-list-item:focus{outline:0}.c-list-item__anchor{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-negative:0;flex-shrink:0;margin:0 16px 0 0;color:rgba(18,18,18,.5);max-width:36px}[class*=t-mode--] [class*=t-mode--dark] .c-list-item__anchor,[class*=t-mode--] [class*=t-mode--light] .c-list-item__anchor,[class*=t-mode--dark] .c-list-item__anchor,[class*=t-mode--light] .c-list-item__anchor{color:hsla(0,0%,100%,.5)}.c-list-item__meta{color:rgba(18,18,18,.75);font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}[class*=t-mode--] [class*=t-mode--dark] .c-list-item__meta,[class*=t-mode--] [class*=t-mode--light] .c-list-item__meta,[class*=t-mode--dark] .c-list-item__meta,[class*=t-mode--light] .c-list-item__meta{color:hsla(0,0%,100%,.75)}a.c-list-item{color:inherit;text-decoration:none}a.c-list-item:hover{background-color:#ccc}.c-tabs__container{width:100%;padding:0}.c-tabs__content{display:none;padding:24px;background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__content,[class*=t-mode--dark] .c-tabs__content{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-tabs__content,[class*=t-mode--light] .c-tabs__content{background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__content,[class*=t-mode--dark] .c-tabs__content{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-tabs__content.is-active{display:block}.c-tabs__label{display:inline-block;padding:1rem 1.5625rem;margin:0 0 -1px;color:#0c77ba;text-align:center;background-color:rgba(18,18,18,.05)}.c-tabs__label:not(.is-active){border-bottom:1px solid rgba(18,18,18,.05)}.c-tabs__label:hover{cursor:pointer;background:rgba(0,0,0,.07)}.c-tabs__label.is-active{font-size:16px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 -1px 1px rgba(27,31,35,.15);box-shadow:0 -1px 1px rgba(27,31,35,.15)}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__label.is-active,[class*=t-mode--dark] .c-tabs__label.is-active{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-tabs__label.is-active,[class*=t-mode--light] .c-tabs__label.is-active{background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 -1px 1px #121212;box-shadow:0 -1px 1px #121212}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__label.is-active,[class*=t-mode--dark] .c-tabs__label.is-active{-webkit-box-shadow:0 -1px 1px #121212;box-shadow:0 -1px 1px #121212}.c-tag,a.c-tag{display:inline-block;text-align:center;white-space:nowrap;vertical-align:baseline;line-height:1;padding:4px 8px;font-size:12px;border-radius:4px;font-weight:600;background-color:rgba(18,18,18,.1);color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-tag,[class*=t-mode--] [class*=t-mode--dark] a.c-tag,[class*=t-mode--] [class*=t-mode--light] .c-tag,[class*=t-mode--] [class*=t-mode--light] a.c-tag,[class*=t-mode--dark] .c-tag,[class*=t-mode--dark] a.c-tag,[class*=t-mode--light] .c-tag,[class*=t-mode--light] a.c-tag{background-color:hsla(0,0%,100%,.25);color:#fff}.c-tag--lg,a.c-tag--lg{font-size:16px}.c-tag--success,a.c-tag--success{background-color:#008719;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--success,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--success,[class*=t-mode--] [class*=t-mode--light] .c-tag--success,[class*=t-mode--] [class*=t-mode--light] a.c-tag--success,[class*=t-mode--dark] .c-tag--success,[class*=t-mode--dark] a.c-tag--success,[class*=t-mode--light] .c-tag--success,[class*=t-mode--light] a.c-tag--success{background-color:#008719}.c-tag--brand,a.c-tag--brand{background-color:#0a649d;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--brand,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--brand,[class*=t-mode--] [class*=t-mode--light] .c-tag--brand,[class*=t-mode--] [class*=t-mode--light] a.c-tag--brand,[class*=t-mode--dark] .c-tag--brand,[class*=t-mode--dark] a.c-tag--brand,[class*=t-mode--light] .c-tag--brand,[class*=t-mode--light] a.c-tag--brand{background-color:#085280}.c-tag--danger,a.c-tag--danger{background-color:#bd2b2b;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--danger,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] .c-tag--danger,[class*=t-mode--] [class*=t-mode--light] a.c-tag--danger,[class*=t-mode--dark] .c-tag--danger,[class*=t-mode--dark] a.c-tag--danger,[class*=t-mode--light] .c-tag--danger,[class*=t-mode--light] a.c-tag--danger{background-color:#bd2b2b}.c-tag--warning,a.c-tag--warning{background-color:#ff9a0d;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-tag--warning,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] .c-tag--warning,[class*=t-mode--] [class*=t-mode--light] a.c-tag--warning,[class*=t-mode--dark] .c-tag--warning,[class*=t-mode--dark] a.c-tag--warning,[class*=t-mode--light] .c-tag--warning,[class*=t-mode--light] a.c-tag--warning{background-color:#ff9a0d;color:rgba(18,18,18,.75)}.c-tag--info,a.c-tag--info{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--info,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--info,[class*=t-mode--] [class*=t-mode--light] .c-tag--info,[class*=t-mode--] [class*=t-mode--light] a.c-tag--info,[class*=t-mode--dark] .c-tag--info,[class*=t-mode--dark] a.c-tag--info,[class*=t-mode--light] .c-tag--info,[class*=t-mode--light] a.c-tag--info{background-color:#fff;color:#2e2e2e}.c-tag:empty,a.c-tag:empty{display:none}.c-tag--secondary,a.c-tag--secondary{background-color:transparent;border:1px solid rgba(18,18,18,.25);color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary,[class*=t-mode--dark] .c-tag--secondary,[class*=t-mode--dark] a.c-tag--secondary,[class*=t-mode--light] .c-tag--secondary,[class*=t-mode--light] a.c-tag--secondary{background-color:transparent;color:hsla(0,0%,100%,.75)}.c-tag--secondary.c-tag--success,a.c-tag--secondary.c-tag--success{color:#008719;border-color:#008719}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--success,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--success,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--success,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--success,[class*=t-mode--dark] .c-tag--secondary.c-tag--success,[class*=t-mode--dark] a.c-tag--secondary.c-tag--success,[class*=t-mode--light] .c-tag--secondary.c-tag--success,[class*=t-mode--light] a.c-tag--secondary.c-tag--success{color:#45c15c;border-color:#45c15c}.c-tag--secondary.c-tag--danger,a.c-tag--secondary.c-tag--danger{color:#bd2b2b;border-color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--danger,[class*=t-mode--dark] .c-tag--secondary.c-tag--danger,[class*=t-mode--dark] a.c-tag--secondary.c-tag--danger,[class*=t-mode--light] .c-tag--secondary.c-tag--danger,[class*=t-mode--light] a.c-tag--secondary.c-tag--danger{color:#fa6464;border-color:#fa6464}.c-tag--secondary.c-tag--warning,a.c-tag--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--warning,[class*=t-mode--dark] .c-tag--secondary.c-tag--warning,[class*=t-mode--dark] a.c-tag--secondary.c-tag--warning,[class*=t-mode--light] .c-tag--secondary.c-tag--warning,[class*=t-mode--light] a.c-tag--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}.c-tag--secondary.c-tag--brand,a.c-tag--secondary.c-tag--brand{border-color:#0a649d;color:#0a649d}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--brand,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--brand,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--brand,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--brand,[class*=t-mode--dark] .c-tag--secondary.c-tag--brand,[class*=t-mode--dark] a.c-tag--secondary.c-tag--brand,[class*=t-mode--light] .c-tag--secondary.c-tag--brand,[class*=t-mode--light] a.c-tag--secondary.c-tag--brand{border-color:#085280;color:#085280}a.c-tag.is-hovered,a.c-tag:hover{cursor:pointer}.c-switch{position:relative;display:inline-block}.c-switch .c-switch__input{position:absolute;display:none}.c-switch .c-switch__input:checked~.c-switch__label .c-switch__control .c-switch__handle{right:0}.c-switch .c-switch__input:checked~.c-switch__label .c-switch__control .c-switch__track .c-switch__inner{margin-left:0}.c-switch .c-switch__label{display:block;cursor:pointer}.c-switch .c-switch__text{vertical-align:middle;font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;padding-left:8px;font-weight:600}.c-switch .c-switch__text--left{padding-left:0;padding-right:8px}.c-switch .c-switch__control{position:relative;width:46.2px;display:inline-block;vertical-align:middle}.c-switch .c-switch__handle{top:0;right:24.2px;margin:0;position:absolute;display:inline-block;width:22px;height:22px;border-radius:22px;z-index:1000;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.8);box-shadow:0 1px 2px rgba(0,0,0,.8);-webkit-transition:right .15s ease-in-out;-o-transition:right .15s ease-in-out;-moz-transition:right .15s ease-in-out;transition:right .15s ease-in-out;background-color:#fff;color:#2e2e2e;border:1px solid hsla(0,0%,100%,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__handle,[class*=t-mode--dark] .c-switch .c-switch__handle{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-switch .c-switch__handle,[class*=t-mode--light] .c-switch .c-switch__handle{background-color:#fff;color:#2e2e2e;border-color:rgba(18,18,18,.5)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__handle,[class*=t-mode--dark] .c-switch .c-switch__handle{border-color:rgba(18,18,18,.5)}.c-switch .c-switch__track{display:block;overflow:hidden;border-radius:44px;margin:0}.c-switch .c-switch__inner{width:200%;margin-left:-100%;-webkit-transition:margin .15s ease-in-out;-o-transition:margin .15s ease-in-out;-moz-transition:margin .15s ease-in-out;transition:margin .15s ease-in-out}.c-switch .c-switch__inner:after,.c-switch .c-switch__inner:before{float:left;display:block;width:50%;padding:0;height:22px;line-height:22px;font-size:12px;color:#fff;font-weight:600;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.7);box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.7);border-radius:44px}.c-switch .c-switch__inner:before{content:\"\";color:#2e2e2e;background-color:#2594d9;-webkit-box-shadow:inset 0 0 2px 1px rgba(18,18,18,.6),inset 0 0 1px 0 rgba(18,18,18,.7);box-shadow:inset 0 0 2px 1px rgba(18,18,18,.6),inset 0 0 1px 0 rgba(18,18,18,.7)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__inner:before,[class*=t-mode--] [class*=t-mode--light] .c-switch .c-switch__inner:before,[class*=t-mode--dark] .c-switch .c-switch__inner:before,[class*=t-mode--light] .c-switch .c-switch__inner:before{color:#fff;background-color:#2594d9}.c-switch .c-switch__inner:after{content:\"\";text-align:right;background-color:#e8e8e8;color:rgba(18,18,18,.75);-webkit-box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.9);box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.9)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__inner:after,[class*=t-mode--] [class*=t-mode--light] .c-switch .c-switch__inner:after,[class*=t-mode--dark] .c-switch .c-switch__inner:after,[class*=t-mode--light] .c-switch .c-switch__inner:after{background-color:#1f1f1f;color:hsla(0,0%,100%,.5)}.c-switch.c-switch--onoff .c-switch .c-switch__inner:after{content:\"OFF\"}.c-switch.c-switch--onoff .c-switch__inner:after{content:\"OFF\";padding-right:3px;font-size:12px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.5);line-height:1.75}[class*=t-mode--] [class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:after,[class*=t-mode--] [class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:after,[class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:after,[class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:after{color:hsla(0,0%,100%,.75)}.c-switch.c-switch--onoff .c-switch__inner:before{content:\"ON\";padding-left:5px;font-size:12px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:hsla(0,0%,100%,.75);line-height:1.75}[class*=t-mode--] [class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:before,[class*=t-mode--] [class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:before,[class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:before,[class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:before{color:hsla(0,0%,100%,.75)}.c-switch.c-switch--sm .c-switch__handle{right:14px;width:14px;height:14px;height:16px}.c-switch.c-switch--sm .c-switch__control{width:28px}.c-switch.c-switch--sm .c-switch__inner{width:200%;margin-left:-100%}.c-switch.c-switch--sm .c-switch__inner:after,.c-switch.c-switch--sm .c-switch__inner:before{height:16px;line-height:16px;font-size:1px}.c-switch.c-switch--lg .c-switch__control{width:59.4px;height:32px}.c-switch.c-switch--lg .c-switch__handle{right:27.4px;width:32px;height:32px}.c-switch.c-switch--lg .c-switch__inner{width:200%;margin-left:-100%}.c-switch.c-switch--lg .c-switch__inner:after,.c-switch.c-switch--lg .c-switch__inner:before{height:32px;line-height:32px}.c-sticker{-ms-flex-align:center;align-items:center;border-radius:4px;height:2rem;line-height:2rem;width:2rem;display:-ms-inline-flexbox;display:inline-flex;font-size:.625rem;font-weight:700;-ms-flex-pack:center;justify-content:center;position:relative;text-align:center;vertical-align:middle;background-color:rgba(18,18,18,.15);overflow:hidden}.c-sticker--circle{border-radius:5000px}body{font-size:16px;line-height:1.5em;font-family:Source Sans Pro,Arial,sans-serif;-webkit-font-smoothing:antialiased}.c-type-display1{font-size:72px}.c-type-display1,.c-type-display2{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-display2{font-size:48px}.c-type-headline1{font-size:32px}.c-type-headline1,.c-type-headline2{font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-headline2{font-size:24px}.c-type-headline3{font-size:20px}.c-type-headline3,.c-type-headline4{font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-headline4{font-size:18px}.c-type-headline5{font-size:16px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-category1{font-size:20px}.c-type-category1,.c-type-category2{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase}.c-type-category2{font-size:16px}.c-type-category3{font-size:14px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase}.c-type-body1{font-size:18px}.c-type-body1,.c-type-body2{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-body2{font-size:16px}.c-type-body3{font-size:14px}.c-type-body3,.c-type-micro{font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-micro{font-size:12px}body{background-color:#fff;color:#2e2e2e;-webkit-transition:background-color .1s linear;transition:background-color .1s linear}[class*=t-mode--] [class*=t-mode--dark] body,[class*=t-mode--dark] body{background-color:#2e2e2e}[class*=t-mode--] [class*=t-mode--light] body,[class*=t-mode--light] body{background-color:#fff;color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--dark] body,[class*=t-mode--dark] body{color:#fff}.o-container.t-mode--light,.o-section.t-mode--light,body.t-mode--light{background:#fff;color:#2e2e2e}.o-container.t-mode--dark,.o-section.t-mode--dark,body.t-mode--dark{background:#2e2e2e;color:#fff}.t-bg-canvas{background-color:#fff;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-canvas,[class*=t-mode--dark] .t-bg-canvas{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-canvas,[class*=t-mode--light] .t-bg-canvas{background-color:#fff;color:#2e2e2e}.t-bg-layer1{background-color:#f8f8f8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-layer1,[class*=t-mode--dark] .t-bg-layer1{background-color:#262626;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-layer1,[class*=t-mode--light] .t-bg-layer1{background-color:#f8f8f8;color:#2e2e2e}.t-bg-layer2{background-color:#e8e8e8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-layer2,[class*=t-mode--dark] .t-bg-layer2{background-color:#1f1f1f;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-layer2,[class*=t-mode--light] .t-bg-layer2{background-color:#e8e8e8;color:#2e2e2e}.t-bg-layer3{background-color:#dedede;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-layer3,[class*=t-mode--dark] .t-bg-layer3{background-color:#171717;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-layer3,[class*=t-mode--light] .t-bg-layer3{background-color:#dedede;color:#2e2e2e}.t-bg-brand1{background-color:#05314d;color:#fff}.t-bg-brand2{background-color:#085280;color:#fff}.t-bg-overlay{background-color:#121212;color:#fff}.t-bg-gray1{background-color:#2e2e2e;color:#fff}.t-bg-gray2{background-color:#474747;color:#fff}.t-mode--light .t-text-primary,.t-text-primary,[class*=t-mode--] .t-mode--light .t-text-primary{color:#2e2e2e}.t-mode--dark .t-text-primary,[class*=t-mode--] .t-mode--dark .t-text-primary{color:#fff}.c-switch .c-switch__text,.c-switch .t-mode--light .c-switch__text,.c-switch [class*=t-mode--] .t-mode--light .c-switch__text,.t-mode--light .c-switch .c-switch__text,.t-mode--light .t-text-secondary,.t-text-secondary,[class*=t-mode--] .t-mode--light .c-switch .c-switch__text,[class*=t-mode--] .t-mode--light .t-text-secondary{color:rgba(18,18,18,.75)}.c-switch .t-mode--dark .c-switch__text,.c-switch [class*=t-mode--] .t-mode--dark .c-switch__text,.t-mode--dark .c-switch .c-switch__text,.t-mode--dark .t-text-secondary,[class*=t-mode--] .t-mode--dark .c-switch .c-switch__text,[class*=t-mode--] .t-mode--dark .t-text-secondary{color:hsla(0,0%,100%,.75)}.t-mode--light .t-text-subtle,.t-text-subtle,[class*=t-mode--] .t-mode--light .t-text-subtle{color:rgba(18,18,18,.5)}.t-mode--dark .t-text-subtle,[class*=t-mode--] .t-mode--dark .t-text-subtle{color:hsla(0,0%,100%,.5)}.t-mode--light .t-text-hint,.t-text-hint,[class*=t-mode--] .t-mode--light .t-text-hint{color:rgba(18,18,18,.25)}.t-mode--dark .t-text-hint,[class*=t-mode--] .t-mode--dark .t-text-hint{color:hsla(0,0%,100%,.25)}.t-mode--light .t-text-error,.t-text-error,[class*=t-mode--] .t-mode--light .t-text-error{color:#bd2b2b}.t-mode--dark .t-text-error,[class*=t-mode--] .t-mode--dark .t-text-error{color:#f26868}.t-mode--light .t-text-warning,.t-text-warning,[class*=t-mode--] .t-mode--light .t-text-warning{color:#804d07}.t-mode--dark .t-text-warning,[class*=t-mode--] .t-mode--dark .t-text-warning{color:#e68b0c}.t-mode--light .t-text-success,.t-text-success,[class*=t-mode--] .t-mode--light .t-text-success{color:#008719}.t-mode--dark .t-text-success,[class*=t-mode--] .t-mode--dark .t-text-success{color:#45c15c}.t-mode--dark .t-text-brand1,.t-mode--light .t-text-brand1,.t-text-brand1,[class*=t-mode--] .t-mode--dark .t-text-brand1,[class*=t-mode--] .t-mode--light .t-text-brand1{color:#085280}.t-mode--dark .t-text-brand2,.t-mode--light .t-text-brand2,.t-text-brand2,[class*=t-mode--] .t-mode--dark .t-text-brand2,[class*=t-mode--] .t-mode--light .t-text-brand2{color:#0c7b91}.t-mode--dark .t-text-brand3,.t-mode--light .t-text-brand3,.t-text-brand3,[class*=t-mode--] .t-mode--dark .t-text-brand3,[class*=t-mode--] .t-mode--light .t-text-brand3{color:#c55422}.t-mode--light .t-text-link,.t-text-link,[class*=t-mode--] .t-mode--light .t-text-link{color:#0c77ba}.t-mode--dark .t-text-link,[class*=t-mode--] .t-mode--dark .t-text-link{color:#2594d9}.t-border-primary{border-color:rgba(18,18,18,.5)}[class*=t-mode--] [class*=t-mode--dark] .t-border-primary,[class*=t-mode--] [class*=t-mode--light] .t-border-primary,[class*=t-mode--dark] .t-border-primary,[class*=t-mode--light] .t-border-primary{border-color:hsla(0,0%,100%,.5)}.t-border-secondary{border-color:rgba(18,18,18,.25)}[class*=t-mode--] [class*=t-mode--dark] .t-border-secondary,[class*=t-mode--] [class*=t-mode--light] .t-border-secondary,[class*=t-mode--dark] .t-border-secondary,[class*=t-mode--light] .t-border-secondary{border-color:hsla(0,0%,100%,.25)}.t-border-subtle{border-color:rgba(18,18,18,.15)}[class*=t-mode--] [class*=t-mode--dark] .t-border-subtle,[class*=t-mode--] [class*=t-mode--light] .t-border-subtle,[class*=t-mode--dark] .t-border-subtle,[class*=t-mode--light] .t-border-subtle{border-color:hsla(0,0%,100%,.15)}.t-border-hint{border-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .t-border-hint,[class*=t-mode--] [class*=t-mode--light] .t-border-hint,[class*=t-mode--dark] .t-border-hint,[class*=t-mode--light] .t-border-hint{border-color:hsla(0,0%,100%,.1)}.t-border-error{border-color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .t-border-error,[class*=t-mode--] [class*=t-mode--light] .t-border-error,[class*=t-mode--dark] .t-border-error,[class*=t-mode--light] .t-border-error{border-color:#cc3535}.t-border-success{border-color:#006e14}[class*=t-mode--] [class*=t-mode--dark] .t-border-success,[class*=t-mode--] [class*=t-mode--light] .t-border-success,[class*=t-mode--dark] .t-border-success,[class*=t-mode--light] .t-border-success{border-color:#008719}.t-border-selected,[class*=t-mode--] [class*=t-mode--dark] .t-border-selected,[class*=t-mode--] [class*=t-mode--light] .t-border-selected,[class*=t-mode--dark] .t-border-selected,[class*=t-mode--light] .t-border-selected{border-color:#1887cc}.u-align-baseline{vertical-align:baseline!important}.u-align-top{vertical-align:top!important}.u-align-middle{vertical-align:middle!important}.u-align-bottom{vertical-align:bottom!important}.u-align-text-bottom{vertical-align:text-bottom!important}.u-align-text-top{vertical-align:text-top!important}\@media screen and (min-width:320px) and (max-width:767px){.u-align-baseline\\\@xs{vertical-align:baseline!important}.u-align-top\\\@xs{vertical-align:top!important}.u-align-middle\\\@xs{vertical-align:middle!important}.u-align-bottom\\\@xs{vertical-align:bottom!important}.u-align-text-bottom\\\@xs{vertical-align:text-bottom!important}.u-align-text-top\\\@xs{vertical-align:text-top!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-baseline\\\@sm{vertical-align:baseline!important}.u-align-top\\\@sm{vertical-align:top!important}.u-align-middle\\\@sm{vertical-align:middle!important}.u-align-bottom\\\@sm{vertical-align:bottom!important}.u-align-text-bottom\\\@sm{vertical-align:text-bottom!important}.u-align-text-top\\\@sm{vertical-align:text-top!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-baseline\\\@md{vertical-align:baseline!important}.u-align-top\\\@md{vertical-align:top!important}.u-align-middle\\\@md{vertical-align:middle!important}.u-align-bottom\\\@md{vertical-align:bottom!important}.u-align-text-bottom\\\@md{vertical-align:text-bottom!important}.u-align-text-top\\\@md{vertical-align:text-top!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-baseline\\\@lg{vertical-align:baseline!important}.u-align-top\\\@lg{vertical-align:top!important}.u-align-middle\\\@lg{vertical-align:middle!important}.u-align-bottom\\\@lg{vertical-align:bottom!important}.u-align-text-bottom\\\@lg{vertical-align:text-bottom!important}.u-align-text-top\\\@lg{vertical-align:text-top!important}}\@media screen and (min-width:1741px){.u-align-baseline\\\@xl{vertical-align:baseline!important}.u-align-top\\\@xl{vertical-align:top!important}.u-align-middle\\\@xl{vertical-align:middle!important}.u-align-bottom\\\@xl{vertical-align:bottom!important}.u-align-text-bottom\\\@xl{vertical-align:text-bottom!important}.u-align-text-top\\\@xl{vertical-align:text-top!important}}.u-fill-current{fill:currentColor!important}.u-stroke-current{stroke:currentColor!important}.u-cursor-auto{cursor:auto!important}.u-cursor-help{cursor:help!important}.u-cursor-pointer{cursor:pointer!important}.u-cursor-move{cursor:move!important}.u-cursor-zoom-in{cursor:-webkit-zoom-in!important;cursor:zoom-in!important}.u-cursor-zoom-out{cursor:-webkit-zoom-out!important;cursor:zoom-out!important}.u-cursor-not-allowed{cursor:not-allowed!important}.u-cursor-wait{cursor:wait!important}.u-display-none{display:none}.u-display-inline{display:inline}.u-display-block{display:block}.u-display-inline-block{display:inline-block}.u-display-table{display:table}.u-display-table-row{display:table-row}.u-display-table-cell{display:table-cell}.u-display-flex{display:-ms-flexbox;display:flex}.u-display-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.u-shade-10{background-color:rgba(18,18,18,.1)}.u-shade-15{background-color:rgba(18,18,18,.15)}.u-shade-25{background-color:rgba(18,18,18,.25)}.u-shade-50{background-color:rgba(18,18,18,.5)}.u-shade-75{background-color:rgba(18,18,18,.75)}.u-shade-90{background-color:rgba(18,18,18,.9)}.u-shade-05{background-color:rgba(18,18,18,.05)}.u-sr-only,.u-sr-only-focusable{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.u-sr-only-focusable:active,.u-sr-only-focusable:focus{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}.u-tint-10{background-color:hsla(0,0%,100%,.1)}.u-tint-15{background-color:hsla(0,0%,100%,.15)}.u-tint-25{background-color:hsla(0,0%,100%,.25)}.u-tint-50{background-color:hsla(0,0%,100%,.5)}.u-tint-75{background-color:hsla(0,0%,100%,.75)}.u-tint-90{background-color:hsla(0,0%,100%,.9)}.u-tint-05{background-color:hsla(0,0%,100%,.05)}.u-uppercase{text-transform:uppercase!important}.u-lowercase{text-transform:lowercase!important}.u-capitalize{text-transform:capitalize!important}.u-hidden{display:none!important}.u-invisible{visibility:hidden!important}.u-visible{visibility:visible!important}.u-visible-toggle:not(:hover) :not(.is-hover).u-hidden-hover:not(:focus){position:absolute!important;width:0!important;height:0!important;padding:0!important;margin:0!important;overflow:hidden!important}.u-visible-toggle:not(:hover) :not(.u-hover).u-invisible-hover:not(:focus){opacity:0!important}\@media screen and (min-width:320px) and (max-width:767px){.u-hidden\\\@xs{display:none!important}.u-invisible\\\@xs{visibility:hidden!important}.u-visible\\\@xs{visibility:visible!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-hidden\\\@sm{display:none!important}.u-invisible\\\@sm{visibility:hidden!important}.u-visible\\\@sm{visibility:visible!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-hidden\\\@md{display:none!important}.u-invisible\\\@md{visibility:hidden!important}.u-visible\\\@md{visibility:visible!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-hidden\\\@lg{display:none!important}.u-invisible\\\@lg{visibility:hidden!important}.u-visible\\\@lg{visibility:visible!important}}\@media screen and (min-width:1741px){.u-hidden\\\@xl{display:none!important}.u-invisible\\\@xl{visibility:hidden!important}.u-visible\\\@xl{visibility:visible!important}}.u-text-size-base{font-size:16px}.u-text-size-xxs{font-size:10px}.u-text-size-xs{font-size:12px}.u-text-size-sm{font-size:14px}.u-text-size-md{font-size:16px}.u-text-size-lg{font-size:18px}.u-text-size-xl{font-size:20px}.u-text-size-xxl{font-size:22px}.u-text-size-xxxl{font-size:24px}.u-text-size-xxxxl{font-size:32px}.u-text-size-display-2{font-size:48px}.u-text-size-display-1{font-size:72px}\@media screen and (min-width:320px) and (max-width:767px){.u-text-size-base\\\@xs{font-size:16px}.u-text-size-xxs\\\@xs{font-size:10px}.u-text-size-xs\\\@xs{font-size:12px}.u-text-size-sm\\\@xs{font-size:14px}.u-text-size-md\\\@xs{font-size:16px}.u-text-size-lg\\\@xs{font-size:18px}.u-text-size-xl\\\@xs{font-size:20px}.u-text-size-xxl\\\@xs{font-size:22px}.u-text-size-xxxl\\\@xs{font-size:24px}.u-text-size-xxxxl\\\@xs{font-size:32px}.u-text-size-display-2\\\@xs{font-size:48px}.u-text-size-display-1\\\@xs{font-size:72px}}\@media screen and (min-width:768px) and (max-width:959px){.u-text-size-base\\\@sm{font-size:16px}.u-text-size-xxs\\\@sm{font-size:10px}.u-text-size-xs\\\@sm{font-size:12px}.u-text-size-sm\\\@sm{font-size:14px}.u-text-size-md\\\@sm{font-size:16px}.u-text-size-lg\\\@sm{font-size:18px}.u-text-size-xl\\\@sm{font-size:20px}.u-text-size-xxl\\\@sm{font-size:22px}.u-text-size-xxxl\\\@sm{font-size:24px}.u-text-size-xxxxl\\\@sm{font-size:32px}.u-text-size-display-2\\\@sm{font-size:48px}.u-text-size-display-1\\\@sm{font-size:72px}}\@media screen and (min-width:960px) and (max-width:1377px){.u-text-size-base\\\@md{font-size:16px}.u-text-size-xxs\\\@md{font-size:10px}.u-text-size-xs\\\@md{font-size:12px}.u-text-size-sm\\\@md{font-size:14px}.u-text-size-md\\\@md{font-size:16px}.u-text-size-lg\\\@md{font-size:18px}.u-text-size-xl\\\@md{font-size:20px}.u-text-size-xxl\\\@md{font-size:22px}.u-text-size-xxxl\\\@md{font-size:24px}.u-text-size-xxxxl\\\@md{font-size:32px}.u-text-size-display-2\\\@md{font-size:48px}.u-text-size-display-1\\\@md{font-size:72px}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-text-size-base\\\@lg{font-size:16px}.u-text-size-xxs\\\@lg{font-size:10px}.u-text-size-xs\\\@lg{font-size:12px}.u-text-size-sm\\\@lg{font-size:14px}.u-text-size-md\\\@lg{font-size:16px}.u-text-size-lg\\\@lg{font-size:18px}.u-text-size-xl\\\@lg{font-size:20px}.u-text-size-xxl\\\@lg{font-size:22px}.u-text-size-xxxl\\\@lg{font-size:24px}.u-text-size-xxxxl\\\@lg{font-size:32px}.u-text-size-display-2\\\@lg{font-size:48px}.u-text-size-display-1\\\@lg{font-size:72px}}\@media screen and (min-width:1741px){.u-text-size-base\\\@xl{font-size:16px}.u-text-size-xxs\\\@xl{font-size:10px}.u-text-size-xs\\\@xl{font-size:12px}.u-text-size-sm\\\@xl{font-size:14px}.u-text-size-md\\\@xl{font-size:16px}.u-text-size-lg\\\@xl{font-size:18px}.u-text-size-xl\\\@xl{font-size:20px}.u-text-size-xxl\\\@xl{font-size:22px}.u-text-size-xxxl\\\@xl{font-size:24px}.u-text-size-xxxxl\\\@xl{font-size:32px}.u-text-size-display-2\\\@xl{font-size:48px}.u-text-size-display-1\\\@xl{font-size:72px}}.u-align-content-flex-start{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch{-ms-flex-line-pack:stretch;align-content:stretch}\@media screen and (min-width:320px) and (max-width:767px){.u-align-content-flex-start\\\@xs{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@xs{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@xs{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@xs{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@xs{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@xs{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-content-flex-start\\\@sm{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@sm{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@sm{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@sm{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@sm{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@sm{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-content-flex-start\\\@md{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@md{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@md{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@md{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@md{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@md{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-content-flex-start\\\@lg{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@lg{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@lg{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@lg{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@lg{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@lg{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:1741px){.u-align-content-flex-start\\\@xl{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@xl{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@xl{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@xl{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@xl{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@xl{-ms-flex-line-pack:stretch;align-content:stretch}}.u-align-items-flex-start{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end{-ms-flex-align:end;align-items:flex-end}.u-align-items-center{-ms-flex-align:center;align-items:center}.u-align-items-baseline{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch{-ms-flex-align:stretch;align-items:stretch}\@media screen and (min-width:320px) and (max-width:767px){.u-align-items-flex-start\\\@xs{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@xs{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@xs{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@xs{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@xs{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-items-flex-start\\\@sm{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@sm{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@sm{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@sm{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@sm{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-items-flex-start\\\@md{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@md{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@md{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@md{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@md{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-items-flex-start\\\@lg{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@lg{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@lg{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@lg{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@lg{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:1741px){.u-align-items-flex-start\\\@xl{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@xl{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@xl{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@xl{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@xl{-ms-flex-align:stretch;align-items:stretch}}.u-align-self-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}\@media screen and (min-width:320px) and (max-width:767px){.u-align-self-auto\\\@xs{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@xs{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@xs{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@xs{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@xs{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@xs{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-self-auto\\\@sm{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@sm{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@sm{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@sm{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@sm{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@sm{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-self-auto\\\@md{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@md{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@md{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@md{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@md{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@md{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-self-auto\\\@lg{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@lg{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@lg{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@lg{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@lg{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@lg{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:1741px){.u-align-self-auto\\\@xl{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@xl{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@xl{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@xl{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@xl{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@xl{-ms-flex-item-align:stretch!important;align-self:stretch!important}}.u-flex-direction-row{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse{-ms-flex-direction:column-reverse;flex-direction:column-reverse}\@media screen and (min-width:320px) and (max-width:767px){.u-flex-direction-row\\\@xs{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@xs{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@xs{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@xs{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:768px) and (max-width:959px){.u-flex-direction-row\\\@sm{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@sm{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@sm{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@sm{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:960px) and (max-width:1377px){.u-flex-direction-row\\\@md{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@md{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@md{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@md{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-flex-direction-row\\\@lg{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@lg{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@lg{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@lg{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:1741px){.u-flex-direction-row\\\@xl{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@xl{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@xl{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@xl{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}.u-flex{display:-ms-flexbox;display:flex}.u-flex-inline{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none{-ms-flex:none;flex:none}.u-flex-auto{-ms-flex:auto;flex:auto}.u-flex-1{-ms-flex:1;flex:1}.u-flex-1-1-auto{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto{-ms-flex:0 0 auto;flex:0 0 auto}\@media screen and (min-width:320px) and (max-width:767px){.u-flex\\\@xs{display:-ms-flexbox;display:flex}.u-flex-inline\\\@xs{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@xs{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@xs{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@xs{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@xs{-ms-flex:none;flex:none}.u-flex-auto\\\@xs{-ms-flex:auto;flex:auto}.u-flex-1\\\@xs{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@xs{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@xs{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@xs{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@xs{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:768px) and (max-width:959px){.u-flex\\\@sm{display:-ms-flexbox;display:flex}.u-flex-inline\\\@sm{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@sm{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@sm{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@sm{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@sm{-ms-flex:none;flex:none}.u-flex-auto\\\@sm{-ms-flex:auto;flex:auto}.u-flex-1\\\@sm{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@sm{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@sm{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@sm{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@sm{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:960px) and (max-width:1377px){.u-flex\\\@md{display:-ms-flexbox;display:flex}.u-flex-inline\\\@md{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@md{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@md{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@md{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@md{-ms-flex:none;flex:none}.u-flex-auto\\\@md{-ms-flex:auto;flex:auto}.u-flex-1\\\@md{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@md{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@md{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@md{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@md{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-flex\\\@lg{display:-ms-flexbox;display:flex}.u-flex-inline\\\@lg{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@lg{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@lg{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@lg{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@lg{-ms-flex:none;flex:none}.u-flex-auto\\\@lg{-ms-flex:auto;flex:auto}.u-flex-1\\\@lg{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@lg{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@lg{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@lg{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@lg{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:1741px){.u-flex\\\@xl{display:-ms-flexbox;display:flex}.u-flex-inline\\\@xl{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@xl{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@xl{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@xl{-ms-flex:none;flex:none}.u-flex-auto\\\@xl{-ms-flex:auto;flex:auto}.u-flex-1\\\@xl{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@xl{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@xl{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@xl{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@xl{-ms-flex:0 0 auto;flex:0 0 auto}}.u-justify-content-flex-start{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly{-ms-flex-pack:space-evenly;justify-content:space-evenly}\@media screen and (min-width:320px) and (max-width:767px){.u-justify-content-flex-start\\\@xs{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@xs{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@xs{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@xs{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@xs{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@xs{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:768px) and (max-width:959px){.u-justify-content-flex-start\\\@sm{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@sm{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@sm{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@sm{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@sm{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@sm{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:960px) and (max-width:1377px){.u-justify-content-flex-start\\\@md{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@md{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@md{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@md{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@md{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@md{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-justify-content-flex-start\\\@lg{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@lg{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@lg{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@lg{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@lg{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@lg{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:1741px){.u-justify-content-flex-start\\\@xl{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@xl{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@xl{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@xl{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@xl{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@xl{-ms-flex-pack:space-evenly;justify-content:space-evenly}}.u-order-0{-ms-flex-order:0;order:0}.u-order-1{-ms-flex-order:1;order:1}.u-order-2{-ms-flex-order:2;order:2}.u-order-3{-ms-flex-order:3;order:3}.u-order-4{-ms-flex-order:4;order:4}.u-order-5{-ms-flex-order:5;order:5}.u-order-6{-ms-flex-order:6;order:6}.u-order-7{-ms-flex-order:7;order:7}.u-order-8{-ms-flex-order:8;order:8}.u-order-9{-ms-flex-order:9;order:9}.u-order-10{-ms-flex-order:10;order:10}.u-order-11{-ms-flex-order:11;order:11}.u-order-minus1{-ms-flex-order:-1;order:-1}.u-order-last{-ms-flex-order:99;order:99}\@media screen and (min-width:320px) and (max-width:767px){.u-order-0\\\@xs{-ms-flex-order:0;order:0}.u-order-1\\\@xs{-ms-flex-order:1;order:1}.u-order-2\\\@xs{-ms-flex-order:2;order:2}.u-order-3\\\@xs{-ms-flex-order:3;order:3}.u-order-4\\\@xs{-ms-flex-order:4;order:4}.u-order-5\\\@xs{-ms-flex-order:5;order:5}.u-order-6\\\@xs{-ms-flex-order:6;order:6}.u-order-7\\\@xs{-ms-flex-order:7;order:7}.u-order-8\\\@xs{-ms-flex-order:8;order:8}.u-order-9\\\@xs{-ms-flex-order:9;order:9}.u-order-10\\\@xs{-ms-flex-order:10;order:10}.u-order-11\\\@xs{-ms-flex-order:11;order:11}.u-order-minus1\\\@xs{-ms-flex-order:-1;order:-1}.u-order-last\\\@xs{-ms-flex-order:99;order:99}}\@media screen and (min-width:768px) and (max-width:959px){.u-order-0\\\@sm{-ms-flex-order:0;order:0}.u-order-1\\\@sm{-ms-flex-order:1;order:1}.u-order-2\\\@sm{-ms-flex-order:2;order:2}.u-order-3\\\@sm{-ms-flex-order:3;order:3}.u-order-4\\\@sm{-ms-flex-order:4;order:4}.u-order-5\\\@sm{-ms-flex-order:5;order:5}.u-order-6\\\@sm{-ms-flex-order:6;order:6}.u-order-7\\\@sm{-ms-flex-order:7;order:7}.u-order-8\\\@sm{-ms-flex-order:8;order:8}.u-order-9\\\@sm{-ms-flex-order:9;order:9}.u-order-10\\\@sm{-ms-flex-order:10;order:10}.u-order-11\\\@sm{-ms-flex-order:11;order:11}.u-order-minus1\\\@sm{-ms-flex-order:-1;order:-1}.u-order-last\\\@sm{-ms-flex-order:99;order:99}}\@media screen and (min-width:960px) and (max-width:1377px){.u-order-0\\\@md{-ms-flex-order:0;order:0}.u-order-1\\\@md{-ms-flex-order:1;order:1}.u-order-2\\\@md{-ms-flex-order:2;order:2}.u-order-3\\\@md{-ms-flex-order:3;order:3}.u-order-4\\\@md{-ms-flex-order:4;order:4}.u-order-5\\\@md{-ms-flex-order:5;order:5}.u-order-6\\\@md{-ms-flex-order:6;order:6}.u-order-7\\\@md{-ms-flex-order:7;order:7}.u-order-8\\\@md{-ms-flex-order:8;order:8}.u-order-9\\\@md{-ms-flex-order:9;order:9}.u-order-10\\\@md{-ms-flex-order:10;order:10}.u-order-11\\\@md{-ms-flex-order:11;order:11}.u-order-minus1\\\@md{-ms-flex-order:-1;order:-1}.u-order-last\\\@md{-ms-flex-order:99;order:99}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-order-0\\\@lg{-ms-flex-order:0;order:0}.u-order-1\\\@lg{-ms-flex-order:1;order:1}.u-order-2\\\@lg{-ms-flex-order:2;order:2}.u-order-3\\\@lg{-ms-flex-order:3;order:3}.u-order-4\\\@lg{-ms-flex-order:4;order:4}.u-order-5\\\@lg{-ms-flex-order:5;order:5}.u-order-6\\\@lg{-ms-flex-order:6;order:6}.u-order-7\\\@lg{-ms-flex-order:7;order:7}.u-order-8\\\@lg{-ms-flex-order:8;order:8}.u-order-9\\\@lg{-ms-flex-order:9;order:9}.u-order-10\\\@lg{-ms-flex-order:10;order:10}.u-order-11\\\@lg{-ms-flex-order:11;order:11}.u-order-minus1\\\@lg{-ms-flex-order:-1;order:-1}.u-order-last\\\@lg{-ms-flex-order:99;order:99}}\@media screen and (min-width:1741px){.u-order-0\\\@xl{-ms-flex-order:0;order:0}.u-order-1\\\@xl{-ms-flex-order:1;order:1}.u-order-2\\\@xl{-ms-flex-order:2;order:2}.u-order-3\\\@xl{-ms-flex-order:3;order:3}.u-order-4\\\@xl{-ms-flex-order:4;order:4}.u-order-5\\\@xl{-ms-flex-order:5;order:5}.u-order-6\\\@xl{-ms-flex-order:6;order:6}.u-order-7\\\@xl{-ms-flex-order:7;order:7}.u-order-8\\\@xl{-ms-flex-order:8;order:8}.u-order-9\\\@xl{-ms-flex-order:9;order:9}.u-order-10\\\@xl{-ms-flex-order:10;order:10}.u-order-11\\\@xl{-ms-flex-order:11;order:11}.u-order-minus1\\\@xl{-ms-flex-order:-1;order:-1}.u-order-last\\\@xl{-ms-flex-order:99;order:99}}.u-inline-none{padding:0!important}.u-inline-xxs{padding:0 4px 0 0!important}.u-inline-xs{padding:0 8px 0 0!important}.u-inline-sm{padding:0 12px 0 0!important}.u-inline-md{padding:0 16px 0 0!important}.u-inline-lg{padding:0 24px 0 0!important}.u-inline-xl{padding:0 48px 0 0!important}.u-inline-xxl{padding:0 96px 0 0!important}.u-inset-none{padding:0!important}.u-inset-xxs{padding:2px!important}.u-inset-xs{padding:8px!important}.u-inset-sm{padding:12px!important}.u-inset-md{padding:16px!important}.u-inset-lg{padding:24px!important}.u-inset-xl{padding:48px!important}.u-inset-xxl{padding:96px!important}.u-squish-none{padding:0!important}.u-squish-xs{padding:4px 8px!important}.u-squish-sm{padding:8px 12px!important}.u-squish-md{padding:8px 16px!important}.u-squish-lg{padding:12px 24px!important}.u-squish-xl{padding:24px 48px!important}.u-squish-xxl{padding:48px 96px!important}.u-stack-none{padding:0!important}.u-stack-xxs{padding:0 0 4px!important}.u-stack-xs{padding:0 0 8px!important}.u-stack-sm{padding:0 0 12px!important}.u-stack-md{padding:0 0 16px!important}.u-stack-lg{padding:0 0 24px!important}.u-stack-xl{padding:0 0 48px!important}.u-stack-xxl{padding:0 0 96px!important}.u-stretch-none{padding:0!important}.u-stretch-sm{padding:18px 12px!important}.u-stretch-md{padding:24px 16px!important}.u-stretch-lg{padding:48px 24px!important}.u-p-0{padding:0}.u-m-0{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs{padding:4px}.u-m-xxs{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs{padding:8px}.u-m-xs{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm{padding:12px}.u-m-sm{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md{padding:16px}.u-m-md{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg{padding:24px}.u-m-lg{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl{padding:48px}.u-m-xl{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl{padding:96px}.u-m-xxl{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default{padding:16px}.u-m-default{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}\@media screen and (min-width:320px) and (max-width:767px){.u-inline-none\\\@xs{padding:0!important}.u-inline-xxs\\\@xs{padding:0 4px 0 0!important}.u-inline-xs\\\@xs{padding:0 8px 0 0!important}.u-inline-sm\\\@xs{padding:0 12px 0 0!important}.u-inline-md\\\@xs{padding:0 16px 0 0!important}.u-inline-lg\\\@xs{padding:0 24px 0 0!important}.u-inline-xl\\\@xs{padding:0 48px 0 0!important}.u-inline-xxl\\\@xs{padding:0 96px 0 0!important}.u-inset-none\\\@xs{padding:0!important}.u-inset-xxs\\\@xs{padding:2px!important}.u-inset-xs\\\@xs{padding:8px!important}.u-inset-sm\\\@xs{padding:12px!important}.u-inset-md\\\@xs{padding:16px!important}.u-inset-lg\\\@xs{padding:24px!important}.u-inset-xl\\\@xs{padding:48px!important}.u-inset-xxl\\\@xs{padding:96px!important}.u-squish-none\\\@xs{padding:0!important}.u-squish-xs\\\@xs{padding:4px 8px!important}.u-squish-sm\\\@xs{padding:8px 12px!important}.u-squish-md\\\@xs{padding:8px 16px!important}.u-squish-lg\\\@xs{padding:12px 24px!important}.u-squish-xl\\\@xs{padding:24px 48px!important}.u-squish-xxl\\\@xs{padding:48px 96px!important}.u-stack-none\\\@xs{padding:0!important}.u-stack-xxs\\\@xs{padding:0 0 4px!important}.u-stack-xs\\\@xs{padding:0 0 8px!important}.u-stack-sm\\\@xs{padding:0 0 12px!important}.u-stack-md\\\@xs{padding:0 0 16px!important}.u-stack-lg\\\@xs{padding:0 0 24px!important}.u-stack-xl\\\@xs{padding:0 0 48px!important}.u-stack-xxl\\\@xs{padding:0 0 96px!important}.u-stretch-none\\\@xs{padding:0!important}.u-stretch-sm\\\@xs{padding:18px 12px!important}.u-stretch-md\\\@xs{padding:24px 16px!important}.u-stretch-lg\\\@xs{padding:48px 24px!important}.u-p-0\\\@xs{padding:0}.u-m-0\\\@xs{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@xs{padding:4px}.u-m-xxs\\\@xs{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@xs{padding:8px}.u-m-xs\\\@xs{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@xs{padding:12px}.u-m-sm\\\@xs{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@xs{padding:16px}.u-m-md\\\@xs{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@xs{padding:24px}.u-m-lg\\\@xs{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@xs{padding:48px}.u-m-xl\\\@xs{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@xs{padding:96px}.u-m-xxl\\\@xs{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@xs{padding:16px}.u-m-default\\\@xs{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-inline-none\\\@sm{padding:0!important}.u-inline-xxs\\\@sm{padding:0 4px 0 0!important}.u-inline-xs\\\@sm{padding:0 8px 0 0!important}.u-inline-sm\\\@sm{padding:0 12px 0 0!important}.u-inline-md\\\@sm{padding:0 16px 0 0!important}.u-inline-lg\\\@sm{padding:0 24px 0 0!important}.u-inline-xl\\\@sm{padding:0 48px 0 0!important}.u-inline-xxl\\\@sm{padding:0 96px 0 0!important}.u-inset-none\\\@sm{padding:0!important}.u-inset-xxs\\\@sm{padding:2px!important}.u-inset-xs\\\@sm{padding:8px!important}.u-inset-sm\\\@sm{padding:12px!important}.u-inset-md\\\@sm{padding:16px!important}.u-inset-lg\\\@sm{padding:24px!important}.u-inset-xl\\\@sm{padding:48px!important}.u-inset-xxl\\\@sm{padding:96px!important}.u-squish-none\\\@sm{padding:0!important}.u-squish-xs\\\@sm{padding:4px 8px!important}.u-squish-sm\\\@sm{padding:8px 12px!important}.u-squish-md\\\@sm{padding:8px 16px!important}.u-squish-lg\\\@sm{padding:12px 24px!important}.u-squish-xl\\\@sm{padding:24px 48px!important}.u-squish-xxl\\\@sm{padding:48px 96px!important}.u-stack-none\\\@sm{padding:0!important}.u-stack-xxs\\\@sm{padding:0 0 4px!important}.u-stack-xs\\\@sm{padding:0 0 8px!important}.u-stack-sm\\\@sm{padding:0 0 12px!important}.u-stack-md\\\@sm{padding:0 0 16px!important}.u-stack-lg\\\@sm{padding:0 0 24px!important}.u-stack-xl\\\@sm{padding:0 0 48px!important}.u-stack-xxl\\\@sm{padding:0 0 96px!important}.u-stretch-none\\\@sm{padding:0!important}.u-stretch-sm\\\@sm{padding:18px 12px!important}.u-stretch-md\\\@sm{padding:24px 16px!important}.u-stretch-lg\\\@sm{padding:48px 24px!important}.u-p-0\\\@sm{padding:0}.u-m-0\\\@sm{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@sm{padding:4px}.u-m-xxs\\\@sm{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@sm{padding:8px}.u-m-xs\\\@sm{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@sm{padding:12px}.u-m-sm\\\@sm{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@sm{padding:16px}.u-m-md\\\@sm{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@sm{padding:24px}.u-m-lg\\\@sm{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@sm{padding:48px}.u-m-xl\\\@sm{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@sm{padding:96px}.u-m-xxl\\\@sm{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@sm{padding:16px}.u-m-default\\\@sm{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-inline-none\\\@md{padding:0!important}.u-inline-xxs\\\@md{padding:0 4px 0 0!important}.u-inline-xs\\\@md{padding:0 8px 0 0!important}.u-inline-sm\\\@md{padding:0 12px 0 0!important}.u-inline-md\\\@md{padding:0 16px 0 0!important}.u-inline-lg\\\@md{padding:0 24px 0 0!important}.u-inline-xl\\\@md{padding:0 48px 0 0!important}.u-inline-xxl\\\@md{padding:0 96px 0 0!important}.u-inset-none\\\@md{padding:0!important}.u-inset-xxs\\\@md{padding:2px!important}.u-inset-xs\\\@md{padding:8px!important}.u-inset-sm\\\@md{padding:12px!important}.u-inset-md\\\@md{padding:16px!important}.u-inset-lg\\\@md{padding:24px!important}.u-inset-xl\\\@md{padding:48px!important}.u-inset-xxl\\\@md{padding:96px!important}.u-squish-none\\\@md{padding:0!important}.u-squish-xs\\\@md{padding:4px 8px!important}.u-squish-sm\\\@md{padding:8px 12px!important}.u-squish-md\\\@md{padding:8px 16px!important}.u-squish-lg\\\@md{padding:12px 24px!important}.u-squish-xl\\\@md{padding:24px 48px!important}.u-squish-xxl\\\@md{padding:48px 96px!important}.u-stack-none\\\@md{padding:0!important}.u-stack-xxs\\\@md{padding:0 0 4px!important}.u-stack-xs\\\@md{padding:0 0 8px!important}.u-stack-sm\\\@md{padding:0 0 12px!important}.u-stack-md\\\@md{padding:0 0 16px!important}.u-stack-lg\\\@md{padding:0 0 24px!important}.u-stack-xl\\\@md{padding:0 0 48px!important}.u-stack-xxl\\\@md{padding:0 0 96px!important}.u-stretch-none\\\@md{padding:0!important}.u-stretch-sm\\\@md{padding:18px 12px!important}.u-stretch-md\\\@md{padding:24px 16px!important}.u-stretch-lg\\\@md{padding:48px 24px!important}.u-p-0\\\@md{padding:0}.u-m-0\\\@md{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@md{padding:4px}.u-m-xxs\\\@md{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@md{padding:8px}.u-m-xs\\\@md{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@md{padding:12px}.u-m-sm\\\@md{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@md{padding:16px}.u-m-md\\\@md{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@md{padding:24px}.u-m-lg\\\@md{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@md{padding:48px}.u-m-xl\\\@md{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@md{padding:96px}.u-m-xxl\\\@md{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@md{padding:16px}.u-m-default\\\@md{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-inline-none\\\@lg{padding:0!important}.u-inline-xxs\\\@lg{padding:0 4px 0 0!important}.u-inline-xs\\\@lg{padding:0 8px 0 0!important}.u-inline-sm\\\@lg{padding:0 12px 0 0!important}.u-inline-md\\\@lg{padding:0 16px 0 0!important}.u-inline-lg\\\@lg{padding:0 24px 0 0!important}.u-inline-xl\\\@lg{padding:0 48px 0 0!important}.u-inline-xxl\\\@lg{padding:0 96px 0 0!important}.u-inset-none\\\@lg{padding:0!important}.u-inset-xxs\\\@lg{padding:2px!important}.u-inset-xs\\\@lg{padding:8px!important}.u-inset-sm\\\@lg{padding:12px!important}.u-inset-md\\\@lg{padding:16px!important}.u-inset-lg\\\@lg{padding:24px!important}.u-inset-xl\\\@lg{padding:48px!important}.u-inset-xxl\\\@lg{padding:96px!important}.u-squish-none\\\@lg{padding:0!important}.u-squish-xs\\\@lg{padding:4px 8px!important}.u-squish-sm\\\@lg{padding:8px 12px!important}.u-squish-md\\\@lg{padding:8px 16px!important}.u-squish-lg\\\@lg{padding:12px 24px!important}.u-squish-xl\\\@lg{padding:24px 48px!important}.u-squish-xxl\\\@lg{padding:48px 96px!important}.u-stack-none\\\@lg{padding:0!important}.u-stack-xxs\\\@lg{padding:0 0 4px!important}.u-stack-xs\\\@lg{padding:0 0 8px!important}.u-stack-sm\\\@lg{padding:0 0 12px!important}.u-stack-md\\\@lg{padding:0 0 16px!important}.u-stack-lg\\\@lg{padding:0 0 24px!important}.u-stack-xl\\\@lg{padding:0 0 48px!important}.u-stack-xxl\\\@lg{padding:0 0 96px!important}.u-stretch-none\\\@lg{padding:0!important}.u-stretch-sm\\\@lg{padding:18px 12px!important}.u-stretch-md\\\@lg{padding:24px 16px!important}.u-stretch-lg\\\@lg{padding:48px 24px!important}.u-p-0\\\@lg{padding:0}.u-m-0\\\@lg{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@lg{padding:4px}.u-m-xxs\\\@lg{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@lg{padding:8px}.u-m-xs\\\@lg{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@lg{padding:12px}.u-m-sm\\\@lg{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@lg{padding:16px}.u-m-md\\\@lg{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@lg{padding:24px}.u-m-lg\\\@lg{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@lg{padding:48px}.u-m-xl\\\@lg{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@lg{padding:96px}.u-m-xxl\\\@lg{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@lg{padding:16px}.u-m-default\\\@lg{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:1741px){.u-inline-none\\\@xl{padding:0!important}.u-inline-xxs\\\@xl{padding:0 4px 0 0!important}.u-inline-xs\\\@xl{padding:0 8px 0 0!important}.u-inline-sm\\\@xl{padding:0 12px 0 0!important}.u-inline-md\\\@xl{padding:0 16px 0 0!important}.u-inline-lg\\\@xl{padding:0 24px 0 0!important}.u-inline-xl\\\@xl{padding:0 48px 0 0!important}.u-inline-xxl\\\@xl{padding:0 96px 0 0!important}.u-inset-none\\\@xl{padding:0!important}.u-inset-xxs\\\@xl{padding:2px!important}.u-inset-xs\\\@xl{padding:8px!important}.u-inset-sm\\\@xl{padding:12px!important}.u-inset-md\\\@xl{padding:16px!important}.u-inset-lg\\\@xl{padding:24px!important}.u-inset-xl\\\@xl{padding:48px!important}.u-inset-xxl\\\@xl{padding:96px!important}.u-squish-none\\\@xl{padding:0!important}.u-squish-xs\\\@xl{padding:4px 8px!important}.u-squish-sm\\\@xl{padding:8px 12px!important}.u-squish-md\\\@xl{padding:8px 16px!important}.u-squish-lg\\\@xl{padding:12px 24px!important}.u-squish-xl\\\@xl{padding:24px 48px!important}.u-squish-xxl\\\@xl{padding:48px 96px!important}.u-stack-none\\\@xl{padding:0!important}.u-stack-xxs\\\@xl{padding:0 0 4px!important}.u-stack-xs\\\@xl{padding:0 0 8px!important}.u-stack-sm\\\@xl{padding:0 0 12px!important}.u-stack-md\\\@xl{padding:0 0 16px!important}.u-stack-lg\\\@xl{padding:0 0 24px!important}.u-stack-xl\\\@xl{padding:0 0 48px!important}.u-stack-xxl\\\@xl{padding:0 0 96px!important}.u-stretch-none\\\@xl{padding:0!important}.u-stretch-sm\\\@xl{padding:18px 12px!important}.u-stretch-md\\\@xl{padding:24px 16px!important}.u-stretch-lg\\\@xl{padding:48px 24px!important}.u-p-0\\\@xl{padding:0}.u-m-0\\\@xl{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@xl{padding:4px}.u-m-xxs\\\@xl{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@xl{padding:8px}.u-m-xs\\\@xl{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@xl{padding:12px}.u-m-sm\\\@xl{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@xl{padding:16px}.u-m-md\\\@xl{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@xl{padding:24px}.u-m-lg\\\@xl{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@xl{padding:48px}.u-m-xl\\\@xl{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@xl{padding:96px}.u-m-xxl\\\@xl{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@xl{padding:16px}.u-m-default\\\@xl{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}.u-child-text-left,.u-text-left{text-align:left}.u-child-text-right,.u-text-right{text-align:right}.u-child-text-center,.u-text-center{text-align:center}.u-text-color-primary{color:fk-get-theme-text(\"primary\")}.u-text-color-primary-on-dark{color:fk-get-theme-text(\"primary\",\"onDark\")}.u-text-color-secondary{color:fk-get-theme-text(\"secondary\")}.u-text-color-secondary-on-dark{color:fk-get-theme-text(\"secondary\",\"onDark\")}.u-text-color-subtle{color:fk-get-theme-text(\"subtle\")}.u-text-color-subtle-on-dark{color:fk-get-theme-text(\"subtle\",\"onDark\")}.u-text-color-hint{color:fk-get-theme-text(\"hint\")}.u-text-color-hint-on-dark{color:fk-get-theme-text(\"hint\",\"onDark\")}.u-text-color-error{color:fk-get-theme-text(\"error\")}.u-text-color-error-on-dark{color:fk-get-theme-text(\"error\",\"onDark\")}.u-text-color-warning{color:fk-get-theme-text(\"warning\")}.u-text-color-warning-on-dark{color:fk-get-theme-text(\"warning\",\"onDark\")}.u-text-color-success{color:fk-get-theme-text(\"success\")}.u-text-color-success-on-dark{color:fk-get-theme-text(\"success\",\"onDark\")}.u-text-color-brand1{color:fk-get-theme-text(\"brand1\")}.u-text-color-brand1-on-dark{color:fk-get-theme-text(\"brand1\",\"onDark\")}.u-text-color-brand2{color:fk-get-theme-text(\"brand2\")}.u-text-color-brand2-on-dark{color:fk-get-theme-text(\"brand2\",\"onDark\")}.u-text-color-brand3{color:fk-get-theme-text(\"brand3\")}.u-text-color-brand3-on-dark{color:fk-get-theme-text(\"brand3\",\"onDark\")}.u-text-color-link{color:fk-get-theme-text(\"link\")}.u-text-color-link-on-dark{color:fk-get-theme-text(\"link\",\"onDark\")}.u-text-weight-regular{font-weight:400}.u-text-weight-semibold{font-weight:600}.u-text-weight-bold{font-weight:700}.u-text-weight-thin{font-weight:300}\@media screen and (min-width:320px) and (max-width:767px){.u-text-weight-regular\\\@xs{font-weight:400}.u-text-weight-semibold\\\@xs{font-weight:600}.u-text-weight-bold\\\@xs{font-weight:700}.u-text-weight-thin\\\@xs{font-weight:300}}\@media screen and (min-width:768px) and (max-width:959px){.u-text-weight-regular\\\@sm{font-weight:400}.u-text-weight-semibold\\\@sm{font-weight:600}.u-text-weight-bold\\\@sm{font-weight:700}.u-text-weight-thin\\\@sm{font-weight:300}}\@media screen and (min-width:960px) and (max-width:1377px){.u-text-weight-regular\\\@md{font-weight:400}.u-text-weight-semibold\\\@md{font-weight:600}.u-text-weight-bold\\\@md{font-weight:700}.u-text-weight-thin\\\@md{font-weight:300}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-text-weight-regular\\\@lg{font-weight:400}.u-text-weight-semibold\\\@lg{font-weight:600}.u-text-weight-bold\\\@lg{font-weight:700}.u-text-weight-thin\\\@lg{font-weight:300}}\@media screen and (min-width:1741px){.u-text-weight-regular\\\@xl{font-weight:400}.u-text-weight-semibold\\\@xl{font-weight:600}.u-text-weight-bold\\\@xl{font-weight:700}.u-text-weight-thin\\\@xl{font-weight:300}}.u-child-width-1>*,.u-width-1{width:1.1rem!important}.u-child-width-2>*,.u-width-2{width:2rem!important}.u-child-width-3>*,.u-width-3{width:4rem!important}.u-child-width-4>*,.u-width-4{width:8rem!important}.u-child-width-5>*,.u-width-5{width:16rem!important}.u-child-width-1-2>*,.u-child-width-2-4>*,.u-child-width-3-6>*,.u-child-width-5-10>*,.u-child-width-6-12>*,.u-width-1-2,.u-width-2-4,.u-width-3-6,.u-width-5-10,.u-width-6-12{width:49.97501%!important}.u-child-width-1-3>*,.u-child-width-2-6>*,.u-width-1-3,.u-width-2-6{width:33.32223%!important}.u-child-width-2-3>*,.u-child-width-4-6>*,.u-width-2-3,.u-width-4-6{width:66.64445%!important}.u-child-width-1-4>*,.u-width-1-4{width:24.99375%!important}.u-child-width-3-4>*,.u-width-3-4{width:74.98125%!important}.u-child-width-1-5>*,.u-width-1-5{width:19.996%!important}.u-child-width-2-5>*,.u-width-2-5{width:39.992%!important}.u-child-width-3-5>*,.u-width-3-5{width:59.988%!important}.u-child-width-4-5>*,.u-width-4-5{width:79.984%!important}.u-child-width-1-6>*,.u-width-1-6{width:16.66389%!important}.u-child-width-5-6>*,.u-width-5-6{width:83.31945%!important}.u-child-width-1-10>*,.u-width-1-10{width:9.999%!important}.u-child-width-2-10>*,.u-width-2-10{width:19.998%!important}.u-child-width-3-10>*,.u-width-3-10{width:29.997%!important}.u-child-width-4-10>*,.u-width-4-10{width:39.996%!important}.u-child-width-6-10>*,.u-width-6-10{width:59.994%!important}.u-child-width-7-10>*,.u-width-7-10{width:69.993%!important}.u-child-width-8-10>*,.u-width-8-10{width:79.992%!important}.u-child-width-9-10>*,.u-width-9-10{width:89.991%!important}.u-child-width-1-12>*,.u-width-1-12{width:8.33264%!important}.u-child-width-2-12>*,.u-width-2-12{width:16.66528%!important}.u-child-width-3-12>*,.u-width-3-12{width:24.99792%!important}.u-child-width-4-12>*,.u-width-4-12{width:33.33056%!important}.u-child-width-5-12>*,.u-width-5-12{width:41.66319%!important}.u-child-width-7-12>*,.u-width-7-12{width:58.32847%!important}.u-child-width-8-12>*,.u-width-8-12{width:66.66111%!important}.u-child-width-9-12>*,.u-width-9-12{width:74.99375%!important}.u-child-width-10-12>*,.u-width-10-12{width:83.32639%!important}.u-child-width-11-12>*,.u-width-11-12{width:91.65903%!important}.u-child-width-full>*,.u-width-full{width:100%!important}.u-width-fill{-ms-flex:1;flex:1;min-width:1px}.u-width-fit{-ms-flex:none!important;flex:none!important}\@media screen and (max-width:1740px){.u-child-width-1\\\@xl>*,.u-width-1\\\@xl{width:1.1rem!important}.u-child-width-2\\\@xl>*,.u-width-2\\\@xl{width:2rem!important}.u-child-width-3\\\@xl>*,.u-width-3\\\@xl{width:4rem!important}.u-child-width-4\\\@xl>*,.u-width-4\\\@xl{width:8rem!important}.u-child-width-5\\\@xl>*,.u-width-5\\\@xl{width:16rem!important}.u-child-width-1-2\\\@xl>*,.u-child-width-2-4\\\@xl>*,.u-child-width-3-6\\\@xl>*,.u-child-width-5-10\\\@xl>*,.u-child-width-6-12\\\@xl>*,.u-width-1-2\\\@xl,.u-width-2-4\\\@xl,.u-width-3-6\\\@xl,.u-width-5-10\\\@xl,.u-width-6-12\\\@xl{width:49.97501%!important}.u-child-width-1-3\\\@xl>*,.u-child-width-2-6\\\@xl>*,.u-width-1-3\\\@xl,.u-width-2-6\\\@xl{width:33.32223%!important}.u-child-width-2-3\\\@xl>*,.u-child-width-4-6\\\@xl>*,.u-width-2-3\\\@xl,.u-width-4-6\\\@xl{width:66.64445%!important}.u-child-width-1-4\\\@xl>*,.u-width-1-4\\\@xl{width:24.99375%!important}.u-child-width-3-4\\\@xl>*,.u-width-3-4\\\@xl{width:74.98125%!important}.u-child-width-1-5\\\@xl>*,.u-width-1-5\\\@xl{width:19.996%!important}.u-child-width-2-5\\\@xl>*,.u-width-2-5\\\@xl{width:39.992%!important}.u-child-width-3-5\\\@xl>*,.u-width-3-5\\\@xl{width:59.988%!important}.u-child-width-4-5\\\@xl>*,.u-width-4-5\\\@xl{width:79.984%!important}.u-child-width-1-6\\\@xl>*,.u-width-1-6\\\@xl{width:16.66389%!important}.u-child-width-5-6\\\@xl>*,.u-width-5-6\\\@xl{width:83.31945%!important}.u-child-width-1-10\\\@xl>*,.u-width-1-10\\\@xl{width:9.999%!important}.u-child-width-2-10\\\@xl>*,.u-width-2-10\\\@xl{width:19.998%!important}.u-child-width-3-10\\\@xl>*,.u-width-3-10\\\@xl{width:29.997%!important}.u-child-width-4-10\\\@xl>*,.u-width-4-10\\\@xl{width:39.996%!important}.u-child-width-6-10\\\@xl>*,.u-width-6-10\\\@xl{width:59.994%!important}.u-child-width-7-10\\\@xl>*,.u-width-7-10\\\@xl{width:69.993%!important}.u-child-width-8-10\\\@xl>*,.u-width-8-10\\\@xl{width:79.992%!important}.u-child-width-9-10\\\@xl>*,.u-width-9-10\\\@xl{width:89.991%!important}.u-child-width-1-12\\\@xl>*,.u-width-1-12\\\@xl{width:8.33264%!important}.u-child-width-2-12\\\@xl>*,.u-width-2-12\\\@xl{width:16.66528%!important}.u-child-width-3-12\\\@xl>*,.u-width-3-12\\\@xl{width:24.99792%!important}.u-child-width-4-12\\\@xl>*,.u-width-4-12\\\@xl{width:33.33056%!important}.u-child-width-5-12\\\@xl>*,.u-width-5-12\\\@xl{width:41.66319%!important}.u-child-width-7-12\\\@xl>*,.u-width-7-12\\\@xl{width:58.32847%!important}.u-child-width-8-12\\\@xl>*,.u-width-8-12\\\@xl{width:66.66111%!important}.u-child-width-9-12\\\@xl>*,.u-width-9-12\\\@xl{width:74.99375%!important}.u-child-width-10-12\\\@xl>*,.u-width-10-12\\\@xl{width:83.32639%!important}.u-child-width-11-12\\\@xl>*,.u-width-11-12\\\@xl{width:91.65903%!important}.u-child-width-full\\\@xl>*,.u-width-full\\\@xl{width:100%!important}.u-width-fill\\\@xl{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@xl{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:1740px){.u-child-width-1\\\@lg>*,.u-width-1\\\@lg{width:1.1rem!important}.u-child-width-2\\\@lg>*,.u-width-2\\\@lg{width:2rem!important}.u-child-width-3\\\@lg>*,.u-width-3\\\@lg{width:4rem!important}.u-child-width-4\\\@lg>*,.u-width-4\\\@lg{width:8rem!important}.u-child-width-5\\\@lg>*,.u-width-5\\\@lg{width:16rem!important}.u-child-width-1-2\\\@lg>*,.u-child-width-2-4\\\@lg>*,.u-child-width-3-6\\\@lg>*,.u-child-width-5-10\\\@lg>*,.u-child-width-6-12\\\@lg>*,.u-width-1-2\\\@lg,.u-width-2-4\\\@lg,.u-width-3-6\\\@lg,.u-width-5-10\\\@lg,.u-width-6-12\\\@lg{width:49.97501%!important}.u-child-width-1-3\\\@lg>*,.u-child-width-2-6\\\@lg>*,.u-width-1-3\\\@lg,.u-width-2-6\\\@lg{width:33.32223%!important}.u-child-width-2-3\\\@lg>*,.u-child-width-4-6\\\@lg>*,.u-width-2-3\\\@lg,.u-width-4-6\\\@lg{width:66.64445%!important}.u-child-width-1-4\\\@lg>*,.u-width-1-4\\\@lg{width:24.99375%!important}.u-child-width-3-4\\\@lg>*,.u-width-3-4\\\@lg{width:74.98125%!important}.u-child-width-1-5\\\@lg>*,.u-width-1-5\\\@lg{width:19.996%!important}.u-child-width-2-5\\\@lg>*,.u-width-2-5\\\@lg{width:39.992%!important}.u-child-width-3-5\\\@lg>*,.u-width-3-5\\\@lg{width:59.988%!important}.u-child-width-4-5\\\@lg>*,.u-width-4-5\\\@lg{width:79.984%!important}.u-child-width-1-6\\\@lg>*,.u-width-1-6\\\@lg{width:16.66389%!important}.u-child-width-5-6\\\@lg>*,.u-width-5-6\\\@lg{width:83.31945%!important}.u-child-width-1-10\\\@lg>*,.u-width-1-10\\\@lg{width:9.999%!important}.u-child-width-2-10\\\@lg>*,.u-width-2-10\\\@lg{width:19.998%!important}.u-child-width-3-10\\\@lg>*,.u-width-3-10\\\@lg{width:29.997%!important}.u-child-width-4-10\\\@lg>*,.u-width-4-10\\\@lg{width:39.996%!important}.u-child-width-6-10\\\@lg>*,.u-width-6-10\\\@lg{width:59.994%!important}.u-child-width-7-10\\\@lg>*,.u-width-7-10\\\@lg{width:69.993%!important}.u-child-width-8-10\\\@lg>*,.u-width-8-10\\\@lg{width:79.992%!important}.u-child-width-9-10\\\@lg>*,.u-width-9-10\\\@lg{width:89.991%!important}.u-child-width-1-12\\\@lg>*,.u-width-1-12\\\@lg{width:8.33264%!important}.u-child-width-2-12\\\@lg>*,.u-width-2-12\\\@lg{width:16.66528%!important}.u-child-width-3-12\\\@lg>*,.u-width-3-12\\\@lg{width:24.99792%!important}.u-child-width-4-12\\\@lg>*,.u-width-4-12\\\@lg{width:33.33056%!important}.u-child-width-5-12\\\@lg>*,.u-width-5-12\\\@lg{width:41.66319%!important}.u-child-width-7-12\\\@lg>*,.u-width-7-12\\\@lg{width:58.32847%!important}.u-child-width-8-12\\\@lg>*,.u-width-8-12\\\@lg{width:66.66111%!important}.u-child-width-9-12\\\@lg>*,.u-width-9-12\\\@lg{width:74.99375%!important}.u-child-width-10-12\\\@lg>*,.u-width-10-12\\\@lg{width:83.32639%!important}.u-child-width-11-12\\\@lg>*,.u-width-11-12\\\@lg{width:91.65903%!important}.u-child-width-full\\\@lg>*,.u-width-full\\\@lg{width:100%!important}.u-width-fill\\\@lg{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@lg{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:1377px){.u-child-width-1\\\@md>*,.u-width-1\\\@md{width:1.1rem!important}.u-child-width-2\\\@md>*,.u-width-2\\\@md{width:2rem!important}.u-child-width-3\\\@md>*,.u-width-3\\\@md{width:4rem!important}.u-child-width-4\\\@md>*,.u-width-4\\\@md{width:8rem!important}.u-child-width-5\\\@md>*,.u-width-5\\\@md{width:16rem!important}.u-child-width-1-2\\\@md>*,.u-child-width-2-4\\\@md>*,.u-child-width-3-6\\\@md>*,.u-child-width-5-10\\\@md>*,.u-child-width-6-12\\\@md>*,.u-width-1-2\\\@md,.u-width-2-4\\\@md,.u-width-3-6\\\@md,.u-width-5-10\\\@md,.u-width-6-12\\\@md{width:49.97501%!important}.u-child-width-1-3\\\@md>*,.u-child-width-2-6\\\@md>*,.u-width-1-3\\\@md,.u-width-2-6\\\@md{width:33.32223%!important}.u-child-width-2-3\\\@md>*,.u-child-width-4-6\\\@md>*,.u-width-2-3\\\@md,.u-width-4-6\\\@md{width:66.64445%!important}.u-child-width-1-4\\\@md>*,.u-width-1-4\\\@md{width:24.99375%!important}.u-child-width-3-4\\\@md>*,.u-width-3-4\\\@md{width:74.98125%!important}.u-child-width-1-5\\\@md>*,.u-width-1-5\\\@md{width:19.996%!important}.u-child-width-2-5\\\@md>*,.u-width-2-5\\\@md{width:39.992%!important}.u-child-width-3-5\\\@md>*,.u-width-3-5\\\@md{width:59.988%!important}.u-child-width-4-5\\\@md>*,.u-width-4-5\\\@md{width:79.984%!important}.u-child-width-1-6\\\@md>*,.u-width-1-6\\\@md{width:16.66389%!important}.u-child-width-5-6\\\@md>*,.u-width-5-6\\\@md{width:83.31945%!important}.u-child-width-1-10\\\@md>*,.u-width-1-10\\\@md{width:9.999%!important}.u-child-width-2-10\\\@md>*,.u-width-2-10\\\@md{width:19.998%!important}.u-child-width-3-10\\\@md>*,.u-width-3-10\\\@md{width:29.997%!important}.u-child-width-4-10\\\@md>*,.u-width-4-10\\\@md{width:39.996%!important}.u-child-width-6-10\\\@md>*,.u-width-6-10\\\@md{width:59.994%!important}.u-child-width-7-10\\\@md>*,.u-width-7-10\\\@md{width:69.993%!important}.u-child-width-8-10\\\@md>*,.u-width-8-10\\\@md{width:79.992%!important}.u-child-width-9-10\\\@md>*,.u-width-9-10\\\@md{width:89.991%!important}.u-child-width-1-12\\\@md>*,.u-width-1-12\\\@md{width:8.33264%!important}.u-child-width-2-12\\\@md>*,.u-width-2-12\\\@md{width:16.66528%!important}.u-child-width-3-12\\\@md>*,.u-width-3-12\\\@md{width:24.99792%!important}.u-child-width-4-12\\\@md>*,.u-width-4-12\\\@md{width:33.33056%!important}.u-child-width-5-12\\\@md>*,.u-width-5-12\\\@md{width:41.66319%!important}.u-child-width-7-12\\\@md>*,.u-width-7-12\\\@md{width:58.32847%!important}.u-child-width-8-12\\\@md>*,.u-width-8-12\\\@md{width:66.66111%!important}.u-child-width-9-12\\\@md>*,.u-width-9-12\\\@md{width:74.99375%!important}.u-child-width-10-12\\\@md>*,.u-width-10-12\\\@md{width:83.32639%!important}.u-child-width-11-12\\\@md>*,.u-width-11-12\\\@md{width:91.65903%!important}.u-child-width-full\\\@md>*,.u-width-full\\\@md{width:100%!important}.u-width-fill\\\@md{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@md{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:959px){.u-child-width-1\\\@sm>*,.u-width-1\\\@sm{width:1.1rem!important}.u-child-width-2\\\@sm>*,.u-width-2\\\@sm{width:2rem!important}.u-child-width-3\\\@sm>*,.u-width-3\\\@sm{width:4rem!important}.u-child-width-4\\\@sm>*,.u-width-4\\\@sm{width:8rem!important}.u-child-width-5\\\@sm>*,.u-width-5\\\@sm{width:16rem!important}.u-child-width-1-2\\\@sm>*,.u-child-width-2-4\\\@sm>*,.u-child-width-3-6\\\@sm>*,.u-child-width-5-10\\\@sm>*,.u-child-width-6-12\\\@sm>*,.u-width-1-2\\\@sm,.u-width-2-4\\\@sm,.u-width-3-6\\\@sm,.u-width-5-10\\\@sm,.u-width-6-12\\\@sm{width:49.97501%!important}.u-child-width-1-3\\\@sm>*,.u-child-width-2-6\\\@sm>*,.u-width-1-3\\\@sm,.u-width-2-6\\\@sm{width:33.32223%!important}.u-child-width-2-3\\\@sm>*,.u-child-width-4-6\\\@sm>*,.u-width-2-3\\\@sm,.u-width-4-6\\\@sm{width:66.64445%!important}.u-child-width-1-4\\\@sm>*,.u-width-1-4\\\@sm{width:24.99375%!important}.u-child-width-3-4\\\@sm>*,.u-width-3-4\\\@sm{width:74.98125%!important}.u-child-width-1-5\\\@sm>*,.u-width-1-5\\\@sm{width:19.996%!important}.u-child-width-2-5\\\@sm>*,.u-width-2-5\\\@sm{width:39.992%!important}.u-child-width-3-5\\\@sm>*,.u-width-3-5\\\@sm{width:59.988%!important}.u-child-width-4-5\\\@sm>*,.u-width-4-5\\\@sm{width:79.984%!important}.u-child-width-1-6\\\@sm>*,.u-width-1-6\\\@sm{width:16.66389%!important}.u-child-width-5-6\\\@sm>*,.u-width-5-6\\\@sm{width:83.31945%!important}.u-child-width-1-10\\\@sm>*,.u-width-1-10\\\@sm{width:9.999%!important}.u-child-width-2-10\\\@sm>*,.u-width-2-10\\\@sm{width:19.998%!important}.u-child-width-3-10\\\@sm>*,.u-width-3-10\\\@sm{width:29.997%!important}.u-child-width-4-10\\\@sm>*,.u-width-4-10\\\@sm{width:39.996%!important}.u-child-width-6-10\\\@sm>*,.u-width-6-10\\\@sm{width:59.994%!important}.u-child-width-7-10\\\@sm>*,.u-width-7-10\\\@sm{width:69.993%!important}.u-child-width-8-10\\\@sm>*,.u-width-8-10\\\@sm{width:79.992%!important}.u-child-width-9-10\\\@sm>*,.u-width-9-10\\\@sm{width:89.991%!important}.u-child-width-1-12\\\@sm>*,.u-width-1-12\\\@sm{width:8.33264%!important}.u-child-width-2-12\\\@sm>*,.u-width-2-12\\\@sm{width:16.66528%!important}.u-child-width-3-12\\\@sm>*,.u-width-3-12\\\@sm{width:24.99792%!important}.u-child-width-4-12\\\@sm>*,.u-width-4-12\\\@sm{width:33.33056%!important}.u-child-width-5-12\\\@sm>*,.u-width-5-12\\\@sm{width:41.66319%!important}.u-child-width-7-12\\\@sm>*,.u-width-7-12\\\@sm{width:58.32847%!important}.u-child-width-8-12\\\@sm>*,.u-width-8-12\\\@sm{width:66.66111%!important}.u-child-width-9-12\\\@sm>*,.u-width-9-12\\\@sm{width:74.99375%!important}.u-child-width-10-12\\\@sm>*,.u-width-10-12\\\@sm{width:83.32639%!important}.u-child-width-11-12\\\@sm>*,.u-width-11-12\\\@sm{width:91.65903%!important}.u-child-width-full\\\@sm>*,.u-width-full\\\@sm{width:100%!important}.u-width-fill\\\@sm{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@sm{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:767px){.u-child-width-1\\\@xs>*,.u-width-1\\\@xs{width:1.1rem!important}.u-child-width-2\\\@xs>*,.u-width-2\\\@xs{width:2rem!important}.u-child-width-3\\\@xs>*,.u-width-3\\\@xs{width:4rem!important}.u-child-width-4\\\@xs>*,.u-width-4\\\@xs{width:8rem!important}.u-child-width-5\\\@xs>*,.u-width-5\\\@xs{width:16rem!important}.u-child-width-1-2\\\@xs>*,.u-child-width-2-4\\\@xs>*,.u-child-width-3-6\\\@xs>*,.u-child-width-5-10\\\@xs>*,.u-child-width-6-12\\\@xs>*,.u-width-1-2\\\@xs,.u-width-2-4\\\@xs,.u-width-3-6\\\@xs,.u-width-5-10\\\@xs,.u-width-6-12\\\@xs{width:49.97501%!important}.u-child-width-1-3\\\@xs>*,.u-child-width-2-6\\\@xs>*,.u-width-1-3\\\@xs,.u-width-2-6\\\@xs{width:33.32223%!important}.u-child-width-2-3\\\@xs>*,.u-child-width-4-6\\\@xs>*,.u-width-2-3\\\@xs,.u-width-4-6\\\@xs{width:66.64445%!important}.u-child-width-1-4\\\@xs>*,.u-width-1-4\\\@xs{width:24.99375%!important}.u-child-width-3-4\\\@xs>*,.u-width-3-4\\\@xs{width:74.98125%!important}.u-child-width-1-5\\\@xs>*,.u-width-1-5\\\@xs{width:19.996%!important}.u-child-width-2-5\\\@xs>*,.u-width-2-5\\\@xs{width:39.992%!important}.u-child-width-3-5\\\@xs>*,.u-width-3-5\\\@xs{width:59.988%!important}.u-child-width-4-5\\\@xs>*,.u-width-4-5\\\@xs{width:79.984%!important}.u-child-width-1-6\\\@xs>*,.u-width-1-6\\\@xs{width:16.66389%!important}.u-child-width-5-6\\\@xs>*,.u-width-5-6\\\@xs{width:83.31945%!important}.u-child-width-1-10\\\@xs>*,.u-width-1-10\\\@xs{width:9.999%!important}.u-child-width-2-10\\\@xs>*,.u-width-2-10\\\@xs{width:19.998%!important}.u-child-width-3-10\\\@xs>*,.u-width-3-10\\\@xs{width:29.997%!important}.u-child-width-4-10\\\@xs>*,.u-width-4-10\\\@xs{width:39.996%!important}.u-child-width-6-10\\\@xs>*,.u-width-6-10\\\@xs{width:59.994%!important}.u-child-width-7-10\\\@xs>*,.u-width-7-10\\\@xs{width:69.993%!important}.u-child-width-8-10\\\@xs>*,.u-width-8-10\\\@xs{width:79.992%!important}.u-child-width-9-10\\\@xs>*,.u-width-9-10\\\@xs{width:89.991%!important}.u-child-width-1-12\\\@xs>*,.u-width-1-12\\\@xs{width:8.33264%!important}.u-child-width-2-12\\\@xs>*,.u-width-2-12\\\@xs{width:16.66528%!important}.u-child-width-3-12\\\@xs>*,.u-width-3-12\\\@xs{width:24.99792%!important}.u-child-width-4-12\\\@xs>*,.u-width-4-12\\\@xs{width:33.33056%!important}.u-child-width-5-12\\\@xs>*,.u-width-5-12\\\@xs{width:41.66319%!important}.u-child-width-7-12\\\@xs>*,.u-width-7-12\\\@xs{width:58.32847%!important}.u-child-width-8-12\\\@xs>*,.u-width-8-12\\\@xs{width:66.66111%!important}.u-child-width-9-12\\\@xs>*,.u-width-9-12\\\@xs{width:74.99375%!important}.u-child-width-10-12\\\@xs>*,.u-width-10-12\\\@xs{width:83.32639%!important}.u-child-width-11-12\\\@xs>*,.u-width-11-12\\\@xs{width:91.65903%!important}.u-child-width-full\\\@xs>*,.u-width-full\\\@xs{width:100%!important}.u-width-fill\\\@xs{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@xs{-ms-flex:none!important;flex:none!important}}:host .mdc-toolbar--fixed{z-index:5}:host section{margin:0 1.5em 0 1.2em;transition:opacity .25s ease-in-out;-moz-transition:opacity .25s ease-in-out;-webkit-transition:opacity .25s ease-in-out}:host section .mdc-typography--subheading2{color:var(--mdc-theme-text-primary-on-primary,#000);font-size:1.1rem;text-overflow:ellipsis}\@media only screen and (max-width:900px){:host #left-panel{max-width:30%}:host #center-panel{min-width:40%}:host #right-panel{max-width:30%}}\@media only screen and (max-width:700px){:host #right-panel{display:none}:host #center-panel{min-width:100%;padding:0}:host #left-panel{display:none}}"; }
}

class Devices {
}
Devices.iphoneX = (h("div", { class: "marvel-device iphone-x" },
    h("div", { class: "notch" },
        h("div", { class: "camera" }),
        h("div", { class: "speaker" })),
    h("div", { class: "top-bar" }),
    h("div", { class: "sleep" }),
    h("div", { class: "bottom-bar" }),
    h("div", { class: "volume" }),
    h("div", { class: "overflow" },
        h("div", { class: "shadow shadow--tr" }),
        h("div", { class: "shadow shadow--tl" }),
        h("div", { class: "shadow shadow--br" }),
        h("div", { class: "shadow shadow--bl" })),
    h("div", { class: "inner-shadow" }),
    h("div", { class: "screen" },
        h("slot", { name: "screen" }))));
Devices.iphone8 = (h("div", { class: "marvel-device iphone8 silver" },
    h("div", { class: "top-bar" }),
    h("div", { class: "sleep" }),
    h("div", { class: "volume" }),
    h("div", { class: "camera" }),
    h("div", { class: "sensor" }),
    h("div", { class: "speaker" }),
    h("div", { class: "screen" },
        h("slot", { name: "screen" })),
    h("div", { class: "home" }),
    h("div", { class: "bottom-bar" })));
Devices.note8 = (h("div", { class: "marvel-device note8" },
    h("div", { class: "inner" }),
    h("div", { class: "overflow" },
        h("div", { class: "shadow" })),
    h("div", { class: "speaker" }),
    h("div", { class: "sensors" }),
    h("div", { class: "more-sensors" }),
    h("div", { class: "sleep" }),
    h("div", { class: "volume" }),
    h("div", { class: "camera" }),
    h("div", { class: "screen" },
        h("slot", { name: "screen" }))));
Devices.nexus5 = (h("div", { class: "marvel-device nexus5" },
    h("div", { class: "top-bar" }),
    h("div", { class: "sleep" }),
    h("div", { class: "volume" }),
    h("div", { class: "camera" }),
    h("div", { class: "screen" },
        h("slot", { name: "screen" }))));
Devices.lumia920 = (h("div", { class: "marvel-device lumia920 yellow" },
    h("div", { class: "top-bar" }),
    h("div", { class: "volume" }),
    h("div", { class: "camera" }),
    h("div", { class: "speaker" }),
    h("div", { class: "screen" },
        h("slot", { name: "screen" }))));
Devices.iPad = (h("div", { class: "marvel-device ipad silver" },
    h("div", { class: "camera" }),
    h("div", { class: "screen" },
        h("slot", { name: "screen" })),
    h("div", { class: "home" })));

class DemoDevicesComponent {
    constructor() {
        this.selectedDevice = 0;
        this.deviceArray = [Devices.iphoneX, Devices.iphone8, Devices.note8, Devices.nexus5, Devices.lumia920, Devices.iPad];
    }
    componentWillUpdate() {
        window.requestAnimationFrame(() => this._sizeFrame());
    }
    componentDidLoad() {
        this.evtListenerRotate = document.addEventListener('rotate-device', this.rotateDevice.bind(this));
        this.evtListenerDeviceChange = document.addEventListener('change-device', this.changeDevice.bind(this));
        this.el.forceUpdate();
    }
    componentDidUnload() {
        document.removeEventListener('rotate-device', this.evtListenerRotate);
        document.removeEventListener('rotate-device', this.evtListenerDeviceChange);
    }
    _sizeFrame() {
        const slotEl = this.el.querySelector('[slot=screen]');
        const iFrameEl = this.el.querySelector('iframe');
        iFrameEl.width = `${slotEl.clientWidth}px`;
        iFrameEl.height = `${slotEl.clientHeight}px`;
        this.el.forceUpdate();
    }
    changeDevice(evt) {
        if (evt.detail === 'navigate-next') {
            this.selectedDevice < this.deviceArray.length - 1 ? this.selectedDevice++ : this.selectedDevice = 0;
        }
        else if (evt.detail === 'navigate-before') {
            this.selectedDevice > 0 ? this.selectedDevice-- : this.selectedDevice = this.deviceArray.length - 1;
        }
    }
    rotateDevice() {
        this._sizeFrame();
        this.el.shadowRoot.querySelector('.marvel-device').classList.toggle('landscape');
    }
    render() {
        return this.deviceArray[this.selectedDevice];
    }
    static get is() { return "o-demo-devices"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "orientation": {
            "type": String,
            "attr": "orientation"
        },
        "selectedDevice": {
            "state": true
        }
    }; }
    static get style() { return ":host .marvel-device{display:inline-block;position:relative;-webkit-box-sizing:content-box!important;box-sizing:content-box!important}:host .marvel-device .screen{width:100%;position:relative;height:100%;z-index:3;background:#fff;overflow:hidden;display:block;border-radius:1px;-webkit-box-shadow:0 0 0 3px #111;box-shadow:0 0 0 3px #111}:host .marvel-device .bottom-bar,:host .marvel-device .top-bar{height:3px;background:#000;width:100%;display:block}:host .marvel-device .middle-bar{width:3px;height:4px;top:0;left:90px;background:#000;position:absolute}:host .marvel-device.iphone8{width:375px;height:667px;padding:105px 24px;background:#d9dbdc;border-radius:56px;-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.2);box-shadow:inset 0 0 3px 0 rgba(0,0,0,.2)}:host .marvel-device.iphone8:before{width:calc(100% - 12px);height:calc(100% - 12px);position:absolute;top:6px;content:\"\";left:6px;border-radius:50px;background:#f8f8f8;z-index:1}:host .marvel-device.iphone8:after{width:calc(100% - 16px);height:calc(100% - 16px);position:absolute;top:8px;content:\"\";left:8px;border-radius:48px;-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #fff;box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #fff;z-index:2}:host .marvel-device.iphone8 .home{border-radius:100%;width:68px;height:68px;position:absolute;left:50%;margin-left:-34px;bottom:22px;z-index:3;background:#303233;background:linear-gradient(135deg,#303233,#b5b7b9 50%,#f0f2f2 69%,#303233)}:host .marvel-device.iphone8 .home:before{background:#f8f8f8;position:absolute;content:\"\";border-radius:100%;width:calc(100% - 8px);height:calc(100% - 8px);top:4px;left:4px}:host .marvel-device.iphone8 .top-bar{height:14px;background:#bfbfc0;position:absolute;top:68px;left:0}:host .marvel-device.iphone8 .bottom-bar{height:14px;background:#bfbfc0;position:absolute;bottom:68px;left:0}:host .marvel-device.iphone8 .sleep{position:absolute;top:190px;right:-4px;width:4px;height:66px;border-radius:0 2px 2px 0;background:#d9dbdc}:host .marvel-device.iphone8 .volume{position:absolute;left:-4px;top:188px;z-index:0;height:66px;width:4px;border-radius:2px 0 0 2px;background:#d9dbdc}:host .marvel-device.iphone8 .volume:before{left:2px;top:-78px;height:40px;width:2px}:host .marvel-device.iphone8 .volume:after,:host .marvel-device.iphone8 .volume:before{position:absolute;border-radius:2px 0 0 2px;background:inherit;content:\"\";display:block}:host .marvel-device.iphone8 .volume:after{left:0;top:82px;height:66px;width:4px}:host .marvel-device.iphone8 .camera{background:#3c3d3d;width:12px;height:12px;position:absolute;top:24px;left:50%;margin-left:-6px;border-radius:100%;z-index:3}:host .marvel-device.iphone8 .sensor{background:#3c3d3d;width:16px;height:16px;position:absolute;top:49px;left:134px;z-index:3;border-radius:100%}:host .marvel-device.iphone8 .speaker{background:#292728;width:70px;height:6px;position:absolute;top:54px;left:50%;margin-left:-35px;border-radius:6px;z-index:3}:host .marvel-device.iphone8.gold{background:#f9e7d3}:host .marvel-device.iphone8.gold .bottom-bar,:host .marvel-device.iphone8.gold .top-bar{background:#fff}:host .marvel-device.iphone8.gold .sleep,:host .marvel-device.iphone8.gold .volume{background:#f9e7d3}:host .marvel-device.iphone8.gold .home{background:#cebba9;background:linear-gradient(135deg,#cebba9,#f9e7d3 50%,#cebba9)}:host .marvel-device.iphone8.black{background:#464646;-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.7);box-shadow:inset 0 0 3px 0 rgba(0,0,0,.7)}:host .marvel-device.iphone8.black:before{background:#080808}:host .marvel-device.iphone8.black:after{-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #212121;box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #212121}:host .marvel-device.iphone8.black .bottom-bar,:host .marvel-device.iphone8.black .top-bar{background:#212121}:host .marvel-device.iphone8.black .sleep,:host .marvel-device.iphone8.black .volume{background:#464646}:host .marvel-device.iphone8.black .camera{background:#080808}:host .marvel-device.iphone8.black .home{background:#080808;background:linear-gradient(135deg,#080808,#464646 50%,#080808)}:host .marvel-device.iphone8.black .home:before{background:#080808}:host .marvel-device.iphone8.landscape{padding:24px 105px;height:375px;width:667px}:host .marvel-device.iphone8.landscape .sleep{top:100%;border-radius:0 0 2px 2px;right:190px;height:4px;width:66px}:host .marvel-device.iphone8.landscape .volume{width:66px;height:4px;top:-4px;left:calc(100% - 254px);border-radius:2px 2px 0 0}:host .marvel-device.iphone8.landscape .volume:before{width:40px;height:2px;top:2px;right:-78px;left:auto;border-radius:2px 2px 0 0}:host .marvel-device.iphone8.landscape .volume:after{left:-82px;width:66px;height:4px;top:0;border-radius:2px 2px 0 0}:host .marvel-device.iphone8.landscape .top-bar{width:14px;height:100%;left:calc(100% - 82px);top:0}:host .marvel-device.iphone8.landscape .bottom-bar{width:14px;height:100%;left:68px;top:0}:host .marvel-device.iphone8.landscape .home{top:50%;margin-top:-34px;margin-left:0;left:22px}:host .marvel-device.iphone8.landscape .sensor{top:134px;left:calc(100% - 65px)}:host .marvel-device.iphone8.landscape .speaker{height:70px;width:6px;left:calc(100% - 60px);top:50%;margin-left:0;margin-top:-35px}:host .marvel-device.iphone8.landscape .camera{left:calc(100% - 32px);top:50%;margin-left:0;margin-top:-5px}:host .marvel-device.iphone8plus{width:414px;height:736px;padding:112px 26px;background:#d9dbdc;border-radius:56px;-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.2);box-shadow:inset 0 0 3px 0 rgba(0,0,0,.2)}:host .marvel-device.iphone8plus:before{width:calc(100% - 12px);height:calc(100% - 12px);position:absolute;top:6px;content:\"\";left:6px;border-radius:50px;background:#f8f8f8;z-index:1}:host .marvel-device.iphone8plus:after{width:calc(100% - 16px);height:calc(100% - 16px);position:absolute;top:8px;content:\"\";left:8px;border-radius:48px;-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #fff;box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #fff;z-index:2}:host .marvel-device.iphone8plus .home{border-radius:100%;width:68px;height:68px;position:absolute;left:50%;margin-left:-34px;bottom:24px;z-index:3;background:#303233;background:linear-gradient(135deg,#303233,#b5b7b9 50%,#f0f2f2 69%,#303233)}:host .marvel-device.iphone8plus .home:before{background:#f8f8f8;position:absolute;content:\"\";border-radius:100%;width:calc(100% - 8px);height:calc(100% - 8px);top:4px;left:4px}:host .marvel-device.iphone8plus .top-bar{height:14px;background:#bfbfc0;position:absolute;top:68px;left:0}:host .marvel-device.iphone8plus .bottom-bar{height:14px;background:#bfbfc0;position:absolute;bottom:68px;left:0}:host .marvel-device.iphone8plus .sleep{position:absolute;top:190px;right:-4px;width:4px;height:66px;border-radius:0 2px 2px 0;background:#d9dbdc}:host .marvel-device.iphone8plus .volume{position:absolute;left:-4px;top:188px;z-index:0;height:66px;width:4px;border-radius:2px 0 0 2px;background:#d9dbdc}:host .marvel-device.iphone8plus .volume:before{position:absolute;left:2px;top:-78px;height:40px;width:2px;border-radius:2px 0 0 2px;background:inherit;content:\"\";display:block}:host .marvel-device.iphone8plus .volume:after{position:absolute;left:0;top:82px;height:66px;width:4px;border-radius:2px 0 0 2px;background:inherit;content:\"\";display:block}:host .marvel-device.iphone8plus .camera{background:#3c3d3d;width:12px;height:12px;position:absolute;top:29px;left:50%;margin-left:-6px;border-radius:100%;z-index:3}:host .marvel-device.iphone8plus .sensor{background:#3c3d3d;width:16px;height:16px;position:absolute;top:54px;left:154px;z-index:3;border-radius:100%}:host .marvel-device.iphone8plus .speaker{background:#292728;width:70px;height:6px;position:absolute;top:59px;left:50%;margin-left:-35px;border-radius:6px;z-index:3}:host .marvel-device.iphone8plus.gold{background:#f9e7d3}:host .marvel-device.iphone8plus.gold .bottom-bar,:host .marvel-device.iphone8plus.gold .top-bar{background:#fff}:host .marvel-device.iphone8plus.gold .sleep,:host .marvel-device.iphone8plus.gold .volume{background:#f9e7d3}:host .marvel-device.iphone8plus.gold .home{background:#cebba9;background:linear-gradient(135deg,#cebba9,#f9e7d3 50%,#cebba9)}:host .marvel-device.iphone8plus.black{background:#464646;-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.7);box-shadow:inset 0 0 3px 0 rgba(0,0,0,.7)}:host .marvel-device.iphone8plus.black:before{background:#080808}:host .marvel-device.iphone8plus.black:after{-webkit-box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #212121;box-shadow:inset 0 0 3px 0 rgba(0,0,0,.1),inset 0 0 6px 3px #212121}:host .marvel-device.iphone8plus.black .bottom-bar,:host .marvel-device.iphone8plus.black .top-bar{background:#212121}:host .marvel-device.iphone8plus.black .sleep,:host .marvel-device.iphone8plus.black .volume{background:#464646}:host .marvel-device.iphone8plus.black .camera{background:#080808}:host .marvel-device.iphone8plus.black .home{background:#080808;background:linear-gradient(135deg,#080808,#464646 50%,#080808)}:host .marvel-device.iphone8plus.black .home:before{background:#080808}:host .marvel-device.iphone8plus.landscape{padding:26px 112px;height:414px;width:736px}:host .marvel-device.iphone8plus.landscape .sleep{top:100%;border-radius:0 0 2px 2px;right:190px;height:4px;width:66px}:host .marvel-device.iphone8plus.landscape .volume{width:66px;height:4px;top:-4px;left:calc(100% - 254px);border-radius:2px 2px 0 0}:host .marvel-device.iphone8plus.landscape .volume:before{width:40px;height:2px;top:2px;right:-78px;left:auto;border-radius:2px 2px 0 0}:host .marvel-device.iphone8plus.landscape .volume:after{left:-82px;width:66px;height:4px;top:0;border-radius:2px 2px 0 0}:host .marvel-device.iphone8plus.landscape .top-bar{width:14px;height:100%;left:calc(100% - 82px);top:0}:host .marvel-device.iphone8plus.landscape .bottom-bar{width:14px;height:100%;left:68px;top:0}:host .marvel-device.iphone8plus.landscape .home{top:50%;margin-top:-34px;margin-left:0;left:24px}:host .marvel-device.iphone8plus.landscape .sensor{top:154px;left:calc(100% - 70px)}:host .marvel-device.iphone8plus.landscape .speaker{height:70px;width:6px;left:calc(100% - 65px);top:50%;margin-left:0;margin-top:-35px}:host .marvel-device.iphone8plus.landscape .camera{left:calc(100% - 29px);top:50%;margin-left:0;margin-top:-5px}:host .marvel-device.iphone5c,:host .marvel-device.iphone5s{padding:105px 22px;background:#2c2b2c;width:320px;height:568px;border-radius:50px}:host .marvel-device.iphone5c:before,:host .marvel-device.iphone5s:before{width:calc(100% - 8px);height:calc(100% - 8px);position:absolute;top:4px;content:\"\";left:4px;border-radius:46px;background:#1e1e1e;z-index:1}:host .marvel-device.iphone5c .sleep,:host .marvel-device.iphone5s .sleep{position:absolute;top:-4px;right:60px;width:60px;height:4px;border-radius:2px 2px 0 0;background:#282727}:host .marvel-device.iphone5c .volume,:host .marvel-device.iphone5s .volume{position:absolute;left:-4px;top:180px;z-index:0;height:27px;width:4px;border-radius:2px 0 0 2px;background:#282727}:host .marvel-device.iphone5c .volume:before,:host .marvel-device.iphone5s .volume:before{position:absolute;left:0;top:-75px;height:35px;width:4px;border-radius:2px 0 0 2px;background:inherit;content:\"\";display:block}:host .marvel-device.iphone5c .volume:after,:host .marvel-device.iphone5s .volume:after{position:absolute;left:0;bottom:-64px;height:27px;width:4px;border-radius:2px 0 0 2px;background:inherit;content:\"\";display:block}:host .marvel-device.iphone5c .camera,:host .marvel-device.iphone5s .camera{background:#3c3d3d;width:10px;height:10px;position:absolute;top:32px;left:50%;margin-left:-5px;border-radius:5px;z-index:3}:host .marvel-device.iphone5c .sensor,:host .marvel-device.iphone5s .sensor{background:#3c3d3d;width:10px;height:10px;position:absolute;top:60px;left:160px;z-index:3;margin-left:-32px;border-radius:5px}:host .marvel-device.iphone5c .speaker,:host .marvel-device.iphone5s .speaker{background:#292728;width:64px;height:10px;position:absolute;top:60px;left:50%;margin-left:-32px;border-radius:5px;z-index:3}:host .marvel-device.iphone5c.landscape,:host .marvel-device.iphone5s.landscape{padding:22px 105px;height:320px;width:568px}:host .marvel-device.iphone5c.landscape .sleep,:host .marvel-device.iphone5s.landscape .sleep{right:-4px;top:calc(100% - 120px);height:60px;width:4px;border-radius:0 2px 2px 0}:host .marvel-device.iphone5c.landscape .volume,:host .marvel-device.iphone5s.landscape .volume{width:27px;height:4px;top:-4px;left:calc(100% - 180px);border-radius:2px 2px 0 0}:host .marvel-device.iphone5c.landscape .volume:before,:host .marvel-device.iphone5s.landscape .volume:before{width:35px;height:4px;top:0;right:-75px;left:auto;border-radius:2px 2px 0 0}:host .marvel-device.iphone5c.landscape .volume:after,:host .marvel-device.iphone5s.landscape .volume:after{bottom:0;left:-64px;z-index:999;height:4px;width:27px;border-radius:2px 2px 0 0}:host .marvel-device.iphone5c.landscape .sensor,:host .marvel-device.iphone5s.landscape .sensor{top:160px;left:calc(100% - 60px);margin-left:0;margin-top:-32px}:host .marvel-device.iphone5c.landscape .speaker,:host .marvel-device.iphone5s.landscape .speaker{height:64px;width:10px;left:calc(100% - 60px);top:50%;margin-left:0;margin-top:-32px}:host .marvel-device.iphone5c.landscape .camera,:host .marvel-device.iphone5s.landscape .camera{left:calc(100% - 32px);top:50%;margin-left:0;margin-top:-5px}:host .marvel-device.iphone5s .home{border-radius:36px;width:68px;-webkit-box-shadow:inset 0 0 0 4px #2c2b2c;box-shadow:inset 0 0 0 4px #2c2b2c;height:68px;position:absolute;left:50%;margin-left:-34px;bottom:19px;z-index:3}:host .marvel-device.iphone5s .top-bar{top:70px;position:absolute;left:0}:host .marvel-device.iphone5s .bottom-bar{bottom:70px;position:absolute;left:0}:host .marvel-device.iphone5s.landscape .home{left:19px;bottom:50%;margin-bottom:-34px;margin-left:0}:host .marvel-device.iphone5s.landscape .top-bar{left:70px;top:0;width:3px;height:100%}:host .marvel-device.iphone5s.landscape .bottom-bar{right:70px;left:auto;bottom:0;width:3px;height:100%}:host .marvel-device.iphone5s.silver{background:#bcbcbc}:host .marvel-device.iphone5s.silver:before{background:#fcfcfc}:host .marvel-device.iphone5s.silver .sleep,:host .marvel-device.iphone5s.silver .volume{background:#d6d6d6}:host .marvel-device.iphone5s.silver .bottom-bar,:host .marvel-device.iphone5s.silver .top-bar{background:#eaebec}:host .marvel-device.iphone5s.silver .home{-webkit-box-shadow:inset 0 0 0 4px #bcbcbc;box-shadow:inset 0 0 0 4px #bcbcbc}:host .marvel-device.iphone5s.gold{background:#f9e7d3}:host .marvel-device.iphone5s.gold:before{background:#fcfcfc}:host .marvel-device.iphone5s.gold .sleep,:host .marvel-device.iphone5s.gold .volume{background:#f9e7d3}:host .marvel-device.iphone5s.gold .bottom-bar,:host .marvel-device.iphone5s.gold .top-bar{background:#fff}:host .marvel-device.iphone5s.gold .home{-webkit-box-shadow:inset 0 0 0 4px #f9e7d3;box-shadow:inset 0 0 0 4px #f9e7d3}:host .marvel-device.iphone5c{background:#fff;-webkit-box-shadow:0 1px 2px 0 rgba(0,0,0,.2);box-shadow:0 1px 2px 0 rgba(0,0,0,.2)}:host .marvel-device.iphone5c .bottom-bar,:host .marvel-device.iphone5c .top-bar{display:none}:host .marvel-device.iphone5c .home{background:#242324;border-radius:36px;width:68px;height:68px;z-index:3;position:absolute;left:50%;margin-left:-34px;bottom:19px}:host .marvel-device.iphone5c .home:after{width:20px;height:20px;border:1px solid hsla(0,0%,100%,.1);border-radius:4px;position:absolute;display:block;content:\"\";top:50%;left:50%;margin-top:-11px;margin-left:-11px}:host .marvel-device.iphone5c.landscape .home{left:19px;bottom:50%;margin-bottom:-34px;margin-left:0}:host .marvel-device.iphone5c .sleep,:host .marvel-device.iphone5c .volume{background:#ddd}:host .marvel-device.iphone5c.red{background:#f96b6c}:host .marvel-device.iphone5c.red .sleep,:host .marvel-device.iphone5c.red .volume{background:#ed5758}:host .marvel-device.iphone5c.yellow{background:#f2dc60}:host .marvel-device.iphone5c.yellow .sleep,:host .marvel-device.iphone5c.yellow .volume{background:#e5ce4c}:host .marvel-device.iphone5c.green{background:#97e563}:host .marvel-device.iphone5c.green .sleep,:host .marvel-device.iphone5c.green .volume{background:#85d94d}:host .marvel-device.iphone5c.blue{background:#33a2db}:host .marvel-device.iphone5c.blue .sleep,:host .marvel-device.iphone5c.blue .volume{background:#2694cd}:host .marvel-device.iphone4s{padding:129px 27px;width:320px;height:480px;background:#686868;border-radius:54px}:host .marvel-device.iphone4s:before{content:\"\";width:calc(100% - 8px);height:calc(100% - 8px);position:absolute;top:4px;left:4px;z-index:1;border-radius:50px;background:#1e1e1e}:host .marvel-device.iphone4s .top-bar{top:60px;position:absolute;left:0}:host .marvel-device.iphone4s .bottom-bar{bottom:90px;position:absolute;left:0}:host .marvel-device.iphone4s .camera{background:#3c3d3d;width:10px;height:10px;position:absolute;top:72px;left:134px;z-index:3;margin-left:-5px;border-radius:100%}:host .marvel-device.iphone4s .speaker{width:64px;top:72px;margin-left:-32px}:host .marvel-device.iphone4s .sensor,:host .marvel-device.iphone4s .speaker{background:#292728;height:10px;position:absolute;left:50%;z-index:3;border-radius:5px}:host .marvel-device.iphone4s .sensor{width:40px;top:36px;margin-left:-20px}:host .marvel-device.iphone4s .home{background:#242324;border-radius:100%;width:72px;height:72px;z-index:3;position:absolute;left:50%;margin-left:-36px;bottom:30px}:host .marvel-device.iphone4s .home:after{width:20px;height:20px;border:1px solid hsla(0,0%,100%,.1);border-radius:4px;position:absolute;display:block;content:\"\";top:50%;left:50%;margin-top:-11px;margin-left:-11px}:host .marvel-device.iphone4s .sleep{position:absolute;top:-4px;right:60px;width:60px;height:4px;border-radius:2px 2px 0 0;background:#4d4d4d}:host .marvel-device.iphone4s .volume{position:absolute;left:-4px;top:160px;height:27px;width:4px;border-radius:2px 0 0 2px;background:#4d4d4d}:host .marvel-device.iphone4s .volume:before{top:-70px;height:35px}:host .marvel-device.iphone4s .volume:after,:host .marvel-device.iphone4s .volume:before{position:absolute;left:0;width:4px;border-radius:2px 0 0 2px;background:inherit;content:\"\";display:block}:host .marvel-device.iphone4s .volume:after{bottom:-64px;height:27px}:host .marvel-device.iphone4s.landscape{padding:27px 129px;height:320px;width:480px}:host .marvel-device.iphone4s.landscape .bottom-bar{left:90px;bottom:0;height:100%;width:3px}:host .marvel-device.iphone4s.landscape .top-bar{left:calc(100% - 60px);top:0;height:100%;width:3px}:host .marvel-device.iphone4s.landscape .camera{top:134px;left:calc(100% - 72px);margin-left:0}:host .marvel-device.iphone4s.landscape .speaker{top:50%;margin-left:0;margin-top:-32px;left:calc(100% - 72px);width:10px;height:64px}:host .marvel-device.iphone4s.landscape .sensor{height:40px;width:10px;left:calc(100% - 36px);top:50%;margin-left:0;margin-top:-20px}:host .marvel-device.iphone4s.landscape .home{left:30px;bottom:50%;margin-left:0;margin-bottom:-36px}:host .marvel-device.iphone4s.landscape .sleep{height:60px;width:4px;right:-4px;top:calc(100% - 120px);border-radius:0 2px 2px 0}:host .marvel-device.iphone4s.landscape .volume{top:-4px;left:calc(100% - 187px);height:4px;width:27px;border-radius:2px 2px 0 0}:host .marvel-device.iphone4s.landscape .volume:before{right:-70px;left:auto;top:0;width:35px;height:4px;border-radius:2px 2px 0 0}:host .marvel-device.iphone4s.landscape .volume:after{width:27px;height:4px;bottom:0;left:-64px;border-radius:2px 2px 0 0}:host .marvel-device.iphone4s.silver{background:#bcbcbc}:host .marvel-device.iphone4s.silver:before{background:#fcfcfc}:host .marvel-device.iphone4s.silver .home{background:#fcfcfc;-webkit-box-shadow:inset 0 0 0 1px #bcbcbc;box-shadow:inset 0 0 0 1px #bcbcbc}:host .marvel-device.iphone4s.silver .home:after{border:1px solid rgba(0,0,0,.2)}:host .marvel-device.iphone4s.silver .sleep,:host .marvel-device.iphone4s.silver .volume{background:#d6d6d6}:host .marvel-device.nexus5{padding:50px 15px;width:320px;height:568px;background:#1e1e1e;border-radius:20px}:host .marvel-device.nexus5:before{border-radius:600px/50px;background:inherit;content:\"\";top:0;position:absolute;height:103.1%;width:calc(100% - 26px);top:50%;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%)}:host .marvel-device.nexus5 .top-bar{width:calc(100% - 8px);height:calc(100% - 6px);position:absolute;top:3px;left:4px;border-radius:20px;background:#181818}:host .marvel-device.nexus5 .top-bar:before{border-radius:600px/50px;background:inherit;content:\"\";top:0;position:absolute;height:103%;width:calc(100% - 26px);top:50%;left:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%)}:host .marvel-device.nexus5 .bottom-bar{display:none}:host .marvel-device.nexus5 .sleep{width:3px;position:absolute;left:-3px;top:110px;height:100px;background:inherit;border-radius:2px 0 0 2px}:host .marvel-device.nexus5 .volume{width:3px;position:absolute;right:-3px;top:70px;height:45px;background:inherit;border-radius:0 2px 2px 0}:host .marvel-device.nexus5 .camera{background:#3c3d3d;width:10px;height:10px;position:absolute;top:18px;left:50%;z-index:3;margin-left:-5px;border-radius:100%}:host .marvel-device.nexus5 .camera:before{background:#3c3d3d;width:6px;height:6px;content:\"\";display:block;position:absolute;top:2px;left:-100px;z-index:3;border-radius:100%}:host .marvel-device.nexus5.landscape{padding:15px 50px;height:320px;width:568px}:host .marvel-device.nexus5.landscape:before{width:103.1%;height:calc(100% - 26px);border-radius:50px/600px}:host .marvel-device.nexus5.landscape .top-bar{left:3px;top:4px;height:calc(100% - 8px);width:calc(100% - 6px)}:host .marvel-device.nexus5.landscape .top-bar:before{width:103%;height:calc(100% - 26px);border-radius:50px/600px}:host .marvel-device.nexus5.landscape .sleep{height:3px;width:100px;left:calc(100% - 210px);top:-3px;border-radius:2px 2px 0 0}:host .marvel-device.nexus5.landscape .volume{height:3px;width:45px;right:70px;top:100%;border-radius:0 0 2px 2px}:host .marvel-device.nexus5.landscape .camera{top:50%;left:calc(100% - 18px);margin-left:0;margin-top:-5px}:host .marvel-device.nexus5.landscape .camera:before{top:-100px;left:2px}:host .marvel-device.s5{padding:60px 18px;border-radius:42px;width:320px;height:568px;background:#bcbcbc}:host .marvel-device.s5:after,:host .marvel-device.s5:before{width:calc(100% - 52px);content:\"\";display:block;height:26px;background:inherit;position:absolute;border-radius:500px/40px;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}:host .marvel-device.s5:before{top:-7px}:host .marvel-device.s5:after{bottom:-7px}:host .marvel-device.s5 .bottom-bar{display:none}:host .marvel-device.s5 .top-bar{border-radius:37px;width:calc(100% - 10px);height:calc(100% - 10px);top:5px;left:5px;background:radial-gradient(rgba(0,0,0,.02) 20%,transparent 60%) 0 0,radial-gradient(rgba(0,0,0,.02) 20%,transparent 60%) 3px 3px;background-color:#fff;background-size:4px 4px;background-position:50%;z-index:2;position:absolute}:host .marvel-device.s5 .top-bar:after,:host .marvel-device.s5 .top-bar:before{width:calc(100% - 48px);content:\"\";display:block;height:26px;background:inherit;position:absolute;border-radius:500px/40px;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}:host .marvel-device.s5 .top-bar:before{top:-7px}:host .marvel-device.s5 .top-bar:after{bottom:-7px}:host .marvel-device.s5 .sleep{width:3px;position:absolute;left:-3px;top:100px;height:100px;background:#cecece;border-radius:2px 0 0 2px}:host .marvel-device.s5 .speaker{width:68px;height:8px;position:absolute;top:20px;display:block;z-index:3;left:50%;margin-left:-34px;background-color:#bcbcbc;background-position:0 0;border-radius:4px}:host .marvel-device.s5 .sensor{top:20px;right:110px}:host .marvel-device.s5 .sensor,:host .marvel-device.s5 .sensor:after{display:block;position:absolute;background:#3c3d3d;border-radius:100%;width:8px;height:8px;z-index:3}:host .marvel-device.s5 .sensor:after{content:\"\";top:0;right:12px}:host .marvel-device.s5 .camera{display:block;position:absolute;top:24px;right:42px;background:#000;border-radius:100%;width:10px;height:10px;z-index:3}:host .marvel-device.s5 .camera:before{width:4px;height:4px;background:#3c3d3d;border-radius:100%;position:absolute;content:\"\";top:50%;left:50%;margin-top:-2px;margin-left:-2px}:host .marvel-device.s5 .home{position:absolute;z-index:3;bottom:17px;left:50%;width:70px;height:20px;background:#fff;border-radius:18px;display:block;margin-left:-35px;border:2px solid #000}:host .marvel-device.s5.landscape{padding:18px 60px;height:320px;width:568px}:host .marvel-device.s5.landscape:after,:host .marvel-device.s5.landscape:before{height:calc(100% - 52px);width:26px;border-radius:40px/500px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}:host .marvel-device.s5.landscape:before{top:50%;left:-7px}:host .marvel-device.s5.landscape:after{top:50%;left:auto;right:-7px}:host .marvel-device.s5.landscape .top-bar:after,:host .marvel-device.s5.landscape .top-bar:before{width:26px;height:calc(100% - 48px);border-radius:40px/500px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}:host .marvel-device.s5.landscape .top-bar:before{right:-7px;top:50%;left:auto}:host .marvel-device.s5.landscape .top-bar:after{left:-7px;top:50%;right:auto}:host .marvel-device.s5.landscape .sleep{height:3px;width:100px;left:calc(100% - 200px);top:-3px;border-radius:2px 2px 0 0}:host .marvel-device.s5.landscape .speaker{height:68px;width:8px;left:calc(100% - 20px);top:50%;margin-left:0;margin-top:-34px}:host .marvel-device.s5.landscape .sensor{right:20px;top:calc(100% - 110px)}:host .marvel-device.s5.landscape .sensor:after{left:-12px;right:0}:host .marvel-device.s5.landscape .camera{top:calc(100% - 42px);right:24px}:host .marvel-device.s5.landscape .home{width:20px;height:70px;bottom:50%;margin-bottom:-35px;margin-left:0;left:17px}:host .marvel-device.s5.black{background:#1e1e1e}:host .marvel-device.s5.black .speaker{background:#000}:host .marvel-device.s5.black .sleep{background:#1e1e1e}:host .marvel-device.s5.black .top-bar{background:radial-gradient(rgba(0,0,0,.05) 20%,transparent 60%) 0 0,radial-gradient(rgba(0,0,0,.05) 20%,transparent 60%) 3px 3px;background-color:#2c2b2c;background-size:4px 4px}:host .marvel-device.s5.black .home{background:#2c2b2c}:host .marvel-device.lumia920{padding:80px 35px 125px;background:#fd0;width:320px;height:533px;border-radius:40px/3px}:host .marvel-device.lumia920 .bottom-bar{display:none}:host .marvel-device.lumia920 .top-bar{width:calc(100% - 24px);height:calc(100% - 32px);position:absolute;top:16px;left:12px;border-radius:24px;background:#000;z-index:1}:host .marvel-device.lumia920 .top-bar:before{background:#1e1e1e;display:block;content:\"\";width:calc(100% - 4px);height:calc(100% - 4px);top:2px;left:2px;position:absolute;border-radius:22px}:host .marvel-device.lumia920 .volume{width:3px;position:absolute;top:130px;height:100px;background:#1e1e1e;right:-3px;border-radius:0 2px 2px 0}:host .marvel-device.lumia920 .volume:before{top:190px}:host .marvel-device.lumia920 .volume:after,:host .marvel-device.lumia920 .volume:before{width:3px;position:absolute;content:\"\";display:block;height:50px;background:inherit;right:0;border-radius:0 2px 2px 0}:host .marvel-device.lumia920 .volume:after{top:460px}:host .marvel-device.lumia920 .camera{background:#3c3d3d;width:10px;height:10px;position:absolute;top:34px;right:130px;z-index:5;border-radius:5px}:host .marvel-device.lumia920 .speaker{background:#292728;width:64px;height:10px;position:absolute;top:38px;left:50%;margin-left:-32px;border-radius:5px;z-index:3}:host .marvel-device.lumia920.landscape{padding:35px 80px 35px 125px;height:320px;width:568px;border-radius:2px/100px}:host .marvel-device.lumia920.landscape .top-bar{height:calc(100% - 24px);width:calc(100% - 32px);left:16px;top:12px}:host .marvel-device.lumia920.landscape .volume{height:3px;right:130px;width:100px;top:100%;border-radius:0 0 2px 2px}:host .marvel-device.lumia920.landscape .volume:before{height:3px;right:190px;top:0;width:50px;border-radius:0 0 2px 2px}:host .marvel-device.lumia920.landscape .volume:after{height:3px;right:430px;top:0;width:50px;border-radius:0 0 2px 2px}:host .marvel-device.lumia920.landscape .camera{right:30px;top:calc(100% - 140px)}:host .marvel-device.lumia920.landscape .speaker{width:10px;height:64px;top:50%;margin-left:0;margin-top:-32px;left:calc(100% - 48px)}:host .marvel-device.lumia920.black{background:#000}:host .marvel-device.lumia920.white{background:#fff;-webkit-box-shadow:0 1px 2px 0 rgba(0,0,0,.2);box-shadow:0 1px 2px 0 rgba(0,0,0,.2)}:host .marvel-device.lumia920.blue{background:#00acdd}:host .marvel-device.lumia920.red{background:#cc3e32}:host .marvel-device.htc-one{padding:72px 25px 100px;width:320px;height:568px;background:#bebebe;border-radius:34px}:host .marvel-device.htc-one:before{content:\"\";display:block;width:calc(100% - 4px);height:calc(100% - 4px);position:absolute;top:2px;left:2px;background:#adadad;border-radius:32px}:host .marvel-device.htc-one:after{content:\"\";display:block;width:calc(100% - 8px);height:calc(100% - 8px);position:absolute;top:4px;left:4px;background:#eee;border-radius:30px}:host .marvel-device.htc-one .top-bar{width:calc(100% - 4px);height:635px;position:absolute;background:#424242;top:50px;z-index:1;left:2px}:host .marvel-device.htc-one .top-bar:before{content:\"\";width:calc(100% - 4px);height:100%;position:absolute;background:#000;top:0;z-index:1;left:2px}:host .marvel-device.htc-one .bottom-bar{display:none}:host .marvel-device.htc-one .speaker{top:22px;background:radial-gradient(#343434 25%,transparent 50%) 0 0,radial-gradient(#343434 25%,transparent 50%) 4px 4px;background-size:4px 4px;background-position:0 0}:host .marvel-device.htc-one .speaker,:host .marvel-device.htc-one .speaker:after{height:16px;width:216px;display:block;position:absolute;z-index:2;left:50%;margin-left:-108px}:host .marvel-device.htc-one .speaker:after{content:\"\";top:676px;background:inherit}:host .marvel-device.htc-one .camera{display:block;position:absolute;top:18px;right:38px;background:#3c3d3d;border-radius:100%;width:24px;height:24px;z-index:3}:host .marvel-device.htc-one .camera:before{width:8px;height:8px;background:#000;border-radius:100%;position:absolute;content:\"\";top:50%;left:50%;margin-top:-4px;margin-left:-4px}:host .marvel-device.htc-one .sensor{top:29px;left:60px}:host .marvel-device.htc-one .sensor,:host .marvel-device.htc-one .sensor:after{display:block;position:absolute;background:#3c3d3d;border-radius:100%;width:8px;height:8px;z-index:3}:host .marvel-device.htc-one .sensor:after{content:\"\";top:0;right:12px}:host .marvel-device.htc-one.landscape{padding:25px 72px 25px 100px;height:320px;width:568px}:host .marvel-device.htc-one.landscape .top-bar{height:calc(100% - 4px);width:635px;left:calc(100% - 685px);top:2px}:host .marvel-device.htc-one.landscape .speaker{width:16px;height:216px;left:calc(100% - 38px);top:50%;margin-left:0;margin-top:-108px}:host .marvel-device.htc-one.landscape .speaker:after{width:16px;height:216px;left:calc(100% - 692px);top:50%;margin-left:0;margin-top:-108px}:host .marvel-device.htc-one.landscape .camera{right:18px;top:calc(100% - 38px)}:host .marvel-device.htc-one.landscape .sensor{left:calc(100% - 29px);top:60px}:host .marvel-device.htc-one.landscape .sensor :after{right:0;top:-12px}:host .marvel-device.ipad{width:576px;height:768px;padding:90px 25px;background:#242324;border-radius:44px}:host .marvel-device.ipad:before{width:calc(100% - 8px);height:calc(100% - 8px);position:absolute;content:\"\";display:block;top:4px;left:4px;border-radius:40px;background:#1e1e1e}:host .marvel-device.ipad .camera{background:#3c3d3d;width:10px;height:10px;position:absolute;top:44px;left:50%;margin-left:-5px;border-radius:100%}:host .marvel-device.ipad .bottom-bar,:host .marvel-device.ipad .top-bar{display:none}:host .marvel-device.ipad .home{background:#242324;border-radius:36px;width:50px;height:50px;position:absolute;left:50%;margin-left:-25px;bottom:22px}:host .marvel-device.ipad .home:after{width:15px;height:15px;margin-top:-8px;margin-left:-8px;border:1px solid hsla(0,0%,100%,.1);border-radius:4px;position:absolute;display:block;content:\"\";top:50%;left:50%}:host .marvel-device.ipad.landscape{height:576px;width:768px;padding:25px 90px}:host .marvel-device.ipad.landscape .camera{left:calc(100% - 44px);top:50%;margin-left:0;margin-top:-5px}:host .marvel-device.ipad.landscape .home{top:50%;left:22px;margin-left:0;margin-top:-25px}:host .marvel-device.ipad.silver{background:#bcbcbc}:host .marvel-device.ipad.silver:before{background:#fcfcfc}:host .marvel-device.ipad.silver .home{background:#fcfcfc;-webkit-box-shadow:inset 0 0 0 1px #bcbcbc;box-shadow:inset 0 0 0 1px #bcbcbc}:host .marvel-device.ipad.silver .home:after{border:1px solid rgba(0,0,0,.2)}:host .marvel-device.macbook{width:960px;height:600px;padding:44px 44px 76px;margin:0 auto;background:#bebebe;border-radius:34px}:host .marvel-device.macbook:before{width:calc(100% - 8px);height:calc(100% - 8px);position:absolute;content:\"\";display:block;top:4px;left:4px;border-radius:30px;background:#1e1e1e}:host .marvel-device.macbook .top-bar{width:calc(100% + 140px);height:40px;position:absolute;content:\"\";display:block;top:680px;left:-70px;border-bottom-left-radius:90px 18px;border-bottom-right-radius:90px 18px;background:#bebebe;-webkit-box-shadow:inset 0 -4px 13px 3px rgba(34,34,34,.6);box-shadow:inset 0 -4px 13px 3px rgba(34,34,34,.6)}:host .marvel-device.macbook .top-bar:before{width:100%;height:24px;content:\"\";display:block;top:0;left:0;background:#f0f0f0;border-bottom:2px solid #aaa;border-radius:5px;position:relative}:host .marvel-device.macbook .top-bar:after{width:16%;height:14px;content:\"\";display:block;top:0;background:#ddd;position:absolute;margin-left:auto;margin-right:auto;left:0;right:0;border-radius:0 0 20px 20px;-webkit-box-shadow:inset 0 -3px 10px #999;box-shadow:inset 0 -3px 10px #999}:host .marvel-device.macbook .bottom-bar{background:transparent;width:calc(100% + 140px);height:26px;position:absolute;content:\"\";display:block;top:680px;left:-70px}:host .marvel-device.macbook .bottom-bar:after,:host .marvel-device.macbook .bottom-bar:before{height:calc(100% - 2px);width:80px;content:\"\";display:block;top:0;position:absolute}:host .marvel-device.macbook .bottom-bar:before{left:0;background:#f0f0f0;background:-webkit-gradient(linear,left top,right top,from(#747474),color-stop(5%,#c3c3c3),color-stop(14%,#ebebeb),color-stop(41%,#979797),color-stop(80%,#f0f0f0),color-stop(100%,#f0f0f0),to(#f0f0f0));background:-webkit-gradient(linear,left top,right top,color-stop(0,#747474),color-stop(5%,#c3c3c3),color-stop(14%,#ebebeb),color-stop(41%,#979797),color-stop(80%,#f0f0f0),color-stop(100%,#f0f0f0),color-stop(0,#f0f0f0));background:linear-gradient(90deg,#747474,#c3c3c3 5%,#ebebeb 14%,#979797 41%,#f0f0f0 80%,#f0f0f0 100%,#f0f0f0 0)}:host .marvel-device.macbook .bottom-bar:after{right:0;background:#f0f0f0;background:-webkit-gradient(linear,left top,right top,from(#f0f0f0),color-stop(0,#f0f0f0),color-stop(20%,#f0f0f0),color-stop(59%,#979797),color-stop(86%,#ebebeb),color-stop(95%,#c3c3c3),to(#747474));background:-webkit-gradient(linear,left top,right top,color-stop(0,#f0f0f0),color-stop(0,#f0f0f0),color-stop(20%,#f0f0f0),color-stop(59%,#979797),color-stop(86%,#ebebeb),color-stop(95%,#c3c3c3),to(#747474));background:linear-gradient(90deg,#f0f0f0,#f0f0f0 0,#f0f0f0 20%,#979797 59%,#ebebeb 86%,#c3c3c3 95%,#747474)}:host .marvel-device.macbook .camera{background:#3c3d3d;width:10px;height:10px;position:absolute;top:20px;left:50%;margin-left:-5px;border-radius:100%}:host .marvel-device.macbook .home{display:none}:host .marvel-device.iphone-x{width:375px;height:812px;padding:26px;background:#fdfdfd;-webkit-box-shadow:inset 0 0 11px 0 #000;box-shadow:inset 0 0 11px 0 #000;border-radius:66px}:host .marvel-device.iphone-x .overflow{width:100%;height:100%;position:absolute;top:0;left:0;border-radius:66px;overflow:hidden}:host .marvel-device.iphone-x .shadow{border-radius:100%;width:90px;height:90px;position:absolute;background:radial-gradient(ellipse at center,rgba(0,0,0,.6) 0,hsla(0,0%,100%,0) 60%)}:host .marvel-device.iphone-x .shadow--tl{top:-20px;left:-20px}:host .marvel-device.iphone-x .shadow--tr{top:-20px;right:-20px}:host .marvel-device.iphone-x .shadow--bl{bottom:-20px;left:-20px}:host .marvel-device.iphone-x .shadow--br{bottom:-20px;right:-20px}:host .marvel-device.iphone-x:before{width:calc(100% - 10px);height:calc(100% - 10px);position:absolute;top:5px;content:\"\";left:5px;border-radius:61px;background:#000;z-index:1}:host .marvel-device.iphone-x .inner-shadow{width:calc(100% - 20px);height:calc(100% - 20px);position:absolute;top:10px;overflow:hidden;left:10px;border-radius:56px;-webkit-box-shadow:inset 0 0 15px 0 hsla(0,0%,100%,.66);box-shadow:inset 0 0 15px 0 hsla(0,0%,100%,.66);z-index:1}:host .marvel-device.iphone-x .inner-shadow:before{-webkit-box-shadow:inset 0 0 20px 0 #fff;box-shadow:inset 0 0 20px 0 #fff;width:100%;height:116%;position:absolute;top:-8%;content:\"\";left:0;border-radius:200px/112px;z-index:2}:host .marvel-device.iphone-x .screen{border-radius:40px;-webkit-box-shadow:none;box-shadow:none}:host .marvel-device.iphone-x .bottom-bar,:host .marvel-device.iphone-x .top-bar{width:100%;position:absolute;height:8px;background:rgba(0,0,0,.1);left:0}:host .marvel-device.iphone-x .top-bar{top:80px}:host .marvel-device.iphone-x .bottom-bar{bottom:80px}:host .marvel-device.iphone-x .sleep,:host .marvel-device.iphone-x .volume,:host .marvel-device.iphone-x .volume:after,:host .marvel-device.iphone-x .volume:before{width:3px;background:#b5b5b5;position:absolute}:host .marvel-device.iphone-x .volume{left:-3px;top:116px;height:32px}:host .marvel-device.iphone-x .volume:before{height:62px;top:62px;content:\"\";left:0}:host .marvel-device.iphone-x .volume:after{height:62px;top:140px;content:\"\";left:0}:host .marvel-device.iphone-x .sleep{height:96px;top:200px;right:-3px}:host .marvel-device.iphone-x .camera{width:6px;height:6px;top:9px;border-radius:100%;position:absolute;left:154px;background:#0d4d71}:host .marvel-device.iphone-x .speaker{height:6px;width:60px;left:50%;position:absolute;top:9px;margin-left:-30px;background:#171818;border-radius:6px}:host .marvel-device.iphone-x .notch{position:absolute;width:210px;height:30px;top:26px;left:108px;z-index:4;background:#000;border-bottom-left-radius:24px;border-bottom-right-radius:24px}:host .marvel-device.iphone-x .notch:after,:host .marvel-device.iphone-x .notch:before{content:\"\";height:8px;position:absolute;top:0;width:8px}:host .marvel-device.iphone-x .notch:after{background:radial-gradient(circle at bottom left,transparent 0,transparent 70%,#000 0,#000 100%);left:-8px}:host .marvel-device.iphone-x .notch:before{background:radial-gradient(circle at bottom right,transparent 0,transparent 70%,#000 0,#000 100%);right:-8px}:host .marvel-device.iphone-x.landscape{height:375px;width:812px}:host .marvel-device.iphone-x.landscape .bottom-bar,:host .marvel-device.iphone-x.landscape .top-bar{width:8px;height:100%;top:0}:host .marvel-device.iphone-x.landscape .top-bar{left:80px}:host .marvel-device.iphone-x.landscape .bottom-bar{right:80px;bottom:auto;left:auto}:host .marvel-device.iphone-x.landscape .sleep,:host .marvel-device.iphone-x.landscape .volume,:host .marvel-device.iphone-x.landscape .volume:after,:host .marvel-device.iphone-x.landscape .volume:before{height:3px}:host .marvel-device.iphone-x.landscape .inner-shadow:before{height:100%;width:116%;left:-8%;top:0;border-radius:112px/200px}:host .marvel-device.iphone-x.landscape .volume{bottom:-3px;top:auto;left:116px;width:32px}:host .marvel-device.iphone-x.landscape .volume:before{width:62px;left:62px;top:0}:host .marvel-device.iphone-x.landscape .volume:after{width:62px;left:140px;top:0}:host .marvel-device.iphone-x.landscape .sleep{width:96px;left:200px;top:-3px;right:auto}:host .marvel-device.iphone-x.landscape .camera{left:9px;bottom:154px;top:auto}:host .marvel-device.iphone-x.landscape .speaker{width:6px;height:60px;left:9px;top:50%;margin-top:-30px;margin-left:0}:host .marvel-device.iphone-x.landscape .notch{height:210px;width:30px;left:26px;bottom:108px;top:auto;border-top-right-radius:24px;border-bottom-right-radius:24px;border-bottom-left-radius:0}:host .marvel-device.iphone-x.landscape .notch:after,:host .marvel-device.iphone-x.landscape .notch:before{left:0}:host .marvel-device.iphone-x.landscape .notch:after{background:radial-gradient(circle at bottom right,transparent 0,transparent 70%,#000 0,#000 100%);bottom:-8px;top:auto}:host .marvel-device.iphone-x.landscape .notch:before{background:radial-gradient(circle at top right,transparent 0,transparent 70%,#000 0,#000 100%);top:-8px}:host .marvel-device.note8{width:400px;height:822px;background:#000;border-radius:34px;padding:45px 10px}:host .marvel-device.note8 .overflow{width:100%;height:100%;position:absolute;top:0;left:0;border-radius:34px;overflow:hidden}:host .marvel-device.note8 .speaker{height:8px;width:56px;left:50%;position:absolute;top:25px;margin-left:-28px;background:#171818;z-index:1;border-radius:8px}:host .marvel-device.note8 .camera{height:18px;width:18px;left:86px;position:absolute;top:18px;background:#212b36;z-index:1;border-radius:100%}:host .marvel-device.note8 .camera:before{content:\"\";height:8px;width:8px;left:-22px;position:absolute;top:5px;background:#212b36;z-index:1;border-radius:100%}:host .marvel-device.note8 .sensors{left:120px;top:22px}:host .marvel-device.note8 .sensors,:host .marvel-device.note8 .sensors:before{height:10px;width:10px;position:absolute;background:#1d233b;z-index:1;border-radius:100%}:host .marvel-device.note8 .sensors:before{content:\"\";left:18px;top:0}:host .marvel-device.note8 .more-sensors{height:16px;width:16px;left:285px;position:absolute;top:18px;background:#33244a;-webkit-box-shadow:0 0 0 2px hsla(0,0%,100%,.1);box-shadow:0 0 0 2px hsla(0,0%,100%,.1);z-index:1;border-radius:100%}:host .marvel-device.note8 .more-sensors:before{content:\"\";height:11px;width:11px;left:40px;position:absolute;top:4px;background:#214a61;z-index:1;border-radius:100%}:host .marvel-device.note8 .sleep{width:2px;height:56px;background:#000;position:absolute;top:288px;right:-2px}:host .marvel-device.note8 .volume{width:2px;height:120px;background:#000;position:absolute;top:168px;left:-2px}:host .marvel-device.note8 .volume:before{content:\"\";top:168px;width:2px;position:absolute;left:0;background:#000;height:56px}:host .marvel-device.note8 .inner{width:100%;height:calc(100% - 8px);position:absolute;top:2px;content:\"\";left:0;border-radius:34px;border-top:2px solid #9fa0a2;border-bottom:2px solid #9fa0a2;background:#000;z-index:1;-webkit-box-shadow:inset 0 0 6px 0 hsla(0,0%,100%,.5);box-shadow:inset 0 0 6px 0 hsla(0,0%,100%,.5)}:host .marvel-device.note8 .shadow{-webkit-box-shadow:inset 0 0 60px 0 #fff,inset 0 0 30px 0 hsla(0,0%,100%,.5),0 0 20px 0 #fff,0 0 20px 0 hsla(0,0%,100%,.5);box-shadow:inset 0 0 60px 0 #fff,inset 0 0 30px 0 hsla(0,0%,100%,.5),0 0 20px 0 #fff,0 0 20px 0 hsla(0,0%,100%,.5);height:101%;position:absolute;top:-.5%;content:\"\";width:calc(100% - 20px);left:10px;border-radius:38px;z-index:5;pointer-events:none}:host .marvel-device.note8 .screen{border-radius:14px;-webkit-box-shadow:none;box-shadow:none}:host .marvel-device.note8.landscape{height:400px;width:822px;padding:10px 45px}:host .marvel-device.note8.landscape .speaker{height:56px;width:8px;top:50%;margin-top:-28px;margin-left:0;right:25px;left:auto}:host .marvel-device.note8.landscape .camera{top:86px;right:18px;left:auto}:host .marvel-device.note8.landscape .camera:before{top:-22px;left:5px}:host .marvel-device.note8.landscape .sensors{top:120px;right:22px;left:auto}:host .marvel-device.note8.landscape .sensors:before{top:18px;left:0}:host .marvel-device.note8.landscape .more-sensors{top:285px;right:18px;left:auto}:host .marvel-device.note8.landscape .more-sensors:before{top:40px;left:4px}:host .marvel-device.note8.landscape .sleep{bottom:-2px;top:auto;right:288px;width:56px;height:2px}:host .marvel-device.note8.landscape .volume{width:120px;height:2px;top:-2px;right:168px;left:auto}:host .marvel-device.note8.landscape .volume:before{right:168px;left:auto;top:0;width:56px;height:2px}:host .marvel-device.note8.landscape .inner{height:100%;width:calc(100% - 8px);left:2px;top:0;border-top:0;border-bottom:0;border-left:2px solid #9fa0a2;border-right:2px solid #9fa0a2}:host .marvel-device.note8.landscape .shadow{width:101%;height:calc(100% - 20px);left:-.5%;top:10px}:host .marvel-device,:host :after,:host :before{-webkit-transition:all .12s cubic-bezier(.175,.885,.32,1.275);transition:all .12s cubic-bezier(.175,.885,.32,1.275)}"; }
}

class DemoFabComponent {
    componentDidLoad() {
        const rootEl = this.el.shadowRoot.querySelector('.mdc-fab');
        this.ripple = MDCRipple.attachTo(rootEl);
    }
    componentDidUnload() {
        this.ripple.destroy();
    }
    showContextMenu() {
        this.el.shadowRoot.querySelector('#fab-menu').classList.toggle('fab-menu--absolute--show');
    }
    handleClick(evt) {
        const target = evt.currentTarget.getAttribute('data-btn');
        target === 'rotate-screen' ? this.fabBtnRotate.emit(target)
            : this.fabBtnChangeDevice.emit(target);
    }
    render() {
        return [
            h("div", { id: "fab-menu", class: "fab-menu--absolute" },
                h("button", { "data-btn": "rotate-screen", onClick: (event) => this.handleClick(event), id: "rotate-screen", class: "mdc-fab mdc-fab--mini material-icons" },
                    h("span", { class: "mdc-fab__icon" },
                        h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                            h("path", { d: "M0 0h24v24H0z", fill: "none" }),
                            h("path", { d: "M16.48 2.52c3.27 1.55 5.61 4.72 5.97 8.48h1.5C23.44 4.84 18.29 0 12 0l-.66.03 3.81 3.81 1.33-1.32zm-6.25-.77c-.59-.59-1.54-.59-2.12 0L1.75 8.11c-.59.59-.59 1.54 0 2.12l12.02 12.02c.59.59 1.54.59 2.12 0l6.36-6.36c.59-.59.59-1.54 0-2.12L10.23 1.75zm4.6 19.44L2.81 9.17l6.36-6.36 12.02 12.02-6.36 6.36zm-7.31.29C4.25 19.94 1.91 16.76 1.55 13H.05C.56 19.16 5.71 24 12 24l.66-.03-3.81-3.81-1.33 1.32z" })))),
                h("button", { "data-btn": "navigate-before", onClick: (event) => this.handleClick(event), id: "navigate-before", class: "mdc-fab mdc-fab--mini material-icons app-fab--mini" },
                    h("span", { class: "mdc-fab__icon" },
                        h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                            h("path", { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" }),
                            h("path", { d: "M0 0h24v24H0z", fill: "none" })))),
                h("button", { "data-btn": "navigate-next", onClick: (event) => this.handleClick(event), id: "navigate-next", class: "mdc-fab mdc-fab--mini material-icons app-fab--mini" },
                    h("span", { class: "mdc-fab__icon" },
                        h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                            h("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }),
                            h("path", { d: "M0 0h24v24H0z", fill: "none" }))))),
            h("button", { "data-btn": "menu-toggle", onClick: () => this.showContextMenu(), class: "mdc-fab material-icons app-fab--absolute" },
                h("span", { class: "mdc-fab__icon" },
                    h("svg", { height: "24", viewBox: "0 0 24 24", width: "24", xmlns: "http://www.w3.org/2000/svg" },
                        h("path", { d: "M0 0h24v24H0z", fill: "none" }),
                        h("path", { d: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }))))
        ];
    }
    static get is() { return "o-demo-fab"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        }
    }; }
    static get events() { return [{
            "name": "rotate-device",
            "method": "fabBtnRotate",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "change-device",
            "method": "fabBtnChangeDevice",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ".mdc-fab{-webkit-box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);display:-ms-inline-flexbox;display:inline-flex;position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;width:56px;height:56px;padding:0;border:none;fill:currentColor;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-moz-appearance:none;-webkit-appearance:none;overflow:hidden;-webkit-transition:opacity 15ms linear 30ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;transition:opacity 15ms linear 30ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;transition:box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms;transition:box-shadow .28s cubic-bezier(.4,0,.2,1),opacity 15ms linear 30ms,transform .27s cubic-bezier(0,0,.2,1) 0ms,-webkit-box-shadow .28s cubic-bezier(.4,0,.2,1),-webkit-transform .27s cubic-bezier(0,0,.2,1) 0ms;background-color:#018786;color:#fff;color:var(--mdc-theme-on-secondary,#fff)}.mdc-fab:not(.mdc-fab--extended){border-radius:50%}.mdc-fab::-moz-focus-inner{padding:0;border:0}.mdc-fab:focus,.mdc-fab:hover{-webkit-box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.mdc-fab:active{-webkit-box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12);box-shadow:0 7px 8px -4px rgba(0,0,0,.2),0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12)}.mdc-fab:active,.mdc-fab:focus{outline:none}.mdc-fab:hover{cursor:pointer}.mdc-fab>svg{width:100%}\@supports not (-ms-ime-align:auto){.mdc-fab{background-color:var(--mdc-theme-secondary,#018786)}}.mdc-fab .mdc-fab__icon{width:24px;height:24px;font-size:24px}.mdc-fab--mini{width:40px;height:40px}.mdc-fab--extended{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;line-height:2.25rem;font-weight:500;letter-spacing:.08929em;text-decoration:none;text-transform:uppercase;border-radius:24px;padding:0 20px;width:auto;max-width:100%;height:48px}.mdc-fab--extended .mdc-fab__icon{margin-left:-8px;margin-right:12px}.mdc-fab--extended .mdc-fab__icon[dir=rtl],.mdc-fab--extended .mdc-fab__label+.mdc-fab__icon,[dir=rtl] .mdc-fab--extended .mdc-fab__icon{margin-left:12px;margin-right:-8px}.mdc-fab--extended .mdc-fab__label+.mdc-fab__icon[dir=rtl],[dir=rtl] .mdc-fab--extended .mdc-fab__label+.mdc-fab__icon{margin-left:-8px;margin-right:12px}.mdc-fab__label{-ms-flex-pack:start;justify-content:flex-start;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-fab__icon{-webkit-transition:-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;transition:-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;transition:transform .18s cubic-bezier(0,0,.2,1) 90ms;transition:transform .18s cubic-bezier(0,0,.2,1) 90ms,-webkit-transform .18s cubic-bezier(0,0,.2,1) 90ms;fill:currentColor;will-change:transform}.mdc-fab .mdc-fab__icon{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.mdc-fab--exited{-webkit-transform:scale(0);transform:scale(0);opacity:0;-webkit-transition:opacity 15ms linear .15s,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;transition:opacity 15ms linear .15s,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms;transition:opacity 15ms linear .15s,transform .18s cubic-bezier(.4,0,1,1) 0ms;transition:opacity 15ms linear .15s,transform .18s cubic-bezier(.4,0,1,1) 0ms,-webkit-transform .18s cubic-bezier(.4,0,1,1) 0ms}.mdc-fab--exited .mdc-fab__icon{-webkit-transform:scale(0);transform:scale(0);-webkit-transition:-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms;transition:-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms;transition:transform 135ms cubic-bezier(.4,0,1,1) 0ms;transition:transform 135ms cubic-bezier(.4,0,1,1) 0ms,-webkit-transform 135ms cubic-bezier(.4,0,1,1) 0ms}\@-webkit-keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}\@keyframes mdc-ripple-fg-radius-in{0%{-webkit-animation-timing-function:cubic-bezier(.4,0,.2,1);animation-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1);transform:translate(var(--mdc-ripple-fg-translate-start,0)) scale(1)}to{-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}}\@-webkit-keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}\@keyframes mdc-ripple-fg-opacity-in{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity,0)}}\@-webkit-keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}\@keyframes mdc-ripple-fg-opacity-out{0%{-webkit-animation-timing-function:linear;animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity,0)}to{opacity:0}}.mdc-ripple-surface--test-edge-var-bug{--mdc-ripple-surface-test-edge-var:1px solid #000;visibility:hidden}.mdc-ripple-surface--test-edge-var-bug:before{border:var(--mdc-ripple-surface-test-edge-var)}.mdc-fab{--mdc-ripple-fg-size:0;--mdc-ripple-left:0;--mdc-ripple-top:0;--mdc-ripple-fg-scale:1;--mdc-ripple-fg-translate-end:0;--mdc-ripple-fg-translate-start:0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-fab:after,.mdc-fab:before{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:\"\"}.mdc-fab:before{-webkit-transition:opacity 15ms linear,background-color 15ms linear;transition:opacity 15ms linear,background-color 15ms linear;z-index:1}.mdc-fab.mdc-ripple-upgraded:before{-webkit-transform:scale(var(--mdc-ripple-fg-scale,1));transform:scale(var(--mdc-ripple-fg-scale,1))}.mdc-fab.mdc-ripple-upgraded:after{top:0;left:0;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:center center;transform-origin:center center}.mdc-fab.mdc-ripple-upgraded--unbounded:after{top:var(--mdc-ripple-top,0);left:var(--mdc-ripple-left,0)}.mdc-fab.mdc-ripple-upgraded--foreground-activation:after{-webkit-animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards;animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-fab.mdc-ripple-upgraded--foreground-deactivation:after{-webkit-animation:mdc-ripple-fg-opacity-out .15s;animation:mdc-ripple-fg-opacity-out .15s;-webkit-transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1));transform:translate(var(--mdc-ripple-fg-translate-end,0)) scale(var(--mdc-ripple-fg-scale,1))}.mdc-fab:after,.mdc-fab:before{top:-50%;left:-50%;width:200%;height:200%}.mdc-fab.mdc-ripple-upgraded:after{width:var(--mdc-ripple-fg-size,100%);height:var(--mdc-ripple-fg-size,100%)}.mdc-fab:after,.mdc-fab:before{background-color:#fff}\@supports not (-ms-ime-align:auto){.mdc-fab:after,.mdc-fab:before{background-color:var(--mdc-theme-on-secondary,#fff)}}.mdc-fab:hover:before{opacity:.08}.mdc-fab.mdc-ripple-upgraded--background-focused:before,.mdc-fab:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-fab:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-fab:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-fab.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.24}\@font-face{font-family:Source Code Pro;font-style:normal;font-weight:400;src:local(\"Source Code Pro\"),local(\"SourceCodePro-Regular\"),url(https://fonts.gstatic.com/s/sourcecodepro/v9/HI_SiYsKILxRpg3hIP6sJ7fM7PqlPevWnsUnxg.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:300;src:local(\"Source Sans Pro Light Italic\"),local(\"SourceSansPro-LightItalic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKwdSBYKcSV-LCoeQqfX1RYOo3qPZZMkids18S0xR41.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:400;src:local(\"Source Sans Pro Italic\"),local(\"SourceSansPro-Italic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xK1dSBYKcSV-LCoeQqfX1RYOo3qPZ7nsDJB9cme.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:600;src:local(\"Source Sans Pro SemiBold Italic\"),local(\"SourceSansPro-SemiBoldItalic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKwdSBYKcSV-LCoeQqfX1RYOo3qPZY4lCds18S0xR41.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:italic;font-weight:700;src:local(\"Source Sans Pro Bold Italic\"),local(\"SourceSansPro-BoldItalic\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKwdSBYKcSV-LCoeQqfX1RYOo3qPZZclSds18S0xR41.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:normal;font-weight:300;src:local(\"Source Sans Pro Light\"),local(\"SourceSansPro-Light\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xKydSBYKcSV-LCoeQqfX1RYOo3ik4zwlxdu3cOWxw.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}\@font-face{font-family:Source Sans Pro;font-style:normal;font-weight:400;src:local(\"Source Sans Pro Regular\"),local(\"SourceSansPro-Regular\"),url(https://fonts.gstatic.com/s/sourcesanspro/v12/6xK3dSBYKcSV-LCoeQqfX1RYOo3qOK7lujVj9w.woff2) format(\"woff2\");unicode-range:U+00??,U+0131,U+0152-0153,U+02bb-02bc,U+02c6,U+02da,U+02dc,U+2000-206f,U+2074,U+20ac,U+2122,U+2191,U+2193,U+2212,U+2215,U+feff,U+fffd}:host{--mdc-theme-primary:#fff;--mdc-theme-text-primary-on-primary:#494949;--mdc-theme-background:#c3c3c3;--vh:1vh;font-family:Source Sans Pro Regular,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}html{line-height:1.15;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}h1{margin:.67em 0;font-size:2em}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible}main{display:block}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border-style:none}svg:not(:root){overflow:hidden}button,input,select{margin:0}button{overflow:visible;text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}fieldset{padding:.35em .75em .625em}input{overflow:visible}legend{-webkit-box-sizing:border-box;box-sizing:border-box;display:table;max-width:100%;color:inherit;white-space:normal}progress{display:inline-block;vertical-align:baseline}select{text-transform:none}textarea{margin:0;overflow:auto}[type=checkbox],[type=radio]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-input-placeholder{color:inherit;opacity:.54}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}::-moz-focus-inner{padding:0;border-style:none}:-moz-focusring{outline:1px dotted ButtonText}details,dialog{display:block}dialog{position:absolute;right:0;left:0;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;padding:1em;margin:auto;color:#000;background-color:#fff;border:solid}dialog:not([open]){display:none}summary{display:list-item}canvas{display:inline-block}[hidden],template{display:none}*,:after,:before{-webkit-box-sizing:border-box;box-sizing:border-box;background-repeat:no-repeat}:after,:before{text-decoration:inherit;vertical-align:inherit}nav ol,nav ul{padding:0;margin:0;list-style:none}audio,canvas,iframe,img,svg,video{vertical-align:middle}svg:not([fill]){fill:currentColor}button,input,select,textarea{font-family:inherit;font-size:inherit;line-height:inherit}textarea{resize:vertical}[tabindex],a,area,button,input,label,select,summary,textarea{-ms-touch-action:manipulation;touch-action:manipulation}[aria-busy=true]{cursor:progress}[aria-controls]{cursor:pointer}[aria-disabled=true],[disabled]{cursor:not-allowed}[aria-hidden=false][hidden]:not(:focus){position:absolute;display:inherit;clip:rect(0,0,0,0)}blockquote,body,dd,dl,fieldset,figure,h1,h2,h3,h4,h5,h6,hr,legend,ol,p,pre,ul{padding:0;margin:0}li>ol,li>ul{margin-bottom:0}table{border-spacing:0;border-collapse:collapse}fieldset{min-width:0;border:0}code{font-family:Source Code Pro,monospace}figcaption{font-style:italic}h1,h2,h3,h4,h5,h6{line-height:1.25}table{width:100%}img{max-width:100%;font-style:italic;vertical-align:middle}img[height],img[width]{max-width:none}a{text-decoration:none;color:#0c77ba}a:hover{text-decoration:underline;-webkit-transition:opacity .15s ease-in;transition:opacity .15s ease-in}label{max-width:100%;word-wrap:break-word}[type=checkbox]+label[for],[type=radio]+label[for],[type=text]+label[for],label[for]{cursor:pointer}ul{list-style:disc outside}ul ul{list-style-type:circle}ul ul ul{list-style-type:square}ol{list-style:inherit outside}ol ol{list-style-type:lower-alpha}dl dt{font-weight:600}dd,ol,ul{margin-left:24px}.o-media{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;text-align:left}.o-media .o-media:first-of-type{margin-top:1rem}.o-media__content{-ms-flex-preferred-size:auto;flex-basis:auto;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;text-align:left;-ms-flex-negative:1;flex-shrink:1}.o-media__left,.o-media__right{-ms-flex-preferred-size:auto;flex-basis:auto;-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:0;flex-shrink:0}.o-list--divided>li+li:before{margin-right:12px;background:red;border-top:2px solid #000}.o-list-bare{list-style:none}.o-list-bare,.o-list-bare__item{margin-left:0}.o-list-inline{margin-left:0;list-style:none}.o-list-inline__item{display:inline-block}.o-list-inline__item:not(:last-child){margin-right:12px}.o-list-inline--divided>li+li:before{margin-right:12px;content:\"|\"}.o-columns{-ms-flex-wrap:wrap;flex-wrap:wrap;margin-top:-12px;margin-right:-12px;margin-left:-12px}\@media screen and (min-width:768px){.o-columns{display:-ms-flexbox;display:flex}}.o-columns:last-child{margin-bottom:-12px}.o-columns:not(:last-child){margin-bottom:12px}.o-columns--centered{-ms-flex-pack:center;justify-content:center}.o-columns--row{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.o-columns--gapless{margin:0}.o-columns--gapless>.o-column{padding:0!important;margin:0}.o-columns--gapless:last-child{margin-bottom:0}.o-column{display:block;-ms-flex-preferred-size:0;flex-basis:0;-ms-flex-positive:1;flex-grow:1;-ms-flex-negative:1;flex-shrink:1;padding:12px;margin:0}[class*=u-width-],[class*=u-width-]>.o-column{-ms-flex:none;flex:none}.o-section{padding:24px 0}.o-container{margin:0 auto}\@media screen and (max-width:959px){.o-container{width:100%;padding:0 16px}}\@media screen and (min-width:960px) and (max-width:1377px){.o-container{width:960px;padding:0 24px}}\@media screen and (min-width:1378px) and (max-width:1740px){.o-container{width:1272px;padding:0 24px}}\@media screen and (min-width:1741px){.o-container{width:1680px;padding:0 24px}}.l-fluid .o-container,.o-container-fluid{width:100%;max-width:100%;padding:0 24px}.c-accordion{width:100%;border:0;margin:0 0 16px}.c-accordion__control{display:block;position:relative;width:100%;left:0;border:0;padding:12px 0 12px 56px;text-align:left;background:none;-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;border-top:1px solid rgba(18,18,18,.15);font-size:20px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-accordion__control:focus,.c-accordion__control:hover{outline:0}.is-open .c-accordion__control:after{-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.c-accordion__icon{color:#0a649d}.c-accordion__icon:after,.c-accordion__icon:before{content:\"\";display:block;left:16px;position:absolute;top:50%;-webkit-transition:all .25s ease-in-out;transition:all .25s ease-in-out;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.c-accordion__icon:before{border:3px solid;border-bottom:0;border-right:0;height:12px;width:12px;-webkit-transform:translate(-50%,-75%) rotate(225deg);transform:translate(-50%,-75%) rotate(225deg)}.c-accordion__item.is-open .c-accordion__control .c-accordion__icon:before{-webkit-transform:translate(-50%,-25%) rotate(45deg);transform:translate(-50%,-25%) rotate(45deg)}.c-accordion__headline{font-size:24px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;margin:0 0 16px}.c-accordion__content{display:none;padding:0 56px 24px}.is-open .c-accordion__content{display:block}.c-accordion--lg .c-accordion__headline{font-size:32px}.c-accordion--lg .c-accordion__control,.c-accordion--lg .c-accordion__headline{font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-accordion--lg .c-accordion__control{font-size:24px}.c-breadcrumb{display:block;font-size:16px;line-height:24px;white-space:nowrap}.c-breadcrumb a{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;padding:0 .5em;color:rgba(18,18,18,.75);text-decoration:none;letter-spacing:.06rem}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb a,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb a,[class*=t-mode--dark] .c-breadcrumb a,[class*=t-mode--light] .c-breadcrumb a{color:hsla(0,0%,100%,.75)}.c-breadcrumb a:hover{color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb a:hover,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb a:hover,[class*=t-mode--dark] .c-breadcrumb a:hover,[class*=t-mode--light] .c-breadcrumb a:hover{color:#fff}.c-breadcrumb li{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.c-breadcrumb li:first-child a{padding-left:0}.c-breadcrumb li.is-active a{pointer-events:none;cursor:default;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb li.is-active a,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb li.is-active a,[class*=t-mode--dark] .c-breadcrumb li.is-active a,[class*=t-mode--light] .c-breadcrumb li.is-active a{color:#fff}.c-breadcrumb li+li:before{color:rgba(18,18,18,.5);content:\"/\"}[class*=t-mode--] [class*=t-mode--dark] .c-breadcrumb li+li:before,[class*=t-mode--] [class*=t-mode--light] .c-breadcrumb li+li:before,[class*=t-mode--dark] .c-breadcrumb li+li:before,[class*=t-mode--light] .c-breadcrumb li+li:before{color:hsla(0,0%,100%,.5)}.c-breadcrumb ol,.c-breadcrumb ul{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:start;justify-content:flex-start;margin-left:0}.c-breadcrumb .icon:first-child{margin-right:.5em}.c-breadcrumb .icon:last-child{margin-left:.5em}.c-breadcrumb--centered ol,.c-breadcrumb--centered ul{-ms-flex-pack:center;justify-content:center}.c-breadcrumb--right ol,.c-breadcrumb--right ul{-ms-flex-pack:end;justify-content:flex-end}.c-breadcrumb--sm{font-size:12px}.c-breadcrumb--lg{font-size:24px}.c-breadcrumb--compressed li+li:before{color:rgba(18,18,18,.25);content:\"/\"}.c-breadcrumb--compressed a{padding:0 4px;letter-spacing:0}.c-badge{position:relative;display:inline-block;margin:0;padding:.2em .5em .25em;border-radius:30em;min-width:1em;font-weight:600;font-size:16px;line-height:1;text-align:center;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle;background-color:#05314d;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-badge,[class*=t-mode--] [class*=t-mode--light] .c-badge,[class*=t-mode--dark] .c-badge,[class*=t-mode--light] .c-badge{background-color:#fff;color:#2e2e2e}.c-badge--subtle{color:#2e2e2e;background-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-badge--subtle,[class*=t-mode--] [class*=t-mode--light] .c-badge--subtle,[class*=t-mode--dark] .c-badge--subtle,[class*=t-mode--light] .c-badge--subtle{color:#fff;background-color:rgba(18,18,18,.75)}.c-badge--sm{font-size:12px;padding:.1em .45em}.c-badge:empty{display:none}.c-badge-notification{position:relative;white-space:nowrap}.c-badge-notification:not([data-badge]) :after,.c-badge-notification[data-badge]:after{display:inline-block;color:#fff;content:attr(data-badge);background-color:#bd2b2b;background-clip:padding-box;font-size:14px;border-radius:.5rem;padding:2px;-webkit-box-shadow:0 0 0 .1rem #fff;box-shadow:0 0 0 .1rem #fff;-webkit-transform:translate(-.05rem,-.5rem);-ms-transform:translate(-.05rem,-.5rem);transform:translate(-.05rem,-.5rem);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.c-badge-notification[data-badge]:after{min-width:.9rem;height:.9rem;padding:0 .2rem;font-size:12px;font-weight:700;line-height:1;text-align:center;white-space:nowrap}.c-badge-notification:not([data-badge]) :after,.c-badge-notification[data-badge=\"\"]:after{width:6px;min-width:6px;height:6px;padding:0}.c-badge-notification.c-button{overflow:inherit}.c-badge-notification.c-button:after{top:0;right:0}.c-badge-notification.c-button:after,.c-badge-notification.c-sticker:after{position:absolute;-webkit-transform:translate(50%,-50%);transform:translate(50%,-50%)}.c-badge-notification.c-sticker:after{top:14.64%;right:14.64%;z-index:1}.c-badge-notification--success{background-color:#008719;color:#fff;-webkit-box-shadow:0 0 0 .1rem #008719;box-shadow:0 0 0 .1rem #008719}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--success,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--success,[class*=t-mode--dark] .c-badge-notification--success,[class*=t-mode--light] .c-badge-notification--success{background-color:#008719}.c-badge-notification:not([data-badge]) ::after--danger,.c-badge-notification[data-badge]::after--danger{background-color:#bd2b2b;color:#fff;-webkit-box-shadow:0 0 0 .1rem #cc3535;box-shadow:0 0 0 .1rem #cc3535}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification:not([data-badge])::after--danger,[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification[data-badge]::after--danger,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification:not([data-badge])::after--danger,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification[data-badge]::after--danger,[class*=t-mode--dark] .c-badge-notification:not([data-badge]) ::after--danger,[class*=t-mode--dark] .c-badge-notification[data-badge]::after--danger,[class*=t-mode--light] .c-badge-notification:not([data-badge]) ::after--danger,[class*=t-mode--light] .c-badge-notification[data-badge]::after--danger{background-color:#bd2b2b}.c-badge-notification--warning{background-color:#ff9a0d;color:#2e2e2e;-webkit-box-shadow:0 0 0 .1rem #000;box-shadow:0 0 0 .1rem #000}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--warning,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--warning,[class*=t-mode--dark] .c-badge-notification--warning,[class*=t-mode--light] .c-badge-notification--warning{background-color:#ff9a0d;color:rgba(18,18,18,.75)}.c-badge-notification--info{background-color:#2e2e2e;color:#fff;-webkit-box-shadow:0 0 0 .1rem hsla(0,0%,100%,.1);box-shadow:0 0 0 .1rem hsla(0,0%,100%,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--info,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--info,[class*=t-mode--dark] .c-badge-notification--info,[class*=t-mode--light] .c-badge-notification--info{background-color:#fff;color:#2e2e2e}.c-badge-notification--secondary{background-color:transparent;border:1px solid rgba(18,18,18,.25);color:rgba(18,18,18,.75);-webkit-box-shadow:0 0 0 .1rem hsla(0,0%,100%,.25);box-shadow:0 0 0 .1rem hsla(0,0%,100%,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary,[class*=t-mode--dark] .c-badge-notification--secondary,[class*=t-mode--light] .c-badge-notification--secondary{background-color:transparent;color:hsla(0,0%,100%,.75)}.c-badge-notification--secondary.c-badge--success{color:#008719;border-color:#008719;-webkit-box-shadow:0 0 0 .1rem fk-theme-switcher(\"background-color\");box-shadow:0 0 0 .1rem fk-theme-switcher(\"background-color\")}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary.c-badge--success,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary.c-badge--success,[class*=t-mode--dark] .c-badge-notification--secondary.c-badge--success,[class*=t-mode--light] .c-badge-notification--secondary.c-badge--success{color:#45c15c;border-color:#45c15c}.c-badge-notification--secondary.c-tag--danger{color:#bd2b2b;border-color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary.c-tag--danger,[class*=t-mode--dark] .c-badge-notification--secondary.c-tag--danger,[class*=t-mode--light] .c-badge-notification--secondary.c-tag--danger{color:#fa6464;border-color:#fa6464}.c-badge-notification--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}[class*=t-mode--] [class*=t-mode--dark] .c-badge-notification--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] .c-badge-notification--secondary.c-tag--warning,[class*=t-mode--dark] .c-badge-notification--secondary.c-tag--warning,[class*=t-mode--light] .c-badge-notification--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}\@-webkit-keyframes spinAround{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}\@keyframes spinAround{0%{-webkit-transform:rotate(0);transform:rotate(0)}to{-webkit-transform:rotate(359deg);transform:rotate(359deg)}}.c-button{display:inline-block;position:relative;background:transparent;-webkit-box-shadow:none;box-shadow:none;border:1px solid transparent;border-radius:4px;margin:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;outline:0;overflow:hidden;text-overflow:ellipsis;text-transform:inherit;vertical-align:middle;font-size:16px;padding:.5em .75em;font-weight:400;-webkit-transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,-webkit-box-shadow .25s ease-in-out;transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,-webkit-box-shadow .25s ease-in-out;transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,box-shadow .25s ease-in-out;transition:color .05s ease-in-out,background-color .05s ease-in-out,border-color .25s ease-in-out,box-shadow .25s ease-in-out,-webkit-box-shadow .25s ease-in-out;min-width:24px;max-width:none;-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25);border:1px solid rgba(18,18,18,.1);background-color:#fff;color:#0c77ba}.c-button.is-hovered,.c-button:hover{text-decoration:none}.c-button.is-disabled,.c-button:disabled,.c-button[disabled]{border-color:transparent;cursor:not-allowed}[class*=t-mode--] [class*=t-mode--dark] .c-button,[class*=t-mode--] [class*=t-mode--light] .c-button,[class*=t-mode--dark] .c-button,[class*=t-mode--light] .c-button{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-button.is-hovered,.c-button:hover{-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button:hover,[class*=t-mode--] [class*=t-mode--light] .c-button.is-hovered,[class*=t-mode--] [class*=t-mode--light] .c-button:hover,[class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--dark] .c-button:hover,[class*=t-mode--light] .c-button.is-hovered,[class*=t-mode--light] .c-button:hover{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-button.is-active,.c-button:active{-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button:active,[class*=t-mode--] [class*=t-mode--light] .c-button.is-active,[class*=t-mode--] [class*=t-mode--light] .c-button:active,[class*=t-mode--dark] .c-button.is-active,[class*=t-mode--dark] .c-button:active,[class*=t-mode--light] .c-button.is-active,[class*=t-mode--light] .c-button:active{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-button.is-disabled,.c-button:disabled,.c-button[disabled]{-webkit-box-shadow:none;box-shadow:none}.c-button.is-hovered,.c-button:hover{background-color:#fafafa}.c-button.is-active,.c-button:active{background-color:#e6e6e6}.c-button.is-disabled,.c-button:disabled,.c-button[disabled]{background-color:rgba(18,18,18,.1)}.c-button:focus{-webkit-box-shadow:0 0 0 3px hsla(0,0%,80%,.5);box-shadow:0 0 0 3px hsla(0,0%,80%,.5)}.c-button.is-loading.is-hovered,.c-button.is-loading:hover{background-color:#fff}.c-button.is-loading:after{color:#0c77ba}[class*=t-mode--] [class*=t-mode--dark] .c-button,[class*=t-mode--dark] .c-button{background-color:#616161;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button:hover,[class*=t-mode--dark] .c-button.is-hovered,[class*=t-mode--dark] .c-button:hover{background-color:#575757}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button:active,[class*=t-mode--dark] .c-button.is-active,[class*=t-mode--dark] .c-button:active{background-color:#484848}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button[disabled],[class*=t-mode--dark] .c-button.is-disabled,[class*=t-mode--dark] .c-button:disabled,[class*=t-mode--dark] .c-button[disabled]{background-color:hsla(0,0%,100%,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button:focus,[class*=t-mode--dark] .c-button:focus{-webkit-box-shadow:0 0 0 3px rgba(97,97,97,.4);box-shadow:0 0 0 3px rgba(97,97,97,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button.is-loading:hover,[class*=t-mode--dark] .c-button.is-loading.is-hovered,[class*=t-mode--dark] .c-button.is-loading:hover{background-color:#616161}[class*=t-mode--] [class*=t-mode--dark] .c-button.is-loading:after,[class*=t-mode--dark] .c-button.is-loading:after{color:#fff}.c-button--primary{background-color:#0a649d;color:#fff}.c-button--primary.is-hovered,.c-button--primary:hover{background-color:#09588a}.c-button--primary.is-active,.c-button--primary:active{background-color:#07456d}.c-button--primary.is-disabled,.c-button--primary:disabled,.c-button--primary[disabled]{background-color:rgba(18,18,18,.1)}.c-button--primary:focus{-webkit-box-shadow:0 0 0 3px rgba(10,100,157,.4);box-shadow:0 0 0 3px rgba(10,100,157,.4)}.c-button--primary.is-loading.is-hovered,.c-button--primary.is-loading:hover{background-color:#0a649d}.c-button--primary.is-loading:after{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary,[class*=t-mode--dark] .c-button--primary{background-color:#0a649d;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:active,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:hover,[class*=t-mode--dark] .c-button--primary.is-active,[class*=t-mode--dark] .c-button--primary.is-hovered,[class*=t-mode--dark] .c-button--primary:active,[class*=t-mode--dark] .c-button--primary:hover{background-color:#09588a}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary[disabled],[class*=t-mode--dark] .c-button--primary.is-disabled,[class*=t-mode--dark] .c-button--primary:disabled,[class*=t-mode--dark] .c-button--primary[disabled]{background-color:hsla(0,0%,100%,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary:focus,[class*=t-mode--dark] .c-button--primary:focus{-webkit-box-shadow:0 0 0 3px rgba(10,100,157,.4);box-shadow:0 0 0 3px rgba(10,100,157,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-loading:hover,[class*=t-mode--dark] .c-button--primary.is-loading.is-hovered,[class*=t-mode--dark] .c-button--primary.is-loading:hover{background-color:#0a649d}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary.is-loading:after,[class*=t-mode--dark] .c-button--primary.is-loading:after{color:#fff}.c-button--primary-alt{background-color:#0c7b91;color:#fff}.c-button--primary-alt.is-hovered,.c-button--primary-alt:hover{background-color:#0a6b7e}.c-button--primary-alt.is-active,.c-button--primary-alt:active{background-color:#085362}.c-button--primary-alt.is-disabled,.c-button--primary-alt:disabled,.c-button--primary-alt[disabled]{background-color:rgba(18,18,18,.1)}.c-button--primary-alt:focus{-webkit-box-shadow:0 0 0 3px rgba(12,123,145,.4);box-shadow:0 0 0 3px rgba(12,123,145,.4)}.c-button--primary-alt.is-loading.is-hovered,.c-button--primary-alt.is-loading:hover{background-color:#0c7b91}.c-button--primary-alt.is-loading:after{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt,[class*=t-mode--dark] .c-button--primary-alt{background-color:#0c7b91;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:hover,[class*=t-mode--dark] .c-button--primary-alt.is-hovered,[class*=t-mode--dark] .c-button--primary-alt:hover{background-color:#0a6b7e}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:active,[class*=t-mode--dark] .c-button--primary-alt.is-active,[class*=t-mode--dark] .c-button--primary-alt:active{background-color:#085362}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt[disabled],[class*=t-mode--dark] .c-button--primary-alt.is-disabled,[class*=t-mode--dark] .c-button--primary-alt:disabled,[class*=t-mode--dark] .c-button--primary-alt[disabled]{background-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt:focus,[class*=t-mode--dark] .c-button--primary-alt:focus{-webkit-box-shadow:0 0 0 3px rgba(12,123,145,.4);box-shadow:0 0 0 3px rgba(12,123,145,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-loading:hover,[class*=t-mode--dark] .c-button--primary-alt.is-loading.is-hovered,[class*=t-mode--dark] .c-button--primary-alt.is-loading:hover{background-color:#0c7b91}[class*=t-mode--] [class*=t-mode--dark] .c-button--primary-alt.is-loading:after,[class*=t-mode--dark] .c-button--primary-alt.is-loading:after{color:#fff}.c-button--destructive{background-color:#ad2323;color:#fff}.c-button--destructive.is-hovered,.c-button--destructive:hover{background-color:#9c2020}.c-button--destructive.is-active,.c-button--destructive:active{background-color:#831a1a}.c-button--destructive.is-disabled,.c-button--destructive:disabled,.c-button--destructive[disabled]{background-color:rgba(18,18,18,.1)}.c-button--destructive:focus{-webkit-box-shadow:0 0 0 3px rgba(173,35,35,.4);box-shadow:0 0 0 3px rgba(173,35,35,.4)}.c-button--destructive.is-loading.is-hovered,.c-button--destructive.is-loading:hover{background-color:#ad2323}.c-button--destructive.is-loading:after{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive,[class*=t-mode--dark] .c-button--destructive{background-color:#ad2323;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:hover,[class*=t-mode--dark] .c-button--destructive.is-hovered,[class*=t-mode--dark] .c-button--destructive:hover{background-color:#9c2020}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-active,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:active,[class*=t-mode--dark] .c-button--destructive.is-active,[class*=t-mode--dark] .c-button--destructive:active{background-color:#831a1a}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:disabled,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive[disabled],[class*=t-mode--dark] .c-button--destructive.is-disabled,[class*=t-mode--dark] .c-button--destructive:disabled,[class*=t-mode--dark] .c-button--destructive[disabled]{background-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive:focus,[class*=t-mode--dark] .c-button--destructive:focus{-webkit-box-shadow:0 0 0 3px rgba(173,35,35,.4);box-shadow:0 0 0 3px rgba(173,35,35,.4)}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-loading.is-hovered,[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-loading:hover,[class*=t-mode--dark] .c-button--destructive.is-loading.is-hovered,[class*=t-mode--dark] .c-button--destructive.is-loading:hover{background-color:#ad2323}[class*=t-mode--] [class*=t-mode--dark] .c-button--destructive.is-loading:after,[class*=t-mode--dark] .c-button--destructive.is-loading:after{color:#fff}.c-button--sm{font-size:14px;padding:.1em .75em}.c-button--lg{font-size:20px;padding:.57em .75em}.c-button--xl{font-size:22px;padding:.75em 2em}.c-button.is-loading{opacity:.6;color:transparent;cursor:not-allowed}.c-button.is-loading.c-button--sm:after{width:8px;height:8px;margin-left:-4px;margin-top:-4px;border-width:1px}.c-button.is-loading.c-button--xl:after{width:24px;height:24px;margin-left:-12px;margin-top:-12px}.c-button.is-loading:after{position:absolute;width:24px;height:24px;display:block;-webkit-animation:spinAround .5s linear infinite;animation:spinAround .5s linear infinite;top:0;left:0;border-radius:4rem;border-color:transparent transparent currentcolor currentcolor;border-style:solid;border-width:1px;content:\"\";top:50%;left:50%;margin-left:-6px;margin-top:-6px;width:12px;height:12px}.c-button.c-button--fullwidth{display:block;width:100%;max-width:100%}.c-button-row .c-button:not(:last-child),.c-dialog__actions .c-button:not(:last-child){margin-right:16px}.c-button-row--right{text-align:right}.c-button-row--center{text-align:center}.hljs-comment,.hljs-quote{font-style:italic;color:#5c6370}.hljs-doctag,.hljs-formula,.hljs-keyword{color:#c678dd}.hljs-deletion,.hljs-name,.hljs-section,.hljs-selector-tag,.hljs-subst{color:#e06c75}.hljs-literal{color:#56b6c2}.hljs-addition,.hljs-attribute,.hljs-meta-string,.hljs-regexp,.hljs-string{color:#98c379}.hljs-built_in,.hljs-class .hljs-title{color:#e6c07b}.hljs-attr,.hljs-number,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-pseudo,.hljs-template-variable,.hljs-type,.hljs-variable{color:#d19a66}.hljs-bullet,.hljs-link,.hljs-meta,.hljs-selector-id,.hljs-symbol,.hljs-title{color:#61aeee}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-link{text-decoration:underline}.c-docs-example{position:relative;padding:1rem;margin:0 0 24px;background-color:#fff;color:#2e2e2e;border:1px solid brand-color(\"magenta\",\"light\")}[class*=t-mode--] [class*=t-mode--dark] .c-docs-example,[class*=t-mode--dark] .c-docs-example{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-docs-example,[class*=t-mode--light] .c-docs-example{background-color:#fff;color:#2e2e2e}.c-docs-example--contrast{background-color:#f8f8f8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-docs-example--contrast,[class*=t-mode--dark] .c-docs-example--contrast{background-color:#262626;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-docs-example--contrast,[class*=t-mode--light] .c-docs-example--contrast{background-color:#f8f8f8;color:#2e2e2e}.c-docs-example:before{position:absolute;top:0;right:-1px;bottom:100%;display:-ms-flexbox;display:flex;-ms-flex-align:stretch;align-items:stretch;height:24px;padding:0 8px;margin-left:-1px;font-size:9px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:1px;vertical-align:top;content:\"Example\";background:brand-color(\"magenta\",\"light\");border-radius:2px 2px 0 0}.c-docs-code{position:relative;display:block;padding:16px;margin:0 0 24px;overflow-x:auto;color:#abb2bf;background-color:rgba(18,18,18,.9)}.c-docs-example+.c-docs-code{margin-top:-24px}.c-docs-code pre{padding:0;margin:0}.c-docs-code code:before{position:absolute;top:8px;right:12px;font-family:Source Code Pro,Verdana;font-weight:text-weight(\"semibold\");content:attr(data-lang)}.c-docs-code figure,.c-docs-code figure pre{margin:0}.c-close{color:#fff;font:14px/100% arial,sans-serif;border-radius:4px;text-decoration:none;font-size:24px;padding:0;cursor:pointer;border:0;background:transparent}.c-close--sm{font-size:20px}.c-close--lg{font-size:48px}.c-datalist{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;padding:0;margin:0}.c-datalist__item{display:inline-block;padding:16px 0;list-style-type:none;border-bottom:1px solid #ccc}.c-datalist__item:last-child{border-bottom:0}.c-datalist__label{display:inline-block;width:35%;font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px;vertical-align:top;text-rendering:optimizeLegibility}\@media screen and (max-width:767px){.c-datalist__label{width:100%}}.c-datalist__value{display:inline-block;width:55%;color:#333;vertical-align:top;margin-right:5%}.c-datalist--columns{-ms-flex-direction:row;flex-direction:row;-ms-flex-flow:row wrap;flex-flow:row wrap}\@media screen and (max-width:767px){.c-datalist--columns{-ms-flex-direction:column;flex-direction:column}}.c-datalist--columns>.c-datalist__item{width:50%;-ms-flex-line-pack:justify;align-content:space-between}.c-dialog{width:450px;text-align:left;border-radius:4px;background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3);box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3)}[class*=t-mode--] [class*=t-mode--dark] .c-dialog,[class*=t-mode--dark] .c-dialog{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-dialog,[class*=t-mode--light] .c-dialog{background-color:#fff;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-dialog,[class*=t-mode--] [class*=t-mode--light] .c-dialog,[class*=t-mode--dark] .c-dialog,[class*=t-mode--light] .c-dialog{-webkit-box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3);box-shadow:0 12px 18px -1px rgba(0,0,0,.1),0 3px 13px 0 rgba(0,0,0,.3)}.c-dialog__message{padding:24px;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column}.c-dialog__title{font-size:20px;font-weight:600}.c-dialog__text,.c-dialog__title{line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-dialog__text{color:#2e2e2e;font-size:16px;font-weight:400}[class*=t-mode--] [class*=t-mode--dark] .c-dialog__text,[class*=t-mode--] [class*=t-mode--light] .c-dialog__text,[class*=t-mode--dark] .c-dialog__text,[class*=t-mode--light] .c-dialog__text{color:#fff}.c-dialog__title+.c-dialog__text{color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-dialog__title+.c-dialog__text,[class*=t-mode--] [class*=t-mode--light] .c-dialog__title+.c-dialog__text,[class*=t-mode--dark] .c-dialog__title+.c-dialog__text,[class*=t-mode--light] .c-dialog__title+.c-dialog__text{color:hsla(0,0%,100%,.75)}.c-dialog__actions{padding:0 24px 24px;border-bottom-right-radius:4px;border-bottom-left-radius:4px;text-align:right}.c-dialog--graphic,.c-dialog--graphic>.c-dialog__actions{text-align:center}.c-dialog__graphic{-ms-flex-item-align:center;align-self:center;margin:0 0 12px}.c-dialog__graphic svg{position:relative;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);color:#bd2b2b;width:72px;height:72px}[class*=c-divider]{border:0;margin-bottom:24px}.c-divider{height:1px}.c-divider:after{content:\"\";display:inline-block;width:100%;max-width:100%;border-top:1px solid #333;vertical-align:top}.c-footer{display:block;width:100%;padding:24px;background-color:#f8f8f8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--light] .c-footer,[class*=t-mode--light] .c-footer{color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-footer,[class*=t-mode--dark] .c-footer{background-color:#262626;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-footer,[class*=t-mode--light] .c-footer{background-color:#f8f8f8;color:#2e2e2e}.c-footer--fluid>.o-container{width:100%;max-width:none}.c-footer--centered{text-align:center}.c-image-responsive{display:block;height:auto;max-width:100%}.c-image-fit-cover{-o-object-fit:cover;object-fit:cover}.c-image-fit-contain{-o-object-fit:contain;object-fit:contain}.c-video-responsive{display:block;overflow:hidden;padding:0;position:relative;width:100%}.c-video-responsive:before{content:\"\";display:block;padding-bottom:56.25%}.c-video-responsive embed,.c-video-responsive iframe,.c-video-responsive object{border:0;bottom:0;height:100%;left:0;position:absolute;right:0;top:0;width:100%}video.c-video-responsive{height:auto;max-width:100%}video.c-video-responsive:before{content:none}.c-video-responsive-4-3:before{padding-bottom:75%}.c-video-responsive-1-1:before{padding-bottom:100%}.c-figure{margin:0 0 24px}.c-figure__caption{font-size:16px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-figure__caption,[class*=t-mode--] [class*=t-mode--light] .c-figure__caption,[class*=t-mode--dark] .c-figure__caption,[class*=t-mode--light] .c-figure__caption{color:hsla(0,0%,100%,.75)}.c-modal{position:fixed;top:0;right:0;bottom:0;left:0;width:auto;z-index:500;pointer-events:none;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.c-modal__container{position:relative;margin:1.75rem auto;outline:0}.c-modal__container .is-closed{-webkit-transform:translateY(-25%);transform:translateY(-25%)}.c-modal__container .is-open{-webkit-transform:translate(0);transform:translate(0)}.c-modal--centered .c-modal__container{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.c-modal__dialog{display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:column;flex-direction:column;width:640px;height:100%;max-height:100%;pointer-events:auto;background-color:#fff;color:#2e2e2e;background-clip:padding-box;overflow:hidden;outline:0}[class*=t-mode--] [class*=t-mode--dark] .c-modal__dialog,[class*=t-mode--dark] .c-modal__dialog{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-modal__dialog,[class*=t-mode--light] .c-modal__dialog{background-color:#fff;color:#2e2e2e}.c-modal__header{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;-ms-flex-pack:justify;justify-content:space-between}.c-image{position:relative;display:block}.c-image img{display:block;width:100%;height:auto}.c-image.c-image--1by1 img,.c-image.c-image--1by2 img,.c-image.c-image--1by3 img,.c-image.c-image--2by1 img,.c-image.c-image--2by3 img,.c-image.c-image--3by1 img,.c-image.c-image--3by2 img,.c-image.c-image--3by4 img,.c-image.c-image--3by5 img,.c-image.c-image--4by3 img,.c-image.c-image--4by5 img,.c-image.c-image--5by3 img,.c-image.c-image--5by4 img,.c-image.c-image--9by16 img,.c-image.c-image--16by9 img,.c-image.c-image--square img{bottom:0;left:0;position:absolute;right:0;top:0;width:100%;height:100%}.c-image.c-image--1by1,.c-image.c-image--square{padding-top:100%}.c-image.c-image--5by4{padding-top:80%}.c-image.c-image--4by3{padding-top:75%}.c-image.c-image--3by2{padding-top:66.6666%}.c-image.c-image--5by3{padding-top:60%}.c-image.c-image--16by9{padding-top:56.25%}.c-image.c-image--2by1{padding-top:50%}.c-image.c-image--3by1{padding-top:33.3333%}.c-image.c-image--4by5{padding-top:125%}.c-image.c-image--3by4{padding-top:133.3333%}.c-image.c-image--2by3{padding-top:150%}.c-image.c-image--3by5{padding-top:166.6666%}.c-image.c-image--9by16{padding-top:177.7777%}.c-image.c-image--1by2{padding-top:200%}.c-image.c-image--1by3{padding-top:300%}.c-form-input,.c-form-select{position:relative;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start;display:-ms-inline-flexbox;display:inline-flex;font-size:16px;line-height:24px;width:100%;max-width:100%;padding:.5em .75em;text-transform:unset;background-clip:padding-box;cursor:text;border-radius:4px;border-color:rgba(18,18,18,.25);border-style:solid;-webkit-box-shadow:none;box-shadow:none;-webkit-transition:1s cubic-bezier(.4,0,.2,1);transition:1s cubic-bezier(.4,0,.2,1);-webkit-transition-property:color,background-color,border;transition-property:color,background-color,border;vertical-align:top}.c-form-input+.c-help,.c-form-select+.c-help{padding-top:8px}.c-form-input+.c-button,.c-form-select+.c-button{margin-right:8px}.c-form-input+.c-button--fullwidth,.c-form-select+.c-button--fullwidth{margin-top:8px}.c-form-input:not(:last-child),.c-form-select:not(:last-child){margin:0}.c-form-input::-webkit-input-placeholder,.c-form-select::-webkit-input-placeholder{color:rgba(18,18,18,.75)}.c-form-input:-ms-input-placeholder,.c-form-select:-ms-input-placeholder{color:rgba(18,18,18,.75)}.c-form-input::-ms-input-placeholder,.c-form-select::-ms-input-placeholder{color:rgba(18,18,18,.75)}.c-form-input::placeholder,.c-form-select::placeholder{color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input::-webkit-input-placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select::-webkit-input-placeholder,[class*=t-mode--light] .c-form-input::-webkit-input-placeholder,[class*=t-mode--light] .c-form-select::-webkit-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input:-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select:-ms-input-placeholder,[class*=t-mode--light] .c-form-input:-ms-input-placeholder,[class*=t-mode--light] .c-form-select:-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input::-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select::-ms-input-placeholder,[class*=t-mode--light] .c-form-input::-ms-input-placeholder,[class*=t-mode--light] .c-form-select::-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--light] .c-form-input::placeholder,[class*=t-mode--] [class*=t-mode--light] .c-form-select::placeholder,[class*=t-mode--light] .c-form-input::placeholder,[class*=t-mode--light] .c-form-select::placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input::-webkit-input-placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select::-webkit-input-placeholder,[class*=t-mode--dark] .c-form-input::-webkit-input-placeholder,[class*=t-mode--dark] .c-form-select::-webkit-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input:-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select:-ms-input-placeholder,[class*=t-mode--dark] .c-form-input:-ms-input-placeholder,[class*=t-mode--dark] .c-form-select:-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input::-ms-input-placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select::-ms-input-placeholder,[class*=t-mode--dark] .c-form-input::-ms-input-placeholder,[class*=t-mode--dark] .c-form-select::-ms-input-placeholder{color:hsla(0,0%,100%,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-form-input::placeholder,[class*=t-mode--] [class*=t-mode--dark] .c-form-select::placeholder,[class*=t-mode--dark] .c-form-input::placeholder,[class*=t-mode--dark] .c-form-select::placeholder{color:hsla(0,0%,100%,.75)}.c-form-input:active,.c-form-input:focus,.c-form-select:active,.c-form-select:focus,.is-active.c-form-input,.is-active.c-form-select,.is-focused.c-form-input,.is-focused.c-form-select{color:inherit;border-color:#1887cc;outline:0;-webkit-box-shadow:0 0 0 1px rgba(24,135,204,.4);box-shadow:0 0 0 1px rgba(24,135,204,.4)}.c-form-input:disabled,.c-form-input[disabled],.c-form-select:disabled,.c-form-select[disabled],.is-disabled.c-form-input,.is-disabled.c-form-select{color:rgba(18,18,18,.5);background-color:hsla(0,0%,100%,.05);border-color:hsla(0,0%,100%,.1);-webkit-box-shadow:none;box-shadow:none;cursor:not-allowed}.is-error.c-form-input,.is-error.c-form-select{color:inherit;border-color:#bd2b2b}.is-error.c-form-input:active,.is-error.c-form-input:focus,.is-error.c-form-select:active,.is-error.c-form-select:focus,.is-error.is-active.c-form-input,.is-error.is-active.c-form-select,.is-error.is-focused.c-form-input,.is-error.is-focused.c-form-select{-webkit-box-shadow:0 0 0 1px rgba(189,43,43,.4);box-shadow:0 0 0 1px rgba(189,43,43,.4)}.is-success.c-form-input,.is-success.c-form-select{color:inherit;border-color:#006e14}.is-success.c-form-input:active,.is-success.c-form-input:focus,.is-success.c-form-select:active,.is-success.c-form-select:focus,.is-success.is-active.c-form-input,.is-success.is-active.c-form-select,.is-success.is-focused.c-form-input,.is-success.is-focused.c-form-select{-webkit-box-shadow:0 0 0 1px rgba(0,110,20,.4);box-shadow:0 0 0 1px rgba(0,110,20,.4)}.c-form-input{background-color:#fff;color:#2e2e2e;border-width:1px;-webkit-box-shadow:none;box-shadow:none}[class*=t-mode--] [class*=t-mode--dark] .c-form-input,[class*=t-mode--dark] .c-form-input{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-form-input,[class*=t-mode--light] .c-form-input{background-color:#fff;color:#2e2e2e}.c-form-input--sm{padding:.1em .75em;font-size:14px;line-height:24px}.c-form-input--lg{padding:.57em .75em;font-size:20px;max-height:none}.c-form-textarea{min-height:80px}.c-help{font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-help,[class*=t-mode--] [class*=t-mode--light] .c-help,[class*=t-mode--dark] .c-help,[class*=t-mode--light] .c-help{color:hsla(0,0%,100%,.75)}.c-help+.c-help{margin-top:4px}.c-help .c-ucon{margin:0 8px 0 0}.c-help.is-error{color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .c-help.is-error,[class*=t-mode--] [class*=t-mode--light] .c-help.is-error,[class*=t-mode--dark] .c-help.is-error,[class*=t-mode--light] .c-help.is-error{color:#f26868}.c-help.is-success{color:#008719}[class*=t-mode--] [class*=t-mode--dark] .c-help.is-success,[class*=t-mode--] [class*=t-mode--light] .c-help.is-success,[class*=t-mode--dark] .c-help.is-success,[class*=t-mode--light] .c-help.is-success{color:#45c15c}.c-form-check input,.c-form-radio input{margin:0 8px 0 0}.c-form-label{line-height:1.4;display:block;margin:0 0 12px;font-weight:600}.c-form-label:after,.c-form-label:before{content:\"\";display:block;height:0;width:0}.c-form-label:before{margin-bottom:-.41875em}.c-form-label:after{margin-top:-.35625em}.c-form-label--lg{font-size:18px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-form-label--xl{font-size:22px}.c-form-inline,.c-form-inline>.c-form-item{display:inline-block;margin:0 16px 0 0}.c-form-item{margin-bottom:24px}.c-form-row{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start}.c-form-row .c-form-item{position:relative;-ms-flex-preferred-size:auto;flex-basis:auto;-ms-flex-direction:row;flex-direction:row;-ms-flex-positive:1;flex-grow:1;min-width:24px;-ms-flex-negative:1;flex-shrink:1}.c-form-row .c-form-item:not(:last-of-type){margin:0 16px 0 0}.c-form-row .c-form-item--fit{width:auto;max-width:100%;-ms-flex-negative:0;flex-shrink:0}.c-form-select:not([multiple]) :not([size]){padding-right:2em;background:#fff url(\"data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23667189'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E\") no-repeat right .5em center/.75em .75em}.c-form-select::-ms-expand{display:none}.c-form-group{margin-bottom:24px}.c-form-group .c-form-item{margin-bottom:0}.c-form--horizontal .c-form-group,.c-form--horizontal .c-form-item{display:-ms-flexbox;display:flex}.c-ucon{position:relative;display:inline-block;vertical-align:middle;stroke-width:0;width:24px;height:24px}.c-ucon svg{vertical-align:top}.c-ucon--lg{width:48px;height:48px}.c-help .c-ucon,.c-ucon--sm{width:16px;height:16px}.c-ucon--mirrored{-webkit-filter:FlipH;filter:FlipH;-webkit-transform:scaleX(-1);transform:scaleX(-1)}.c-ucon--lg.c-ucon-loader:after{width:36px;height:36px}.c-help .c-ucon-loader.c-ucon:after,.c-ucon--sm.c-ucon-loader:after{width:16px;height:16px}.c-ucon-loader:after{width:24px;height:24px;display:block;-webkit-animation:spinAround .5s linear infinite;animation:spinAround .5s linear infinite;top:0;left:0;border-radius:4rem;border-color:transparent transparent currentcolor currentcolor;border-style:solid;border-width:1px;content:\"\"}.c-keyvalue{text-align:center}.c-keyvalue__label{font-size:14px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase;color:rgba(18,18,18,.75);line-height:1.4}[class*=t-mode--] [class*=t-mode--dark] .c-keyvalue__label,[class*=t-mode--] [class*=t-mode--light] .c-keyvalue__label,[class*=t-mode--dark] .c-keyvalue__label,[class*=t-mode--light] .c-keyvalue__label{color:hsla(0,0%,100%,.75)}.c-keyvalue__label:after,.c-keyvalue__label:before{content:\"\";display:block;height:0;width:0}.c-keyvalue__label:before{margin-bottom:-.41875em}.c-keyvalue__label:after{margin-top:-.35625em}.c-keyvalue__value{font-size:18px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;line-height:1.4}.c-keyvalue__value:after,.c-keyvalue__value:before{content:\"\";display:block;height:0;width:0}.c-keyvalue__value:before{margin-bottom:-.41875em}.c-keyvalue__value:after{margin-top:-.35625em}.c-keyvalue--lg .c-keyvalue__label{font-size:16px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase}.c-keyvalue--lg .c-keyvalue__value{font-size:32px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-keyvalue--xl>.c-keyvalue__label{font-size:16px;text-transform:uppercase}.c-keyvalue--xl>.c-keyvalue__label,.c-keyvalue--xl>.c-keyvalue__value{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit}.c-keyvalue--xl>.c-keyvalue__value{font-size:48px;text-transform:inherit}.c-keyvalue__label+.c-keyvalue__value,.c-keyvalue__value+.c-keyvalue__label{margin-top:4px}.c-link,.c-link-underlined{cursor:pointer}.c-link-underlined:visited,.c-link:visited{color:inherit}.c-link,.c-link-underlined{color:#0c77ba}[class*=t-mode--] [class*=t-mode--dark] .c-link,[class*=t-mode--] [class*=t-mode--dark] .c-link-underlined,[class*=t-mode--] [class*=t-mode--light] .c-link,[class*=t-mode--] [class*=t-mode--light] .c-link-underlined,[class*=t-mode--dark] .c-link,[class*=t-mode--dark] .c-link-underlined,[class*=t-mode--light] .c-link,[class*=t-mode--light] .c-link-underlined{color:#2594d9}.c-link-article{color:#0c77ba;background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(12,119,186,.15)),color-stop(rgba(12,119,186,.15)),to(rgba(12,119,186,.15)));background-image:linear-gradient(rgba(12,119,186,.15),rgba(12,119,186,.15),rgba(12,119,186,.15));background-repeat:repeat-x;background-position:1px 1.1em;background-size:1em 2px}[class*=t-mode--] [class*=t-mode--dark] .c-link-article,[class*=t-mode--] [class*=t-mode--light] .c-link-article,[class*=t-mode--dark] .c-link-article,[class*=t-mode--light] .c-link-article{color:#2594d9}.c-link-article:hover{text-decoration:none;background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(12,119,186,.45)),color-stop(rgba(12,119,186,.45)),to(rgba(12,119,186,.45)));background-image:linear-gradient(rgba(12,119,186,.45),rgba(12,119,186,.45),rgba(12,119,186,.45))}.c-link-info{border-bottom:1px dashed rgba(10,100,157,.6);color:#0c77ba}[class*=t-mode--] [class*=t-mode--dark] .c-link-info,[class*=t-mode--] [class*=t-mode--light] .c-link-info,[class*=t-mode--dark] .c-link-info,[class*=t-mode--light] .c-link-info{color:#2594d9}.c-link-implied,.c-link-info:hover{text-decoration:none}.c-link-implied{color:currentColor}.c-link-implied:hover,.c-link-underlined{text-decoration:underline}.c-list{padding:8px 0;margin:0;line-height:1.25;list-style-type:none}.c-list--large.c-list--two-line,.c-list--two-line>.c-list-item{height:72px}.c-list--lg{padding:8px 0}.c-list--lg>.c-list-item{height:48px;font-size:18px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-list .c-divider{margin:12px 0}.c-list-item{position:relative;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start;height:36px;padding:0 24px;font-size:16px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-list-item,[class*=t-mode--] [class*=t-mode--light] .c-list-item,[class*=t-mode--dark] .c-list-item,[class*=t-mode--light] .c-list-item{color:#fff}.c-list-item,.c-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.c-list-item__text{-ms-flex-positive:1;flex-grow:1}.c-list-item__secondary{display:block;font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-list-item__secondary,[class*=t-mode--] [class*=t-mode--light] .c-list-item__secondary,[class*=t-mode--dark] .c-list-item__secondary,[class*=t-mode--light] .c-list-item__secondary{color:hsla(0,0%,100%,.75)}.c-list-item__primary-text,.c-list-item__secondary-text,.c-list-item__text{line-height:1.25}.c-list-item:focus{outline:0}.c-list-item__anchor{display:-ms-inline-flexbox;display:inline-flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-ms-flex-negative:0;flex-shrink:0;margin:0 16px 0 0;color:rgba(18,18,18,.5);max-width:36px}[class*=t-mode--] [class*=t-mode--dark] .c-list-item__anchor,[class*=t-mode--] [class*=t-mode--light] .c-list-item__anchor,[class*=t-mode--dark] .c-list-item__anchor,[class*=t-mode--light] .c-list-item__anchor{color:hsla(0,0%,100%,.5)}.c-list-item__meta{color:rgba(18,18,18,.75);font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}[class*=t-mode--] [class*=t-mode--dark] .c-list-item__meta,[class*=t-mode--] [class*=t-mode--light] .c-list-item__meta,[class*=t-mode--dark] .c-list-item__meta,[class*=t-mode--light] .c-list-item__meta{color:hsla(0,0%,100%,.75)}a.c-list-item{color:inherit;text-decoration:none}a.c-list-item:hover{background-color:#ccc}.c-tabs__container{width:100%;padding:0}.c-tabs__content{display:none;padding:24px;background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 1px 1px rgba(27,31,35,.25);box-shadow:0 1px 1px rgba(27,31,35,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__content,[class*=t-mode--dark] .c-tabs__content{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-tabs__content,[class*=t-mode--light] .c-tabs__content{background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__content,[class*=t-mode--dark] .c-tabs__content{-webkit-box-shadow:0 1px 1px rgba(18,18,18,.75);box-shadow:0 1px 1px rgba(18,18,18,.75)}.c-tabs__content.is-active{display:block}.c-tabs__label{display:inline-block;padding:1rem 1.5625rem;margin:0 0 -1px;color:#0c77ba;text-align:center;background-color:rgba(18,18,18,.05)}.c-tabs__label:not(.is-active){border-bottom:1px solid rgba(18,18,18,.05)}.c-tabs__label:hover{cursor:pointer;background:rgba(0,0,0,.07)}.c-tabs__label.is-active{font-size:16px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 -1px 1px rgba(27,31,35,.15);box-shadow:0 -1px 1px rgba(27,31,35,.15)}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__label.is-active,[class*=t-mode--dark] .c-tabs__label.is-active{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-tabs__label.is-active,[class*=t-mode--light] .c-tabs__label.is-active{background-color:#fff;color:#2e2e2e;-webkit-box-shadow:0 -1px 1px #121212;box-shadow:0 -1px 1px #121212}[class*=t-mode--] [class*=t-mode--dark] .c-tabs__label.is-active,[class*=t-mode--dark] .c-tabs__label.is-active{-webkit-box-shadow:0 -1px 1px #121212;box-shadow:0 -1px 1px #121212}.c-tag,a.c-tag{display:inline-block;text-align:center;white-space:nowrap;vertical-align:baseline;line-height:1;padding:4px 8px;font-size:12px;border-radius:4px;font-weight:600;background-color:rgba(18,18,18,.1);color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-tag,[class*=t-mode--] [class*=t-mode--dark] a.c-tag,[class*=t-mode--] [class*=t-mode--light] .c-tag,[class*=t-mode--] [class*=t-mode--light] a.c-tag,[class*=t-mode--dark] .c-tag,[class*=t-mode--dark] a.c-tag,[class*=t-mode--light] .c-tag,[class*=t-mode--light] a.c-tag{background-color:hsla(0,0%,100%,.25);color:#fff}.c-tag--lg,a.c-tag--lg{font-size:16px}.c-tag--success,a.c-tag--success{background-color:#008719;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--success,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--success,[class*=t-mode--] [class*=t-mode--light] .c-tag--success,[class*=t-mode--] [class*=t-mode--light] a.c-tag--success,[class*=t-mode--dark] .c-tag--success,[class*=t-mode--dark] a.c-tag--success,[class*=t-mode--light] .c-tag--success,[class*=t-mode--light] a.c-tag--success{background-color:#008719}.c-tag--brand,a.c-tag--brand{background-color:#0a649d;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--brand,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--brand,[class*=t-mode--] [class*=t-mode--light] .c-tag--brand,[class*=t-mode--] [class*=t-mode--light] a.c-tag--brand,[class*=t-mode--dark] .c-tag--brand,[class*=t-mode--dark] a.c-tag--brand,[class*=t-mode--light] .c-tag--brand,[class*=t-mode--light] a.c-tag--brand{background-color:#085280}.c-tag--danger,a.c-tag--danger{background-color:#bd2b2b;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--danger,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] .c-tag--danger,[class*=t-mode--] [class*=t-mode--light] a.c-tag--danger,[class*=t-mode--dark] .c-tag--danger,[class*=t-mode--dark] a.c-tag--danger,[class*=t-mode--light] .c-tag--danger,[class*=t-mode--light] a.c-tag--danger{background-color:#bd2b2b}.c-tag--warning,a.c-tag--warning{background-color:#ff9a0d;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .c-tag--warning,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] .c-tag--warning,[class*=t-mode--] [class*=t-mode--light] a.c-tag--warning,[class*=t-mode--dark] .c-tag--warning,[class*=t-mode--dark] a.c-tag--warning,[class*=t-mode--light] .c-tag--warning,[class*=t-mode--light] a.c-tag--warning{background-color:#ff9a0d;color:rgba(18,18,18,.75)}.c-tag--info,a.c-tag--info{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--dark] .c-tag--info,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--info,[class*=t-mode--] [class*=t-mode--light] .c-tag--info,[class*=t-mode--] [class*=t-mode--light] a.c-tag--info,[class*=t-mode--dark] .c-tag--info,[class*=t-mode--dark] a.c-tag--info,[class*=t-mode--light] .c-tag--info,[class*=t-mode--light] a.c-tag--info{background-color:#fff;color:#2e2e2e}.c-tag:empty,a.c-tag:empty{display:none}.c-tag--secondary,a.c-tag--secondary{background-color:transparent;border:1px solid rgba(18,18,18,.25);color:rgba(18,18,18,.75)}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary,[class*=t-mode--dark] .c-tag--secondary,[class*=t-mode--dark] a.c-tag--secondary,[class*=t-mode--light] .c-tag--secondary,[class*=t-mode--light] a.c-tag--secondary{background-color:transparent;color:hsla(0,0%,100%,.75)}.c-tag--secondary.c-tag--success,a.c-tag--secondary.c-tag--success{color:#008719;border-color:#008719}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--success,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--success,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--success,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--success,[class*=t-mode--dark] .c-tag--secondary.c-tag--success,[class*=t-mode--dark] a.c-tag--secondary.c-tag--success,[class*=t-mode--light] .c-tag--secondary.c-tag--success,[class*=t-mode--light] a.c-tag--secondary.c-tag--success{color:#45c15c;border-color:#45c15c}.c-tag--secondary.c-tag--danger,a.c-tag--secondary.c-tag--danger{color:#bd2b2b;border-color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--danger,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--danger,[class*=t-mode--dark] .c-tag--secondary.c-tag--danger,[class*=t-mode--dark] a.c-tag--secondary.c-tag--danger,[class*=t-mode--light] .c-tag--secondary.c-tag--danger,[class*=t-mode--light] a.c-tag--secondary.c-tag--danger{color:#fa6464;border-color:#fa6464}.c-tag--secondary.c-tag--warning,a.c-tag--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--warning,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--warning,[class*=t-mode--dark] .c-tag--secondary.c-tag--warning,[class*=t-mode--dark] a.c-tag--secondary.c-tag--warning,[class*=t-mode--light] .c-tag--secondary.c-tag--warning,[class*=t-mode--light] a.c-tag--secondary.c-tag--warning{color:#c55422;border-color:#ff9a0d}.c-tag--secondary.c-tag--brand,a.c-tag--secondary.c-tag--brand{border-color:#0a649d;color:#0a649d}[class*=t-mode--] [class*=t-mode--dark] .c-tag--secondary.c-tag--brand,[class*=t-mode--] [class*=t-mode--dark] a.c-tag--secondary.c-tag--brand,[class*=t-mode--] [class*=t-mode--light] .c-tag--secondary.c-tag--brand,[class*=t-mode--] [class*=t-mode--light] a.c-tag--secondary.c-tag--brand,[class*=t-mode--dark] .c-tag--secondary.c-tag--brand,[class*=t-mode--dark] a.c-tag--secondary.c-tag--brand,[class*=t-mode--light] .c-tag--secondary.c-tag--brand,[class*=t-mode--light] a.c-tag--secondary.c-tag--brand{border-color:#085280;color:#085280}a.c-tag.is-hovered,a.c-tag:hover{cursor:pointer}.c-switch{position:relative;display:inline-block}.c-switch .c-switch__input{position:absolute;display:none}.c-switch .c-switch__input:checked~.c-switch__label .c-switch__control .c-switch__handle{right:0}.c-switch .c-switch__input:checked~.c-switch__label .c-switch__control .c-switch__track .c-switch__inner{margin-left:0}.c-switch .c-switch__label{display:block;cursor:pointer}.c-switch .c-switch__text{vertical-align:middle;font-size:14px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;padding-left:8px;font-weight:600}.c-switch .c-switch__text--left{padding-left:0;padding-right:8px}.c-switch .c-switch__control{position:relative;width:46.2px;display:inline-block;vertical-align:middle}.c-switch .c-switch__handle{top:0;right:24.2px;margin:0;position:absolute;display:inline-block;width:22px;height:22px;border-radius:22px;z-index:1000;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.8);box-shadow:0 1px 2px rgba(0,0,0,.8);-webkit-transition:right .15s ease-in-out;-o-transition:right .15s ease-in-out;-moz-transition:right .15s ease-in-out;transition:right .15s ease-in-out;background-color:#fff;color:#2e2e2e;border:1px solid hsla(0,0%,100%,.25)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__handle,[class*=t-mode--dark] .c-switch .c-switch__handle{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .c-switch .c-switch__handle,[class*=t-mode--light] .c-switch .c-switch__handle{background-color:#fff;color:#2e2e2e;border-color:rgba(18,18,18,.5)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__handle,[class*=t-mode--dark] .c-switch .c-switch__handle{border-color:rgba(18,18,18,.5)}.c-switch .c-switch__track{display:block;overflow:hidden;border-radius:44px;margin:0}.c-switch .c-switch__inner{width:200%;margin-left:-100%;-webkit-transition:margin .15s ease-in-out;-o-transition:margin .15s ease-in-out;-moz-transition:margin .15s ease-in-out;transition:margin .15s ease-in-out}.c-switch .c-switch__inner:after,.c-switch .c-switch__inner:before{float:left;display:block;width:50%;padding:0;height:22px;line-height:22px;font-size:12px;color:#fff;font-weight:600;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.7);box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.7);border-radius:44px}.c-switch .c-switch__inner:before{content:\"\";color:#2e2e2e;background-color:#2594d9;-webkit-box-shadow:inset 0 0 2px 1px rgba(18,18,18,.6),inset 0 0 1px 0 rgba(18,18,18,.7);box-shadow:inset 0 0 2px 1px rgba(18,18,18,.6),inset 0 0 1px 0 rgba(18,18,18,.7)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__inner:before,[class*=t-mode--] [class*=t-mode--light] .c-switch .c-switch__inner:before,[class*=t-mode--dark] .c-switch .c-switch__inner:before,[class*=t-mode--light] .c-switch .c-switch__inner:before{color:#fff;background-color:#2594d9}.c-switch .c-switch__inner:after{content:\"\";text-align:right;background-color:#e8e8e8;color:rgba(18,18,18,.75);-webkit-box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.9);box-shadow:inset 0 0 2px 1px rgba(18,18,18,.03),inset 0 0 1px 0 rgba(18,18,18,.9)}[class*=t-mode--] [class*=t-mode--dark] .c-switch .c-switch__inner:after,[class*=t-mode--] [class*=t-mode--light] .c-switch .c-switch__inner:after,[class*=t-mode--dark] .c-switch .c-switch__inner:after,[class*=t-mode--light] .c-switch .c-switch__inner:after{background-color:#1f1f1f;color:hsla(0,0%,100%,.5)}.c-switch.c-switch--onoff .c-switch .c-switch__inner:after{content:\"OFF\"}.c-switch.c-switch--onoff .c-switch__inner:after{content:\"OFF\";padding-right:3px;font-size:12px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:rgba(18,18,18,.5);line-height:1.75}[class*=t-mode--] [class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:after,[class*=t-mode--] [class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:after,[class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:after,[class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:after{color:hsla(0,0%,100%,.75)}.c-switch.c-switch--onoff .c-switch__inner:before{content:\"ON\";padding-left:5px;font-size:12px;font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit;color:hsla(0,0%,100%,.75);line-height:1.75}[class*=t-mode--] [class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:before,[class*=t-mode--] [class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:before,[class*=t-mode--dark] .c-switch.c-switch--onoff .c-switch__inner:before,[class*=t-mode--light] .c-switch.c-switch--onoff .c-switch__inner:before{color:hsla(0,0%,100%,.75)}.c-switch.c-switch--sm .c-switch__handle{right:14px;width:14px;height:14px;height:16px}.c-switch.c-switch--sm .c-switch__control{width:28px}.c-switch.c-switch--sm .c-switch__inner{width:200%;margin-left:-100%}.c-switch.c-switch--sm .c-switch__inner:after,.c-switch.c-switch--sm .c-switch__inner:before{height:16px;line-height:16px;font-size:1px}.c-switch.c-switch--lg .c-switch__control{width:59.4px;height:32px}.c-switch.c-switch--lg .c-switch__handle{right:27.4px;width:32px;height:32px}.c-switch.c-switch--lg .c-switch__inner{width:200%;margin-left:-100%}.c-switch.c-switch--lg .c-switch__inner:after,.c-switch.c-switch--lg .c-switch__inner:before{height:32px;line-height:32px}.c-sticker{-ms-flex-align:center;align-items:center;border-radius:4px;height:2rem;line-height:2rem;width:2rem;display:-ms-inline-flexbox;display:inline-flex;font-size:.625rem;font-weight:700;-ms-flex-pack:center;justify-content:center;position:relative;text-align:center;vertical-align:middle;background-color:rgba(18,18,18,.15);overflow:hidden}.c-sticker--circle{border-radius:5000px}body{font-size:16px;line-height:1.5em;font-family:Source Sans Pro,Arial,sans-serif;-webkit-font-smoothing:antialiased}.c-type-display1{font-size:72px}.c-type-display1,.c-type-display2{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-display2{font-size:48px}.c-type-headline1{font-size:32px}.c-type-headline1,.c-type-headline2{font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-headline2{font-size:24px}.c-type-headline3{font-size:20px}.c-type-headline3,.c-type-headline4{font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-headline4{font-size:18px}.c-type-headline5{font-size:16px;font-weight:600;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-category1{font-size:20px}.c-type-category1,.c-type-category2{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase}.c-type-category2{font-size:16px}.c-type-category3{font-size:14px;font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:uppercase}.c-type-body1{font-size:18px}.c-type-body1,.c-type-body2{font-weight:400;line-height:1.5;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-body2{font-size:16px}.c-type-body3{font-size:14px}.c-type-body3,.c-type-micro{font-weight:400;line-height:1.25;letter-spacing:.01em;text-decoration:inherit;text-transform:inherit}.c-type-micro{font-size:12px}body{background-color:#fff;color:#2e2e2e;-webkit-transition:background-color .1s linear;transition:background-color .1s linear}[class*=t-mode--] [class*=t-mode--dark] body,[class*=t-mode--dark] body{background-color:#2e2e2e}[class*=t-mode--] [class*=t-mode--light] body,[class*=t-mode--light] body{background-color:#fff;color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--dark] body,[class*=t-mode--dark] body{color:#fff}.o-container.t-mode--light,.o-section.t-mode--light,body.t-mode--light{background:#fff;color:#2e2e2e}.o-container.t-mode--dark,.o-section.t-mode--dark,body.t-mode--dark{background:#2e2e2e;color:#fff}.t-bg-canvas{background-color:#fff;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-canvas,[class*=t-mode--dark] .t-bg-canvas{background-color:#2e2e2e;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-canvas,[class*=t-mode--light] .t-bg-canvas{background-color:#fff;color:#2e2e2e}.t-bg-layer1{background-color:#f8f8f8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-layer1,[class*=t-mode--dark] .t-bg-layer1{background-color:#262626;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-layer1,[class*=t-mode--light] .t-bg-layer1{background-color:#f8f8f8;color:#2e2e2e}.t-bg-layer2{background-color:#e8e8e8;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-layer2,[class*=t-mode--dark] .t-bg-layer2{background-color:#1f1f1f;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-layer2,[class*=t-mode--light] .t-bg-layer2{background-color:#e8e8e8;color:#2e2e2e}.t-bg-layer3{background-color:#dedede;color:#2e2e2e}[class*=t-mode--] [class*=t-mode--dark] .t-bg-layer3,[class*=t-mode--dark] .t-bg-layer3{background-color:#171717;color:#fff}[class*=t-mode--] [class*=t-mode--light] .t-bg-layer3,[class*=t-mode--light] .t-bg-layer3{background-color:#dedede;color:#2e2e2e}.t-bg-brand1{background-color:#05314d;color:#fff}.t-bg-brand2{background-color:#085280;color:#fff}.t-bg-overlay{background-color:#121212;color:#fff}.t-bg-gray1{background-color:#2e2e2e;color:#fff}.t-bg-gray2{background-color:#474747;color:#fff}.t-mode--light .t-text-primary,.t-text-primary,[class*=t-mode--] .t-mode--light .t-text-primary{color:#2e2e2e}.t-mode--dark .t-text-primary,[class*=t-mode--] .t-mode--dark .t-text-primary{color:#fff}.c-switch .c-switch__text,.c-switch .t-mode--light .c-switch__text,.c-switch [class*=t-mode--] .t-mode--light .c-switch__text,.t-mode--light .c-switch .c-switch__text,.t-mode--light .t-text-secondary,.t-text-secondary,[class*=t-mode--] .t-mode--light .c-switch .c-switch__text,[class*=t-mode--] .t-mode--light .t-text-secondary{color:rgba(18,18,18,.75)}.c-switch .t-mode--dark .c-switch__text,.c-switch [class*=t-mode--] .t-mode--dark .c-switch__text,.t-mode--dark .c-switch .c-switch__text,.t-mode--dark .t-text-secondary,[class*=t-mode--] .t-mode--dark .c-switch .c-switch__text,[class*=t-mode--] .t-mode--dark .t-text-secondary{color:hsla(0,0%,100%,.75)}.t-mode--light .t-text-subtle,.t-text-subtle,[class*=t-mode--] .t-mode--light .t-text-subtle{color:rgba(18,18,18,.5)}.t-mode--dark .t-text-subtle,[class*=t-mode--] .t-mode--dark .t-text-subtle{color:hsla(0,0%,100%,.5)}.t-mode--light .t-text-hint,.t-text-hint,[class*=t-mode--] .t-mode--light .t-text-hint{color:rgba(18,18,18,.25)}.t-mode--dark .t-text-hint,[class*=t-mode--] .t-mode--dark .t-text-hint{color:hsla(0,0%,100%,.25)}.t-mode--light .t-text-error,.t-text-error,[class*=t-mode--] .t-mode--light .t-text-error{color:#bd2b2b}.t-mode--dark .t-text-error,[class*=t-mode--] .t-mode--dark .t-text-error{color:#f26868}.t-mode--light .t-text-warning,.t-text-warning,[class*=t-mode--] .t-mode--light .t-text-warning{color:#804d07}.t-mode--dark .t-text-warning,[class*=t-mode--] .t-mode--dark .t-text-warning{color:#e68b0c}.t-mode--light .t-text-success,.t-text-success,[class*=t-mode--] .t-mode--light .t-text-success{color:#008719}.t-mode--dark .t-text-success,[class*=t-mode--] .t-mode--dark .t-text-success{color:#45c15c}.t-mode--dark .t-text-brand1,.t-mode--light .t-text-brand1,.t-text-brand1,[class*=t-mode--] .t-mode--dark .t-text-brand1,[class*=t-mode--] .t-mode--light .t-text-brand1{color:#085280}.t-mode--dark .t-text-brand2,.t-mode--light .t-text-brand2,.t-text-brand2,[class*=t-mode--] .t-mode--dark .t-text-brand2,[class*=t-mode--] .t-mode--light .t-text-brand2{color:#0c7b91}.t-mode--dark .t-text-brand3,.t-mode--light .t-text-brand3,.t-text-brand3,[class*=t-mode--] .t-mode--dark .t-text-brand3,[class*=t-mode--] .t-mode--light .t-text-brand3{color:#c55422}.t-mode--light .t-text-link,.t-text-link,[class*=t-mode--] .t-mode--light .t-text-link{color:#0c77ba}.t-mode--dark .t-text-link,[class*=t-mode--] .t-mode--dark .t-text-link{color:#2594d9}.t-border-primary{border-color:rgba(18,18,18,.5)}[class*=t-mode--] [class*=t-mode--dark] .t-border-primary,[class*=t-mode--] [class*=t-mode--light] .t-border-primary,[class*=t-mode--dark] .t-border-primary,[class*=t-mode--light] .t-border-primary{border-color:hsla(0,0%,100%,.5)}.t-border-secondary{border-color:rgba(18,18,18,.25)}[class*=t-mode--] [class*=t-mode--dark] .t-border-secondary,[class*=t-mode--] [class*=t-mode--light] .t-border-secondary,[class*=t-mode--dark] .t-border-secondary,[class*=t-mode--light] .t-border-secondary{border-color:hsla(0,0%,100%,.25)}.t-border-subtle{border-color:rgba(18,18,18,.15)}[class*=t-mode--] [class*=t-mode--dark] .t-border-subtle,[class*=t-mode--] [class*=t-mode--light] .t-border-subtle,[class*=t-mode--dark] .t-border-subtle,[class*=t-mode--light] .t-border-subtle{border-color:hsla(0,0%,100%,.15)}.t-border-hint{border-color:rgba(18,18,18,.1)}[class*=t-mode--] [class*=t-mode--dark] .t-border-hint,[class*=t-mode--] [class*=t-mode--light] .t-border-hint,[class*=t-mode--dark] .t-border-hint,[class*=t-mode--light] .t-border-hint{border-color:hsla(0,0%,100%,.1)}.t-border-error{border-color:#bd2b2b}[class*=t-mode--] [class*=t-mode--dark] .t-border-error,[class*=t-mode--] [class*=t-mode--light] .t-border-error,[class*=t-mode--dark] .t-border-error,[class*=t-mode--light] .t-border-error{border-color:#cc3535}.t-border-success{border-color:#006e14}[class*=t-mode--] [class*=t-mode--dark] .t-border-success,[class*=t-mode--] [class*=t-mode--light] .t-border-success,[class*=t-mode--dark] .t-border-success,[class*=t-mode--light] .t-border-success{border-color:#008719}.t-border-selected,[class*=t-mode--] [class*=t-mode--dark] .t-border-selected,[class*=t-mode--] [class*=t-mode--light] .t-border-selected,[class*=t-mode--dark] .t-border-selected,[class*=t-mode--light] .t-border-selected{border-color:#1887cc}.u-align-baseline{vertical-align:baseline!important}.u-align-top{vertical-align:top!important}.u-align-middle{vertical-align:middle!important}.u-align-bottom{vertical-align:bottom!important}.u-align-text-bottom{vertical-align:text-bottom!important}.u-align-text-top{vertical-align:text-top!important}\@media screen and (min-width:320px) and (max-width:767px){.u-align-baseline\\\@xs{vertical-align:baseline!important}.u-align-top\\\@xs{vertical-align:top!important}.u-align-middle\\\@xs{vertical-align:middle!important}.u-align-bottom\\\@xs{vertical-align:bottom!important}.u-align-text-bottom\\\@xs{vertical-align:text-bottom!important}.u-align-text-top\\\@xs{vertical-align:text-top!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-baseline\\\@sm{vertical-align:baseline!important}.u-align-top\\\@sm{vertical-align:top!important}.u-align-middle\\\@sm{vertical-align:middle!important}.u-align-bottom\\\@sm{vertical-align:bottom!important}.u-align-text-bottom\\\@sm{vertical-align:text-bottom!important}.u-align-text-top\\\@sm{vertical-align:text-top!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-baseline\\\@md{vertical-align:baseline!important}.u-align-top\\\@md{vertical-align:top!important}.u-align-middle\\\@md{vertical-align:middle!important}.u-align-bottom\\\@md{vertical-align:bottom!important}.u-align-text-bottom\\\@md{vertical-align:text-bottom!important}.u-align-text-top\\\@md{vertical-align:text-top!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-baseline\\\@lg{vertical-align:baseline!important}.u-align-top\\\@lg{vertical-align:top!important}.u-align-middle\\\@lg{vertical-align:middle!important}.u-align-bottom\\\@lg{vertical-align:bottom!important}.u-align-text-bottom\\\@lg{vertical-align:text-bottom!important}.u-align-text-top\\\@lg{vertical-align:text-top!important}}\@media screen and (min-width:1741px){.u-align-baseline\\\@xl{vertical-align:baseline!important}.u-align-top\\\@xl{vertical-align:top!important}.u-align-middle\\\@xl{vertical-align:middle!important}.u-align-bottom\\\@xl{vertical-align:bottom!important}.u-align-text-bottom\\\@xl{vertical-align:text-bottom!important}.u-align-text-top\\\@xl{vertical-align:text-top!important}}.u-fill-current{fill:currentColor!important}.u-stroke-current{stroke:currentColor!important}.u-cursor-auto{cursor:auto!important}.u-cursor-help{cursor:help!important}.u-cursor-pointer{cursor:pointer!important}.u-cursor-move{cursor:move!important}.u-cursor-zoom-in{cursor:-webkit-zoom-in!important;cursor:zoom-in!important}.u-cursor-zoom-out{cursor:-webkit-zoom-out!important;cursor:zoom-out!important}.u-cursor-not-allowed{cursor:not-allowed!important}.u-cursor-wait{cursor:wait!important}.u-display-none{display:none}.u-display-inline{display:inline}.u-display-block{display:block}.u-display-inline-block{display:inline-block}.u-display-table{display:table}.u-display-table-row{display:table-row}.u-display-table-cell{display:table-cell}.u-display-flex{display:-ms-flexbox;display:flex}.u-display-inline-flex{display:-ms-inline-flexbox;display:inline-flex}.u-shade-10{background-color:rgba(18,18,18,.1)}.u-shade-15{background-color:rgba(18,18,18,.15)}.u-shade-25{background-color:rgba(18,18,18,.25)}.u-shade-50{background-color:rgba(18,18,18,.5)}.u-shade-75{background-color:rgba(18,18,18,.75)}.u-shade-90{background-color:rgba(18,18,18,.9)}.u-shade-05{background-color:rgba(18,18,18,.05)}.u-sr-only,.u-sr-only-focusable{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.u-sr-only-focusable:active,.u-sr-only-focusable:focus{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}.u-tint-10{background-color:hsla(0,0%,100%,.1)}.u-tint-15{background-color:hsla(0,0%,100%,.15)}.u-tint-25{background-color:hsla(0,0%,100%,.25)}.u-tint-50{background-color:hsla(0,0%,100%,.5)}.u-tint-75{background-color:hsla(0,0%,100%,.75)}.u-tint-90{background-color:hsla(0,0%,100%,.9)}.u-tint-05{background-color:hsla(0,0%,100%,.05)}.u-uppercase{text-transform:uppercase!important}.u-lowercase{text-transform:lowercase!important}.u-capitalize{text-transform:capitalize!important}.u-hidden{display:none!important}.u-invisible{visibility:hidden!important}.u-visible{visibility:visible!important}.u-visible-toggle:not(:hover) :not(.is-hover).u-hidden-hover:not(:focus){position:absolute!important;width:0!important;height:0!important;padding:0!important;margin:0!important;overflow:hidden!important}.u-visible-toggle:not(:hover) :not(.u-hover).u-invisible-hover:not(:focus){opacity:0!important}\@media screen and (min-width:320px) and (max-width:767px){.u-hidden\\\@xs{display:none!important}.u-invisible\\\@xs{visibility:hidden!important}.u-visible\\\@xs{visibility:visible!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-hidden\\\@sm{display:none!important}.u-invisible\\\@sm{visibility:hidden!important}.u-visible\\\@sm{visibility:visible!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-hidden\\\@md{display:none!important}.u-invisible\\\@md{visibility:hidden!important}.u-visible\\\@md{visibility:visible!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-hidden\\\@lg{display:none!important}.u-invisible\\\@lg{visibility:hidden!important}.u-visible\\\@lg{visibility:visible!important}}\@media screen and (min-width:1741px){.u-hidden\\\@xl{display:none!important}.u-invisible\\\@xl{visibility:hidden!important}.u-visible\\\@xl{visibility:visible!important}}.u-text-size-base{font-size:16px}.u-text-size-xxs{font-size:10px}.u-text-size-xs{font-size:12px}.u-text-size-sm{font-size:14px}.u-text-size-md{font-size:16px}.u-text-size-lg{font-size:18px}.u-text-size-xl{font-size:20px}.u-text-size-xxl{font-size:22px}.u-text-size-xxxl{font-size:24px}.u-text-size-xxxxl{font-size:32px}.u-text-size-display-2{font-size:48px}.u-text-size-display-1{font-size:72px}\@media screen and (min-width:320px) and (max-width:767px){.u-text-size-base\\\@xs{font-size:16px}.u-text-size-xxs\\\@xs{font-size:10px}.u-text-size-xs\\\@xs{font-size:12px}.u-text-size-sm\\\@xs{font-size:14px}.u-text-size-md\\\@xs{font-size:16px}.u-text-size-lg\\\@xs{font-size:18px}.u-text-size-xl\\\@xs{font-size:20px}.u-text-size-xxl\\\@xs{font-size:22px}.u-text-size-xxxl\\\@xs{font-size:24px}.u-text-size-xxxxl\\\@xs{font-size:32px}.u-text-size-display-2\\\@xs{font-size:48px}.u-text-size-display-1\\\@xs{font-size:72px}}\@media screen and (min-width:768px) and (max-width:959px){.u-text-size-base\\\@sm{font-size:16px}.u-text-size-xxs\\\@sm{font-size:10px}.u-text-size-xs\\\@sm{font-size:12px}.u-text-size-sm\\\@sm{font-size:14px}.u-text-size-md\\\@sm{font-size:16px}.u-text-size-lg\\\@sm{font-size:18px}.u-text-size-xl\\\@sm{font-size:20px}.u-text-size-xxl\\\@sm{font-size:22px}.u-text-size-xxxl\\\@sm{font-size:24px}.u-text-size-xxxxl\\\@sm{font-size:32px}.u-text-size-display-2\\\@sm{font-size:48px}.u-text-size-display-1\\\@sm{font-size:72px}}\@media screen and (min-width:960px) and (max-width:1377px){.u-text-size-base\\\@md{font-size:16px}.u-text-size-xxs\\\@md{font-size:10px}.u-text-size-xs\\\@md{font-size:12px}.u-text-size-sm\\\@md{font-size:14px}.u-text-size-md\\\@md{font-size:16px}.u-text-size-lg\\\@md{font-size:18px}.u-text-size-xl\\\@md{font-size:20px}.u-text-size-xxl\\\@md{font-size:22px}.u-text-size-xxxl\\\@md{font-size:24px}.u-text-size-xxxxl\\\@md{font-size:32px}.u-text-size-display-2\\\@md{font-size:48px}.u-text-size-display-1\\\@md{font-size:72px}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-text-size-base\\\@lg{font-size:16px}.u-text-size-xxs\\\@lg{font-size:10px}.u-text-size-xs\\\@lg{font-size:12px}.u-text-size-sm\\\@lg{font-size:14px}.u-text-size-md\\\@lg{font-size:16px}.u-text-size-lg\\\@lg{font-size:18px}.u-text-size-xl\\\@lg{font-size:20px}.u-text-size-xxl\\\@lg{font-size:22px}.u-text-size-xxxl\\\@lg{font-size:24px}.u-text-size-xxxxl\\\@lg{font-size:32px}.u-text-size-display-2\\\@lg{font-size:48px}.u-text-size-display-1\\\@lg{font-size:72px}}\@media screen and (min-width:1741px){.u-text-size-base\\\@xl{font-size:16px}.u-text-size-xxs\\\@xl{font-size:10px}.u-text-size-xs\\\@xl{font-size:12px}.u-text-size-sm\\\@xl{font-size:14px}.u-text-size-md\\\@xl{font-size:16px}.u-text-size-lg\\\@xl{font-size:18px}.u-text-size-xl\\\@xl{font-size:20px}.u-text-size-xxl\\\@xl{font-size:22px}.u-text-size-xxxl\\\@xl{font-size:24px}.u-text-size-xxxxl\\\@xl{font-size:32px}.u-text-size-display-2\\\@xl{font-size:48px}.u-text-size-display-1\\\@xl{font-size:72px}}.u-align-content-flex-start{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch{-ms-flex-line-pack:stretch;align-content:stretch}\@media screen and (min-width:320px) and (max-width:767px){.u-align-content-flex-start\\\@xs{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@xs{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@xs{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@xs{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@xs{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@xs{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-content-flex-start\\\@sm{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@sm{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@sm{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@sm{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@sm{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@sm{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-content-flex-start\\\@md{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@md{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@md{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@md{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@md{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@md{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-content-flex-start\\\@lg{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@lg{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@lg{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@lg{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@lg{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@lg{-ms-flex-line-pack:stretch;align-content:stretch}}\@media screen and (min-width:1741px){.u-align-content-flex-start\\\@xl{-ms-flex-line-pack:start;align-content:flex-start}.u-align-content-center\\\@xl{-ms-flex-line-pack:center;align-content:center}.u-align-content-flex-end\\\@xl{-ms-flex-line-pack:end;align-content:flex-end}.u-align-content-space-between\\\@xl{-ms-flex-line-pack:justify;align-content:space-between}.u-align-content-space-around\\\@xl{-ms-flex-line-pack:distribute;align-content:space-around}.u-align-content-stretch\\\@xl{-ms-flex-line-pack:stretch;align-content:stretch}}.u-align-items-flex-start{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end{-ms-flex-align:end;align-items:flex-end}.u-align-items-center{-ms-flex-align:center;align-items:center}.u-align-items-baseline{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch{-ms-flex-align:stretch;align-items:stretch}\@media screen and (min-width:320px) and (max-width:767px){.u-align-items-flex-start\\\@xs{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@xs{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@xs{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@xs{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@xs{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-items-flex-start\\\@sm{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@sm{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@sm{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@sm{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@sm{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-items-flex-start\\\@md{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@md{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@md{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@md{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@md{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-items-flex-start\\\@lg{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@lg{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@lg{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@lg{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@lg{-ms-flex-align:stretch;align-items:stretch}}\@media screen and (min-width:1741px){.u-align-items-flex-start\\\@xl{-ms-flex-align:start;align-items:flex-start}.u-align-items-flex-end\\\@xl{-ms-flex-align:end;align-items:flex-end}.u-align-items-center\\\@xl{-ms-flex-align:center;align-items:center}.u-align-items-baseline\\\@xl{-ms-flex-align:baseline;align-items:baseline}.u-align-items-stretch\\\@xl{-ms-flex-align:stretch;align-items:stretch}}.u-align-self-auto{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch{-ms-flex-item-align:stretch!important;align-self:stretch!important}\@media screen and (min-width:320px) and (max-width:767px){.u-align-self-auto\\\@xs{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@xs{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@xs{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@xs{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@xs{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@xs{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-align-self-auto\\\@sm{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@sm{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@sm{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@sm{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@sm{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@sm{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-align-self-auto\\\@md{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@md{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@md{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@md{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@md{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@md{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-align-self-auto\\\@lg{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@lg{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@lg{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@lg{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@lg{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@lg{-ms-flex-item-align:stretch!important;align-self:stretch!important}}\@media screen and (min-width:1741px){.u-align-self-auto\\\@xl{-ms-flex-item-align:auto!important;align-self:auto!important}.u-align-self-start\\\@xl{-ms-flex-item-align:start!important;align-self:flex-start!important}.u-align-self-end\\\@xl{-ms-flex-item-align:end!important;align-self:flex-end!important}.u-align-self-center\\\@xl{-ms-flex-item-align:center!important;align-self:center!important}.u-align-self-baseine\\\@xl{-ms-flex-item-align:baseline!important;align-self:baseline!important}.u-align-self-stretch\\\@xl{-ms-flex-item-align:stretch!important;align-self:stretch!important}}.u-flex-direction-row{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse{-ms-flex-direction:column-reverse;flex-direction:column-reverse}\@media screen and (min-width:320px) and (max-width:767px){.u-flex-direction-row\\\@xs{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@xs{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@xs{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@xs{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:768px) and (max-width:959px){.u-flex-direction-row\\\@sm{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@sm{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@sm{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@sm{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:960px) and (max-width:1377px){.u-flex-direction-row\\\@md{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@md{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@md{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@md{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-flex-direction-row\\\@lg{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@lg{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@lg{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@lg{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}\@media screen and (min-width:1741px){.u-flex-direction-row\\\@xl{-ms-flex-direction:row;flex-direction:row}.u-flex-direction-row-reverse\\\@xl{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.u-flex-direction-column\\\@xl{-ms-flex-direction:column;flex-direction:column}.u-flex-direction-column-reverse\\\@xl{-ms-flex-direction:column-reverse;flex-direction:column-reverse}}.u-flex{display:-ms-flexbox;display:flex}.u-flex-inline{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none{-ms-flex:none;flex:none}.u-flex-auto{-ms-flex:auto;flex:auto}.u-flex-1{-ms-flex:1;flex:1}.u-flex-1-1-auto{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto{-ms-flex:0 0 auto;flex:0 0 auto}\@media screen and (min-width:320px) and (max-width:767px){.u-flex\\\@xs{display:-ms-flexbox;display:flex}.u-flex-inline\\\@xs{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@xs{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@xs{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@xs{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@xs{-ms-flex:none;flex:none}.u-flex-auto\\\@xs{-ms-flex:auto;flex:auto}.u-flex-1\\\@xs{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@xs{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@xs{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@xs{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@xs{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:768px) and (max-width:959px){.u-flex\\\@sm{display:-ms-flexbox;display:flex}.u-flex-inline\\\@sm{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@sm{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@sm{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@sm{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@sm{-ms-flex:none;flex:none}.u-flex-auto\\\@sm{-ms-flex:auto;flex:auto}.u-flex-1\\\@sm{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@sm{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@sm{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@sm{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@sm{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:960px) and (max-width:1377px){.u-flex\\\@md{display:-ms-flexbox;display:flex}.u-flex-inline\\\@md{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@md{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@md{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@md{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@md{-ms-flex:none;flex:none}.u-flex-auto\\\@md{-ms-flex:auto;flex:auto}.u-flex-1\\\@md{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@md{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@md{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@md{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@md{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-flex\\\@lg{display:-ms-flexbox;display:flex}.u-flex-inline\\\@lg{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@lg{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@lg{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@lg{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@lg{-ms-flex:none;flex:none}.u-flex-auto\\\@lg{-ms-flex:auto;flex:auto}.u-flex-1\\\@lg{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@lg{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@lg{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@lg{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@lg{-ms-flex:0 0 auto;flex:0 0 auto}}\@media screen and (min-width:1741px){.u-flex\\\@xl{display:-ms-flexbox;display:flex}.u-flex-inline\\\@xl{display:-ms-inline-flexbox;display:inline-flex}.u-flex-nowrap\\\@xl{-ms-flex-wrap:nowrap;flex-wrap:nowrap}.u-flex-wrap\\\@xl{-ms-flex-wrap:wrap;flex-wrap:wrap}.u-flex-wrap-reverse\\\@xl{-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse}.u-flex-none\\\@xl{-ms-flex:none;flex:none}.u-flex-auto\\\@xl{-ms-flex:auto;flex:auto}.u-flex-1\\\@xl{-ms-flex:1;flex:1}.u-flex-1-1-auto\\\@xl{-ms-flex:1 1 auto;flex:1 1 auto}.u-flex-1-0-auto\\\@xl{-ms-flex:1 0 auto;flex:1 0 auto}.u-flex-0-1-auto\\\@xl{-ms-flex:0 1 auto;flex:0 1 auto}.u-flex-0-0-auto\\\@xl{-ms-flex:0 0 auto;flex:0 0 auto}}.u-justify-content-flex-start{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly{-ms-flex-pack:space-evenly;justify-content:space-evenly}\@media screen and (min-width:320px) and (max-width:767px){.u-justify-content-flex-start\\\@xs{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@xs{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@xs{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@xs{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@xs{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@xs{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:768px) and (max-width:959px){.u-justify-content-flex-start\\\@sm{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@sm{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@sm{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@sm{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@sm{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@sm{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:960px) and (max-width:1377px){.u-justify-content-flex-start\\\@md{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@md{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@md{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@md{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@md{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@md{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-justify-content-flex-start\\\@lg{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@lg{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@lg{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@lg{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@lg{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@lg{-ms-flex-pack:space-evenly;justify-content:space-evenly}}\@media screen and (min-width:1741px){.u-justify-content-flex-start\\\@xl{-ms-flex-pack:start;justify-content:flex-start}.u-justify-content-center\\\@xl{-ms-flex-pack:center;justify-content:center}.u-justify-content-flex-end\\\@xl{-ms-flex-pack:end;justify-content:flex-end}.u-justify-content-space-between\\\@xl{-ms-flex-pack:justify;justify-content:space-between}.u-justify-content-space-around\\\@xl{-ms-flex-pack:distribute;justify-content:space-around}.u-justify-content-space-evenly\\\@xl{-ms-flex-pack:space-evenly;justify-content:space-evenly}}.u-order-0{-ms-flex-order:0;order:0}.u-order-1{-ms-flex-order:1;order:1}.u-order-2{-ms-flex-order:2;order:2}.u-order-3{-ms-flex-order:3;order:3}.u-order-4{-ms-flex-order:4;order:4}.u-order-5{-ms-flex-order:5;order:5}.u-order-6{-ms-flex-order:6;order:6}.u-order-7{-ms-flex-order:7;order:7}.u-order-8{-ms-flex-order:8;order:8}.u-order-9{-ms-flex-order:9;order:9}.u-order-10{-ms-flex-order:10;order:10}.u-order-11{-ms-flex-order:11;order:11}.u-order-minus1{-ms-flex-order:-1;order:-1}.u-order-last{-ms-flex-order:99;order:99}\@media screen and (min-width:320px) and (max-width:767px){.u-order-0\\\@xs{-ms-flex-order:0;order:0}.u-order-1\\\@xs{-ms-flex-order:1;order:1}.u-order-2\\\@xs{-ms-flex-order:2;order:2}.u-order-3\\\@xs{-ms-flex-order:3;order:3}.u-order-4\\\@xs{-ms-flex-order:4;order:4}.u-order-5\\\@xs{-ms-flex-order:5;order:5}.u-order-6\\\@xs{-ms-flex-order:6;order:6}.u-order-7\\\@xs{-ms-flex-order:7;order:7}.u-order-8\\\@xs{-ms-flex-order:8;order:8}.u-order-9\\\@xs{-ms-flex-order:9;order:9}.u-order-10\\\@xs{-ms-flex-order:10;order:10}.u-order-11\\\@xs{-ms-flex-order:11;order:11}.u-order-minus1\\\@xs{-ms-flex-order:-1;order:-1}.u-order-last\\\@xs{-ms-flex-order:99;order:99}}\@media screen and (min-width:768px) and (max-width:959px){.u-order-0\\\@sm{-ms-flex-order:0;order:0}.u-order-1\\\@sm{-ms-flex-order:1;order:1}.u-order-2\\\@sm{-ms-flex-order:2;order:2}.u-order-3\\\@sm{-ms-flex-order:3;order:3}.u-order-4\\\@sm{-ms-flex-order:4;order:4}.u-order-5\\\@sm{-ms-flex-order:5;order:5}.u-order-6\\\@sm{-ms-flex-order:6;order:6}.u-order-7\\\@sm{-ms-flex-order:7;order:7}.u-order-8\\\@sm{-ms-flex-order:8;order:8}.u-order-9\\\@sm{-ms-flex-order:9;order:9}.u-order-10\\\@sm{-ms-flex-order:10;order:10}.u-order-11\\\@sm{-ms-flex-order:11;order:11}.u-order-minus1\\\@sm{-ms-flex-order:-1;order:-1}.u-order-last\\\@sm{-ms-flex-order:99;order:99}}\@media screen and (min-width:960px) and (max-width:1377px){.u-order-0\\\@md{-ms-flex-order:0;order:0}.u-order-1\\\@md{-ms-flex-order:1;order:1}.u-order-2\\\@md{-ms-flex-order:2;order:2}.u-order-3\\\@md{-ms-flex-order:3;order:3}.u-order-4\\\@md{-ms-flex-order:4;order:4}.u-order-5\\\@md{-ms-flex-order:5;order:5}.u-order-6\\\@md{-ms-flex-order:6;order:6}.u-order-7\\\@md{-ms-flex-order:7;order:7}.u-order-8\\\@md{-ms-flex-order:8;order:8}.u-order-9\\\@md{-ms-flex-order:9;order:9}.u-order-10\\\@md{-ms-flex-order:10;order:10}.u-order-11\\\@md{-ms-flex-order:11;order:11}.u-order-minus1\\\@md{-ms-flex-order:-1;order:-1}.u-order-last\\\@md{-ms-flex-order:99;order:99}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-order-0\\\@lg{-ms-flex-order:0;order:0}.u-order-1\\\@lg{-ms-flex-order:1;order:1}.u-order-2\\\@lg{-ms-flex-order:2;order:2}.u-order-3\\\@lg{-ms-flex-order:3;order:3}.u-order-4\\\@lg{-ms-flex-order:4;order:4}.u-order-5\\\@lg{-ms-flex-order:5;order:5}.u-order-6\\\@lg{-ms-flex-order:6;order:6}.u-order-7\\\@lg{-ms-flex-order:7;order:7}.u-order-8\\\@lg{-ms-flex-order:8;order:8}.u-order-9\\\@lg{-ms-flex-order:9;order:9}.u-order-10\\\@lg{-ms-flex-order:10;order:10}.u-order-11\\\@lg{-ms-flex-order:11;order:11}.u-order-minus1\\\@lg{-ms-flex-order:-1;order:-1}.u-order-last\\\@lg{-ms-flex-order:99;order:99}}\@media screen and (min-width:1741px){.u-order-0\\\@xl{-ms-flex-order:0;order:0}.u-order-1\\\@xl{-ms-flex-order:1;order:1}.u-order-2\\\@xl{-ms-flex-order:2;order:2}.u-order-3\\\@xl{-ms-flex-order:3;order:3}.u-order-4\\\@xl{-ms-flex-order:4;order:4}.u-order-5\\\@xl{-ms-flex-order:5;order:5}.u-order-6\\\@xl{-ms-flex-order:6;order:6}.u-order-7\\\@xl{-ms-flex-order:7;order:7}.u-order-8\\\@xl{-ms-flex-order:8;order:8}.u-order-9\\\@xl{-ms-flex-order:9;order:9}.u-order-10\\\@xl{-ms-flex-order:10;order:10}.u-order-11\\\@xl{-ms-flex-order:11;order:11}.u-order-minus1\\\@xl{-ms-flex-order:-1;order:-1}.u-order-last\\\@xl{-ms-flex-order:99;order:99}}.u-inline-none{padding:0!important}.u-inline-xxs{padding:0 4px 0 0!important}.u-inline-xs{padding:0 8px 0 0!important}.u-inline-sm{padding:0 12px 0 0!important}.u-inline-md{padding:0 16px 0 0!important}.u-inline-lg{padding:0 24px 0 0!important}.u-inline-xl{padding:0 48px 0 0!important}.u-inline-xxl{padding:0 96px 0 0!important}.u-inset-none{padding:0!important}.u-inset-xxs{padding:2px!important}.u-inset-xs{padding:8px!important}.u-inset-sm{padding:12px!important}.u-inset-md{padding:16px!important}.u-inset-lg{padding:24px!important}.u-inset-xl{padding:48px!important}.u-inset-xxl{padding:96px!important}.u-squish-none{padding:0!important}.u-squish-xs{padding:4px 8px!important}.u-squish-sm{padding:8px 12px!important}.u-squish-md{padding:8px 16px!important}.u-squish-lg{padding:12px 24px!important}.u-squish-xl{padding:24px 48px!important}.u-squish-xxl{padding:48px 96px!important}.u-stack-none{padding:0!important}.u-stack-xxs{padding:0 0 4px!important}.u-stack-xs{padding:0 0 8px!important}.u-stack-sm{padding:0 0 12px!important}.u-stack-md{padding:0 0 16px!important}.u-stack-lg{padding:0 0 24px!important}.u-stack-xl{padding:0 0 48px!important}.u-stack-xxl{padding:0 0 96px!important}.u-stretch-none{padding:0!important}.u-stretch-sm{padding:18px 12px!important}.u-stretch-md{padding:24px 16px!important}.u-stretch-lg{padding:48px 24px!important}.u-p-0{padding:0}.u-m-0{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs{padding:4px}.u-m-xxs{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs{padding:8px}.u-m-xs{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm{padding:12px}.u-m-sm{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md{padding:16px}.u-m-md{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg{padding:24px}.u-m-lg{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl{padding:48px}.u-m-xl{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl{padding:96px}.u-m-xxl{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default{padding:16px}.u-m-default{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}\@media screen and (min-width:320px) and (max-width:767px){.u-inline-none\\\@xs{padding:0!important}.u-inline-xxs\\\@xs{padding:0 4px 0 0!important}.u-inline-xs\\\@xs{padding:0 8px 0 0!important}.u-inline-sm\\\@xs{padding:0 12px 0 0!important}.u-inline-md\\\@xs{padding:0 16px 0 0!important}.u-inline-lg\\\@xs{padding:0 24px 0 0!important}.u-inline-xl\\\@xs{padding:0 48px 0 0!important}.u-inline-xxl\\\@xs{padding:0 96px 0 0!important}.u-inset-none\\\@xs{padding:0!important}.u-inset-xxs\\\@xs{padding:2px!important}.u-inset-xs\\\@xs{padding:8px!important}.u-inset-sm\\\@xs{padding:12px!important}.u-inset-md\\\@xs{padding:16px!important}.u-inset-lg\\\@xs{padding:24px!important}.u-inset-xl\\\@xs{padding:48px!important}.u-inset-xxl\\\@xs{padding:96px!important}.u-squish-none\\\@xs{padding:0!important}.u-squish-xs\\\@xs{padding:4px 8px!important}.u-squish-sm\\\@xs{padding:8px 12px!important}.u-squish-md\\\@xs{padding:8px 16px!important}.u-squish-lg\\\@xs{padding:12px 24px!important}.u-squish-xl\\\@xs{padding:24px 48px!important}.u-squish-xxl\\\@xs{padding:48px 96px!important}.u-stack-none\\\@xs{padding:0!important}.u-stack-xxs\\\@xs{padding:0 0 4px!important}.u-stack-xs\\\@xs{padding:0 0 8px!important}.u-stack-sm\\\@xs{padding:0 0 12px!important}.u-stack-md\\\@xs{padding:0 0 16px!important}.u-stack-lg\\\@xs{padding:0 0 24px!important}.u-stack-xl\\\@xs{padding:0 0 48px!important}.u-stack-xxl\\\@xs{padding:0 0 96px!important}.u-stretch-none\\\@xs{padding:0!important}.u-stretch-sm\\\@xs{padding:18px 12px!important}.u-stretch-md\\\@xs{padding:24px 16px!important}.u-stretch-lg\\\@xs{padding:48px 24px!important}.u-p-0\\\@xs{padding:0}.u-m-0\\\@xs{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@xs{padding:4px}.u-m-xxs\\\@xs{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@xs{padding:8px}.u-m-xs\\\@xs{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@xs{padding:12px}.u-m-sm\\\@xs{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@xs{padding:16px}.u-m-md\\\@xs{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@xs{padding:24px}.u-m-lg\\\@xs{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@xs{padding:48px}.u-m-xl\\\@xs{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@xs{padding:96px}.u-m-xxl\\\@xs{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@xs{padding:16px}.u-m-default\\\@xs{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:768px) and (max-width:959px){.u-inline-none\\\@sm{padding:0!important}.u-inline-xxs\\\@sm{padding:0 4px 0 0!important}.u-inline-xs\\\@sm{padding:0 8px 0 0!important}.u-inline-sm\\\@sm{padding:0 12px 0 0!important}.u-inline-md\\\@sm{padding:0 16px 0 0!important}.u-inline-lg\\\@sm{padding:0 24px 0 0!important}.u-inline-xl\\\@sm{padding:0 48px 0 0!important}.u-inline-xxl\\\@sm{padding:0 96px 0 0!important}.u-inset-none\\\@sm{padding:0!important}.u-inset-xxs\\\@sm{padding:2px!important}.u-inset-xs\\\@sm{padding:8px!important}.u-inset-sm\\\@sm{padding:12px!important}.u-inset-md\\\@sm{padding:16px!important}.u-inset-lg\\\@sm{padding:24px!important}.u-inset-xl\\\@sm{padding:48px!important}.u-inset-xxl\\\@sm{padding:96px!important}.u-squish-none\\\@sm{padding:0!important}.u-squish-xs\\\@sm{padding:4px 8px!important}.u-squish-sm\\\@sm{padding:8px 12px!important}.u-squish-md\\\@sm{padding:8px 16px!important}.u-squish-lg\\\@sm{padding:12px 24px!important}.u-squish-xl\\\@sm{padding:24px 48px!important}.u-squish-xxl\\\@sm{padding:48px 96px!important}.u-stack-none\\\@sm{padding:0!important}.u-stack-xxs\\\@sm{padding:0 0 4px!important}.u-stack-xs\\\@sm{padding:0 0 8px!important}.u-stack-sm\\\@sm{padding:0 0 12px!important}.u-stack-md\\\@sm{padding:0 0 16px!important}.u-stack-lg\\\@sm{padding:0 0 24px!important}.u-stack-xl\\\@sm{padding:0 0 48px!important}.u-stack-xxl\\\@sm{padding:0 0 96px!important}.u-stretch-none\\\@sm{padding:0!important}.u-stretch-sm\\\@sm{padding:18px 12px!important}.u-stretch-md\\\@sm{padding:24px 16px!important}.u-stretch-lg\\\@sm{padding:48px 24px!important}.u-p-0\\\@sm{padding:0}.u-m-0\\\@sm{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@sm{padding:4px}.u-m-xxs\\\@sm{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@sm{padding:8px}.u-m-xs\\\@sm{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@sm{padding:12px}.u-m-sm\\\@sm{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@sm{padding:16px}.u-m-md\\\@sm{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@sm{padding:24px}.u-m-lg\\\@sm{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@sm{padding:48px}.u-m-xl\\\@sm{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@sm{padding:96px}.u-m-xxl\\\@sm{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@sm{padding:16px}.u-m-default\\\@sm{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:960px) and (max-width:1377px){.u-inline-none\\\@md{padding:0!important}.u-inline-xxs\\\@md{padding:0 4px 0 0!important}.u-inline-xs\\\@md{padding:0 8px 0 0!important}.u-inline-sm\\\@md{padding:0 12px 0 0!important}.u-inline-md\\\@md{padding:0 16px 0 0!important}.u-inline-lg\\\@md{padding:0 24px 0 0!important}.u-inline-xl\\\@md{padding:0 48px 0 0!important}.u-inline-xxl\\\@md{padding:0 96px 0 0!important}.u-inset-none\\\@md{padding:0!important}.u-inset-xxs\\\@md{padding:2px!important}.u-inset-xs\\\@md{padding:8px!important}.u-inset-sm\\\@md{padding:12px!important}.u-inset-md\\\@md{padding:16px!important}.u-inset-lg\\\@md{padding:24px!important}.u-inset-xl\\\@md{padding:48px!important}.u-inset-xxl\\\@md{padding:96px!important}.u-squish-none\\\@md{padding:0!important}.u-squish-xs\\\@md{padding:4px 8px!important}.u-squish-sm\\\@md{padding:8px 12px!important}.u-squish-md\\\@md{padding:8px 16px!important}.u-squish-lg\\\@md{padding:12px 24px!important}.u-squish-xl\\\@md{padding:24px 48px!important}.u-squish-xxl\\\@md{padding:48px 96px!important}.u-stack-none\\\@md{padding:0!important}.u-stack-xxs\\\@md{padding:0 0 4px!important}.u-stack-xs\\\@md{padding:0 0 8px!important}.u-stack-sm\\\@md{padding:0 0 12px!important}.u-stack-md\\\@md{padding:0 0 16px!important}.u-stack-lg\\\@md{padding:0 0 24px!important}.u-stack-xl\\\@md{padding:0 0 48px!important}.u-stack-xxl\\\@md{padding:0 0 96px!important}.u-stretch-none\\\@md{padding:0!important}.u-stretch-sm\\\@md{padding:18px 12px!important}.u-stretch-md\\\@md{padding:24px 16px!important}.u-stretch-lg\\\@md{padding:48px 24px!important}.u-p-0\\\@md{padding:0}.u-m-0\\\@md{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@md{padding:4px}.u-m-xxs\\\@md{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@md{padding:8px}.u-m-xs\\\@md{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@md{padding:12px}.u-m-sm\\\@md{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@md{padding:16px}.u-m-md\\\@md{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@md{padding:24px}.u-m-lg\\\@md{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@md{padding:48px}.u-m-xl\\\@md{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@md{padding:96px}.u-m-xxl\\\@md{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@md{padding:16px}.u-m-default\\\@md{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-inline-none\\\@lg{padding:0!important}.u-inline-xxs\\\@lg{padding:0 4px 0 0!important}.u-inline-xs\\\@lg{padding:0 8px 0 0!important}.u-inline-sm\\\@lg{padding:0 12px 0 0!important}.u-inline-md\\\@lg{padding:0 16px 0 0!important}.u-inline-lg\\\@lg{padding:0 24px 0 0!important}.u-inline-xl\\\@lg{padding:0 48px 0 0!important}.u-inline-xxl\\\@lg{padding:0 96px 0 0!important}.u-inset-none\\\@lg{padding:0!important}.u-inset-xxs\\\@lg{padding:2px!important}.u-inset-xs\\\@lg{padding:8px!important}.u-inset-sm\\\@lg{padding:12px!important}.u-inset-md\\\@lg{padding:16px!important}.u-inset-lg\\\@lg{padding:24px!important}.u-inset-xl\\\@lg{padding:48px!important}.u-inset-xxl\\\@lg{padding:96px!important}.u-squish-none\\\@lg{padding:0!important}.u-squish-xs\\\@lg{padding:4px 8px!important}.u-squish-sm\\\@lg{padding:8px 12px!important}.u-squish-md\\\@lg{padding:8px 16px!important}.u-squish-lg\\\@lg{padding:12px 24px!important}.u-squish-xl\\\@lg{padding:24px 48px!important}.u-squish-xxl\\\@lg{padding:48px 96px!important}.u-stack-none\\\@lg{padding:0!important}.u-stack-xxs\\\@lg{padding:0 0 4px!important}.u-stack-xs\\\@lg{padding:0 0 8px!important}.u-stack-sm\\\@lg{padding:0 0 12px!important}.u-stack-md\\\@lg{padding:0 0 16px!important}.u-stack-lg\\\@lg{padding:0 0 24px!important}.u-stack-xl\\\@lg{padding:0 0 48px!important}.u-stack-xxl\\\@lg{padding:0 0 96px!important}.u-stretch-none\\\@lg{padding:0!important}.u-stretch-sm\\\@lg{padding:18px 12px!important}.u-stretch-md\\\@lg{padding:24px 16px!important}.u-stretch-lg\\\@lg{padding:48px 24px!important}.u-p-0\\\@lg{padding:0}.u-m-0\\\@lg{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@lg{padding:4px}.u-m-xxs\\\@lg{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@lg{padding:8px}.u-m-xs\\\@lg{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@lg{padding:12px}.u-m-sm\\\@lg{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@lg{padding:16px}.u-m-md\\\@lg{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@lg{padding:24px}.u-m-lg\\\@lg{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@lg{padding:48px}.u-m-xl\\\@lg{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@lg{padding:96px}.u-m-xxl\\\@lg{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@lg{padding:16px}.u-m-default\\\@lg{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}\@media screen and (min-width:1741px){.u-inline-none\\\@xl{padding:0!important}.u-inline-xxs\\\@xl{padding:0 4px 0 0!important}.u-inline-xs\\\@xl{padding:0 8px 0 0!important}.u-inline-sm\\\@xl{padding:0 12px 0 0!important}.u-inline-md\\\@xl{padding:0 16px 0 0!important}.u-inline-lg\\\@xl{padding:0 24px 0 0!important}.u-inline-xl\\\@xl{padding:0 48px 0 0!important}.u-inline-xxl\\\@xl{padding:0 96px 0 0!important}.u-inset-none\\\@xl{padding:0!important}.u-inset-xxs\\\@xl{padding:2px!important}.u-inset-xs\\\@xl{padding:8px!important}.u-inset-sm\\\@xl{padding:12px!important}.u-inset-md\\\@xl{padding:16px!important}.u-inset-lg\\\@xl{padding:24px!important}.u-inset-xl\\\@xl{padding:48px!important}.u-inset-xxl\\\@xl{padding:96px!important}.u-squish-none\\\@xl{padding:0!important}.u-squish-xs\\\@xl{padding:4px 8px!important}.u-squish-sm\\\@xl{padding:8px 12px!important}.u-squish-md\\\@xl{padding:8px 16px!important}.u-squish-lg\\\@xl{padding:12px 24px!important}.u-squish-xl\\\@xl{padding:24px 48px!important}.u-squish-xxl\\\@xl{padding:48px 96px!important}.u-stack-none\\\@xl{padding:0!important}.u-stack-xxs\\\@xl{padding:0 0 4px!important}.u-stack-xs\\\@xl{padding:0 0 8px!important}.u-stack-sm\\\@xl{padding:0 0 12px!important}.u-stack-md\\\@xl{padding:0 0 16px!important}.u-stack-lg\\\@xl{padding:0 0 24px!important}.u-stack-xl\\\@xl{padding:0 0 48px!important}.u-stack-xxl\\\@xl{padding:0 0 96px!important}.u-stretch-none\\\@xl{padding:0!important}.u-stretch-sm\\\@xl{padding:18px 12px!important}.u-stretch-md\\\@xl{padding:24px 16px!important}.u-stretch-lg\\\@xl{padding:48px 24px!important}.u-p-0\\\@xl{padding:0}.u-m-0\\\@xl{margin:0}.u-px-0{padding-left:0;padding-right:0}.u-py-0{padding-top:0;padding-bottom:0}.u-mx-0{margin-left:0;margin-right:0}.u-my-0{margin-top:0;margin-bottom:0}.u-pt-0{padding-top:0!important}.u-mt-0{margin-top:0!important}.u-pr-0{padding-right:0!important}.u-mr-0{margin-right:0!important}.u-pb-0{padding-bottom:0!important}.u-mb-0{margin-bottom:0!important}.u-pl-0{padding-left:0!important}.u-ml-0{margin-left:0!important}.u-p-xxs\\\@xl{padding:4px}.u-m-xxs\\\@xl{margin:4px}.u-px-xxs{padding-left:4px;padding-right:4px}.u-py-xxs{padding-top:4px;padding-bottom:4px}.u-mx-xxs{margin-left:4px;margin-right:4px}.u-my-xxs{margin-top:4px;margin-bottom:4px}.u-pt-xxs{padding-top:4px!important}.u-mt-xxs{margin-top:4px!important}.u-pr-xxs{padding-right:4px!important}.u-mr-xxs{margin-right:4px!important}.u-pb-xxs{padding-bottom:4px!important}.u-mb-xxs{margin-bottom:4px!important}.u-pl-xxs{padding-left:4px!important}.u-ml-xxs{margin-left:4px!important}.u-p-xs\\\@xl{padding:8px}.u-m-xs\\\@xl{margin:8px}.u-px-xs{padding-left:8px;padding-right:8px}.u-py-xs{padding-top:8px;padding-bottom:8px}.u-mx-xs{margin-left:8px;margin-right:8px}.u-my-xs{margin-top:8px;margin-bottom:8px}.u-pt-xs{padding-top:8px!important}.u-mt-xs{margin-top:8px!important}.u-pr-xs{padding-right:8px!important}.u-mr-xs{margin-right:8px!important}.u-pb-xs{padding-bottom:8px!important}.u-mb-xs{margin-bottom:8px!important}.u-pl-xs{padding-left:8px!important}.u-ml-xs{margin-left:8px!important}.u-p-sm\\\@xl{padding:12px}.u-m-sm\\\@xl{margin:12px}.u-px-sm{padding-left:12px;padding-right:12px}.u-py-sm{padding-top:12px;padding-bottom:12px}.u-mx-sm{margin-left:12px;margin-right:12px}.u-my-sm{margin-top:12px;margin-bottom:12px}.u-pt-sm{padding-top:12px!important}.u-mt-sm{margin-top:12px!important}.u-pr-sm{padding-right:12px!important}.u-mr-sm{margin-right:12px!important}.u-pb-sm{padding-bottom:12px!important}.u-mb-sm{margin-bottom:12px!important}.u-pl-sm{padding-left:12px!important}.u-ml-sm{margin-left:12px!important}.u-p-md\\\@xl{padding:16px}.u-m-md\\\@xl{margin:16px}.u-px-md{padding-left:16px;padding-right:16px}.u-py-md{padding-top:16px;padding-bottom:16px}.u-mx-md{margin-left:16px;margin-right:16px}.u-my-md{margin-top:16px;margin-bottom:16px}.u-pt-md{padding-top:16px!important}.u-mt-md{margin-top:16px!important}.u-pr-md{padding-right:16px!important}.u-mr-md{margin-right:16px!important}.u-pb-md{padding-bottom:16px!important}.u-mb-md{margin-bottom:16px!important}.u-pl-md{padding-left:16px!important}.u-ml-md{margin-left:16px!important}.u-p-lg\\\@xl{padding:24px}.u-m-lg\\\@xl{margin:24px}.u-px-lg{padding-left:24px;padding-right:24px}.u-py-lg{padding-top:24px;padding-bottom:24px}.u-mx-lg{margin-left:24px;margin-right:24px}.u-my-lg{margin-top:24px;margin-bottom:24px}.u-pt-lg{padding-top:24px!important}.u-mt-lg{margin-top:24px!important}.u-pr-lg{padding-right:24px!important}.u-mr-lg{margin-right:24px!important}.u-pb-lg{padding-bottom:24px!important}.u-mb-lg{margin-bottom:24px!important}.u-pl-lg{padding-left:24px!important}.u-ml-lg{margin-left:24px!important}.u-p-xl\\\@xl{padding:48px}.u-m-xl\\\@xl{margin:48px}.u-px-xl{padding-left:48px;padding-right:48px}.u-py-xl{padding-top:48px;padding-bottom:48px}.u-mx-xl{margin-left:48px;margin-right:48px}.u-my-xl{margin-top:48px;margin-bottom:48px}.u-pt-xl{padding-top:48px!important}.u-mt-xl{margin-top:48px!important}.u-pr-xl{padding-right:48px!important}.u-mr-xl{margin-right:48px!important}.u-pb-xl{padding-bottom:48px!important}.u-mb-xl{margin-bottom:48px!important}.u-pl-xl{padding-left:48px!important}.u-ml-xl{margin-left:48px!important}.u-p-xxl\\\@xl{padding:96px}.u-m-xxl\\\@xl{margin:96px}.u-px-xxl{padding-left:96px;padding-right:96px}.u-py-xxl{padding-top:96px;padding-bottom:96px}.u-mx-xxl{margin-left:96px;margin-right:96px}.u-my-xxl{margin-top:96px;margin-bottom:96px}.u-pt-xxl{padding-top:96px!important}.u-mt-xxl{margin-top:96px!important}.u-pr-xxl{padding-right:96px!important}.u-mr-xxl{margin-right:96px!important}.u-pb-xxl{padding-bottom:96px!important}.u-mb-xxl{margin-bottom:96px!important}.u-pl-xxl{padding-left:96px!important}.u-ml-xxl{margin-left:96px!important}.u-p-default\\\@xl{padding:16px}.u-m-default\\\@xl{margin:16px}.u-px-default{padding-left:16px;padding-right:16px}.u-py-default{padding-top:16px;padding-bottom:16px}.u-mx-default{margin-left:16px;margin-right:16px}.u-my-default{margin-top:16px;margin-bottom:16px}.u-pt-default{padding-top:16px!important}.u-mt-default{margin-top:16px!important}.u-pr-default{padding-right:16px!important}.u-mr-default{margin-right:16px!important}.u-pb-default{padding-bottom:16px!important}.u-mb-default{margin-bottom:16px!important}.u-pl-default{padding-left:16px!important}.u-ml-default{margin-left:16px!important}}.u-child-text-left,.u-text-left{text-align:left}.u-child-text-right,.u-text-right{text-align:right}.u-child-text-center,.u-text-center{text-align:center}.u-text-color-primary{color:fk-get-theme-text(\"primary\")}.u-text-color-primary-on-dark{color:fk-get-theme-text(\"primary\",\"onDark\")}.u-text-color-secondary{color:fk-get-theme-text(\"secondary\")}.u-text-color-secondary-on-dark{color:fk-get-theme-text(\"secondary\",\"onDark\")}.u-text-color-subtle{color:fk-get-theme-text(\"subtle\")}.u-text-color-subtle-on-dark{color:fk-get-theme-text(\"subtle\",\"onDark\")}.u-text-color-hint{color:fk-get-theme-text(\"hint\")}.u-text-color-hint-on-dark{color:fk-get-theme-text(\"hint\",\"onDark\")}.u-text-color-error{color:fk-get-theme-text(\"error\")}.u-text-color-error-on-dark{color:fk-get-theme-text(\"error\",\"onDark\")}.u-text-color-warning{color:fk-get-theme-text(\"warning\")}.u-text-color-warning-on-dark{color:fk-get-theme-text(\"warning\",\"onDark\")}.u-text-color-success{color:fk-get-theme-text(\"success\")}.u-text-color-success-on-dark{color:fk-get-theme-text(\"success\",\"onDark\")}.u-text-color-brand1{color:fk-get-theme-text(\"brand1\")}.u-text-color-brand1-on-dark{color:fk-get-theme-text(\"brand1\",\"onDark\")}.u-text-color-brand2{color:fk-get-theme-text(\"brand2\")}.u-text-color-brand2-on-dark{color:fk-get-theme-text(\"brand2\",\"onDark\")}.u-text-color-brand3{color:fk-get-theme-text(\"brand3\")}.u-text-color-brand3-on-dark{color:fk-get-theme-text(\"brand3\",\"onDark\")}.u-text-color-link{color:fk-get-theme-text(\"link\")}.u-text-color-link-on-dark{color:fk-get-theme-text(\"link\",\"onDark\")}.u-text-weight-regular{font-weight:400}.u-text-weight-semibold{font-weight:600}.u-text-weight-bold{font-weight:700}.u-text-weight-thin{font-weight:300}\@media screen and (min-width:320px) and (max-width:767px){.u-text-weight-regular\\\@xs{font-weight:400}.u-text-weight-semibold\\\@xs{font-weight:600}.u-text-weight-bold\\\@xs{font-weight:700}.u-text-weight-thin\\\@xs{font-weight:300}}\@media screen and (min-width:768px) and (max-width:959px){.u-text-weight-regular\\\@sm{font-weight:400}.u-text-weight-semibold\\\@sm{font-weight:600}.u-text-weight-bold\\\@sm{font-weight:700}.u-text-weight-thin\\\@sm{font-weight:300}}\@media screen and (min-width:960px) and (max-width:1377px){.u-text-weight-regular\\\@md{font-weight:400}.u-text-weight-semibold\\\@md{font-weight:600}.u-text-weight-bold\\\@md{font-weight:700}.u-text-weight-thin\\\@md{font-weight:300}}\@media screen and (min-width:1378px) and (max-width:1740px){.u-text-weight-regular\\\@lg{font-weight:400}.u-text-weight-semibold\\\@lg{font-weight:600}.u-text-weight-bold\\\@lg{font-weight:700}.u-text-weight-thin\\\@lg{font-weight:300}}\@media screen and (min-width:1741px){.u-text-weight-regular\\\@xl{font-weight:400}.u-text-weight-semibold\\\@xl{font-weight:600}.u-text-weight-bold\\\@xl{font-weight:700}.u-text-weight-thin\\\@xl{font-weight:300}}.u-child-width-1>*,.u-width-1{width:1.1rem!important}.u-child-width-2>*,.u-width-2{width:2rem!important}.u-child-width-3>*,.u-width-3{width:4rem!important}.u-child-width-4>*,.u-width-4{width:8rem!important}.u-child-width-5>*,.u-width-5{width:16rem!important}.u-child-width-1-2>*,.u-child-width-2-4>*,.u-child-width-3-6>*,.u-child-width-5-10>*,.u-child-width-6-12>*,.u-width-1-2,.u-width-2-4,.u-width-3-6,.u-width-5-10,.u-width-6-12{width:49.97501%!important}.u-child-width-1-3>*,.u-child-width-2-6>*,.u-width-1-3,.u-width-2-6{width:33.32223%!important}.u-child-width-2-3>*,.u-child-width-4-6>*,.u-width-2-3,.u-width-4-6{width:66.64445%!important}.u-child-width-1-4>*,.u-width-1-4{width:24.99375%!important}.u-child-width-3-4>*,.u-width-3-4{width:74.98125%!important}.u-child-width-1-5>*,.u-width-1-5{width:19.996%!important}.u-child-width-2-5>*,.u-width-2-5{width:39.992%!important}.u-child-width-3-5>*,.u-width-3-5{width:59.988%!important}.u-child-width-4-5>*,.u-width-4-5{width:79.984%!important}.u-child-width-1-6>*,.u-width-1-6{width:16.66389%!important}.u-child-width-5-6>*,.u-width-5-6{width:83.31945%!important}.u-child-width-1-10>*,.u-width-1-10{width:9.999%!important}.u-child-width-2-10>*,.u-width-2-10{width:19.998%!important}.u-child-width-3-10>*,.u-width-3-10{width:29.997%!important}.u-child-width-4-10>*,.u-width-4-10{width:39.996%!important}.u-child-width-6-10>*,.u-width-6-10{width:59.994%!important}.u-child-width-7-10>*,.u-width-7-10{width:69.993%!important}.u-child-width-8-10>*,.u-width-8-10{width:79.992%!important}.u-child-width-9-10>*,.u-width-9-10{width:89.991%!important}.u-child-width-1-12>*,.u-width-1-12{width:8.33264%!important}.u-child-width-2-12>*,.u-width-2-12{width:16.66528%!important}.u-child-width-3-12>*,.u-width-3-12{width:24.99792%!important}.u-child-width-4-12>*,.u-width-4-12{width:33.33056%!important}.u-child-width-5-12>*,.u-width-5-12{width:41.66319%!important}.u-child-width-7-12>*,.u-width-7-12{width:58.32847%!important}.u-child-width-8-12>*,.u-width-8-12{width:66.66111%!important}.u-child-width-9-12>*,.u-width-9-12{width:74.99375%!important}.u-child-width-10-12>*,.u-width-10-12{width:83.32639%!important}.u-child-width-11-12>*,.u-width-11-12{width:91.65903%!important}.u-child-width-full>*,.u-width-full{width:100%!important}.u-width-fill{-ms-flex:1;flex:1;min-width:1px}.u-width-fit{-ms-flex:none!important;flex:none!important}\@media screen and (max-width:1740px){.u-child-width-1\\\@xl>*,.u-width-1\\\@xl{width:1.1rem!important}.u-child-width-2\\\@xl>*,.u-width-2\\\@xl{width:2rem!important}.u-child-width-3\\\@xl>*,.u-width-3\\\@xl{width:4rem!important}.u-child-width-4\\\@xl>*,.u-width-4\\\@xl{width:8rem!important}.u-child-width-5\\\@xl>*,.u-width-5\\\@xl{width:16rem!important}.u-child-width-1-2\\\@xl>*,.u-child-width-2-4\\\@xl>*,.u-child-width-3-6\\\@xl>*,.u-child-width-5-10\\\@xl>*,.u-child-width-6-12\\\@xl>*,.u-width-1-2\\\@xl,.u-width-2-4\\\@xl,.u-width-3-6\\\@xl,.u-width-5-10\\\@xl,.u-width-6-12\\\@xl{width:49.97501%!important}.u-child-width-1-3\\\@xl>*,.u-child-width-2-6\\\@xl>*,.u-width-1-3\\\@xl,.u-width-2-6\\\@xl{width:33.32223%!important}.u-child-width-2-3\\\@xl>*,.u-child-width-4-6\\\@xl>*,.u-width-2-3\\\@xl,.u-width-4-6\\\@xl{width:66.64445%!important}.u-child-width-1-4\\\@xl>*,.u-width-1-4\\\@xl{width:24.99375%!important}.u-child-width-3-4\\\@xl>*,.u-width-3-4\\\@xl{width:74.98125%!important}.u-child-width-1-5\\\@xl>*,.u-width-1-5\\\@xl{width:19.996%!important}.u-child-width-2-5\\\@xl>*,.u-width-2-5\\\@xl{width:39.992%!important}.u-child-width-3-5\\\@xl>*,.u-width-3-5\\\@xl{width:59.988%!important}.u-child-width-4-5\\\@xl>*,.u-width-4-5\\\@xl{width:79.984%!important}.u-child-width-1-6\\\@xl>*,.u-width-1-6\\\@xl{width:16.66389%!important}.u-child-width-5-6\\\@xl>*,.u-width-5-6\\\@xl{width:83.31945%!important}.u-child-width-1-10\\\@xl>*,.u-width-1-10\\\@xl{width:9.999%!important}.u-child-width-2-10\\\@xl>*,.u-width-2-10\\\@xl{width:19.998%!important}.u-child-width-3-10\\\@xl>*,.u-width-3-10\\\@xl{width:29.997%!important}.u-child-width-4-10\\\@xl>*,.u-width-4-10\\\@xl{width:39.996%!important}.u-child-width-6-10\\\@xl>*,.u-width-6-10\\\@xl{width:59.994%!important}.u-child-width-7-10\\\@xl>*,.u-width-7-10\\\@xl{width:69.993%!important}.u-child-width-8-10\\\@xl>*,.u-width-8-10\\\@xl{width:79.992%!important}.u-child-width-9-10\\\@xl>*,.u-width-9-10\\\@xl{width:89.991%!important}.u-child-width-1-12\\\@xl>*,.u-width-1-12\\\@xl{width:8.33264%!important}.u-child-width-2-12\\\@xl>*,.u-width-2-12\\\@xl{width:16.66528%!important}.u-child-width-3-12\\\@xl>*,.u-width-3-12\\\@xl{width:24.99792%!important}.u-child-width-4-12\\\@xl>*,.u-width-4-12\\\@xl{width:33.33056%!important}.u-child-width-5-12\\\@xl>*,.u-width-5-12\\\@xl{width:41.66319%!important}.u-child-width-7-12\\\@xl>*,.u-width-7-12\\\@xl{width:58.32847%!important}.u-child-width-8-12\\\@xl>*,.u-width-8-12\\\@xl{width:66.66111%!important}.u-child-width-9-12\\\@xl>*,.u-width-9-12\\\@xl{width:74.99375%!important}.u-child-width-10-12\\\@xl>*,.u-width-10-12\\\@xl{width:83.32639%!important}.u-child-width-11-12\\\@xl>*,.u-width-11-12\\\@xl{width:91.65903%!important}.u-child-width-full\\\@xl>*,.u-width-full\\\@xl{width:100%!important}.u-width-fill\\\@xl{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@xl{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:1740px){.u-child-width-1\\\@lg>*,.u-width-1\\\@lg{width:1.1rem!important}.u-child-width-2\\\@lg>*,.u-width-2\\\@lg{width:2rem!important}.u-child-width-3\\\@lg>*,.u-width-3\\\@lg{width:4rem!important}.u-child-width-4\\\@lg>*,.u-width-4\\\@lg{width:8rem!important}.u-child-width-5\\\@lg>*,.u-width-5\\\@lg{width:16rem!important}.u-child-width-1-2\\\@lg>*,.u-child-width-2-4\\\@lg>*,.u-child-width-3-6\\\@lg>*,.u-child-width-5-10\\\@lg>*,.u-child-width-6-12\\\@lg>*,.u-width-1-2\\\@lg,.u-width-2-4\\\@lg,.u-width-3-6\\\@lg,.u-width-5-10\\\@lg,.u-width-6-12\\\@lg{width:49.97501%!important}.u-child-width-1-3\\\@lg>*,.u-child-width-2-6\\\@lg>*,.u-width-1-3\\\@lg,.u-width-2-6\\\@lg{width:33.32223%!important}.u-child-width-2-3\\\@lg>*,.u-child-width-4-6\\\@lg>*,.u-width-2-3\\\@lg,.u-width-4-6\\\@lg{width:66.64445%!important}.u-child-width-1-4\\\@lg>*,.u-width-1-4\\\@lg{width:24.99375%!important}.u-child-width-3-4\\\@lg>*,.u-width-3-4\\\@lg{width:74.98125%!important}.u-child-width-1-5\\\@lg>*,.u-width-1-5\\\@lg{width:19.996%!important}.u-child-width-2-5\\\@lg>*,.u-width-2-5\\\@lg{width:39.992%!important}.u-child-width-3-5\\\@lg>*,.u-width-3-5\\\@lg{width:59.988%!important}.u-child-width-4-5\\\@lg>*,.u-width-4-5\\\@lg{width:79.984%!important}.u-child-width-1-6\\\@lg>*,.u-width-1-6\\\@lg{width:16.66389%!important}.u-child-width-5-6\\\@lg>*,.u-width-5-6\\\@lg{width:83.31945%!important}.u-child-width-1-10\\\@lg>*,.u-width-1-10\\\@lg{width:9.999%!important}.u-child-width-2-10\\\@lg>*,.u-width-2-10\\\@lg{width:19.998%!important}.u-child-width-3-10\\\@lg>*,.u-width-3-10\\\@lg{width:29.997%!important}.u-child-width-4-10\\\@lg>*,.u-width-4-10\\\@lg{width:39.996%!important}.u-child-width-6-10\\\@lg>*,.u-width-6-10\\\@lg{width:59.994%!important}.u-child-width-7-10\\\@lg>*,.u-width-7-10\\\@lg{width:69.993%!important}.u-child-width-8-10\\\@lg>*,.u-width-8-10\\\@lg{width:79.992%!important}.u-child-width-9-10\\\@lg>*,.u-width-9-10\\\@lg{width:89.991%!important}.u-child-width-1-12\\\@lg>*,.u-width-1-12\\\@lg{width:8.33264%!important}.u-child-width-2-12\\\@lg>*,.u-width-2-12\\\@lg{width:16.66528%!important}.u-child-width-3-12\\\@lg>*,.u-width-3-12\\\@lg{width:24.99792%!important}.u-child-width-4-12\\\@lg>*,.u-width-4-12\\\@lg{width:33.33056%!important}.u-child-width-5-12\\\@lg>*,.u-width-5-12\\\@lg{width:41.66319%!important}.u-child-width-7-12\\\@lg>*,.u-width-7-12\\\@lg{width:58.32847%!important}.u-child-width-8-12\\\@lg>*,.u-width-8-12\\\@lg{width:66.66111%!important}.u-child-width-9-12\\\@lg>*,.u-width-9-12\\\@lg{width:74.99375%!important}.u-child-width-10-12\\\@lg>*,.u-width-10-12\\\@lg{width:83.32639%!important}.u-child-width-11-12\\\@lg>*,.u-width-11-12\\\@lg{width:91.65903%!important}.u-child-width-full\\\@lg>*,.u-width-full\\\@lg{width:100%!important}.u-width-fill\\\@lg{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@lg{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:1377px){.u-child-width-1\\\@md>*,.u-width-1\\\@md{width:1.1rem!important}.u-child-width-2\\\@md>*,.u-width-2\\\@md{width:2rem!important}.u-child-width-3\\\@md>*,.u-width-3\\\@md{width:4rem!important}.u-child-width-4\\\@md>*,.u-width-4\\\@md{width:8rem!important}.u-child-width-5\\\@md>*,.u-width-5\\\@md{width:16rem!important}.u-child-width-1-2\\\@md>*,.u-child-width-2-4\\\@md>*,.u-child-width-3-6\\\@md>*,.u-child-width-5-10\\\@md>*,.u-child-width-6-12\\\@md>*,.u-width-1-2\\\@md,.u-width-2-4\\\@md,.u-width-3-6\\\@md,.u-width-5-10\\\@md,.u-width-6-12\\\@md{width:49.97501%!important}.u-child-width-1-3\\\@md>*,.u-child-width-2-6\\\@md>*,.u-width-1-3\\\@md,.u-width-2-6\\\@md{width:33.32223%!important}.u-child-width-2-3\\\@md>*,.u-child-width-4-6\\\@md>*,.u-width-2-3\\\@md,.u-width-4-6\\\@md{width:66.64445%!important}.u-child-width-1-4\\\@md>*,.u-width-1-4\\\@md{width:24.99375%!important}.u-child-width-3-4\\\@md>*,.u-width-3-4\\\@md{width:74.98125%!important}.u-child-width-1-5\\\@md>*,.u-width-1-5\\\@md{width:19.996%!important}.u-child-width-2-5\\\@md>*,.u-width-2-5\\\@md{width:39.992%!important}.u-child-width-3-5\\\@md>*,.u-width-3-5\\\@md{width:59.988%!important}.u-child-width-4-5\\\@md>*,.u-width-4-5\\\@md{width:79.984%!important}.u-child-width-1-6\\\@md>*,.u-width-1-6\\\@md{width:16.66389%!important}.u-child-width-5-6\\\@md>*,.u-width-5-6\\\@md{width:83.31945%!important}.u-child-width-1-10\\\@md>*,.u-width-1-10\\\@md{width:9.999%!important}.u-child-width-2-10\\\@md>*,.u-width-2-10\\\@md{width:19.998%!important}.u-child-width-3-10\\\@md>*,.u-width-3-10\\\@md{width:29.997%!important}.u-child-width-4-10\\\@md>*,.u-width-4-10\\\@md{width:39.996%!important}.u-child-width-6-10\\\@md>*,.u-width-6-10\\\@md{width:59.994%!important}.u-child-width-7-10\\\@md>*,.u-width-7-10\\\@md{width:69.993%!important}.u-child-width-8-10\\\@md>*,.u-width-8-10\\\@md{width:79.992%!important}.u-child-width-9-10\\\@md>*,.u-width-9-10\\\@md{width:89.991%!important}.u-child-width-1-12\\\@md>*,.u-width-1-12\\\@md{width:8.33264%!important}.u-child-width-2-12\\\@md>*,.u-width-2-12\\\@md{width:16.66528%!important}.u-child-width-3-12\\\@md>*,.u-width-3-12\\\@md{width:24.99792%!important}.u-child-width-4-12\\\@md>*,.u-width-4-12\\\@md{width:33.33056%!important}.u-child-width-5-12\\\@md>*,.u-width-5-12\\\@md{width:41.66319%!important}.u-child-width-7-12\\\@md>*,.u-width-7-12\\\@md{width:58.32847%!important}.u-child-width-8-12\\\@md>*,.u-width-8-12\\\@md{width:66.66111%!important}.u-child-width-9-12\\\@md>*,.u-width-9-12\\\@md{width:74.99375%!important}.u-child-width-10-12\\\@md>*,.u-width-10-12\\\@md{width:83.32639%!important}.u-child-width-11-12\\\@md>*,.u-width-11-12\\\@md{width:91.65903%!important}.u-child-width-full\\\@md>*,.u-width-full\\\@md{width:100%!important}.u-width-fill\\\@md{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@md{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:959px){.u-child-width-1\\\@sm>*,.u-width-1\\\@sm{width:1.1rem!important}.u-child-width-2\\\@sm>*,.u-width-2\\\@sm{width:2rem!important}.u-child-width-3\\\@sm>*,.u-width-3\\\@sm{width:4rem!important}.u-child-width-4\\\@sm>*,.u-width-4\\\@sm{width:8rem!important}.u-child-width-5\\\@sm>*,.u-width-5\\\@sm{width:16rem!important}.u-child-width-1-2\\\@sm>*,.u-child-width-2-4\\\@sm>*,.u-child-width-3-6\\\@sm>*,.u-child-width-5-10\\\@sm>*,.u-child-width-6-12\\\@sm>*,.u-width-1-2\\\@sm,.u-width-2-4\\\@sm,.u-width-3-6\\\@sm,.u-width-5-10\\\@sm,.u-width-6-12\\\@sm{width:49.97501%!important}.u-child-width-1-3\\\@sm>*,.u-child-width-2-6\\\@sm>*,.u-width-1-3\\\@sm,.u-width-2-6\\\@sm{width:33.32223%!important}.u-child-width-2-3\\\@sm>*,.u-child-width-4-6\\\@sm>*,.u-width-2-3\\\@sm,.u-width-4-6\\\@sm{width:66.64445%!important}.u-child-width-1-4\\\@sm>*,.u-width-1-4\\\@sm{width:24.99375%!important}.u-child-width-3-4\\\@sm>*,.u-width-3-4\\\@sm{width:74.98125%!important}.u-child-width-1-5\\\@sm>*,.u-width-1-5\\\@sm{width:19.996%!important}.u-child-width-2-5\\\@sm>*,.u-width-2-5\\\@sm{width:39.992%!important}.u-child-width-3-5\\\@sm>*,.u-width-3-5\\\@sm{width:59.988%!important}.u-child-width-4-5\\\@sm>*,.u-width-4-5\\\@sm{width:79.984%!important}.u-child-width-1-6\\\@sm>*,.u-width-1-6\\\@sm{width:16.66389%!important}.u-child-width-5-6\\\@sm>*,.u-width-5-6\\\@sm{width:83.31945%!important}.u-child-width-1-10\\\@sm>*,.u-width-1-10\\\@sm{width:9.999%!important}.u-child-width-2-10\\\@sm>*,.u-width-2-10\\\@sm{width:19.998%!important}.u-child-width-3-10\\\@sm>*,.u-width-3-10\\\@sm{width:29.997%!important}.u-child-width-4-10\\\@sm>*,.u-width-4-10\\\@sm{width:39.996%!important}.u-child-width-6-10\\\@sm>*,.u-width-6-10\\\@sm{width:59.994%!important}.u-child-width-7-10\\\@sm>*,.u-width-7-10\\\@sm{width:69.993%!important}.u-child-width-8-10\\\@sm>*,.u-width-8-10\\\@sm{width:79.992%!important}.u-child-width-9-10\\\@sm>*,.u-width-9-10\\\@sm{width:89.991%!important}.u-child-width-1-12\\\@sm>*,.u-width-1-12\\\@sm{width:8.33264%!important}.u-child-width-2-12\\\@sm>*,.u-width-2-12\\\@sm{width:16.66528%!important}.u-child-width-3-12\\\@sm>*,.u-width-3-12\\\@sm{width:24.99792%!important}.u-child-width-4-12\\\@sm>*,.u-width-4-12\\\@sm{width:33.33056%!important}.u-child-width-5-12\\\@sm>*,.u-width-5-12\\\@sm{width:41.66319%!important}.u-child-width-7-12\\\@sm>*,.u-width-7-12\\\@sm{width:58.32847%!important}.u-child-width-8-12\\\@sm>*,.u-width-8-12\\\@sm{width:66.66111%!important}.u-child-width-9-12\\\@sm>*,.u-width-9-12\\\@sm{width:74.99375%!important}.u-child-width-10-12\\\@sm>*,.u-width-10-12\\\@sm{width:83.32639%!important}.u-child-width-11-12\\\@sm>*,.u-width-11-12\\\@sm{width:91.65903%!important}.u-child-width-full\\\@sm>*,.u-width-full\\\@sm{width:100%!important}.u-width-fill\\\@sm{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@sm{-ms-flex:none!important;flex:none!important}}\@media screen and (max-width:767px){.u-child-width-1\\\@xs>*,.u-width-1\\\@xs{width:1.1rem!important}.u-child-width-2\\\@xs>*,.u-width-2\\\@xs{width:2rem!important}.u-child-width-3\\\@xs>*,.u-width-3\\\@xs{width:4rem!important}.u-child-width-4\\\@xs>*,.u-width-4\\\@xs{width:8rem!important}.u-child-width-5\\\@xs>*,.u-width-5\\\@xs{width:16rem!important}.u-child-width-1-2\\\@xs>*,.u-child-width-2-4\\\@xs>*,.u-child-width-3-6\\\@xs>*,.u-child-width-5-10\\\@xs>*,.u-child-width-6-12\\\@xs>*,.u-width-1-2\\\@xs,.u-width-2-4\\\@xs,.u-width-3-6\\\@xs,.u-width-5-10\\\@xs,.u-width-6-12\\\@xs{width:49.97501%!important}.u-child-width-1-3\\\@xs>*,.u-child-width-2-6\\\@xs>*,.u-width-1-3\\\@xs,.u-width-2-6\\\@xs{width:33.32223%!important}.u-child-width-2-3\\\@xs>*,.u-child-width-4-6\\\@xs>*,.u-width-2-3\\\@xs,.u-width-4-6\\\@xs{width:66.64445%!important}.u-child-width-1-4\\\@xs>*,.u-width-1-4\\\@xs{width:24.99375%!important}.u-child-width-3-4\\\@xs>*,.u-width-3-4\\\@xs{width:74.98125%!important}.u-child-width-1-5\\\@xs>*,.u-width-1-5\\\@xs{width:19.996%!important}.u-child-width-2-5\\\@xs>*,.u-width-2-5\\\@xs{width:39.992%!important}.u-child-width-3-5\\\@xs>*,.u-width-3-5\\\@xs{width:59.988%!important}.u-child-width-4-5\\\@xs>*,.u-width-4-5\\\@xs{width:79.984%!important}.u-child-width-1-6\\\@xs>*,.u-width-1-6\\\@xs{width:16.66389%!important}.u-child-width-5-6\\\@xs>*,.u-width-5-6\\\@xs{width:83.31945%!important}.u-child-width-1-10\\\@xs>*,.u-width-1-10\\\@xs{width:9.999%!important}.u-child-width-2-10\\\@xs>*,.u-width-2-10\\\@xs{width:19.998%!important}.u-child-width-3-10\\\@xs>*,.u-width-3-10\\\@xs{width:29.997%!important}.u-child-width-4-10\\\@xs>*,.u-width-4-10\\\@xs{width:39.996%!important}.u-child-width-6-10\\\@xs>*,.u-width-6-10\\\@xs{width:59.994%!important}.u-child-width-7-10\\\@xs>*,.u-width-7-10\\\@xs{width:69.993%!important}.u-child-width-8-10\\\@xs>*,.u-width-8-10\\\@xs{width:79.992%!important}.u-child-width-9-10\\\@xs>*,.u-width-9-10\\\@xs{width:89.991%!important}.u-child-width-1-12\\\@xs>*,.u-width-1-12\\\@xs{width:8.33264%!important}.u-child-width-2-12\\\@xs>*,.u-width-2-12\\\@xs{width:16.66528%!important}.u-child-width-3-12\\\@xs>*,.u-width-3-12\\\@xs{width:24.99792%!important}.u-child-width-4-12\\\@xs>*,.u-width-4-12\\\@xs{width:33.33056%!important}.u-child-width-5-12\\\@xs>*,.u-width-5-12\\\@xs{width:41.66319%!important}.u-child-width-7-12\\\@xs>*,.u-width-7-12\\\@xs{width:58.32847%!important}.u-child-width-8-12\\\@xs>*,.u-width-8-12\\\@xs{width:66.66111%!important}.u-child-width-9-12\\\@xs>*,.u-width-9-12\\\@xs{width:74.99375%!important}.u-child-width-10-12\\\@xs>*,.u-width-10-12\\\@xs{width:83.32639%!important}.u-child-width-11-12\\\@xs>*,.u-width-11-12\\\@xs{width:91.65903%!important}.u-child-width-full\\\@xs>*,.u-width-full\\\@xs{width:100%!important}.u-width-fill\\\@xs{-ms-flex:1;flex:1;min-width:1px}.u-width-fit\\\@xs{-ms-flex:none!important;flex:none!important}}:host .app-fab--absolute,:host .fab-menu--absolute{display:none}\@media (min-width:1024px){:host .fab-menu--absolute{display:block;position:fixed;bottom:1.1rem;right:5rem;z-index:999;visibility:hidden;opacity:0;will-change:transform;-webkit-transition:visibility 0s,opacity .5s linear;transition:visibility 0s,opacity .5s linear}:host .fab-menu--absolute button{background-color:var(--mdc-theme-text-primary-on-primary);margin:4px}:host .fab-menu--absolute--show{visibility:visible;opacity:1;-webkit-transition:visibility 0s,opacity .5s linear;transition:visibility 0s,opacity .5s linear}:host .app-fab--absolute{display:block;background-color:var(--mdc-theme-text-primary-on-primary);position:fixed;bottom:1rem;right:1rem;z-index:999}}"; }
}

class DemoResizerComponent {
    constructor() {
        this.desktop = [
            { size: '1600', name: 'Window xxlarge' },
            { size: '1440', name: 'Window xlarge' },
            { size: '1280', name: 'Window large' },
            { size: '1024', name: 'Window large' },
            { size: '900', name: 'Window medium' },
            { size: '840', name: 'Window medium' },
            { size: '600', name: 'Window small' },
            { size: '480', name: 'Window xsmall' }
        ];
        this.mobile = [
            { size: '1024', name: 'Tablet' },
            { size: '720', name: 'Phablet' },
            { size: '600', name: 'Mobile Landscape' },
            { size: '412', name: 'Mobile Portrait medium' },
            { size: '360', name: 'Mobile Portrait' },
            { size: '280', name: 'Mobile Portrait xsmall' },
        ];
    }
    handleClick(event) {
        let evt = event.currentTarget.getAttribute('data-size');
        this.resizeButtonClicked.emit(evt);
        this.setActiveViewPort(evt);
    }
    setActiveViewPort(size) {
        const sizeList = Array.from(this.el.shadowRoot.querySelectorAll('.item-resize-toolbar'));
        sizeList.forEach((el) => {
            el.classList.remove('active');
        });
        const activeEl = sizeList.filter((el) => {
            return el.getAttribute('data-size') === size;
        });
        if (activeEl.length) {
            activeEl[0].classList.add('active');
        }
    }
    render() {
        const viewports = this.viewport === 'desktop' ? this.desktop : this.mobile;
        return (h("div", { class: "resize-toolbar-container" },
            h("div", { class: "resize-toolbar" }, viewports.map(option => {
                var cssSize = { width: `${option.size}px` };
                return (h("div", { onClick: (event) => this.handleClick(event), class: "item-resize-toolbar", style: cssSize, "data-name": option.size, "data-size": option.size },
                    h("div", { class: "left device-resizer" },
                        option.size,
                        "px"),
                    h("div", { class: "rigth device-resizer" },
                        option.size,
                        "px")));
            }))));
    }
    static get is() { return "o-demo-resizer"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "setActiveViewPort": {
            "method": true
        },
        "size": {
            "type": String,
            "attr": "size"
        },
        "viewport": {
            "type": String,
            "attr": "viewport"
        }
    }; }
    static get events() { return [{
            "name": "resizeButtonClicked",
            "method": "resizeButtonClicked",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return ":host .resize-toolbar-container{margin-top:4px;color:#212121;height:16px;white-space:nowrap;font-weight:500;border-top:1px solid #ddd;background:#fff;position:relative}:host .resize-toolbar{position:absolute;left:-100px;right:-100px}:host .item-resize-toolbar{-webkit-box-sizing:border-box;box-sizing:border-box;border-left:1px solid #ddd;border-right:1px solid #ddd;padding:1px;color:#212121;cursor:pointer;font-size:7.5px;font-weight:400;height:16px;left:0;line-height:16px;margin-left:auto;margin-right:auto;position:absolute;right:0}:host .item-resize-toolbar .left{float:left}:host .item-resize-toolbar .rigth{float:right}:host .active{background:rgba(0,0,0,.08)}"; }
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$9 = {
    CLOSING: 'mdc-snackbar--closing',
    OPEN: 'mdc-snackbar--open',
    OPENING: 'mdc-snackbar--opening',
};
var strings$9 = {
    ACTION_SELECTOR: '.mdc-snackbar__action',
    ARIA_LIVE_LABEL_TEXT_ATTR: 'data-mdc-snackbar-label-text',
    CLOSED_EVENT: 'MDCSnackbar:closed',
    CLOSING_EVENT: 'MDCSnackbar:closing',
    DISMISS_SELECTOR: '.mdc-snackbar__dismiss',
    LABEL_SELECTOR: '.mdc-snackbar__label',
    OPENED_EVENT: 'MDCSnackbar:opened',
    OPENING_EVENT: 'MDCSnackbar:opening',
    REASON_ACTION: 'action',
    REASON_DISMISS: 'dismiss',
    SURFACE_SELECTOR: '.mdc-snackbar__surface',
};
var numbers$5 = {
    DEFAULT_AUTO_DISMISS_TIMEOUT_MS: 5000,
    MAX_AUTO_DISMISS_TIMEOUT_MS: 10000,
    MIN_AUTO_DISMISS_TIMEOUT_MS: 4000,
    // These variables need to be kept in sync with the values in _variables.scss.
    SNACKBAR_ANIMATION_CLOSE_TIME_MS: 75,
    SNACKBAR_ANIMATION_OPEN_TIME_MS: 150,
    /**
     * Number of milliseconds to wait between temporarily clearing the label text
     * in the DOM and subsequently restoring it. This is necessary to force IE 11
     * to pick up the `aria-live` content change and announce it to the user.
     */
    ARIA_LIVE_DELAY_MS: 1000,
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ARIA_LIVE_DELAY_MS = numbers$5.ARIA_LIVE_DELAY_MS;
var ARIA_LIVE_LABEL_TEXT_ATTR = strings$9.ARIA_LIVE_LABEL_TEXT_ATTR;
function announce(ariaEl, labelEl) {
    if (labelEl === void 0) { labelEl = ariaEl; }
    var priority = ariaEl.getAttribute('aria-live');
    // Trim text to ignore `&nbsp;` (see below).
    // textContent is only null if the node is a document, DOCTYPE, or notation.
    var labelText = labelEl.textContent.trim();
    if (!labelText || !priority) {
        return;
    }
    // Temporarily disable `aria-live` to prevent JAWS+Firefox from announcing the message twice.
    ariaEl.setAttribute('aria-live', 'off');
    // Temporarily clear `textContent` to force a DOM mutation event that will be detected by screen readers.
    // `aria-live` elements are only announced when the element's `textContent` *changes*, so snackbars
    // sent to the browser in the initial HTML response won't be read unless we clear the element's `textContent` first.
    // Similarly, displaying the same snackbar message twice in a row doesn't trigger a DOM mutation event,
    // so screen readers won't announce the second message unless we first clear `textContent`.
    //
    // We have to clear the label text two different ways to make it work in all browsers and screen readers:
    //
    //   1. `textContent = ''` is required for IE11 + JAWS
    //   2. `innerHTML = '&nbsp;'` is required for Chrome + JAWS and NVDA
    //
    // All other browser/screen reader combinations support both methods.
    //
    // The wrapper `<span>` visually hides the space character so that it doesn't cause jank when added/removed.
    // N.B.: Setting `position: absolute`, `opacity: 0`, or `height: 0` prevents Chrome from detecting the DOM change.
    //
    // This technique has been tested in:
    //
    //   * JAWS 2019:
    //       - Chrome 70
    //       - Firefox 60 (ESR)
    //       - IE 11
    //   * NVDA 2018:
    //       - Chrome 70
    //       - Firefox 60 (ESR)
    //       - IE 11
    //   * ChromeVox 53
    labelEl.textContent = '';
    labelEl.innerHTML = '<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>';
    // Prevent visual jank by temporarily displaying the label text in the ::before pseudo-element.
    // CSS generated content is normally announced by screen readers
    // (except in IE 11; see https://tink.uk/accessibility-support-for-css-generated-content/);
    // however, `aria-live` is turned off, so this DOM update will be ignored by screen readers.
    labelEl.setAttribute(ARIA_LIVE_LABEL_TEXT_ATTR, labelText);
    setTimeout(function () {
        // Allow screen readers to announce changes to the DOM again.
        ariaEl.setAttribute('aria-live', priority);
        // Remove the message from the ::before pseudo-element.
        labelEl.removeAttribute(ARIA_LIVE_LABEL_TEXT_ATTR);
        // Restore the original label text, which will be announced by screen readers.
        labelEl.textContent = labelText;
    }, ARIA_LIVE_DELAY_MS);
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var OPENING = cssClasses$9.OPENING, OPEN = cssClasses$9.OPEN, CLOSING = cssClasses$9.CLOSING;
var REASON_ACTION = strings$9.REASON_ACTION, REASON_DISMISS = strings$9.REASON_DISMISS;
var MDCSnackbarFoundation = /** @class */ (function (_super) {
    __extends(MDCSnackbarFoundation, _super);
    function MDCSnackbarFoundation(adapter) {
        var _this = _super.call(this, __assign({}, MDCSnackbarFoundation.defaultAdapter, adapter)) || this;
        _this.isOpen_ = false;
        _this.animationFrame_ = 0;
        _this.animationTimer_ = 0;
        _this.autoDismissTimer_ = 0;
        _this.autoDismissTimeoutMs_ = numbers$5.DEFAULT_AUTO_DISMISS_TIMEOUT_MS;
        _this.closeOnEscape_ = true;
        return _this;
    }
    Object.defineProperty(MDCSnackbarFoundation, "cssClasses", {
        get: function () {
            return cssClasses$9;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbarFoundation, "strings", {
        get: function () {
            return strings$9;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbarFoundation, "numbers", {
        get: function () {
            return numbers$5;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbarFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                announce: function () { return undefined; },
                notifyClosed: function () { return undefined; },
                notifyClosing: function () { return undefined; },
                notifyOpened: function () { return undefined; },
                notifyOpening: function () { return undefined; },
                removeClass: function () { return undefined; },
            };
        },
        enumerable: true,
        configurable: true
    });
    MDCSnackbarFoundation.prototype.destroy = function () {
        this.clearAutoDismissTimer_();
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = 0;
        clearTimeout(this.animationTimer_);
        this.animationTimer_ = 0;
        this.adapter_.removeClass(OPENING);
        this.adapter_.removeClass(OPEN);
        this.adapter_.removeClass(CLOSING);
    };
    MDCSnackbarFoundation.prototype.open = function () {
        var _this = this;
        this.clearAutoDismissTimer_();
        this.isOpen_ = true;
        this.adapter_.notifyOpening();
        this.adapter_.removeClass(CLOSING);
        this.adapter_.addClass(OPENING);
        this.adapter_.announce();
        // Wait a frame once display is no longer "none", to establish basis for animation
        this.runNextAnimationFrame_(function () {
            _this.adapter_.addClass(OPEN);
            _this.animationTimer_ = setTimeout(function () {
                _this.handleAnimationTimerEnd_();
                _this.adapter_.notifyOpened();
                _this.autoDismissTimer_ = setTimeout(function () {
                    _this.close(REASON_DISMISS);
                }, _this.getTimeoutMs());
            }, numbers$5.SNACKBAR_ANIMATION_OPEN_TIME_MS);
        });
    };
    /**
     * @param reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
     *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
     *     client-specific values may also be used if desired.
     */
    MDCSnackbarFoundation.prototype.close = function (reason) {
        var _this = this;
        if (reason === void 0) { reason = ''; }
        if (!this.isOpen_) {
            // Avoid redundant close calls (and events), e.g. repeated interactions as the snackbar is animating closed
            return;
        }
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = 0;
        this.clearAutoDismissTimer_();
        this.isOpen_ = false;
        this.adapter_.notifyClosing(reason);
        this.adapter_.addClass(cssClasses$9.CLOSING);
        this.adapter_.removeClass(cssClasses$9.OPEN);
        this.adapter_.removeClass(cssClasses$9.OPENING);
        clearTimeout(this.animationTimer_);
        this.animationTimer_ = setTimeout(function () {
            _this.handleAnimationTimerEnd_();
            _this.adapter_.notifyClosed(reason);
        }, numbers$5.SNACKBAR_ANIMATION_CLOSE_TIME_MS);
    };
    MDCSnackbarFoundation.prototype.isOpen = function () {
        return this.isOpen_;
    };
    MDCSnackbarFoundation.prototype.getTimeoutMs = function () {
        return this.autoDismissTimeoutMs_;
    };
    MDCSnackbarFoundation.prototype.setTimeoutMs = function (timeoutMs) {
        // Use shorter variable names to make the code more readable
        var minValue = numbers$5.MIN_AUTO_DISMISS_TIMEOUT_MS;
        var maxValue = numbers$5.MAX_AUTO_DISMISS_TIMEOUT_MS;
        if (timeoutMs <= maxValue && timeoutMs >= minValue) {
            this.autoDismissTimeoutMs_ = timeoutMs;
        }
        else {
            throw new Error("timeoutMs must be an integer in the range " + minValue + "\u2013" + maxValue + ", but got '" + timeoutMs + "'");
        }
    };
    MDCSnackbarFoundation.prototype.getCloseOnEscape = function () {
        return this.closeOnEscape_;
    };
    MDCSnackbarFoundation.prototype.setCloseOnEscape = function (closeOnEscape) {
        this.closeOnEscape_ = closeOnEscape;
    };
    MDCSnackbarFoundation.prototype.handleKeyDown = function (evt) {
        var isEscapeKey = evt.key === 'Escape' || evt.keyCode === 27;
        if (isEscapeKey && this.getCloseOnEscape()) {
            this.close(REASON_DISMISS);
        }
    };
    MDCSnackbarFoundation.prototype.handleActionButtonClick = function (_evt) {
        this.close(REASON_ACTION);
    };
    MDCSnackbarFoundation.prototype.handleActionIconClick = function (_evt) {
        this.close(REASON_DISMISS);
    };
    MDCSnackbarFoundation.prototype.clearAutoDismissTimer_ = function () {
        clearTimeout(this.autoDismissTimer_);
        this.autoDismissTimer_ = 0;
    };
    MDCSnackbarFoundation.prototype.handleAnimationTimerEnd_ = function () {
        this.animationTimer_ = 0;
        this.adapter_.removeClass(cssClasses$9.OPENING);
        this.adapter_.removeClass(cssClasses$9.CLOSING);
    };
    /**
     * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
     */
    MDCSnackbarFoundation.prototype.runNextAnimationFrame_ = function (callback) {
        var _this = this;
        cancelAnimationFrame(this.animationFrame_);
        this.animationFrame_ = requestAnimationFrame(function () {
            _this.animationFrame_ = 0;
            clearTimeout(_this.animationTimer_);
            _this.animationTimer_ = setTimeout(callback, 0);
        });
    };
    return MDCSnackbarFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var SURFACE_SELECTOR = strings$9.SURFACE_SELECTOR, LABEL_SELECTOR = strings$9.LABEL_SELECTOR, ACTION_SELECTOR = strings$9.ACTION_SELECTOR, DISMISS_SELECTOR = strings$9.DISMISS_SELECTOR, OPENING_EVENT = strings$9.OPENING_EVENT, OPENED_EVENT = strings$9.OPENED_EVENT, CLOSING_EVENT = strings$9.CLOSING_EVENT, CLOSED_EVENT = strings$9.CLOSED_EVENT;
var MDCSnackbar = /** @class */ (function (_super) {
    __extends(MDCSnackbar, _super);
    function MDCSnackbar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MDCSnackbar.attachTo = function (root) {
        return new MDCSnackbar(root);
    };
    MDCSnackbar.prototype.initialize = function (announcerFactory) {
        if (announcerFactory === void 0) { announcerFactory = function () { return announce; }; }
        this.announce_ = announcerFactory();
    };
    MDCSnackbar.prototype.initialSyncWithDOM = function () {
        var _this = this;
        this.surfaceEl_ = this.root_.querySelector(SURFACE_SELECTOR);
        this.labelEl_ = this.root_.querySelector(LABEL_SELECTOR);
        this.actionEl_ = this.root_.querySelector(ACTION_SELECTOR);
        this.handleKeyDown_ = function (evt) { return _this.foundation_.handleKeyDown(evt); };
        this.handleSurfaceClick_ = function (evt) {
            var target = evt.target;
            if (_this.isActionButton_(target)) {
                _this.foundation_.handleActionButtonClick(evt);
            }
            else if (_this.isActionIcon_(target)) {
                _this.foundation_.handleActionIconClick(evt);
            }
        };
        this.registerKeyDownHandler_(this.handleKeyDown_);
        this.registerSurfaceClickHandler_(this.handleSurfaceClick_);
    };
    MDCSnackbar.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.deregisterKeyDownHandler_(this.handleKeyDown_);
        this.deregisterSurfaceClickHandler_(this.handleSurfaceClick_);
    };
    MDCSnackbar.prototype.open = function () {
        this.foundation_.open();
    };
    /**
     * @param reason Why the snackbar was closed. Value will be passed to CLOSING_EVENT and CLOSED_EVENT via the
     *     `event.detail.reason` property. Standard values are REASON_ACTION and REASON_DISMISS, but custom
     *     client-specific values may also be used if desired.
     */
    MDCSnackbar.prototype.close = function (reason) {
        if (reason === void 0) { reason = ''; }
        this.foundation_.close(reason);
    };
    MDCSnackbar.prototype.getDefaultFoundation = function () {
        var _this = this;
        // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.
        // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.
        var adapter = {
            addClass: function (className) { return _this.root_.classList.add(className); },
            announce: function () { return _this.announce_(_this.labelEl_); },
            notifyClosed: function (reason) { return _this.emit(CLOSED_EVENT, reason ? { reason: reason } : {}); },
            notifyClosing: function (reason) { return _this.emit(CLOSING_EVENT, reason ? { reason: reason } : {}); },
            notifyOpened: function () { return _this.emit(OPENED_EVENT, {}); },
            notifyOpening: function () { return _this.emit(OPENING_EVENT, {}); },
            removeClass: function (className) { return _this.root_.classList.remove(className); },
        };
        return new MDCSnackbarFoundation(adapter);
    };
    Object.defineProperty(MDCSnackbar.prototype, "timeoutMs", {
        get: function () {
            return this.foundation_.getTimeoutMs();
        },
        set: function (timeoutMs) {
            this.foundation_.setTimeoutMs(timeoutMs);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "closeOnEscape", {
        get: function () {
            return this.foundation_.getCloseOnEscape();
        },
        set: function (closeOnEscape) {
            this.foundation_.setCloseOnEscape(closeOnEscape);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "isOpen", {
        get: function () {
            return this.foundation_.isOpen();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "labelText", {
        get: function () {
            // This property only returns null if the node is a document, DOCTYPE, or notation.
            // On Element nodes, it always returns a string.
            return this.labelEl_.textContent;
        },
        set: function (labelText) {
            this.labelEl_.textContent = labelText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MDCSnackbar.prototype, "actionButtonText", {
        get: function () {
            return this.actionEl_.textContent;
        },
        set: function (actionButtonText) {
            this.actionEl_.textContent = actionButtonText;
        },
        enumerable: true,
        configurable: true
    });
    MDCSnackbar.prototype.registerKeyDownHandler_ = function (handler) {
        this.listen('keydown', handler);
    };
    MDCSnackbar.prototype.deregisterKeyDownHandler_ = function (handler) {
        this.unlisten('keydown', handler);
    };
    MDCSnackbar.prototype.registerSurfaceClickHandler_ = function (handler) {
        this.surfaceEl_.addEventListener('click', handler);
    };
    MDCSnackbar.prototype.deregisterSurfaceClickHandler_ = function (handler) {
        this.surfaceEl_.removeEventListener('click', handler);
    };
    MDCSnackbar.prototype.isActionButton_ = function (target) {
        return Boolean(closest(target, ACTION_SELECTOR));
    };
    MDCSnackbar.prototype.isActionIcon_ = function (target) {
        return Boolean(closest(target, DISMISS_SELECTOR));
    };
    return MDCSnackbar;
}(MDCComponent));

/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class DemoSnackbarComponent {
    componentDidLoad() {
        const rootEl = this.el.shadowRoot.querySelector('.mdc-snackbar');
        this.snackbarToast = new MDCSnackbar(rootEl);
        this.snackbarToast.dismissesOnAction = true;
        if (this._computeEvents()) {
            this._computeEvents().forEach(el => {
                window.addEventListener(el, evt => {
                    const payload = {
                        message: `${evt.type} : ${JSON.stringify(evt.detail)} `,
                        actionText: 'Close',
                        multiline: false,
                        actionOnBottom: true,
                        actionHandler: () => false
                    };
                    this.snackbarToast.show(payload);
                }, false);
            });
        }
    }
    componentDidUnload() {
        this.snackbarToast.destroy();
        this._computeEvents().forEach(el => {
            window.removeEventListener(el, () => { }, true);
        });
    }
    _computeEvents() {
        return this.events && this.events !== '' ? this.events.split(',') : false;
    }
    render() {
        return (h("div", { class: "mdc-snackbar mdc-snackbar--align-start", "aria-live": "assertive", "aria-atomic": "true", "aria-hidden": "true" },
            h("div", { class: "mdc-snackbar__text" }),
            h("div", { class: "mdc-snackbar__action-wrapper" },
                h("button", { type: "button", class: "mdc-snackbar__action-button" }))));
    }
    static get is() { return "o-demo-snackbar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "events": {
            "type": "Any",
            "attr": "events"
        }
    }; }
    static get style() { return ".mdc-snackbar{z-index:8;margin:8px;display:none;position:fixed;right:0;bottom:0;left:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;-webkit-box-sizing:border-box;box-sizing:border-box;pointer-events:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mdc-snackbar__surface{background-color:#333}.mdc-snackbar__label{color:hsla(0,0%,100%,.87)}.mdc-snackbar__surface{min-width:344px}\@media (max-width:344px),(max-width:480px){.mdc-snackbar__surface{min-width:100%}}.mdc-snackbar__surface{max-width:672px;-webkit-box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);border-radius:4px}.mdc-snackbar--closing,.mdc-snackbar--open,.mdc-snackbar--opening{display:-ms-flexbox;display:flex}.mdc-snackbar--leading{-ms-flex-pack:start;justify-content:flex-start}.mdc-snackbar--stacked .mdc-snackbar__surface{-ms-flex-direction:column;flex-direction:column;-ms-flex-align:start;align-items:flex-start}.mdc-snackbar--stacked .mdc-snackbar__actions{-ms-flex-item-align:end;align-self:flex-end;margin-bottom:8px}.mdc-snackbar__surface{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-transform:scale(.8);transform:scale(.8);opacity:0}.mdc-snackbar--open .mdc-snackbar__surface{-webkit-transform:scale(1);transform:scale(1);-webkit-transition:opacity .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;transition:opacity .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;transition:opacity .15s cubic-bezier(0,0,.2,1) 0ms,transform .15s cubic-bezier(0,0,.2,1) 0ms;transition:opacity .15s cubic-bezier(0,0,.2,1) 0ms,transform .15s cubic-bezier(0,0,.2,1) 0ms,-webkit-transform .15s cubic-bezier(0,0,.2,1) 0ms;opacity:1;pointer-events:auto}.mdc-snackbar--closing .mdc-snackbar__surface{-webkit-transform:scale(1);transform:scale(1);-webkit-transition:opacity 75ms cubic-bezier(.4,0,1,1) 0ms;transition:opacity 75ms cubic-bezier(.4,0,1,1) 0ms}.mdc-snackbar__label{font-family:Roboto,sans-serif;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-size:.875rem;line-height:1.25rem;font-weight:400;letter-spacing:.01786em;text-decoration:inherit;text-transform:inherit;-ms-flex-positive:1;flex-grow:1;-webkit-box-sizing:border-box;box-sizing:border-box;margin:0;padding:14px 16px}.mdc-snackbar__label:before{display:inline;content:attr(data-mdc-snackbar-label-text)}.mdc-snackbar__actions{margin-left:0;margin-right:8px;display:-ms-flexbox;display:flex;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-webkit-box-sizing:border-box;box-sizing:border-box}.mdc-snackbar__actions[dir=rtl],[dir=rtl] .mdc-snackbar__actions{margin-left:8px;margin-right:0}.mdc-snackbar__action:not(:disabled){color:#bb86fc}.mdc-snackbar__action:after,.mdc-snackbar__action:before{background-color:#bb86fc}.mdc-snackbar__action:hover:before{opacity:.08}.mdc-snackbar__action.mdc-ripple-upgraded--background-focused:before,.mdc-snackbar__action:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-snackbar__action:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-snackbar__action:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-snackbar__action.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.24}.mdc-snackbar__dismiss{color:hsla(0,0%,100%,.87)}.mdc-snackbar__dismiss:after,.mdc-snackbar__dismiss:before{background-color:hsla(0,0%,100%,.87)}.mdc-snackbar__dismiss:hover:before{opacity:.08}.mdc-snackbar__dismiss.mdc-ripple-upgraded--background-focused:before,.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):focus:before{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):after{-webkit-transition:opacity .15s linear;transition:opacity .15s linear}.mdc-snackbar__dismiss:not(.mdc-ripple-upgraded):active:after{-webkit-transition-duration:75ms;transition-duration:75ms;opacity:.24}.mdc-snackbar__dismiss.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:0.24}.mdc-snackbar__dismiss.mdc-snackbar__dismiss{width:36px;height:36px;padding:9px;font-size:18px}.mdc-snackbar__dismiss.mdc-snackbar__dismiss img,.mdc-snackbar__dismiss.mdc-snackbar__dismiss svg{width:18px;height:18px}.mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:8px;margin-right:0}.mdc-snackbar__action+.mdc-snackbar__dismiss[dir=rtl],[dir=rtl] .mdc-snackbar__action+.mdc-snackbar__dismiss{margin-left:0;margin-right:8px}:host .mdc-snackbar{z-index:4}"; }
}

export { DemoBarComponent as ODemoBar, DemoButtonsComponent as ODemoBarButtons, DemoSelectComponent as ODemoBarSelect, DemoToolbarComponent as ODemoBarToolbar, DemoDevicesComponent as ODemoDevices, DemoFabComponent as ODemoFab, DemoResizerComponent as ODemoResizer, DemoSnackbarComponent as ODemoSnackbar };
