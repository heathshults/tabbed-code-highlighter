import '../../stencil.core';
export declare class DemoDevicesComponent {
    private evtListenerRotate;
    private evtListenerDeviceChange;
    el: any;
    orientation: string;
    selectedDevice: number;
    deviceArray: JSX.Element[];
    componentWillUpdate(): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    _sizeFrame(): void;
    changeDevice(evt: any): void;
    rotateDevice(): void;
    render(): JSX.Element;
}
