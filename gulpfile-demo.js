var gulp = require('gulp'),
	path = require('path');

var devPath = path.join(__dirname, 'dev'),
	distPath = path.join(__dirname, 'dist'),
	publicPath = path.join(__dirname, 'public'),
	h5Demo = require('./dev/config');



var autoprefixer = require('gulp-autoprefixer'),
	csslint = require('gulp-csslint'),
	stylish = require('csslint-stylish'),
	minifyCss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	minifyHtml = require('gulp-htmlmin'),
	concat = require('gulp-concat'),				 //- 多个文件合并为一个；
	rev = require('gulp-rev'),                         //- 对文件名加MD5后缀
	revCollector = require('gulp-rev-collector'),          //- 路径替换
	gulpSync = require('gulp-sync')(gulp),
	clean = require('gulp-clean');

	var postcss     = require('gulp-postcss');
	var reporter    = require('postcss-reporter');
	var stylelint   = require('stylelint');


	function concatFile(arr1, arr2){
		var ret = [];
		Array.prototype.push.apply(ret, arr1);
		Array.prototype.push.apply(ret, arr2);

		return ret;
	}

	var allcss = concatFile(h5Demo.css, h5Demo.libcss);
	var alljs = concatFile(h5Demo.js, h5Demo.libjs);
	// var allhtml = concatFile([path.join(h5Demo.rev,'**/*.json')], h5Demo.html);

	var allhtml = concatFile(['rev-manifest.json'], h5Demo.html);
	


	gulp.task('copylibjs', function(){
		return gulp.src(h5Demo.libjs)
				.pipe(gulp.dest(path.join(distPath, h5Demo.name, 'js/libs')));
	})

	gulp.task('copylibcss', function(){
		return gulp.src(h5Demo.libjs)
				.pipe(gulp.dest(path.join(distPath, h5Demo.name, 'css/libs')));
	})

	gulp.task('copyimage', function(){
		return gulp.src(path.join(h5Demo.img,h5Demo.name,'**/*'))
				.pipe(gulp.dest(path.join(distPath, h5Demo.name, 'images')))
	})


	gulp.task('csslint', function(){
		// Stylelint config rules
		var stylelintConfig = {
			"rules": {
			  "block-no-empty": true,
			  "color-no-invalid-hex": true,
			  "declaration-colon-space-after": "always",
			  "declaration-colon-space-before": "never",
			  "function-comma-space-after": "always",
			  "function-url-quotes": "double",
			  "media-feature-colon-space-after": "always",
			  "media-feature-colon-space-before": "never",
			  "media-feature-name-no-vendor-prefix": true,
			  "max-empty-lines": 5,
			  "number-leading-zero": "never",
			  "number-no-trailing-zeros": true,
			  "property-no-vendor-prefix": true,
			  "rule-no-duplicate-properties": true,
			  "declaration-block-no-single-line": true,
			  "rule-trailing-semicolon": "always",
			  "selector-list-comma-space-before": "never",
			  "selector-list-comma-newline-after": "always",
			  "selector-no-id": true,
			  "string-quotes": "double",
			  "value-no-vendor-prefix": true
			}
		}

		var processors = [
			stylelint(stylelintConfig),
			// Pretty reporting config
			reporter({
			  clearMessages: true,
			  throwError: true
			})
		];

	  	// return gulp.src(allcss)
	  	// 		.pipe(postcss(processors));


		return gulp.src(allcss)
				.pipe(csslint())//{'shorthand': false,"vendor-prefix": false}
				.pipe(csslint.formatter(stylish))
				.pipe(csslint.formatter('fail'));
	})
		
	gulp.task('jslint', function(){
		return gulp.src(alljs)
				.pipe(jshint({
					undef: false,
					unused: false
				}))
				.pipe(jshint.reporter('default'))  //错误默认提示
				.pipe(jshint.reporter('fail'));
	})

	gulp.task('cssDev', function(){
		return gulp.src(h5Demo.css)
				.pipe(autoprefixer({
					browsers: ['last 2 versions', 'Android >= 4.0'],
					cascade: true,//是否美化属性值 默认：true 像这样：
					remove: true //是否去掉不必要的前缀 默认：true 
				}))
				.pipe(concat('all.css')) //- 合并后的文件名
				.pipe(gulp.dest(path.join(distPath, h5Demo.name,'css')))
				.pipe(rev())	//- 文件名加MD5后缀
				.pipe(gulp.dest(path.join(distPath, h5Demo.name,'css')))
				.pipe(rev.manifest({
					base: path.join(h5Demo.rev),
					merge: true // merge with the existing manifest if one exists
				}))                     //- 生成一个rev-manifest.json
    			.pipe(gulp.dest(h5Demo.rev));                  //- 将 rev-manifest.json 保存到 rev 目录内
	})

	gulp.task('jsDev', function(){
		return gulp.src(h5Demo.js)
				.pipe(concat('all.js')) //- 合并后的文件名
				.pipe(gulp.dest(path.join(distPath, h5Demo.name,'js')))
				.pipe(rev())	//- 文件名加MD5后缀
				.pipe(gulp.dest(path.join(distPath, h5Demo.name,'js')))
				.pipe(rev.manifest({
					base: path.join(h5Demo.rev),
					merge: true // merge with the existing manifest if one exists
				}))                     //- 生成一个rev-manifest.json
    			.pipe(gulp.dest(h5Demo.rev));                  //- 将 rev-manifest.json 保存到 rev 目录内
	})

	gulp.task('htmlDev', function(){
		return gulp.src(allhtml)
				.pipe(revCollector({
			    	replaceReved: true,
		            dirReplacements: {
		                'css': function(f){

		                	console.log(f);

		                	return 'all.css?'+h5Demo.version;
		                	// return f.replace(/-.*\./,'.')+'?v=2017-1-1'
		                },
		                'js':function(f){

		                	console.log(f);

		                	return 'all.js?'+h5Demo.version;
		                	// return f.replace(/-.*\./,'.')+'?v=2017-1-1'
		                },
		            //     'cdn/': function(manifest_value) {
		            //         return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
		            //     }
		            }
			    }))
				.pipe(gulp.dest(path.join(distPath, h5Demo.name)))
	})

	gulp.task('miniCss', function(){
		return gulp.src(h5Demo.css)
				.pipe(concat('all.css')) //- 合并后的文件名
				.pipe(minifyCss())
				.pipe(rev())	//- 文件名加MD5后缀
				.pipe(gulp.dest(path.join(distPath, h5Demo.name,'css')))
				.pipe(rev.manifest({
					base: h5Demo.rev,
					// merge: true // merge with the existing manifest if one exists
				}))                     //- 生成一个rev-manifest.json
    			.pipe(gulp.dest(path.join(h5Demo.rev)));                  //- 将 rev-manifest.json 保存到 rev 目录内
	})

	gulp.task('miniJs', function(){
		return gulp.src(h5Demo.js)
				.pipe(concat('all.js')) //- 合并后的文件名
				.pipe(uglify({
		            // mangle: true,//类型：Boolean 默认：true 是否修改变量名
		            // compress: true,//类型：Boolean 默认：true 是否完全压缩
		            // preserveComments: all //保留所有注释
		        }))
				.pipe(rev())	//- 文件名加MD5后缀
				.pipe(gulp.dest(path.join(distPath, h5Demo.name,'js')))
				.pipe(rev.manifest({
					base: h5Demo.rev,
					// merge: true // merge with the existing manifest if one exists
				}))                     //- 生成一个rev-manifest.json
    			.pipe(gulp.dest(path.join(h5Demo.rev)));                  //- 将 rev-manifest.json 保存到 rev 目录内
	})

	gulp.task('miniHtml', function(){
		return gulp.src(allhtml)
				.pipe(revCollector({
			    	replaceReved: true,
		            // dirReplacements: {
		            //     'css': '/dist/css/',
		            //     'js/': '/dist/js/',
		            //     'cdn/': function(manifest_value) {
		            //         return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
		            //     }
		            // }
			    }))
				.pipe(minifyHtml({
					removeComments: true,//清除HTML注释
			        collapseWhitespace: true,//压缩HTML
			        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
			        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
			        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
			        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
			        minifyJS: true,//压缩页面JS
			        minifyCSS: true//压缩页面CSS
				}))
				.pipe(gulp.dest(path.join(distPath, h5Demo.name)))//
	})


	gulp.task('clean', function(){
		return  gulp.src(distPath)
				.pipe(clean())
	})



gulp.task('dev', gulpSync.async(['copylibjs','copylibcss','copyimage',['cssDev','jsDev','htmlDev']]))//'csslint','jslint',



gulp.task('dist', gulpSync.sync(['clean','copylibjs','copylibcss','copyimage','miniCss','miniJs','miniHtml']))//,'csslint','jslint'


gulp.task('watch',function(){

	gulp.watch(path.join(devPath, 'images', h5Demo.name, '**/*'), ['copyimage'])

	gulp.watch(path.join(devPath, 'css/**/*.css'),[ 'cssDev', 'htmlDev'])//'csslint',

	gulp.watch(path.join(devPath, 'js/**/*.js'),[ 'jsDev', 'htmlDev'])//'jslint',

	gulp.watch(path.join(devPath, 'html', h5Demo.name, '**/*.html'), ['htmlDev'])
})


gulp.task('default', ['dev']);