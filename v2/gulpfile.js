var path = require("path");
var del = require('del');
var gulp = require('gulp'),
	htmlmin = require('gulp-htmlmin'),
	minifycss=require('gulp-minify-css'),   //css压缩
  autoprefixer = require('gulp-autoprefixer'),
    // concat=require('gulp-concat'),   //合并文件
    uglify=require('gulp-uglify'),   //js压缩
    // rename=require('gulp-rename'),   //文件重命名
    // jshint=require('gulp-jshint'),   //js检查
    notify=require('gulp-notify');   //提示

var config = require('./project.json');
//配置远程路径
var remotePath = path.join(__dirname,"public",config.name);

gulp.task('clean', function() {
  return del([remotePath+'/dist'])
});


//css处理
gulp.task('minifycss',function(){
   return gulp.src(remotePath+'/css/**/*.css')      //设置css
       // .pipe(rename({suffix:'.min'}))         //修改文件名
       .pipe(minifycss({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))                    //压缩文件
       .pipe(gulp.dest(remotePath+'/css'))            //输出文件目录
       .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: true, //是否美化属性值 默认：true
            remove:true //是否去掉不必要的前缀 默认：true
        }))
       .pipe(gulp.dest(remotePath+'/css'))           //设置输出路径
       .pipe(notify({message:'css task ok'}));   //提示成功
});

//JS处理
gulp.task('minifyjs',function(){
   return gulp.src(remotePath+'/js/**/*.js')  //选择合并的JS
       // .pipe(concat('order_query.js'))   //合并js
       .pipe(gulp.dest(remotePath+'/js'))         //输出
       // .pipe(rename({suffix:'.min'}))     //重命名
       .pipe(uglify())                    //压缩
       .pipe(gulp.dest(remotePath+'/js'))            //输出 
       .pipe(notify({message:"js task ok"}));    //提示
});

gulp.task('minihtml', function() {
    var options = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    };
    gulp.src(remotePath+'/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(remotePath));
});


gulp.task('default', function() {
  // 将你的默认的任务代码放在这
  gulp.start('clean','minifycss','minifyjs','minihtml');
});