const gulp = require("gulp");
const postcssSCSS = require("postcss-scss");
const concatCss = require("gulp-concat-css");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const postcssCustomProperties = require("postcss-custom-properties");
const serve = require("gulp-serve");
const svgo = require("gulp-svgo");
const del = require("del");
const postcssInlineSVG = require("postcss-inline-svg");

function defaultTask(cb) {
    cb();
    gulp.watch("src/*.*", gulp.series(["build"]));
}

function clean(cb) {
    return del(["./docs/images/*.*", "./docs/*.css"], cb);
}

function css(cb) {
    const options = { parser: postcssSCSS };
    const plugins = [
        require("postcss-nested"),
        postcssCustomProperties({
            importFrom: "./src/variables.css",
            preserve: false,
        }),
        postcssInlineSVG({
            encode: encodeURIComponent,
        }),
        require("postcss-flexbugs-fixes"),
        require("postcss-preset-env")({
            autoprefixer: {
                flexbox: "no-2009",
            },
            stage: 3,
        }),
    ];

    return gulp
        .src("./src/**/*.css")
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins, options))
        .pipe(concatCss("./bcs.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./docs/"));
}

function images(cb) {
    return gulp.src("./src/images/**/*.*").pipe(gulp.dest("docs/images"));
}

function serveTask(cb) {
    return new Promise(
        serve({
            root: ["docs"],
            port: 3030,
        })
    );
}

module.exports = {
    serve: gulp.series(clean, gulp.parallel(css, images), serveTask),
    build: gulp.series(clean, gulp.parallel(css, images)),
    default: defaultTask,
};
