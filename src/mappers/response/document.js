module.exports = function () {
    var _self = global !== this ? this : {};

    _self.map = function (document, hideInternalIds) {
        hideInternalIds = hideInternalIds || false;

        if (hideInternalIds) {
            delete document._id;
            delete document._rev;
        }

        return document;
    };

    return _self;
};