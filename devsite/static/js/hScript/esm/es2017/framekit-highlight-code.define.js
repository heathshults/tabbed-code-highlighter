
// FramekitHighlightCode: Custom Elements Define Library, ES Module/es2017 Target

import { defineCustomElement } from './framekit-highlight-code.core.js';
import { COMPONENTS } from './framekit-highlight-code.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
