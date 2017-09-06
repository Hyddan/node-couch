module.exports = function () {
	var _self = global !== this ? this : {};

	_self.map = function (viewResponse, removeInternalProperties) {
		var response = [];
        removeInternalProperties = removeInternalProperties || false;

		'rows' in viewResponse && (viewResponse = viewResponse.rows);

		for (var row in viewResponse) {
			if (!viewResponse.hasOwnProperty(row)) continue;

			var value = viewResponse[row].doc || viewResponse[row].value;

			if (removeInternalProperties) {
				delete value._id;
				delete value._rev;
			}

			response.splice(response.length, 0, value);
		}

		return response;
	};

	return _self;
};