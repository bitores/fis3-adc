var fs = require('fs');
var minify = require('html-minifier').minify;
var config = require('./config.json');

//path模块，可以生产相对和绝对路径
var path = require("path");

//配置远程路径
var remotePath = path.join(__dirname,"public",config.name);

//获取后缀名
function getdir(url){
    var arr = url.split('.');
    var len = arr.length;
    return arr[len-1];
}


function handleFile(path, floor) {  
    var blankStr = '';  
    for (var i = 0; i < floor; i++) {  
        blankStr += '    ';  
    }  
  
    fs.stat(path, function(err1, stats) {  
        if (err1) {  
            console.log('stat error');  
        } else {  
            if (stats.isDirectory()) {  
                // console.log('+' + blankStr + path);  
            } else {  
            	if(getdir(path) == 'html'){
            		// console.log('-' + blankStr + path);

            		fs.readFile(path, 'utf8', function (err, data) {
					    if (err) {
					        throw err;
					    }
					    fs.writeFile(path, minify(data,{removeComments: true,collapseWhitespace: true,minifyJS:true, minifyCSS:true}),function(){
					        console.log('mini file '+path+' success');
					    });
					});
            	}
                  
            }  
        }  
    })  
  
  
} 

function walk(path, floor, handleFile) {  
    handleFile(path, floor);  
    floor++;  
    fs.readdir(path, function(err, files) {  
        if (err) {  
            console.log('read dir error');  
        } else {  
            files.forEach(function(item) {  
                var tmpPath = path + '/' + item;  
                fs.stat(tmpPath, function(err1, stats) {  
                    if (err1) {  
                        console.log('stat error');  
                    } else {  
                        if (stats.isDirectory()) {  
                            walk(tmpPath, floor, handleFile);  
                        } else {  
                            handleFile(tmpPath, floor);  
                        }  
                    }  
                })  
            });  
  
        }  
    });  
}  


walk(remotePath, 0, handleFile)


