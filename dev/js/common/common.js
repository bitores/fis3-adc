/**
 * 获取 url 中参数 ，返回一个 Object 对象
 * RETURN {param1:'', param2:''}
 */

function getRequest() {
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/**
 *  返回指定的 url 参数
 *  @param  name - URL请求参数
 */
 function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};

/**
 * 根据请求环境（com/cc/dev）返回 api 地址
 */

function getHost() {
	var oldUrl = document.domain;
    var num = oldUrl.lastIndexOf('.');
    var newUrl = oldUrl.substring(num + 1, oldUrl.length);
    if (newUrl == 'cc') {
        var HOST = "https://api.cyb.kuaiqiangche.cc";
    } else if (newUrl == 'com') {
        var HOST = "https://api.cyb.kuaiqiangche.com";
    } else {
        var HOST = "https://api.cyb.kuaiqiangche.com";
    }
    return HOST;
}

/**
 * 判断是否在 我司 车源宝App 内部展示
 */

function isInApp() {
	if(navigator.userAgent.indexOf('cheyuanbaoios') != -1) {
		return !!1; // 1: IOS 车源宝App
	} else if(navigator.userAgent.indexOf('cheyuanbaoand') != -1) {
		return !!2; // 2: Android 车源宝App
	} else {
		return false;
	}
}

/**
 * 判断是否在 pc 端展示
 */

function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**
 * 计算根元素大小 3.75为设计稿尺寸/100
 */

function initDocumentFontSize() {

    var deviceWidth = document.documentElement.clientWidth;
    if (deviceWidth > 640) {
    	deviceWidth = 640;
    }
    document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px';
}