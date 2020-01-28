import { Component, Prop, Element, Event, EventEmitter, Method, State, Watch } from '@stencil/core';
@Component({
  tag: 'fk-tabs',
  styleUrl: '../../global/app.scss',
  shadow: true
})
export class FkTabs {
  @Element() elem: HTMLElement;
  @State() tabs: any[];
  @Event({ eventName: 'change' }) onChange: EventEmitter;

  @Prop({ reflectToAttr: true, mutable: true}) width?: string = '100%';
  @Prop({ reflectToAttr: true, mutable: true }) height?: string = '400';
  @Prop() cssClass?: string;
  @Prop({mutable: true}) tabContainerHeight: any;
  @Prop() convToHTMLElement: any;
  @Prop() idx: any;
  @Prop() btnIdShowMore: number = 1000;
  @Prop() btnIdTabHead: number = 999;

  hostData(){
    this.tabContainerHeight = this.elem.style.setProperty('height', this.height)
    return this.tabContainerHeight
    };

@Method()
  async getNewHeight() {
    return this.height
  }
    // @Watch(this.tabContainer.style)
    @Prop({ mutable: true }) value = '';

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
    let thoseTabs = this.elem.shadowRoot.querySelectorAll('div.fk-tab')

    for (var i = 0; thoseTabs[i]; i++) {
      let nodes = thoseTabs[i];
      this.convToHTMLElement = (nodes as HTMLElement).style.setProperty('height', newHeightValue.toString());
    }
  }

  @Method()
  async currentTab() {
    return this.tabs.findIndex((tab) => tab.open);
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
  expand(tabIndex: number) {
    if (!this.tabs[tabIndex].disabled) {
      // let openTabPanel: HTMLDivElement = this.tabs[tabIndex]
      // let divTabPanel: any =  this.elem.shadowRoot.querySelector('.c-tabs[role="container"]')
      let openTabPanel: HTMLDivElement = this.tabs[tabIndex]
      let divTabPanel: HTMLDivElement=  openTabPanel.shadowRoot.querySelector('div[role="tabpanel"]')
      divTabPanel.classList.toggle('c-tabs__expander')
      return;
    }
  };

      // let openTab: HTMLDivElement = this.tabs[tabIndex]
      // let tabHeight = openTab.getBoundingClientRect().height;
      // console.log('Tab: ' + tabHeight)
      // this.height = tabHeight.toString();
      // this.onChange.emit({ idx: tabIndex });



  @Method()
  removeFocus(tabIndex: number, btnId: number) {

    if (!this.tabs[tabIndex].disabled && tabIndex === this.btnIdTabHead || !this.tabs[tabIndex].disabled && btnId === this.btnIdShowMore) {
      this.tabs = this.tabs.map((tab) => {
        tab.blur()
        return tab
      })
    }
  }

  render() {

    return (
      <div class="c-tabs" role="container" id={this.idx}>
        <div role="tablist" class="c-tabs">
          <div class="c-tabs__nav">
            <div class="c-tabs__headings">
              {this.tabs.map((tab, i: number) => {
                const openClass = tab.open ? 'c-tab-heading--active' : '';
                const typeClass = tab.type ? `c-tab-heading--${tab.type}` : '';
                return (
                  <button
                    role="tab"
                    id={tab.header}
                    disabled={tab.disabled}
                    class={`c-tab-heading ${typeClass} ${openClass}`}
                    onClick={() => this.openTab(i)}
                    onMouseOut={() => this.removeFocus(i, 999)} >
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
          if (tab.open) {
          return (
            <button
              id={`btn${this.idx}`}
              disabled={tab.disabled}
              class={`c-button c-button--showMore`}
              onClick={() => this.expand(i)}
              onMouseOut={() => this.removeFocus(i, this.btnIdShowMore)} >
              Show More
            </button>
          );
          }
        })}
      </div>
    </div>
    );
  }
}
