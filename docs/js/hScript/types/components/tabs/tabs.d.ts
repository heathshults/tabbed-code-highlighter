import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class FkTabs {
    elem: HTMLElement;
    tabs: any[];
    onChange: EventEmitter;
    width?: string;
    height?: string;
    cssClass?: string;
    tabContainerHeight: any;
    convToHTMLElement: any;
    hostData(): any;
    getNewHeight(): Promise<string>;
    value: string;
    componentWillLoad(): void;
    /**
     * Update the native input element when the value changes
     */
    protected valueChanged(): void;
    currentTab(): Promise<number>;
    openTab(tabIndex: number): void;
    expand(tabIndex: number): void;
    removeFocus(tabIndex: number): void;
    render(): JSX.Element;
}
