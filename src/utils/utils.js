module.exports = (function () {
	var _self = this;

	_self.extend = function () {
		for (var i = 1; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		
		return arguments[0];
	};
	
	_self.stringFormat = function (pattern) {
		if (!pattern) {
			return null;
		}

		var _args = Array.prototype.slice.call(arguments, 0);
		for (var i = 1; i < _args.length; i++) {
			if ('object' !== typeof _args[i]) {
				pattern = pattern.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), _args[i]);
			}
			else {
				for (var key in _args[i]) {
					if (_args[i].hasOwnProperty(key)) {
						pattern = pattern.replace(new RegExp('\\{' + key + '\\}', 'g'), _args[i][key]);
					}
				}
			}
		}

		return pattern;
	};
	
	return _self;
})();