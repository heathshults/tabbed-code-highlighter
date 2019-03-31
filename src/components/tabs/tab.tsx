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
  @Prop({ reflectToAttr: true, mutable: true}) width?: string = '100%';
  @Prop({ reflectToAttr: true, mutable: true }) height?: string = '400px';
  @Prop({ reflectToAttr: true, mutable: true }) class?: string = 'c-tabs__expander';

  render() {
    const typeClass = this.type ? `c-tabs__tab--${this.type}` : '';

    return (
      <div role="tabpanel" hidden={!this.open} class={`c-tabs__tab c-tabs__expander ${typeClass}`}>
        <slot />
      </div>
    );
  }
}
