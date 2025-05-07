const gulp = require('gulp');
const connect = require('gulp-connect');

// Task to serve with access to node_modules
gulp.task('serve', function () {
  connect.server({
    root: ['src', 'node_modules'], // Add both folders
    livereload: true,
    port: 8080,
    fallback: 'src/index.html'
  });
});
