
// OrangoDemoTools: Custom Elements Define Library, ES Module/es5 Target

import { defineCustomElement } from './orango-demo-tools.core.js';
import { COMPONENTS } from './orango-demo-tools.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
