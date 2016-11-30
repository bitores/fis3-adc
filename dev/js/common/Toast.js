/**
 * 仿 Android Toast
 * 使用方法 Toast.show('msg...')
 */

var _Toast = function(context) {
	this.context = !!context ? context : document.body;
	this.toastTimer = null;
	this.displayTimer = null;
	this.init(0)
};
_Toast.prototype = {
	constructor: _Toast,
	BOTTOM: 1,
	CENTER: 2,
	init: function(POS) {
		switch (POS) {
			case this.BOTTOM:
				this.context.insertAdjacentHTML("beforeEnd", '<div id="toastMessage" style="z-index:1003;font-size: 1.2em;position: fixed;bottom:25%;width: 100%;opacity:0;text-align: center;display: none;transition: opacity 1s ease-out;display: none; opacity: 0;"><span id="toastMsg" style="display:inline-block;max-width:80%;word-wrap:break-word;white-space:pre-wrap;color:#fff;background: rgba(0, 0, 0, 0.6);border-radius: 2px;padding: 0.5rem 0.5rem;text-align: center;margin: 0 auto;"></span></div>');
				break;
			case this.CENTER:
				this.context.insertAdjacentHTML("beforeEnd", '<div id="toastMessage" style="z-index:1003;font-size: 1.2em;position:fixed;left:0;top:50%;margin-left:0;width: 100%;opacity:0;text-align: center;display: none;display: none; opacity: 0;"><span id="toastMsg" style="display:inline-block;max-width:80%;word-wrap:break-word;white-space:pre-wrap;color:#fff;background: rgba(0, 0, 0, 0.6);border-radius: 2px;padding: 0.5rem 0.5rem;;text-align: center;margin: 0 auto;"></span></div>');
				break;
			default:
				this.context.insertAdjacentHTML("beforeEnd", '<div id="toastMessage" style="z-index:1003;font-size: 1.2em;position: fixed;bottom:25%;width: 100%;opacity:0;text-align: center;display: none;transition: opacity 1s ease-out;display: none; opacity: 0;"><span id="toastMsg" style="display:inline-block;max-width:80%;word-wrap:break-word;white-space:pre-wrap;color:#fff;background: rgba(0, 0, 0, 0.6);border-radius: 2px;padding: 0.5rem 0.5rem;;text-align: center;margin: 0 auto;"></span></div>')
		}
	},
	selector: function(s) {
		return document.getElementById(s)
	},
	insertMsg: function(s, html) {
		this.selector(s).innerHTML = html
	},
	makeText: function(msg, interval) {
		var scope = this;
		interval = !!interval ? parseInt(interval) : 1000;
		if (this.toastTimer != null) {
			clearTimeout(this.toastTimer);
			clearTimeout(this.displayTimer)
		}
		scope.selector("toastMessage").style.opacity = 1;
		scope.insertMsg("toastMsg", msg);
		scope.selector("toastMessage").style.display = "block";
		scope.toastTimer = setTimeout(function() {
			scope.selector("toastMessage").style.opacity = 0;
			scope.displayTimer = setTimeout(function() {
				scope.selector("toastMessage").style.display = "none"
			}, 1000)
		}, interval)
	},
	show: function(msg, interval) {
		this.makeText(msg, interval)
	}
};

var Toast = new _Toast();