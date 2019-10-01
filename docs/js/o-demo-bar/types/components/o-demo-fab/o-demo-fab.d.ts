import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class DemoFabComponent {
    private ripple;
    el: HTMLElement;
    fabBtnRotate: EventEmitter;
    fabBtnChangeDevice: EventEmitter;
    componentDidLoad(): void;
    componentDidUnload(): void;
    showContextMenu(): void;
    handleClick(evt: any): void;
    render(): JSX.Element[];
}
