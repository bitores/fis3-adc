# fis3-adc


####使用方法


>fis3-adc

>npm install

>fis3 release dev -d .


#### 功能描述

1、可配置

2、小文件（js/css）合并

3、样式在前、脚本在后

4、内嵌脚本、样式整合

5、通过 __inline 实现小图片的 base64 内嵌

6、可实现 md5 与 发布版本号


#### 开发指令

> fis3 server start [-p 8080]

	eg.启动本地 Web Server,浏览器自动打开 http://127.0.0.1:8080

> fis3 server open

	eg.构建时不指定输出目录，构建结果被发送到内置 Web Server 的根目录下。此目录可以通过执行以下命令打开。


> fis3 server clean

	eg. 消除

> fis3 release [-d path] [media] [-wL]

	eg. 构建发布到项目目录的 output 目录下, fis-config.js内release路径也是相对于 -d 路径

		fis3 release -d ./output


	eg. 先定义

		fis3 release debug

	eg. 添加 -wL 参数时，文件监听且浏览器能自动刷新,  CTRL+C 程序才会终止

> fis.match(selector, props);


> 开启将零散资源进行自动打包
  
  注： 使用时注意： html 内 script | style 
  eg. fis3-postpackager-loader   

  {
    obtainScript: true, //是否收集 <script> 内容
    obtainStyle: true, // 是否收集 <style> 和 <link>内容
    allInOne: {// 默认 false, 配置是否合并零碎资源

        js: function(file) {
          return 'dist/'+config.name+'/js/all.js';
        },
        css: function(file) {
          return 'dist/'+config.name+'/css/all.css';
        },
        includeAsyncs: true
      }
    })
  }



#### 基本属性

```
release : 设置文件的产出路径。默认是文件相对项目根目录的路径，以 / 开头。该值可以设置为 false ，表示为不产出（unreleasable）文件。
packTo  : 文件将会合并到这个属性配置的文件中
packOrder:用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。默认 0
query	：指定文件的资源定位路径之后的query，比如'?t=123124132'。
id
url
charset
isHtmlLike：对文件进行 html 相关语言能力处理
isCssLike：对文件进行 css 相关语言能力处理
isJsLike：对文件进行 js 相关语言能力处理
useHash:文件是否携带 md5 戳
domain:
rExt：设置最终文件产出后的后缀
useMap：文件信息是否添加到 map.json
isMod：标示文件是否为组件化文件。
extras
requires：添加依赖文件id列表
useSameNameRequire
useCache：是否使用编译缓存
```

#### 插件属性

```
lint：启用 lint 插件
parser：启用 parser 插件
preprocessor：标准化前处理
standard：
postprocessor：
optimizer：
```

#### 特殊匹配
1、::package 用来匹配 fis 打包过程
2、::text 用来匹配 默认后缀 的文本文件
3、::image 用来匹配 默认后缀 的图片的文件。
4、:js|:css|:scss|inline-style 用来匹配html中 内嵌 js|css|scss|行内样式部分


#### [资源可相互内嵌(?__inline)](http://www.jianshu.com/p/fdb7bf974fcf)

0、demo.html?__inline （<link rel="import" href="demo.html?__inline">）
1、demo.css?__inline
2、demo.js?__inline
3、logo.gif?__inline

4、__inline('demo.js');
5、__inline('a.css');
6、__inline('images/logo.gif');

7、@import url('demo.css?__inline');
8、background: url(images/logo.gif?__inline);


#### [::package使用要注意]()

*前端不能加限制路径*
  
  eg. fis.match('dev/::package')

```
fis.match('::package', {
  postpackager: fis.plugin('loader')
});
```

#### Code

```
1、规则会覆盖前面的，不让覆盖，可输入第三个参数  !important
2、匹配规则 * | **/* | {a,b}.{jpg,png,js,css}  | /^\/a\/(.*\.js$)/i
3、widget/{*.js,**/*.js} <==> widget/**.js
4、匹配结果 $0 ...
5、定义变量 fis.set(key, value), 使用 ${key}
6、



fis.set('new date', Date.now());
fis.match('*.js', {
  query: '?=t' + fis.get('new date')
});


fis.match('*.js', {
  useHash: false
});

fis.match('*.css', {
  useHash: false
});

fis.match('*.png', {
  useHash: false
});

fis.match('/widget/{*,**/*}.js', {
	isMod: true,
	release: '/static/$0'
});


fis.match('{a,b,c}.js', {
    optimizer: fis.plugin('uglify-js')
});


// 加 md5
fis.match('*.{js,css,png}', {
  useHash: true
});

// :js | :css | ::text | ::image | ::package

// 压缩 index.html 内联的 js
fis.match('index.html:js', {
  optimizer: fis.plugin('uglify-js')
});

// 压缩 index.tpl 内联的 js
fis.match('index.tpl:js', {
  optimizer: fis.plugin('uglify-js')
})



// 清除其他配置，只保留如下配置
fis.match('*.js', {
  // fis-optimizer-uglify-js 插件进行压缩，已内置
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  // fis-optimizer-clean-css 插件进行压缩，已内置
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

// A
fis.match('*', {
  release: '/dist/$0'
});

// B
fis.match('test.js', {
  useHash: true,
  release: '/dist/js/$0'
})


fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
})


fis.match('*.{less,css}', {
  packTo: '/static/aio.css'
});

// FIS 中前端模板推荐预编译为 js，所以应该使用 js 的内置语法
fis.match('*.tmpl', {
  isJsLike: true
});
fis.match('*.sass', {
  isCssLike: true
});
fis.match('*.xxhtml', {
  isHtmlLike: true
})


fis.match('*.es6', {
  parser: fis.plugin('babel'),
  rExt: '.js' // 代码编译产出时，后缀改成 .js
});

fis.media('debug').match('*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})
```

#### [内嵌插件](http://fis.baidu.com/fis3/docs/api/config-system-plugin.html)

  fis-optimizer-clean-css
  fis-optimizer-png-compressor
  fis-optimizer-uglify-js
  fis-spriter-csssprites
  fis3-deploy-local-deliver
  fis3-deploy-http-push
  fis3-hook-components
  fis3-packager-map


##### 第三方插件

> 支持 es6、es7 或者 jsx 编译成 es5

*[fis-parser-babel-5.x](https://github.com/fex-team/fis-parser-babel-5.x)*

> 支持 typescript、es6 或者 jsx 编译成 js。速度相比 babel 略快，但是 es7 跟进较慢。

*[fis3-parser-typescript](https://github.com/fex-team/fis3-parser-typescript)*

>支持 less 编译成 css

*[fis-parser-less-2.x](https://github.com/fouber/fis-parser-less-2.x)*

>支持 sass/scss 编译成 css

*[fis-parser-node-sass](https://github.com/fex-team/fis-parser-node-sass)*

>一款强大的代码块预处理工具。比如加上如下配置，在 debug 注释中的代码，在正式环境下自动移除。

*[fis-parser-jdists](https://github.com/fex-team/fis-parser-jdists)*

>支持 jade 编译成 html

*[fis-parser-jade](https://github.com/ssddi456/fis-parser-jade)*

>零散资源打包

*[fis-postpackager-simple](https://github.com/hefangshi/fis-postpackager-simple)*

*cnpm install fis3-deploy-offline-pack*http路径变成了本地的文件路径



#### 其它脚手架

[基于fis3-arrow(fisa)的多业务模块化脚手架](https://github.com/zuojj/fis3-arrow-scaffold)

[基于fis3的PC端纯静态解决方案](https://github.com/fancyboynet/fis3-www-demo)

[]()

[]()

[]()

[]()
