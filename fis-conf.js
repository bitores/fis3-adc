var config = require('./config.json');
fis.set('pro_name', config.name);


fis.set('t_version', new Date().getTime());
fis.set('dev_path', 'dev');
fis.set('public_path', 'public');
fis.set('common', 'common');





var fs = require('fs');

var rootFile = fis.get('public_path')+'/'+fis.get('pro_name');
function deleteFolder(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
                console.log('del dir '+curPath+' success');
            } else { // delete file
                fs.unlinkSync(curPath);

                console.log("del file "+curPath+'/'+file+" success");
            }
        });
        fs.rmdirSync(path);
    }
};

deleteFolder(rootFile);


fis.match('*.less', {
  // fis-parser-less 插件进行解析
  parser: fis.plugin('less'),
  // .less 文件后缀构建后被改成 .css 文件
  rExt: '.css'
})


// 禁止多项目 
fis.match('${public_path}/**.html', {
  release: false
})

fis.match('${public_path}/${common}/**', {
  release: true
})

fis.match('${public_path}/${public_path}/**', {
  release: true
})

// Global end

// default media is `dev`
fis.media('dev')
.hook('relative')
.match('**', { relative: true })
.match('::package', {
  // packager: fis.plugin('map'),
  // prepackager: fis.plugin('plugin-name'),

  postpackager: fis.plugin('loader',{
    // resourceType: 'mod',
    // obtainScript: true, //是否收集 <script> 内容
    // obtainStyle: true, // 是否收集 <style> 和 <link>内容
    // useInlineMap: true,
    allInOne:  {// 默认 false, 配置是否合并零碎资源

      'js': function(file) {
        // console.log(file);
        return fis.get('public_path')+'/'+fis.get('pro_name')+'/js/all.js';
      },
      'css': function(file) {
        // console.log(file);
        return fis.get('public_path')+'/'+fis.get('pro_name')+'/css/all.css';
      },
      includeAsyncs: true
      // sourceMap: true
    }, 
    useInlineMap: false,
    useHash: true
  })
})

// 项目设限
.match('${dev_path}/**', {
  release: false
})

// common 第三方js/css插件 指定拷贝目录
.match('${dev_path}/${common}/(**.js)', {
  release: '${public_path}/common/$1',
  optimizer: fis.plugin('uglify-js')
})

.match('${dev_path}/${common}/(**.css)', {
  release: '${public_path}/common/$1',
  optimizer: fis.plugin('clean-css')
})


// 指定项目可操作
.match('${dev_path}/${pro_name}/**', {
  release: true
})

// 指定项目 图片通行
.match('${dev_path}/${pro_name}/(**.{png,jpeg,jpg,gif})', {
  release: '${public_path}/${pro_name}/$1',
  useMap: true
})


.match('${dev_path}/${pro_name}/(**.html)', {
  release: '${public_path}/${pro_name}/$1',
  useMap :true
})

.match('${dev_path}/${pro_name}/(**.css)', {
  release: '${public_path}/${pro_name}/css/all.css',
  optimizer: fis.plugin('clean-css')
})

.match('${dev_path}/${pro_name}/(**.js)', {
  release: '${public_path}/${pro_name}/js/all.js',
  optimizer: fis.plugin('uglify-js')
})

// 压缩 html 内联的 js
.match('${dev_path}/${pro_name}/**.html:js', {
  useMap :true,
  optimizer: fis.plugin('uglify-js'),
})

// 压缩 html 内联的 css
.match('${dev_path}/${pro_name}/**.html:css', {
  useMap :true,
  optimizer: fis.plugin('clean-css'),
})
.match('**', {
  
  useHash: false,
  userMap: false,
  // optimizer: null
})
.match('*.{js,css,png,jpeg,jpg,gif}', {
    query: '?v=${t_version}',
});



// extends GLOBAL config
fis.media('production')
.hook('relative')
.match('**', { relative: true })
.match('${public_path}/${pro_name}/(**.html)', {
  // release: '${public_path}/${pro_name}/$1',
  optimizer: fis.plugin('html-minifier')
})