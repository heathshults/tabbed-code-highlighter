import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

export const tab = [
  {
    id: 1,
    header: 'Tab 1',
    class: 'c-tabs[type={`panelList"]',
    state: 'open',
    language: 'html',
    type: 'brand',
    content: `<p>This is the content for tab 1</p>`
  },
  {
    id: 2,
    header: 'Tab 2',
    class: 'c-tabs[type={`panelList"]',
    state: '',
    language: 'JAVASCRIPT',
    type: 'brand',
    content: `<p>This is the content for tab 2</p>`
  },
  {
    id: 3,
    header: 'Tab 3',
    class: 'c-tabs[type={`panelList"]',
    state: '',
    language: 'JAVASCRIPT',
    type: 'brand',
    content: `<p>This is the content for tab 3</p>`
  }
];

export const actions = {
  onClick: action('expand'),
  onMouseOut: action('removeFocus')
};

storiesOf('Tabs', module)
  .add('as MyTabs', () => {
    <div id={`theTabContainer`} class={`c-tabs`}>
      <div role={`tablist`} class={`c-tabs`}>
        <div class={`c-tabs__nav`}>
          <div class={`c-tabs__headings`}>
            {tab.map((tab) =>
              <button language={tab.html} type={tab.brand}  role={`tab`} class={`c-tab-heading c-tab-heading--brand c-tab-heading--active`} state={tab.state} {...actions}>
                {tab.header}
              </button>
            )}
          </div>
          {tab.map((tab) =>
          <div role={`tabpanel`}class={`c-tabs__tab c-tabs__tab--brand`}>
            {tab.content}
          </div>
          )};
        </div>
      </div>
    </div>
  });
