import { Devices } from './devices';
export class DemoDevicesComponent {
    constructor() {
        this.selectedDevice = 0;
        this.deviceArray = [Devices.iphoneX, Devices.iphone8, Devices.note8, Devices.nexus5, Devices.lumia920, Devices.iPad];
    }
    componentWillUpdate() {
        window.requestAnimationFrame(() => this._sizeFrame());
    }
    componentDidLoad() {
        this.evtListenerRotate = document.addEventListener('rotate-device', this.rotateDevice.bind(this));
        this.evtListenerDeviceChange = document.addEventListener('change-device', this.changeDevice.bind(this));
        this.el.forceUpdate();
    }
    componentDidUnload() {
        document.removeEventListener('rotate-device', this.evtListenerRotate);
        document.removeEventListener('rotate-device', this.evtListenerDeviceChange);
    }
    _sizeFrame() {
        const slotEl = this.el.querySelector('[slot=screen]');
        const iFrameEl = this.el.querySelector('iframe');
        iFrameEl.width = `${slotEl.clientWidth}px`;
        iFrameEl.height = `${slotEl.clientHeight}px`;
        this.el.forceUpdate();
    }
    changeDevice(evt) {
        if (evt.detail === 'navigate-next') {
            this.selectedDevice < this.deviceArray.length - 1 ? this.selectedDevice++ : this.selectedDevice = 0;
        }
        else if (evt.detail === 'navigate-before') {
            this.selectedDevice > 0 ? this.selectedDevice-- : this.selectedDevice = this.deviceArray.length - 1;
        }
    }
    rotateDevice() {
        this._sizeFrame();
        this.el.shadowRoot.querySelector('.marvel-device').classList.toggle('landscape');
    }
    render() {
        return this.deviceArray[this.selectedDevice];
    }
    static get is() { return "o-demo-devices"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "orientation": {
            "type": String,
            "attr": "orientation"
        },
        "selectedDevice": {
            "state": true
        }
    }; }
    static get style() { return "/**style-placeholder:o-demo-devices:**/"; }
}
