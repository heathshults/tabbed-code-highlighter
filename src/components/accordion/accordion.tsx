import {  Component, Prop, Element, Event, EventEmitter, Method, State, Watch, } from '@stencil/core';


@Component({
    tag: 'bpds-accordion',
    styleUrl: 'accordion.css',
    shadow: true
})
export class Accordion {
  @Element() elem: HTMLElement;
  @State() accordionPanels: any[];
  @Event({ eventName: 'change' }) onChange: EventEmitter;

  @Prop({ reflectToAttr: true, mutable: true}) width?: string = '100%';
  @Prop({ reflectToAttr: true, mutable: true }) height?: string = '400';
  @Prop() cssClass?: string;
  @Prop({ mutable: true}) accordionContainerHeight: any;
  @Prop() convToHTMLElement: any;
  @Prop() idx: any;
  @Prop({ mutable: true }) value = '';
  
  hostData(){
    this.accordionContainerHeight = this.elem.style.setProperty('height', this.height)
    return this.accordionContainerHeight
  };
    
  @Method()
  async getNewHeight() {
    return this.height
  }

  componentWillLoad() {
    this.accordionPanels = Array.from(this.elem.querySelectorAll('.bp-contentPanel'));
  }
  
  /**
   * Update the native input element when the value changes
   */
  @Watch('value')
  protected valueChanged() {
    let newHeightValue = this.getNewHeight();
        this.elem.style.setProperty('height', newHeightValue.toString())
    let thosePanels = this.elem.shadowRoot.querySelectorAll('.bp-contentPanel')

    for (var i = 0; thosePanels[i]; i++) {
      let nodes = thosePanels[i];
      this.convToHTMLElement = (nodes as HTMLElement).style.setProperty('height', newHeightValue.toString());
    }
  }
  
  @Method()
  async currentTab() {
    return this.accordionPanels.findIndex((accordionPanel) => accordionPanel.open);
  }

  @Method()
  openAccordionPanel(accordionPanelIndex: number) {
    if (!this.accordionPanels[accordionPanelIndex].disabled) {
      this.accordionPanels = this.accordionPanels.map((accordionPanel) => {
        accordionPanel.open = false;
        return accordionPanel;
      });
      this.accordionPanels[accordionPanelIndex].open = true;
      this.onChange.emit({ idx: accordionPanelIndex });
    }
  }

  @Method()
  expand(accordionPanelIndex: number) {
    if (!this.accordionPanels[accordionPanelIndex].disabled) {
      // let openPanel: HTMLDivElement = this.accordionPanels[accordionPanelIndex]
      // let divPanel: any =  this.elem.shadowRoot.querySelector('.bp-accordionPanels[role="container"]')
      let openPanel: HTMLDivElement = this.accordionPanels[accordionPanelIndex]
      let divPanel: HTMLDivElement=  openPanel.shadowRoot.querySelector('div[role="accordionPanel"]')
      divPanel.classList.toggle('bp-panels__expander')
      return;
    }
  };

  @Method()
  removeFocus(accordionPanelIndex: number) {
    if (!this.accordionPanels[accordionPanelIndex].disabled) {
      this.accordionPanels = this.accordionPanels.map((accordionPanel) => {
        accordionPanel.blur()
        return accordionPanel
      })
    }
  }
  
    render() {
      return (
        <div class="bp-accordionPanel" role="container" id={this.idx}>
          <div role="panelList" class="bp-accordionPanel">
            <div class="bp-accordion__nav">
              <div class="bp-accordion__headings">
                {this.accordionPanels.map((accordionPanel, i: number) => {
                  const openClass = accordionPanel.open ? 'bp-accordion-heading--active' : '';
                  const typeClass = accordionPanel.type ? `bp-accordion-heading--${accordionPanel.type}` : '';
                  return (
                    <button
                      role="accordionControl"
                      disabled={accordionPanel.disabled}
                      class={`bp-accordionControl-heading ${typeClass} ${openClass}`}
                      onClick={() => this.openAccordionPanel(i)}
                      onMouseOut={() => this.removeFocus(i)} >
                      {accordionPanel.header}
                    </button>
                  );
                })}
              </div>
            </div>
            <slot />
          </div>
          
      </div>
      );
    }
}
