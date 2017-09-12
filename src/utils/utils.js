module.exports = (function () {
	var _self = this;

	_self.enumerate = function (obj, func) {
		var prop = null,
			    result = null;

		if (_self.isFunction(func)) {
			for (prop in obj) {
			    if (!obj.hasOwnProperty(prop)) continue;

                result = func(prop, obj[prop]);

                if (result) {
                    return result;
                }
			}
		}
	};

	_self.exists = function () {
		for (var i = 0; i < arguments.length; i++)
			if ('undefined' === typeof arguments[i])
				return false;

		return true;
	};

	_self.extend = (function () {
		var toStr = Object.prototype.toString,
				arrayStr = toStr.call([]);

		return function (base) {
			var current = null,
					newProperty = null,
					i;

			for (i = 1; i < arguments.length; i += 1) {
				current = arguments[i];

				_self.enumerate(current, function (key, val) {
					if (_self.isObject(val) && _self.isObject(base[key]) && !(val instanceof Date)) {
						newProperty = (toStr.call(val) === arrayStr) ? [] : {};
						base[key] = _self.extend(base[key] || newProperty, val);
					}
					else {
						base[key] = _self.exists(val) ? val : base[key];
					}
				});
			}

			return base;
		};
	}());

	_self.guid = function (format) {
		return (format || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0;

			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	};

	_self.isFunction = function (arg) {
		return 'function' === typeof (arg);
	};

	_self.isObject = function (arg) {
		return 'object' === typeof (arg) && null !== arg;
	};

	_self.parseFunction = function (funcString) {
        var body = funcString.substring(funcString.indexOf('{'), 1 + funcString.lastIndexOf('}')),
                declaration = funcString.substring(0, funcString.indexOf('{')),
                args = declaration.substring(1 + declaration.indexOf('('), declaration.lastIndexOf(')')).split(','),
                func = _self.extend(function () {
                    return Function('return function (' + args.join(',') + ') ' + body);
                }, {
                    prototype: Function.prototype
                });

        return (new func())();
    };

	_self.stringFormat = function (pattern) {
        if (!pattern) {
            return null;
        }

        var _args = Array.prototype.slice.call(arguments, 0);
        for (var i = 1; i < _args.length; i++) {
            if ('object' !== typeof (_args[i])) {
                pattern = pattern.replace(new RegExp('\\{' + (i - 1) + '\\}', 'g'), _args[i]);
            }
            else {
				var _deepReplace = function (obj, deepName, depth) {
                    for (var p in obj) {
                        if (!obj.hasOwnProperty(p)) continue;

                        if ('object' === typeof (obj[p]) && 5 > depth) {
                            _deepReplace(obj[p], deepName + p + '.', ++depth);
                        }

                        pattern = pattern.replace(new RegExp('\\{' + deepName + p + '\\}', 'g'), obj[p]);
                    }

                    return this;
                };

                for (var key in _args[i]) {
                    if (!_args[i].hasOwnProperty(key)) continue;

                    if ('object' === typeof (_args[i][key])) {
                        _deepReplace(_args[i][key], key + '.', 0)
                    }

                    pattern = pattern.replace(new RegExp('\\{' + key + '\\}', 'g'), _args[i][key]);
                }
            }
        }

        return pattern;
    };

	return _self;
})();