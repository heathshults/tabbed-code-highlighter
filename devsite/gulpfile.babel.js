// require('@babel/register')({ presets: [ '@babel/preset-env' ] }),
// require('@babel/core').transform('code', { plugins: ['dynamic-const-node'] });

const path = require('path'),
  fs = require('fs'),
  gulp = require('gulp'),
  p = require('./tasks/setup/setup-paths'),
  fn = require('./tasks/functions/setup-functions'),
  $ = require('gulp-load-plugins'),
  c = require('./tasks/setup/setup-configuration'),
  runSequence = require('run-sequence').use(gulp),
  $$ = require('gulp-load-plugins')();

// ====== REQUIRE TASK DIRECTORY ======>
const requireDir = require('require-dir')
if (c.length) { console.log('has length')}
const dirTasks = requireDir('./tasks', { noCache: true, extensions: ['.js'], recurse: true,
  filter: function (fullPath) { return process.env.NODE_ENV !== 'production' && !fullPath.match(/$setup-/); }
});

// ====== CONFIGS AND ON PAGE TASKS ======>

// ====== CSS COMPILE ZONE ======>
const FKOptions = {
  lintSCSS: false,
  prefixCSS: true,
  srceMaps: true,
  minifyCSS: true,
  logFiles: true }
module.exports = FKOptions

gulp.task('fkCSS', function(callback) {
  runSequence(
    'fkCSS:clean',
    'fkSASS:lint',
    'fkCSS:compile',
    'fkCSS:minify',
    // 'fkCSS:prefix',
    'fkCSS:bannerize:map',
    'copy:distCSS-to-build',
    callback
  );
});








// ===== FUTURE CODE ======>
/**
 // gulp 4 only: const HubRegistry from 'gulp-hub'
// ./node_modules/.bin/babel-node --plugins dynamic-const-node  ./node_modules/.bin/gulp default --gulpfile ./gulpfile.babel.js
// gulp.task('cleanDist', getTask(cleanDist)); 
*/

/** gulp 4 only
 * // load tasks & use tasks 
 * let hub = new HubRegistry(['./tasks/*.js', '!./tasks/setup/globglob/glob.js']);
 * gulp.re gistry(hub);
**/

// gulp.task('default', ['scripts', 'sass'], function () {
//   gulp.watch('src/js/**/*.js', ['scripts']);
//   gulp.watch('src/sass/**/*.{sass,scss}', ['sass']);
// });