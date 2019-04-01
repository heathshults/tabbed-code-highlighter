import { Component, Prop, Element, Event, EventEmitter, Method, State, Watch } from '@stencil/core';
// next up https://itnext.io/creating-a-side-menu-component-with-stencil-using-events-listen-and-slot-ed06c612bc6
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
      return this.height
    }

  @Method()
  async currentTab() {
    return this.tabs.findIndex((tab) => tab.open);
  }

  @Method()
  getMeasuredHeight() {
    const cTab = this.currentTab().toString()
    const tabster = this.elem.shadowRoot.querySelector(cTab).clientHeight
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
    // let thoseTabs = this.elem.shadowRoot.querySelectorAll('div.fk-tab')

    // for (var i = 0; thoseTabs[i]; i++) {
    //   let nodes = thoseTabs[i];
    //   this.convToHTMLElement = (nodes as HTMLElement).style.setProperty('height', newHeightValue.toString());
    // }
  }

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

  hostData() {

    let styleTag = document.createElement('style');
    let textContent = `
    .c-tabs__expander {
      width: 100%;
      height: ${this.height} }`;
    styleTag.innerHTML = textContent;
    this.elem.shadowRoot.appendChild(styleTag);
  }

  @Method()
    expand() {
      const measuredHeight = this.getMeasuredHeight().toString();
      this.height = measuredHeight;
    }

  render() {

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
        <button class="c-button--showMore"
        onClick={() => this.expand()}>
          Show More
          <span class="showMoreLines"></span>
        </button>
      </div>
    </div>
    );
  }
}
