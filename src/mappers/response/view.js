module.exports = function () {
	var _self = global !== this ? this : {};

	_self.map = function (viewResponse, hideInternalIds) {
		var response = [];
		hideInternalIds = hideInternalIds || false;

		for (var row in viewResponse) {
			if (!viewResponse.hasOwnProperty(row)) continue;

			var value = viewResponse[row];

			if (hideInternalIds) {
				delete value._id;
				delete value._rev;
			}

			response.splice(response.length, 0, value);
		}

		return response;
	};

	return _self;
};