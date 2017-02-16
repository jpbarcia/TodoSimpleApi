/**
 * Created by jeanpierre on 11/02/17.
 */

// Gulpfile.js
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const notifier = require('node-notifier');


gulp.task('lint', function () {
    gulp.src('./**/*.js')
        .pipe(jshint())
});

gulp.task('develop', function () {
    let stream = nodemon({
        exec: 'node --harmony-async-await',
        //args:['--harmony-async-await'],
        script: 'index.js',
        ext: 'html js',
        ignore: ['./node_modules'],
        tasks: ['lint']
    });

    stream
        .on('restart', function () {
            console.log('restarted!')
        })
        .on('crash', function() {
            console.error('Application has crashed!\n');
            notifier.notify({
                'title': 'Application has crashed!',
                'message': 'See log/terminal for errors.'
            });
            stream.emit('restart', 10);  // restart the server in 10 seconds
        })
});

gulp.task('default', ['develop']);