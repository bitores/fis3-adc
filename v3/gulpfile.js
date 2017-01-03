var path = require("path");
var del = require('del');
var gulp = require('gulp'),
    inject = require('gulp-inject'), // 插入外部js
    assetRev = require('./asset-rev'),
    rev = require('./rev'),
    revCollector = require('./rev-collector'),
    runSequence = require('run-sequence');

var cheerio = require('gulp-cheerio');
var through2 = require('through2');
var domSrc = require('gulp-dom-src');
var concat = require('gulp-concat'); //合并文件
var cssmin = require('gulp-cssmin'),
    htmlmin = require('gulp-htmlmin'),
    inlinesource = require('gulp-inline-source'),
    minifycss = require('gulp-minify-css'), //css压缩 - 过时，use gulp-clean-css 
    uglify = require('gulp-uglify'), //js压缩
    // rename=require('gulp-rename'),   //文件重命名
    // jshint=require('gulp-jshint'),   //js检查
    notify = require('gulp-notify'); //提示

// var config = require('./project.json');
//配置远程路径
// var remotePath = path.join(__dirname,"public",config.name);

// gulp.task('clean', function() {
//   return del([remotePath+'/dist'])
// });

var common_dir = path.join(__dirname, 'dev', 'common');
var dist_dir = path.join(__dirname, 'out', 'common');
var project_dir = path.join(__dirname, "dev", 'face_value');
var out_dir = path.join(__dirname, "out", 'face_value');
var manifest_name = path.join(out_dir, 'manifest.json');


gulp.task('common', function() {
    return gulp.src(common_dir + '/**/*.{js,css}') //该任务针对的文件
        .pipe(gulp.dest(dist_dir)); //编译后的路径
})

gulp.task('preHtml', function() {
    var options = {
        compress: true // 压缩
    };
    return gulp.src(project_dir + '/**/*.html')
        .pipe(inlinesource(options))
        .pipe(gulp.dest(out_dir))
        
});

gulp.task('analyseHtml', function() {






  return gulp.src(out_dir + '/**/*.html')
      // .pipe(gulp.dest(out_dir))
      .pipe(through2.obj(function(file, enc, cb) {
          var that = this;
          console.log('!!!!', file.path); // 文件路径


          // domSrc({ file: path.relative(__dirname, file.path), selector: 'link[ignore=ignore]', attribute: 'href' })
          // // .pipe(gulp.dest(out_dir + '/css'))
          // .on('end', function() {
          //       console.log('5555');
          //       that.push(file);
          //       cb();
          //   })

          // domSrc({ file: path.relative(__dirname, file.path), selector: 'script[ignore=ignore]', attribute: 'src' })
          // .pipe(gulp.dest(out_dir + '/js'))
          // .on('end', function() {
          //       console.log('5555');
          //       that.push(file);
          //       cb();
          //   })





          
          domSrc({ file: path.relative(__dirname, file.path), selector: 'link[ignore!=ignore]', attribute: 'href' })
            // .pipe(through2.obj(function (file, enc, cb) {
            //   console.log('~~',file.relative);
            //   this.push(file)
            //   cb()
            // }))
            .pipe(concat(file.relative + '.min.css'))
            // .pipe(cssmin())
            .pipe(gulp.dest(out_dir + '/css'))
            .on('end', function() {
                console.log('5555');
                that.push(file);
                cb();
            })



            domSrc({ file: path.relative(__dirname, file.path), selector: 'script[ignore!=ignore]', attribute: 'src' })
            // .pipe(through2.obj(function (file, enc, cb) {
            //   console.log('~~',file.relative);
            //   this.push(file)
            //   cb()
            // }))
            .pipe(concat(file.relative + '.min.js'))
            // .pipe(cssmin())
            .pipe(gulp.dest(out_dir + '/js'))
            .on('end', function() {
                console.log('5555');
                that.push(file);
                cb();
            })



        }))
        // .pipe(gulp.dest(out_dir))
        // .pipe(through2.obj(function (file, enc, cb) {
        //       console.log(']]]]',file.relative);
        //       this.push(file)
        //       cb()
        // }))
        // .pipe(inject(gulp.src(out_dir+'/**/*.html'),{relative:true}))
        // .pipe(gulp.dest(out_dir))
});



gulp.task('replaceHtml', function(){
  return gulp.src(out_dir + '/**/*.html')
      .pipe(cheerio(function($,file, next, c) {
          console.log('cheerio',file.relative);

          var count=0;
          for(var i=0, len = $('script[ignore!=ignore]').length; i<len; i++) {
            if($($('script[ignore!=ignore]')[i]).attr('src')) {
              if(count===0){
                
                $($('script[ignore!=ignore]')[i]).replaceWith('<script src="js/'+file.relative+'.min.js"></script>')

              }else{
                
                $($('script[ignore!=ignore]')[i]).remove();
                i--;
              }
              
              count++;
            }else{
              
            }
          }


          var $first = $('link[ignore!=ignore]').first();
          $first.siblings('link[ignore!=ignore]').remove();
          $first.replaceWith('<link rel="stylesheet" href="css/'+file.relative+'.min.css">')  

          next();
      }))
      .pipe(gulp.dest(out_dir));
});



//为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function() {
    return gulp.src(out_dir + '/**/*.css') //该任务针对的文件
        .pipe(assetRev()) //该任务调用的模块
        .pipe(gulp.dest(out_dir)); //编译后的路径
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function() {
    return gulp.src(out_dir + '/**/*.css')
        .pipe(rev()) //文件名加MD5后缀
        .pipe(gulp.dest(out_dir))
        .pipe(rev.manifest(manifest_name, {
            base: out_dir,
            merge: true
        })) //必须有这个方法  生成一个rev-manifest.json
        .pipe(gulp.dest(out_dir)); //将rev-manifest.json 保存到 dist/css 目录内
});

//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function() {
    return gulp.src(out_dir + '/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest(out_dir))
        .pipe(rev.manifest(manifest_name, {
            base: out_dir,
            merge: true
        }))
        .pipe(gulp.dest(out_dir));
});

gulp.task('revImage', function() {
    return gulp.src(project_dir + '/**/*.{png,jpg,jpeg,gif,ico}')
        .pipe(rev())
        .pipe(gulp.dest(out_dir))
        .pipe(rev.manifest(manifest_name, {
            base: out_dir,
            merge: true
        })) //必须有这个方法
        .pipe(gulp.dest(out_dir));
});

//Html替换css、js文件版本

// var uglify = require('gulp-uglify');
// 

gulp.task('revHtml', function() {
    return gulp.src([ manifest_name, out_dir + '/**/*.html'])
        .pipe(revCollector({
            // replaceReved: true,
            //   dirReplacements: {
            //       'css': function(manifest_value) {
            //           console.log('css',manifest_value);
            //           return manifest_value;
            //       },
            //       'js': function(manifest_value) {
            //           console.log('js',manifest_value);
            //           return manifest_value;
            //       },
            //       'img': function(manifest_value) {
            //           console.log('img',manifest_value);
            //           return manifest_value;
            //       }
            //   }
        }))
        .pipe(gulp.dest(out_dir))
        // .pipe(inject(gulp.src(out_dir+'/**/*.html'),{relative:true}))
        // .pipe(gulp.dest(out_dir))
});



gulp.task('domcss', function() {
    return domSrc({ file: 'index.html', selector: 'link', attribute: 'href' })
        .pipe(concat('app.full.min.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('dist/'));
});

gulp.task('domjs', function() {
    return domSrc({ file: 'index.html', selector: 'script', attribute: 'src' })
        .pipe(concat('app.full.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('domhtml', function() {
    return gulp.src('index.html')
        .pipe(cheerio(function($) {
            $('script').remove();
            $('link').remove();
            $('body').append('<script src="app.full.min.js"></script>');
            $('head').append('<link rel="stylesheet" href="app.full.min.css">');
        }))
        .pipe(gulp.dest('dist/'));
});




// assetRev->revCss->revJs->revImage->revHtml







//css处理
gulp.task('minifycss', function() {
    return gulp.src(remotePath + '/css/**/*.css') //设置css
        // .pipe(rename({suffix:'.min'}))         //修改文件名
        .pipe(minifycss({
            advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
                //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        })) //压缩文件
        .pipe(gulp.dest(remotePath + '/css')) //输出文件目录
        .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest(remotePath + '/css')) //设置输出路径
        .pipe(notify({ message: 'css task ok' })); //提示成功
});

//JS处理
gulp.task('minifyjs', function() {
    return gulp.src(remotePath + '/js/**/*.js') //选择合并的JS
        // .pipe(concat('order_query.js'))   //合并js
        .pipe(gulp.dest(remotePath + '/js')) //输出
        // .pipe(rename({suffix:'.min'}))     //重命名
        .pipe(uglify()) //压缩
        .pipe(gulp.dest(remotePath + '/js')) //输出 
        .pipe(notify({ message: "js task ok" })); //提示
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
    gulp.src(remotePath + '/**/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(remotePath));
});


gulp.task('default', ['common'], function(done) {
    // 将你的默认的任务代码放在这
    // gulp.start('clean','minifycss','minifyjs','minihtml');
    // gulp.start('inline')

    // sequence('inline')
    runSequence('preHtml','analyseHtml','replaceHtml','assetRev', 'revCss', 'revJs', 'revImage', 'revHtml', done);
    // runSequence()
});
