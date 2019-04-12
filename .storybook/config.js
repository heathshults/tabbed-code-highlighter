import React from 'react';
import { configure, addDecorator } from '@storybook/react';

addDecorator(storyFn => <div style={{ textAlign: 'center' }}>{storyFn()}</div>);
import requireContext from 'require-context.macro';
import '../src/components/tasks/tasks.css';

// automatically import all files ending in *.stories.js
const req = requireContext('../src/components/', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
