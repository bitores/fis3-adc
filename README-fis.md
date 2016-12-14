__ RESOURCE_MAP__
#项目

#### 写法注意项

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

#### 功能描述

1、css/js/html有压缩，内嵌style、script有压缩

2、超过 2 个的小文件（js/css）会合并 all.js,all.css

3、自动将 样式放在header中、脚本放在 body 内后页

4、脚本、样式文件可通过 __inline 内嵌在页面中

5、图片可通过 __inline 实现 base64 内嵌

6、每次打包，自动添加版本时间戳，css,js每次打包时间戳都不一样，图片有修改后时间戳会更改

7、打包后的文件在 public 目录，common 内的文件合移植

8、html 页面内的script 引入 common 内的 js / css 会按需 自动打包合并到 所属项目 目录中


#### 使用

*开发*

> npm start 文件监听且浏览器能自动刷新

> npm run stop 关闭 测试服务

> npm run public  打包发布到 public
