import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class DemoModalComponent {
    modalEl: any;
    el: HTMLElement;
    codeEditorChanged: EventEmitter;
    open: boolean;
    code: any;
    debounce(delay: any, fn: any): (...args: any[]) => void;
    contentChanged(arg: any): void;
    openDialog(): void;
    closeDialog(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    render(): JSX.Element;
}
