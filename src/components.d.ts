/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';


import {
  FramekitHighlightCodeAnchor,
} from './components/declarations/fk-highlight-code-anchor';


export namespace Components {

  interface FkHighlightCode {
    'anchor': string;
    'anchorZoom': string;
    'findNextAnchor': (enter: boolean) => Promise<FramekitHighlightCodeAnchor>;
    'hideAnchor': boolean;
    'highlightLines': string;
    'language': string;
    'load': () => Promise<void>;
    'src': string;
    'zoomCode': (zoom: boolean) => Promise<void>;
  }
  interface FkHighlightCodeAttributes extends StencilHTMLAttributes {
    'anchor'?: string;
    'anchorZoom'?: string;
    'hideAnchor'?: boolean;
    'highlightLines'?: string;
    'language'?: string;
    'onPrismLanguageLoaded'?: (event: CustomEvent<string>) => void;
    'src'?: string;
  }

  interface FkTab {
    'class'?: string;
    'disabled': boolean;
    'header': string;
    'height'?: string;
    'open': boolean;
    'type': string;
    'width'?: string;
  }
  interface FkTabAttributes extends StencilHTMLAttributes {
    'class'?: string;
    'disabled'?: boolean;
    'header'?: string;
    'height'?: string;
    'open'?: boolean;
    'type'?: string;
    'width'?: string;
  }

  interface FkTabs {
    'class'?: string;
    'convToHTMLElement': any;
    'cssClass'?: string;
    'currentTab': () => Promise<number>;
    'expand': () => void;
    'getMeasuredHeight': () => string;
    'getNewHeight': () => Promise<string>;
    'height'?: string;
    'openTab': (tabIndex: number) => void;
    'removeFocus': (tabIndex: number) => void;
    'tabContainerHeight': any;
    'value': string;
    'width'?: string;
  }
  interface FkTabsAttributes extends StencilHTMLAttributes {
    'class'?: string;
    'convToHTMLElement'?: any;
    'cssClass'?: string;
    'height'?: string;
    'onChange'?: (event: CustomEvent) => void;
    'tabContainerHeight'?: any;
    'value'?: string;
    'width'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'FkHighlightCode': Components.FkHighlightCode;
    'FkTab': Components.FkTab;
    'FkTabs': Components.FkTabs;
  }

  interface StencilIntrinsicElements {
    'fk-highlight-code': Components.FkHighlightCodeAttributes;
    'fk-tab': Components.FkTabAttributes;
    'fk-tabs': Components.FkTabsAttributes;
  }


  interface HTMLFkHighlightCodeElement extends Components.FkHighlightCode, HTMLStencilElement {}
  var HTMLFkHighlightCodeElement: {
    prototype: HTMLFkHighlightCodeElement;
    new (): HTMLFkHighlightCodeElement;
  };

  interface HTMLFkTabElement extends Components.FkTab, HTMLStencilElement {}
  var HTMLFkTabElement: {
    prototype: HTMLFkTabElement;
    new (): HTMLFkTabElement;
  };

  interface HTMLFkTabsElement extends Components.FkTabs, HTMLStencilElement {}
  var HTMLFkTabsElement: {
    prototype: HTMLFkTabsElement;
    new (): HTMLFkTabsElement;
  };

  interface HTMLElementTagNameMap {
    'fk-highlight-code': HTMLFkHighlightCodeElement
    'fk-tab': HTMLFkTabElement
    'fk-tabs': HTMLFkTabsElement
  }

  interface ElementTagNameMap {
    'fk-highlight-code': HTMLFkHighlightCodeElement;
    'fk-tab': HTMLFkTabElement;
    'fk-tabs': HTMLFkTabsElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
