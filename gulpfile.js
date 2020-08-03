const gulp = require("gulp");
const postcssSCSS = require("postcss-scss");
const concatCss = require("gulp-concat-css");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const postcssCustomProperties = require("postcss-custom-properties");

function defaultTask(cb) {
    // cb();

    const plugins = [
        require("postcss-nested"),
        require("postcss-flexbugs-fixes"),
        postcssCustomProperties({
            importFrom: "./src/variables.css",
            preserve: false,
        }),
        require("postcss-preset-env")({
            autoprefixer: {
                flexbox: "no-2009",
            },
            stage: 3,
        }),
    ];

    const options = { parser: postcssSCSS };

    return gulp
        .src("./src/**/*.css")
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins, options))
        .pipe(concatCss("./bcs.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./build/"));
}

exports.default = defaultTask;
