import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
export declare class DemoSelectComponent {
    private select;
    el: HTMLElement;
    selectedCaseChanged: EventEmitter;
    options: any;
    componentDidLoad(): void;
    emitChange(): void;
    componentDidUnload(): void;
    render(): JSX.Element;
}
