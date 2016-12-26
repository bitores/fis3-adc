__ RESOURCE_MAP__
#项目

#### 写法注意项

+ js引用写法

```
<script src="../common/js/libs/zepto.min.js"></script><!--ignore-->
<script src="../common/js/ajax.js"></script>
<script>
  function aa(){

  }
</script>
<script src="../common/js/common.js"></script>
<script src="../common/js/Toast.js"></script>
```

```
<script src="../common/js/libs/zepto.min.js"></script><!--ignore-->
<script src="../common/js/ajax.js"></script>
<script src="../common/js/common.js"></script>
<script src="../common/js/Toast.js"></script>
<script>
  function aa(){

  }
</script>
```

+ css文件中 注释 使用 多行注释




#### 功能描述

1、css/js/html有压缩，内嵌style、script有压缩

2、html中 超过 2 个的 js/css 文件会合并为一个文件(通过<!--ignore-->可忽略合并)

3、自动将 样式放在header中、脚本放在 body 内后页

4、脚本、样式文件、图片可通过 __inline 内嵌在页面中

5、每次打包，自动添加版本时间戳




#### 使用

*安装*
> npm run install 安装必要的依赖

*开发*

> npm start 文件监听且浏览器能自动刷新

> npm run stop 关闭 测试服务

> npm run dev 打包 未压缩 到 public

> npm run public  打包 并 压缩 发布到 public



#### 目录

	dev --------------开发目录
	├─common-----------------------------公共目录
	│  ├─css
	│  │  └─libs---------------第三方
	│  └─js
	│      └─libs
	│          └─qiniu
	├─face_value-------------------------项目1
	│  ├─css
	│  ├─images
	│  └─js
	└─invite_reg-------------------------项目2
	    ├─css
	    ├─images
	    └─js



#### 说明：

> 版本号

》 md5: gulp-make-css-url-version




> [gulp-rev + gulp-rev-collector](https://coding.net/u/givebest/p/gulp-automatic-add-version/git) 

	分别安装gulp-rev、gulp-rev-collerctor

	npm install --save-dev gulp-rev 
	npm install --save-dev gulp-rev-collector
	打开 node_modules\gulp-rev\index.js

	第133行 manifest[originalFile] = revisionedFile; 
	更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;

	打开 nodemodules\gulp-rev\nodemodules\rev-path\index.js

	10行 return filename + '-' + hash + ext; 
	更新为: return filename + ext;

	打开 node_modules\gulp-rev-collector\index.js

	31行 if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) { 
	更新为: if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {

	配置gulpfile.js, 可参考下面 gulpfile.js 代码

	结果达到预期，如下：

	Css

	 background: url('../img/one.jpg?v=28bd4f6d18');
	 src: url('/fonts/icomoon.eot?v=921bbb6f59');
	Html

	 href="css/main.css?v=885e0e1815"
	 src="js/main.js?v=10ba7be289"
	 src="img/one.jpg?v=28bd4f6d18"