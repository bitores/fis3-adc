// default settings. fis3 release
var DEFAULT_SETTINGS = {
  project: {
    charset: 'utf8',
    md5Length: 7,
    md5Connector: '_',
    files: ['**'],
    ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js','dist/**']
  },

  component: {
    skipRoadmapCheck: true,
    protocol: 'github',
    author: 'fis-components'
  },

  modules: {
    hook: 'components',
    packager: 'map'
  },

  options: {}
};


var config = require('./dev/config');


// console.log(config);

// return;


fis.set('t_version', config.version);
fis.set('dev_path', '/dev');
fis.set('dist_path', '/dist');
fis.set('pro_name', config.name);

// 开启相对地址
// npm install [-g] fis3-hook-relative 
fis.hook('relative'); 
fis.match('**', { relative: true })

// Global start
//合并打包需加
fis.match('::package', {
  postpackager: fis.plugin('loader',{
    // resourceType: 'mod',
    obtainScript: true, //是否收集 <script> 内容
    obtainStyle: true, // 是否收集 <style> 和 <link>内容
    allInOne: {// 默认 false, 配置是否合并零碎资源

      // '${dist_path}/${pro_name}/css/all.css'

      js: function(file) {
        return 'dist/'+config.name+'/js/all.js';
      },
      css: function(file) {
        return 'dist/'+config.name+'/css/all.css';
      }
    }, 
    // useInlineMap: true,
    // useHash: true
  })
});


fis.match('${dev_path}/images/(**)', {
  release:'${dist_path}/images/$1',
  useHash: true
});

fis.match('${dev_path}/html/${pro_name}/(**)', {
  //invoke fis-optimizer-html-minifier  
  release:'${dist_path}/${pro_name}/$1',
  optimizer: fis.plugin('html-minifier'),
  useHash: true
});

// 压缩 index.html 内联的 js
fis.match('${dev_path}/html/${pro_name}/(**):js', {
  optimizer: fis.plugin('uglify-js')
});

// 压缩 index.html 内联的 css
fis.match('${dev_path}/html/${pro_name}/(**):css', {
  optimizer: fis.plugin('clean-css')
});


fis.match('${dev_path}/css/common/libs/{**/(*.css),(*.css)}', {
  release:'${dist_path}/css/common/$1'
});

// fis.match('${dev_path}/css/{common/*.css,${pro_name}/*.css}', {
//   // release:true,
//   // useHash: true,
//   // packTo: '${dist_path}/${pro_name}/css/all.css',
//   optimizer: fis.plugin('clean-css') // js 压缩
// });
fis.match('${dist_path}/${pro_name}/css/all.css', {
  // release:'${dist_path}/${pro_name}/css/all.css',
  optimizer: fis.plugin('clean-css') // js 压缩
});

fis.match('${dev_path}/js/common/libs/{**/(*.js),(*.js)}', {
  release:'${dist_path}/js/common/$1',
});

// fis.match('${dev_path}/js/common/*.js', {
//   // release:true,
//   // useHash: true,
//   // packTo: '${dist_path}/${pro_name}/js/all.js',
//   optimizer: fis.plugin('uglify-js') // js 压缩
// });
fis.match('${dist_path}/${pro_name}/js/all.js', {
  optimizer: fis.plugin('uglify-js') // js 压缩
});


// Global end

// default media is `dev`
fis.media('dev')

  .match('${dev_path}/(**)', {
  	
    useHash: false,
    userMap: false,
    optimizer: null
  })
  .match('*.{js,css,png,jpeg,jpg,gif}', {
      query: '?${t_version}',
  });


// extends GLOBAL config
fis.media('production')