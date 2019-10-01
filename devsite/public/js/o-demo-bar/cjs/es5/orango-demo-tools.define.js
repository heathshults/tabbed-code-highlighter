"use strict";
// OrangoDemoTools: Custom Elements Define Library, ES Module/es5 Target
Object.defineProperty(exports, "__esModule", { value: true });
var orango_demo_tools_core_js_1 = require("./orango-demo-tools.core.js");
var orango_demo_tools_components_js_1 = require("./orango-demo-tools.components.js");
function defineCustomElements(win, opts) {
    return orango_demo_tools_core_js_1.defineCustomElement(win, orango_demo_tools_components_js_1.COMPONENTS, opts);
}
exports.defineCustomElements = defineCustomElements;
