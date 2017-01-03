'use strict';
var modifyFilename = require('modify-filename');

module.exports = function (pth, hash) {
	if (arguments.length !== 2) {
		throw new Error('`path` and `hash` required');
	}

	return modifyFilename(pth, function (filename, ext) {
		/*mod by huangzhengjie 2016-12-27*/
		// return filename + '-' + hash + ext;
		return filename + ext;
	});
};

module.exports.revert = function (pth, hash) {
	if (arguments.length !== 2) {
		throw new Error('`path` and `hash` required');
	}

	return modifyFilename(pth, function (filename, ext) {
		return filename.replace(new RegExp('-' + hash + '$'), '') + ext;
	});
};
