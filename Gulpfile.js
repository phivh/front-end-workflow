//-------------------------------------
// Require Plugin
//-------------------------------------

var gulp            =   require( 'gulp' ),
    sass            =   require( 'gulp-sass' ),
    concat          =   require( 'gulp-concat' ),
    plumber         =   require( 'gulp-plumber' ),
    htmltidy        =   require( 'gulp-htmltidy' ),
    uglify          =   require( 'gulp-uglify' ),
    sourcemaps      =   require( 'gulp-sourcemaps' ),
    jslint          =   require( 'gulp-jslint' ),
    autoprefixer    =   require( 'gulp-autoprefixer' ),
    imagemin        =   require( 'gulp-imagemin' ),
    pngquant        =   require( 'imagemin-pngquant' ),
    browserSync     =   require( 'browser-sync' );


//-------------------------------------
// DECLARE
//-------------------------------------

var src =  {
    html    : 'src/**/*.html',
    scss    : 'src/scss/**/*.scss',
    js      : 'src/js/**/*.js',
    img     : 'src/img/**/*'
}

var output = {
    css     :   'dist/css/',
    js      :   'dist/js/',
    img     :   'dist/images/',
    html    :   'dist/',
    min_css :   'style.min.css',
    min_js  :   'script.min.js'
}

var htmlOption = {
    doctype: 'html5', 
    hideComments: false,
    indent: true,
    dropEmptyElements: false // Keep Elements empty content
}

var sassOption = { 
    outputStyle : 'compressed',
    precision   : 10
}

var syncOption = { 
    stream : true
}

var prefixVersion = { 
    browsers :  ['> 1%', 'last 2 versions', 'Firefox ESR']
}

var onError = function(err) {
    console.log(err);
    this.emit('end');
}
//-------------------------------------
// TASK: Html Compile
//-------------------------------------

gulp.task( 'html', function(){
    return gulp.src(src.html)
        .pipe(htmltidy(htmlOption))
        .pipe(gulp.dest(output.html))
        .pipe(browserSync.reload(syncOption));
});

//-------------------------------------
// TASK: Style Compile
//-------------------------------------


gulp.task( 'style', function() {
    return gulp.src(src.scss)
        .pipe(plumber({
            errorHandler : onError
        }))
        .pipe(sourcemaps.init())
        .pipe(sass.sync(sassOption).on('error',sass.logError))
        .pipe(autoprefixer(prefixVersion))
        .pipe(concat(output.min_css))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.css))
        .pipe(browserSync.reload(syncOption));
});

//-------------------------------------
// TASK: Javascript Compile
//-------------------------------------


gulp.task( 'js', function() {
    return gulp.src(src.js)
        .pipe(plumber({
            errorHandler : onError
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(output.min_js))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.js))
        .pipe(browserSync.reload(syncOption));
});

//-------------------------------------
// TASK: Image Optimize
//-------------------------------------

gulp.task('image',function(){
    return gulp.src(src.img)
        .pipe(imagemin({
            progressive : true,
            svgoPlugins : [ { removeViewBox :  false } ],
            use         : [pngquant()]
        }))
        .pipe(gulp.dest(output.img));
});

//-------------------------------------
// TASK: Watch
//-------------------------------------

gulp.task('watch',function() {
    browserSync.init({
        server : {
            baseDir : './dist'
        },
        open: false
    });
    gulp.watch(src.html, ['html']);
    gulp.watch(src.scss, ['style']);
    gulp.watch(src.js,   ['js']);
    gulp.watch(src.img,  ['image']);
});

//-------------------------------------
// TASK: Default
//-------------------------------------

gulp.task('default',['watch', 'html', 'style', 'js', 'image']);