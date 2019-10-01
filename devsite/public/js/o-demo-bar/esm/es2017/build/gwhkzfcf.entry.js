import { h } from '../orango-demo-tools.core.js';

class DemoCaseComponent {
    static get is() { return "o-demo-case"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "name": {
            "type": String,
            "attr": "name"
        }
    }; }
}

export { DemoCaseComponent as ODemoCase };
