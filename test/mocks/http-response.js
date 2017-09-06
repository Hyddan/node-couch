var EventEmitter = require('events'),
        HttpResponseMock = function () {
            EventEmitter.call(this);
        };

require('util').inherits(HttpResponseMock, EventEmitter);

module.exports = HttpResponseMock;