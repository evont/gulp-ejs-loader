const gulp = require('gulp');
const ejsLoader = require('../index');

gulp.task('default', () => {
  gulp.src('./views/pages/**/*.ejs')
      .pipe(ejsLoader({
        layout: './views/layout.ejs',
        babelOption: {
          presets: ['@babel/env']
        }
      }))
      .pipe(gulp.dest('./dist/pages/'));
})