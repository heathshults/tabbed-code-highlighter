import { Component, Prop, Element, Event, EventEmitter, Method, State, Watch } from '@stencil/core';
import {FkTab} from './tab'

@Component({
  tag: 'fk-tabs',
  styleUrl: '../../global/app.scss',
  shadow: true
})
export class FkTabs {
  @Element() elem: HTMLElement;

  @State() tabs: any[];

  @Event({ eventName: 'change' }) onChange: EventEmitter;

  @Prop({ reflectToAttr: true, mutable: true }) width?: string = '100%';
  @Prop({ reflectToAttr: true, mutable: true }) height?: string = '400px';
  @Prop({ reflectToAttr: true, mutable: true }) class?: string = 'c-tabs__expander';
  @Prop() cssClass?: string;
  @Prop({ mutable: true}) tabContainerHeight: any;
  @Prop() convToHTMLElement: any;
  @Prop({ mutable: true }) value = ''; // @Watch(this.tabContainer.style)

  @Method()
    async getNewHeight() {
      return this.height;
    }

  @Method()
  async currentTab() {
    let curtab: number = this.tabs.findIndex((tab) => tab.open);
    let curtabel: HTMLElement = this.tabs[curtab].tab
    let curtabheight: number = curtabel.clientHeight
    alert(`curtab: ${curtab}, ${curtabheight}`)
    return curtab

  }

  @Method()
  getMeasuredHeight() {
    const cTab = this.currentTab()
    const tabster = this.elem.shadowRoot.querySelector(cTab.toString()).clientHeight
    return tabster.toString()
  }

  componentWillLoad() {
    this.tabs = Array.from(this.elem.querySelectorAll('fk-tab'));
  }

  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    let newHeightValue = this.getNewHeight();
    this.elem.style.setProperty('height', newHeightValue.toString())

    let thisTab: any = this.tabs.forEach( tab => tab.height = FkTab.call(this, outerWidth, outerHeight) );
    thisTab.setAttribute('height', this.height)
    thisTab.setAttribute('width', this.width)
      return thisTab;
    };

// let thoseTabs = this.elem.shadowRoot.querySelectorAll('div.fk-tab')

    // for (var i = 0; thoseTabs[i]; i++) {
    //   let nodes = thoseTabs[i];
    //   this.convToHTMLElement = (nodes as HTMLElement).style.setProperty('height', newHeightValue.toString());
    // }
  @Method()
  openTab(tabIndex: number) {
    if (!this.tabs[tabIndex].disabled) {
      this.tabs = this.tabs.map((tab) => {
        tab.open = false;
        return tab;
      });
      this.tabs[tabIndex].open = true;
      this.onChange.emit({ idx: tabIndex });
    }
  }

  @Method()
  removeFocus(tabIndex: number) {
    if (!this.tabs[tabIndex].disabled) {
      this.tabs = this.tabs.map((tab) => {
        tab.blur()
        return tab
      })
    }
  }
  @Method()
  sizer() {
    let styleTag = document.createElement('style');
    let textContent = `
    .c-tabs__expander {
      width: ${this.width};
      height: ${this.height} }`;
    styleTag.innerHTML = textContent;
    this.elem.shadowRoot.appendChild(styleTag);
  }

  @Method()
  expand(tabIndex: number) {
    if (!this.tabs[tabIndex].disabled) {
      this.tabs = this.tabs.map((tab) => {
        tab.open = false;
        return tab;
      });
      let openTab: HTMLDivElement = this.tabs[tabIndex]
      let tabHeight = openTab.offsetHeight;
      this.height = tabHeight.toString();
      this.onChange.emit({ idx: tabIndex });
    }
  }

  render() {
    this.sizer();
    return (
      <div id="theTabContainer" class="c-tabs">
        <div role="tablist" class="c-tabs c-tabs__expander">
          <div class="c-tabs__nav">
            <div class="c-tabs__headings">
              {this.tabs.map((tab, i: number) => {
                const openClass = tab.open ? 'c-tab-heading--active' : '';
                const typeClass = tab.type ? `c-tab-heading--${tab.type}` : '';

                return (
                  <button
                    role="tab"
                    disabled={tab.disabled}
                    class={`c-tab-heading ${typeClass} ${openClass}`}
                    onClick={() => this.openTab(i)}
                    onMouseOut={() => this.removeFocus(i)} >
                    {tab.header}
                  </button>
                );
              })}
            </div>
          </div>
          <slot />
        </div>
        <div class="c-button-container">
        {this.tabs.map((tab, i: number) => {
          console.log('did it!')
          if (!tab.open) {
          return (
            <button
              id="st"
              disabled={tab.disabled}
              class={`c-button c-button--showMore`}
              onClick={() => this.expand(i)}
              onMouseOut={() => this.removeFocus(i)} >
              {tab.header}
            </button>
          );
          }
        })}
      </div>
    </div>
    );
  }
}
