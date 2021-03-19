var { src, dest } = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
exports.default = function () {
    return src('./src/1.js')
        .pipe(babel())
        .pipe(src('./src/2.js'))
        .pipe(uglify())
        .pipe(dest('./dist/uglify'))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('dist/min'));
}
function test(file) {
    return console.log(file);
}