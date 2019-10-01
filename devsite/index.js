require('@babel/core').transform('code', {
  plugins: ['dynamic-import-node']
});

import * as path from 'path'
// import './dist/js/framekit'
import p from './tasks/paths'

let exec = require('child_process').exec;

(cb) => 
  exec('babel --plugins dynamic-import-node ./gulpfile start', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
 
    exec('gulp fk:release', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    })
    cb()
  })

let approot = path.resolve(__dirname, 'tasks/setup/require-plugins-all.js')
let x = approot

console.log(x)