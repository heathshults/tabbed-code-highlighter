import Prism from 'prismjs';
export class FramekitHighlightCode {
    constructor() {
        this.anchor = '// Framekit';
        this.anchorZoom = '// FramekitZoom';
        this.hideAnchor = true;
        this.language = 'javascript';
        this.anchorOffsetTop = 0;
    }
    async componentDidLoad() {
        await this.loadLanguage();
        if (this.language === 'javascript') {
            await this.fetchOrParse();
        }
    }
    async languageLoaded($event) {
        if (!$event || !$event.detail) {
            return;
        }
        if (this.language && this.language !== 'javascript' && $event.detail === this.language) {
            await this.fetchOrParse();
        }
    }
    async fetchOrParse() {
        if (this.src) {
            await this.fetchCode();
        }
        else {
            await this.parseSlottedCode();
        }
    }
    loadLanguage() {
        return new Promise(async (resolve) => {
            if (!document || !this.language || this.language === '' || this.language === 'javascript') {
                resolve();
                return;
            }
            const scripts = document.querySelector('[framekit-prism=\'' + this.language + '\']');
            if (scripts) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.onload = async () => {
                script.setAttribute('framekit-prism-loaded', this.language);
                this.prismLanguageLoaded.emit(this.language);
            };
            script.src = 'https://unpkg.com/prismjs@latest/components/prism-' + this.language + '.js';
            script.setAttribute('framekit-prism', this.language);
            script.defer = true;
            document.head.appendChild(script);
            resolve();
        });
    }
    load() {
        return new Promise(async (resolve) => {
            if (!this.language || this.language === '') {
                resolve();
                return;
            }
            if (this.language === 'javascript') {
                await this.fetchOrParse();
                resolve();
                return;
            }
            if (document.querySelector('[framekit-prism-loaded=\'' + this.language + '\']')) {
                await this.fetchOrParse();
            }
            else {
                await this.loadLanguage();
            }
            resolve();
        });
    }
    parseSlottedCode() {
        const code = this.el.querySelector('[slot=\'code\']');
        if (code) {
            return this.parseCode(code.innerText);
        }
        else {
            return new Promise((resolve) => {
                resolve();
            });
        }
    }
    async fetchCode() {
        if (!this.src) {
            return;
        }
        let fetchedCode;
        try {
            const response = await fetch(this.src);
            fetchedCode = await response.text();
            await this.parseCode(fetchedCode);
        }
        catch (e) {
            const container = this.el.shadowRoot.querySelector('pre.fk-highlight-code-container');
            if (container && fetchedCode) {
                container.children[0].innerHTML = fetchedCode;
            }
        }
    }
    parseCode(code) {
        return new Promise(async (resolve, reject) => {
            const container = this.el.shadowRoot.querySelector('pre.fk-highlight-code-container');
            if (container) {
                try {
                    const highlightedCode = Prism.highlight(code, Prism.languages[this.language]);
                    container.children[0].innerHTML = highlightedCode;
                    await this.addAnchors();
                    await this.addHighlight();
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            }
        });
    }
    addAnchors() {
        return new Promise((resolve) => {
            const elements = this.el.shadowRoot.querySelectorAll('span.comment');
            if (elements) {
                const elementsArray = Array.from(elements);
                const anchors = elementsArray.filter((element) => {
                    return this.hasLineAnchor(element.innerHTML);
                });
                if (anchors) {
                    anchors.forEach((anchor) => {
                        anchor.classList.add('fk-highlight-code-anchor');
                        if (this.hideAnchor) {
                            anchor.classList.add('fk-highlight-code-anchor-hidden');
                        }
                    });
                }
            }
            resolve();
        });
    }
    hasLineAnchor(line) {
        return line && this.anchor &&
            line.indexOf('@Prop') === -1 &&
            line.split(' ').join('').indexOf(this.anchor.split(' ').join('')) > -1;
    }
    addHighlight() {
        return new Promise(async (resolve) => {
            if (this.highlightLines && this.highlightLines.length > 0) {
                const rows = await this.findRowsToHighlight();
                if (rows && rows.length > 0) {
                    const containerCode = this.el.shadowRoot.querySelector('code');
                    if (containerCode && containerCode.hasChildNodes()) {
                        const elements = Array.prototype.slice.call(containerCode.childNodes);
                        let rowIndex = -1;
                        let lastOffsetTop = -1;
                        let offsetHeight = -1;
                        elements.forEach((element) => {
                            let editElement;
                            if (element.nodeName === '#text') {
                                const span = document.createElement('span');
                                if (element.previousElementSibling) {
                                    element.previousElementSibling.insertAdjacentElement('afterend', span);
                                }
                                else {
                                    element.parentNode.prepend(span);
                                }
                                span.appendChild(element);
                                editElement = span;
                            }
                            else {
                                editElement = element;
                            }
                            rowIndex = editElement.offsetTop > lastOffsetTop ? (rowIndex + 1) : rowIndex;
                            lastOffsetTop = editElement.offsetTop;
                            offsetHeight = offsetHeight === -1 || offsetHeight > editElement.offsetHeight ? editElement.offsetHeight : offsetHeight;
                            const rowsIndexToCompare = editElement.offsetHeight > offsetHeight ? (rowIndex + 1) : rowIndex;
                            if (rows.indexOf(rowsIndexToCompare) > -1) {
                                editElement.classList.add('fk-highlight-code-line');
                            }
                        });
                    }
                }
            }
            resolve();
        });
    }
    findRowsToHighlight() {
        return new Promise((resolve) => {
            let results = [];
            const rows = this.highlightLines.split(' ');
            if (rows && rows.length > 0) {
                rows.forEach((row) => {
                    const index = row.split(',');
                    if (index && index.length >= 1) {
                        const start = parseInt(index[0], 0);
                        const end = parseInt(index[1], 0);
                        for (let i = start; i <= end; i++) {
                            results.push(i);
                        }
                    }
                });
            }
            resolve(results);
        });
    }
    findNextAnchor(enter) {
        return new Promise(async (resolve) => {
            const elements = this.el.shadowRoot.querySelectorAll('span.fk-highlight-code-anchor');
            if (elements) {
                const elementsArray = enter ? Array.from(elements) : Array.from(elements).reverse();
                const anchor = elementsArray.find((element) => {
                    return enter ? element.offsetTop > this.anchorOffsetTop : element.offsetTop < this.anchorOffsetTop;
                });
                if (anchor) {
                    this.anchorOffsetTop = anchor.offsetTop;
                    resolve({
                        offsetTop: anchor.offsetTop,
                        hasLineZoom: this.hasLineZoom(anchor.textContent)
                    });
                }
                else if (!enter) {
                    const elementCode = this.el.shadowRoot.querySelector('code');
                    if (elementCode && elementCode.firstElementChild) {
                        this.anchorOffsetTop = 0;
                        resolve({
                            offsetTop: 0,
                            hasLineZoom: false
                        });
                    }
                    else {
                        resolve(null);
                    }
                }
                else {
                    resolve(null);
                }
            }
            else {
                resolve(null);
            }
        });
    }
    zoomCode(zoom) {
        return new Promise((resolve) => {
            const container = this.el.shadowRoot.querySelector('pre.fk-highlight-code-container');
            if (container) {
                container.style.setProperty('--fk-highlight-code-zoom', zoom ? '1.3' : '1');
            }
            resolve();
        });
    }
    hasLineZoom(line) {
        return line && this.anchorZoom &&
            line.indexOf('@Prop') === -1 &&
            line.split(' ').join('').indexOf(this.anchorZoom.split(' ').join('')) > -1;
    }
    render() {
        return h("pre", { "data-source": "plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js", "data-label": "Copy", class: "fk-highlight-code-container no-whitespace-normalization" },
            h("code", { slot: "code", class: "theCodeTag" }, " "));
    }
    static get is() { return "fk-highlight-code"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "anchor": {
            "type": String,
            "attr": "anchor"
        },
        "anchorZoom": {
            "type": String,
            "attr": "anchor-zoom"
        },
        "el": {
            "elementRef": true
        },
        "findNextAnchor": {
            "method": true
        },
        "hideAnchor": {
            "type": Boolean,
            "attr": "hide-anchor"
        },
        "highlightLines": {
            "type": String,
            "attr": "highlight-lines"
        },
        "language": {
            "type": String,
            "attr": "language",
            "watchCallbacks": ["loadLanguage"]
        },
        "load": {
            "method": true
        },
        "src": {
            "type": String,
            "attr": "src"
        },
        "zoomCode": {
            "method": true
        }
    }; }
    static get events() { return [{
            "name": "prismLanguageLoaded",
            "method": "prismLanguageLoaded",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "document:prismLanguageLoaded",
            "method": "languageLoaded"
        }]; }
    static get style() { return "/**style-placeholder:fk-highlight-code:**/"; }
}
