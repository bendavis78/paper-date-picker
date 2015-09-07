'use strict';

var gulp = require('gulp');
var add = require('gulp-add');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var ghPages = require('gulp-gh-pages');
var bower = require('gulp-bower');
var fs = require('fs');
var vinylPaths = require('vinyl-paths');
var execSync = require('child_process').execSync;
var merge = require('merge-stream');
var copy = require('gulp-copy');
var bump = require('gulp-bump');
var tagVersion = require('gulp-tag-version');
var git = require('gulp-git');
var filter = require('gulp-filter');

function getPackage() {
  return JSON.parse(fs.readFileSync('bower.json', 'utf8')); 
}

function getBowerConfig() {
  if (fs.existsSync('.bowerrc')) {
    return JSON.parse(fs.readFileSync('.bowerrc', 'utf8'));
  }
  return {dir: 'bower_components'};
}

function gitFiles() {
  return execSync('git ls-files').toString().split('\n');
}

var bowerDir = getBowerConfig().dir;

gulp.task('clean', function() {
  return gulp.src([bowerDir, '.publish', '.tmp'])
    .pipe(vinylPaths(del));
});

gulp.task('bower', function() {
  return bower(bowerDir);
});

gulp.task('bower:reload', ['bower'], reload);

var redirect = function(from, to) {
  return function(req, res, next) {
    if (from === req.url) {
      res.writeHead(301, {
        'Location': to,
        'Cache-Control': 'cache-control: private, max-age=0, no-cache'
      });
      res.end();
    }
    next();
  };
};

function _bump(type) {
  return gulp.src(['bower.json', 'package.json'])
    .pipe(bump({type: type}))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('version bump'))
    .pipe(filter('package.json'))
    .pipe(tagVersion({prefix: ''}));
}
gulp.task('release', _bump.bind(null, 'patch'));
gulp.task('release:minor', _bump.bind(null, 'minor'));
gulp.task('release:major', _bump.bind(null, 'major'));

// Watch Files For Changes & Reload
gulp.task('serve', ['bower'], function () {
  var pkgRoot = '/' + getPackage().name;
  var opts = {
    notify: false,
    snippetOptions: {
      rule: {
        match: /<\/body>/i,
        fn: function(snippet, match) {
          return snippet + match;
        }
      }
    },
    server: {
      baseDir: bowerDir,
      middleware: [redirect('/', pkgRoot + '/demo')],
      routes: {}
    }
  };
  opts.server.routes[pkgRoot] = '.';
  browserSync.init(opts);

  gulp.watch(['**/*.html']).on('change', reload);
  gulp.watch(['**/*.css']).on('change', reload);
  gulp.watch(['bower.json']).on('change', 'bower:reload');
});

gulp.task('gh-pages', function() {
  var pkgName = getPackage().name;
  return merge(
    gulp.src(gitFiles())
      .pipe(copy('.tmp/' + pkgName)),
    bower('.tmp')
      .pipe(add(
        'index.html',
        '<meta http-equev="refresh" content="0;URL=' + pkgName + '/">'
      ))
    ).pipe(ghPages()).on('end', function() {
      del(['.tmp', '.publish']);
    });
});


// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
require('web-component-tester').gulp.init(gulp);
