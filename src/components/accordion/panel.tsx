import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'bpds-accordion-panel',
  styleUrl: '../../global/app.scss',
  shadow: true
})

export class AccordionPanel {
  @Prop() header: string;
  @Prop() disabled: boolean;
  @Prop() open: boolean;
  @Prop() type: string;

  render() {
    const typeClass = this.type ? `bp-accordion__panel--${this.type}` : '';

    return (
      <div role="accordionPanel" hidden={!this.open} class={`bp-accordion__panel ${typeClass}`}>
        <slot />
      </div>
    );
  }
}
