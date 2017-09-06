var EventEmitter = require('events'),
        HttpRequestMock = function (options, response, responseBody) {
            EventEmitter.call(this);

            var _self = this,
                    _body = null,
                    _responseBody = responseBody;

            _self.end = function () {
                response.emit('data', JSON.stringify(Object.assign({
                    request: {
                        body: _body,
                        options: options
                    },
                    response: response
                }, response.body)));
                response.emit('end');

                return _self;
            };

            _self.write = function (body) {
                _body = body;
            };

            return _self;
        };

require('util').inherits(HttpRequestMock, EventEmitter);

module.exports = HttpRequestMock;