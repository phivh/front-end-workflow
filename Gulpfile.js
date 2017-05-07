//-------------------------------------
// Require Plugin
//-------------------------------------

var gulp            =   require( 'gulp' ),
    sass            =   require( 'gulp-sass' ),
    concat          =   require( 'gulp-concat' ),
    plumber         =   require( 'gulp-plumber' ),
    minifyCss       =   require( 'gulp-minify-css' ),
    uglify          =   require( 'gulp-uglify' ),
    sourcemaps      =   require( 'gulp-sourcemaps' ),
    jslint          =   require( 'gulp-jslint' ),
    autoprefixer    =   require( 'gulp-autoprefixer' ),
    imagemin        =   require( 'gulp-imagemin' ),
    pngquant        =   require( 'gulp-pngquant' ),
    browserSync     =   require( 'browser-sync' );


//-------------------------------------
// DECLARE
//-------------------------------------

var src =  {
    scss    : './src/scss/**/*.scss',
    js      : './src/js/**/*.js',
    img     : './src/img/*'
}

var output = {
    css     :   'dist/css/',
    js      :   'dist/js/',
    img     :   'dist/images/',
    html    :   'dist/**.html',
    min_css :   'style.min.css',
    min_js  :   'script.min.js'
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
            use         : [pngquant]
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
        }
    });
    gulp.watch(src.scss, ['style']);
    gulp.watch(src.js, ['js']);
    gulp.watch(src.img, ['image']);
    gulp.watch(output.html).on('change',browserSync.reload);
});

//-------------------------------------
// TASK: Default
//-------------------------------------

gulp.task('default',['watch', 'style', 'js', 'image']);