import '../../stencil.core';
export declare class DemoBarComponent {
    private demoCases;
    private casesOptions;
    private resizeComponent;
    private codeEditor;
    el: any;
    name: string;
    events: string;
    backgroundColor: string;
    caseOptionSelected: number;
    pattern: boolean;
    device: string;
    deviceSize: string;
    deviceEmulate: boolean;
    componentWillLoad(): void;
    componentDidLoad(): void;
    componentDidUpdate(): void;
    setViewPort(): void;
    stencilDevServer(): void;
    codeEditorChangedHandler(event: CustomEvent): void;
    selectedCaseChangedHandler(event: CustomEvent): void;
    toolbarButtonClickedHandler(event: CustomEvent): void;
    resizeButtonClickedHandler(event: CustomEvent): void;
    _setSelect(): any[];
    _cleanIframe(): void;
    _setIframe(code?: string): void;
    render(): JSX.Element;
}
