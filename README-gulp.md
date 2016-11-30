# b2b/H5

### 运行

1、npm install 			安装依赖包

2、在 dev 目录下，新建文件 并进行开发

3、gulp 				开发编译项目


###需求描述

1、多文件合并

2、自动添加版本号



###功能描述

*自定义公共文件的合并*

*第三方插件自动拷贝*

*js/css/html文件压缩【可去注释】*

*发布时版本号自动添【可自定义版本号格式】*



### 编译流程

*dev*  ——开发测试——> *dist*  ——发布——> *public*


#### dev 开发目录

	│  config.json   				项目配置文件
	│
	├─css
	│  ├─common
	│  │  │  base.css 				基础 css 文件
	│  │  │
	│  │  └─libs
	│  │          lib.css 			第三方 css 文件
	│  │
	│  └─demo1
	│          demo1.css 			项目自定义 样式
	│
	├─html
	│  ├─common
	│  │      index.html      		项目 模板 文件
	│  │
	│  └─demo1  					demo1 项目文件 目录
	│          dem.html  			项目中页面
	│          index.html 			项目中页面
	│
	├─images
	│  └─demo1 						demo1项目中用到 图片 目录
	└─js
	    ├─common 					常用 js 文件
	    │  │  ajax.js
	    │  │  common.js
	    │  │  Toast.js
	    │  │
	    │  └─libs 					第三方 js 插件
	    │          zepto.min.js
	    │
	    └─demo1 					demo1 项目 js 文件目录

#### config.json 配置文件

	{
		"rev":"dist/rev",						不配置
		"img":"dev/images", 					不配置
		"libcss":[	
			"插件css路径"						 可配
		],
		"libjs":[
			"插件js路径"						 可配
		],
		"css":[									可配
			"dev/css/common/base.css",
			"其它css路径"
		],
		"js":[
			"dev/js/common/common.js",
			"dev/js/common/ajax.js",
			"dev/js/common/Toast.js",


			"其它js路径"
		],
		"html":[

			"其它html文件路径"
		],

		"name": "项目名称",

		"version": "文件后缀" 				eg."v=2016-22-34"
	}