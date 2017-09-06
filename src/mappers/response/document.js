module.exports = function () {
	var _self = global !== this ? this : {};

	_self.map = function (document, removeInternalProperties) {
		removeInternalProperties = removeInternalProperties || false;

		if (removeInternalProperties) {
			delete document._id;
			delete document._rev;
		}

		return document;
	};

	return _self;
};