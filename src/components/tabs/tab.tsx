import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'fk-tab',
  styleUrl: '../../global/app.scss',
  shadow: true
})

export class FkTab {
  @Prop() header: string;
  @Prop() disabled: boolean;
  @Prop() open: boolean;
  @Prop() type: string;

  render() {
    const typeClass = this.type ? `c-tabs__tab--${this.type}` : '';

    return (
      <div role="tabpanel" hidden={!this.open} class={`c-tabs__tab ${typeClass}`}>
        <slot />
      </div>
    );
  }
}
