import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import FKTabs from './tabs';

export const tab = {
  id: '1',
  title: 'Test Tabs',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
  language: 'html',
  type: 'brand',
  header: 'HTML',
  open: ''
};

export const actions = {
  onClick: action('openTab'),
  onClick: action('expand'),
  onMouseOut: action('removeFocus')
};

storiesOf('Tabs', module)
  .add('default', () => <fk-tabs class={`c-tabs-container`} height={`300`} width={`100%`} {...actions} >
    <fk-tab language={`html`} type={`brand`} header={`HTML`} ><fk-highlight-code language={`markup`}><code slot={`code`}><spanT type={`tedt/plain`} class={`language-markup`}><p>Hello</p></spanT></code></fk-highlight-code></fk-tab>
    <fk-tab language={`html`} type={`brand`} header={`CODE`} ><fk-highlight-code language={`markup`}><code slot={`code`}><spanT type={`tedt/plain`} class={`language-markup`}><p>Hello</p></spanT></code></fk-highlight-code></fk-tab>
    <fk-tab language={`html`} type={`brand`} header={`YAML`} open><fk-highlight-code language={`markup`}><code slot={`code`}><span type={`tedt/plain`} class={`language-markup`}><p>Hello</p></span></code></fk-highlight-code></fk-tab></fk-tabs>
  )
  .add('onClick', () => <fk-tabs class={`c-tabs-container`} height={`300`} width={`100%`} {...actions} >
  <fk-tab language={`html`} type={`brand`} header={`HTML`} ><fk-highlight-code language={`markup`}><code slot={`code`}><spanT type={`tedt/plain`} class={`language-markup`}><p>Hello</p></spanT></code></fk-highlight-code></fk-tab>
  <fk-tab language={`html`} type={`brand`} header={`CODE`} ><fk-highlight-code language={`markup`}><code slot={`code`}><spanT type={`tedt/plain`} class={`language-markup`}><p>Hello</p></spanT></code></fk-highlight-code></fk-tab>
  <fk-tab language={`html`} type={`brand`} header={`YAML`} open><fk-highlight-code language={`markup`}><code slot={`code`}><span type={`tedt/plain`} class={`language-markup`}><p>Hello</p></span></code></fk-highlight-code></fk-tab></fk-tabs>)
  .add('onMouseOut', () => <fk-tabs class={`c-tabs-container`} height={`300`} width={`100%`} {...actions} >
  <fk-tab language={`html`} type={`brand`} header={`HTML`} ><fk-highlight-code language={`markup`}><code slot={`code`}><spanT type={`tedt/plain`} class={`language-markup`}><p>Hello</p></spanT></code></fk-highlight-code></fk-tab>
  <fk-tab language={`html`} type={`brand`} header={`CODE`} ><fk-highlight-code language={`markup`}><code slot={`code`}><spanT type={`tedt/plain`} class={`language-markup`}><p>Hello</p></spanT></code></fk-highlight-code></fk-tab>
  <fk-tab language={`html`} type={`brand`} header={`YAML`} open><fk-highlight-code language={`markup`}><code slot={`code`}><span type={`tedt/plain`} class={`language-markup`}><p>Hello</p></span></code></fk-highlight-code></fk-tab></fk-tabs>);

