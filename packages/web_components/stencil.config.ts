import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'framekit-highlight-code',
  enableCache: false,
  srcDir: 'src',
  globalStyle: 'src/global/app.scss',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ],
  copy: [
    {
      src: 'src/global/*.woff2'
    }
  ],
  plugins: [
    sass(),
    postcss({
      plugins: [autoprefixer()]
    })
  ]
};
