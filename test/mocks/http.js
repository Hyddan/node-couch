var EventEmitter = require('events'),
        HttpMock = function () {
            EventEmitter.call(this);

            var _self = this,
                    _callCount = {
                        request: 0
                    },
                    _response = new (require('./http-response'))();

            _self.callCount = function () {
                return _callCount;
            };

            _self.request = function (options, callback) {
                ++_callCount.request;

                _self.emit('request', options);

                callback(_response);

                return new (require('./http-request'))(options, _response);
            };

            _self.response = function (properties) {
                Object.assign(_response, properties);

                return _self;
            };

            return _self;
        };

require('util').inherits(HttpMock, EventEmitter);

module.exports = HttpMock;