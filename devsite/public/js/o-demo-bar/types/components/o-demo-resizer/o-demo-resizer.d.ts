import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class DemoResizerComponent {
    private desktop;
    private mobile;
    resizeButtonClicked: EventEmitter;
    el: HTMLElement;
    size: string;
    viewport: string;
    handleClick(event: any): void;
    setActiveViewPort(size?: string): void;
    render(): JSX.Element;
}
