module.exports = function () {
    var _self = global !== this ? this : {},
            _configuration = {
                credentials: {
                    userName: null,
                    password: null
                },
                database: null,
                url: {
                    hostName: null,
                    port: null,
                    protocol: null
                }
            },
            _http = require('http'),
            _https = require('https'),
            _utils = require('./utils/utils'),
            _createHttpClient = function (path, method, callback) {
                callback = callback || function () {};

                if (!_configuration.database && (0 !== path.indexOf('/') || 0 !== path.indexOf('/_'))) {
                    callback({
                        message: 'No database selected!'
                    });
                }

                return ('https' === _configuration.url.protocol ? _https : _http).request({
                    hostname: _configuration.url.hostName,
                    port: _configuration.url.port,
                    path: path,
                    method: method,
                    headers: {
                        Authorization: ('object' === typeof (_configuration.credentials) && _configuration.credentials.userName && _configuration.credentials.password)
                                            ? 'Basic ' + (new Buffer(_configuration.credentials.userName + ':' + _configuration.credentials.password)).toString('base64')
                                            : null,
                        'Content-Type': 'application/json'
                    },
                    timeout: 'number' === typeof (_configuration.timeout) ? _configuration.timeout : 30000
                }, function (response) {
                    if (399 < response.statusCode) {
                        callback({
                            message: _utils.stringFormat('{method} to {path} failed!', {
                                method: method,
                                path: path
                            }),
                            error: response
                        });
                    }
                    else {
                        var responseData = '';
                        response.on('data', function (_data) {
                            responseData += _data;
                        });
                        response.on('end', function () {
                            callback(null, JSON.parse(responseData || '{}'));
                        });
                    }
                }).on('timeout', function () {
                    this.abort();
                }).on('error', function (error) {
                    if (this.aborted) {
                        callback({
                            message: _utils.stringFormat('{method} to {path} timed out!', {
                                method: method,
                                path: path
                            }),
                            error: error
                        });

                        return;
                    }

                    callback({
                        message: _utils.stringFormat('{method} to {path} failed!', {
                            method: method,
                            path: path
                        }),
                        error: error
                    });
                });
            },
            _preparePath = function (relativePath, omitDatabase) {
                if (!relativePath && omitDatabase) {
                    return '/';
                }

                return _utils.stringFormat((omitDatabase ? '' : '/{database}') + (!relativePath ? '' : '/{relativePath}'), {
                    database: _configuration.database,
                    relativePath: relativePath
                });
            },
            _write = function (request, data) {
                request.write(JSON.stringify(data || ''));
                request.end();
            },
            _deserializeDesignDocumentFunctions = function (designDocument) {
                for (var f in designDocument.filters) {
                    if (!designDocument.filters.hasOwnProperty(f)) continue;

                    0 === designDocument.filters[f].indexOf('function') && (designDocument.filters[f] = _utils.parseFunction(designDocument.filters[f]));
                }

                for (var l in designDocument.lists) {
                    if (!designDocument.lists.hasOwnProperty(l)) continue;

                    0 === designDocument.lists[l].indexOf('function') && (designDocument.lists[l] = _utils.parseFunction(designDocument.lists[l]));
                }

                'string' === typeof (designDocument.rewrites) && 0 === designDocument.rewrites.indexOf('function') && (designDocument.rewrites = _utils.parseFunction(designDocument.rewrites));
                if (Array.isArray(designDocument.rewrites)) {
                    for (var r in designDocument.rewrites) {
                        if (!designDocument.rewrites.hasOwnProperty(r)) continue;

                        0 === designDocument.rewrites[r].indexOf('function') && (designDocument.rewrites[r] = _utils.parseFunction(designDocument.rewrites[r]));
                    }
                }

                for (var s in designDocument.shows) {
                    if (!designDocument.shows.hasOwnProperty(s)) continue;

                    0 === designDocument.shows[s].indexOf('function') && (designDocument.shows[s] = _utils.parseFunction(designDocument.shows[s]));
                }

                'string' === typeof (designDocument.validate_doc_update) && 0 === designDocument.validate_doc_update.indexOf('function') && (designDocument.validate_doc_update = _utils.parseFunction(designDocument.validate_doc_update));

                for (var v in designDocument.views) {
                    if (!designDocument.views.hasOwnProperty(v)) continue;

                    'string' === typeof (designDocument.views[v].map) && 0 === designDocument.views[v].map.indexOf('function') && (designDocument.views[v].map = _utils.parseFunction(designDocument.views[v].map));
                    'string' === typeof (designDocument.views[v].reduce) && 0 === designDocument.views[v].reduce.indexOf('function') && (designDocument.views[v].reduce = _utils.parseFunction(designDocument.views[v].reduce));
                }

                return designDocument;
            },
            _serializeDesignDocumentFunctions = function (designDocument) {
                for (var f in designDocument.filters) {
                    if (!designDocument.filters.hasOwnProperty(f)) continue;

                    _utils.isFunction(designDocument.filters[f]) && (designDocument.filters[f] = designDocument.filters[f].toString());
                }

                for (var l in designDocument.lists) {
                    if (!designDocument.lists.hasOwnProperty(l)) continue;

                    _utils.isFunction(designDocument.lists[l]) && (designDocument.lists[l] = designDocument.lists[l].toString());
                }

                'function' === typeof (designDocument.rewrites) && (designDocument.rewrites = designDocument.rewrites.toString());
                if (Array.isArray(designDocument.rewrites)) {
                    for (var r in designDocument.rewrites) {
                        if (!designDocument.rewrites.hasOwnProperty(r)) continue;

                        _utils.isFunction(designDocument.rewrites[r]) && (designDocument.rewrites[r] = designDocument.rewrites[r].toString());
                    }
                }

                for (var s in designDocument.shows) {
                    if (!designDocument.shows.hasOwnProperty(s)) continue;

                    _utils.isFunction(designDocument.shows[s]) && (designDocument.shows[s] = designDocument.shows[s].toString());
                }

                'function' === typeof (designDocument.validate_doc_update) && (designDocument.validate_doc_update = designDocument.validate_doc_update.toString());

                for (var v in designDocument.views) {
                    if (!designDocument.views.hasOwnProperty(v)) continue;

                    _utils.isFunction(designDocument.views[v].map) && (designDocument.views[v].map = designDocument.views[v].map.toString());
                    _utils.isFunction(designDocument.views[v].reduce) && (designDocument.views[v].reduce = designDocument.views[v].reduce.toString());
                }

                return designDocument;
            };

    return _utils.extend(_self, {
        configuration: function (configuration) {
            if (!configuration) {
                return _configuration;
            }

            _utils.extend(_configuration, configuration);

            return _self;
        },
        credentials: function (credentials) {
            if (!credentials) {
                return _configuration.credentials;
            }

            _utils.extend(_configuration.credentials, credentials);

            return _self;
        },
        initialize: function (configuration) {
            _utils.extend(_configuration, configuration);

            return _self;
        },
        Database: {
            create: function (callback) {
                callback = (callback || function () {}).bind(_self.Database);

                _createHttpClient(_preparePath(), 'PUT', callback)
                    .end();

                return _self.Database;
            },
            delete: function (callback) {
                callback = (callback || function () {}).bind(_self.Database);

                _createHttpClient(_preparePath(), 'DELETE', callback)
                    .end();

                return _self.Database;
            },
            exists: function (callback) {
                callback = (callback || function () {}).bind(_self.Database);

                _createHttpClient(_preparePath(), 'HEAD', callback)
                    .end();

                return _self.Database;
            },
            get: function (callback) {
                callback = (callback || function () {}).bind(_self.Database);

                _createHttpClient(_preparePath(), 'GET', callback)
                    .end();

                return _self.Database;
            },
            parent: function () {
                return _self;
            },
            select: function (database) {
                if (!database) {
                    throw new Error('Database name must be provided!');
                }

                _configuration.database = database;

                return _self.Database;
            }
        },
        Design: { // ToDo: handle view functions (through stringification)
            create: function (designDocument, callback) {
                callback = (callback || function () {}).bind(_self.Design);

                0 !== designDocument._id.indexOf('_design/') && (designDocument._id = _utils.stringFormat('_design/{0}', designDocument._id));
                !designDocument.language && (designDocument.language = 'javascript');

                _write(_createHttpClient(_preparePath(designDocument._id), 'PUT', callback), _serializeDesignDocumentFunctions(designDocument));

                return _self.Design;
            },
            delete: function (designDocumentInfo, callback) {
                // ToDo: if not _rev, get design doc first? if not _id, fail!

                callback = (callback || function () {}).bind(_self.Design);

                0 !== designDocumentInfo._id.indexOf('_design/') && (designDocumentInfo._id = _utils.stringFormat('_design/{0}', designDocumentInfo._id));

                _createHttpClient(_preparePath(_utils.stringFormat('{0}?rev={1}', designDocumentInfo._id, designDocumentInfo._rev)), 'DELETE', callback)
                    .end();

                return _self;
            },
            exists: function (designDocumentId, callback) {
                callback = (callback || function () {}).bind(_self.Design);

                0 !== designDocumentId.indexOf('_design/') && (designDocumentId = _utils.stringFormat('_design/{0}', designDocumentId));

                _createHttpClient(_preparePath(designDocumentId), 'HEAD', callback)
                    .end();

                return _self.Design;
            },
            get: function (designDocumentId, callback) {
                callback = (callback || function () {}).bind(_self.Design);

                0 !== designDocumentId.indexOf('_design/') && (designDocumentId = _utils.stringFormat('_design/{0}', designDocumentId));

                _createHttpClient(_preparePath(designDocumentId), 'GET', function (error, response) {
                        if (error) {
                            callback(error);

                            return;
                        }

                        callback(null, _deserializeDesignDocumentFunctions(response));
                    })
                    .end();

                return _self;
            },
            parent: function () {
                return _self;
            },
            update: function (designDocument, callback) {
                // ToDo: if not _rev, get design doc first? if not _id, fail!

                callback = (callback || function () {}).bind(_self.Design);

                0 !== designDocument._id.indexOf('_design/') && (designDocument._id = _utils.stringFormat('_design/{0}', designDocument._id));
                !designDocument.language && (designDocument.language = 'javascript');

                _write(_createHttpClient(_preparePath(designDocument._id), 'PUT', callback), _serializeDesignDocumentFunctions(designDocument));

                return _self;
            }
        },
        Document: {
            Bulk: {
                create: function (documents, callback) {
                    callback = (callback || function () {}).bind(_self.Document.Bulk);

                    _write(_createHttpClient(_preparePath('_bulk_docs'), 'POST', function (error, response) {
                            if (error) {
                                callback(error);

                                return;
                            }

                            var failed = [],
                                    successful = [];
                            for (var d in response) {
                                if (!response.hasOwnProperty(d)) continue;

                                response[d].error ? failed.push(response[d]) : successful.push(response[d]);
                            }

                            callback(null, {
                                failed: failed,
                                response: response,
                                successful: successful
                            });
                        }), {
                        docs: documents
                    });

                    return _self.Document.Bulk;
                },
                delete: function (documents, callback) {
                    // ToDo: validate that all documents have _id & _rev properties

                    for (var doc in documents) {
                        if (!documents.hasOwnProperty(doc)) continue;

                        documents[doc]._deleted = true;
                    }

                    return _self.Document.Bulk.create(documents, callback);
                },
                parent: function () {
                    return _self.Document;
                },
                update: function (documents, callback) {
                    // ToDo: validate that all documents have _id & _rev properties

                    return _self.Document.Bulk.create(documents, callback);
                }
            },
            create: function (document, callback) {
                callback = (callback || function () {}).bind(_self.Document);

                _write(_createHttpClient(_preparePath(), 'POST', callback), document);

                return _self.Document;
            },
            delete: function (documentInfo, callback) {
                // ToDo: if not _rev, get doc first? if not _id, fail!

                callback = (callback || function () {}).bind(_self.Document);

                _createHttpClient(_preparePath(_utils.stringFormat('{0}?rev={1}', documentInfo._id, documentInfo._rev)), 'DELETE', callback)
                    .end();

                return _self.Document;
            },
            exists: function (documentId, callback) {
                callback = (callback || function () {}).bind(_self.Document);

                _createHttpClient(_preparePath(documentId), 'HEAD', callback)
                    .end();

                return _self.Document;
            },
            get: function (documentId, callback) {
                callback = (callback || function () {}).bind(_self.Document);

                _createHttpClient(_preparePath(documentId), 'GET', callback)
                    .end();

                return _self.Document;
            },
            parent: function () {
                return _self;
            },
            update: function (document, callback) {
                // ToDo: if not _rev, get doc first? if not _id, fail!

                callback = (callback || function () {}).bind(_self.Document);

                _write(_createHttpClient(_preparePath(document._id), 'PUT', callback), document);

                return _self.Document;
            }
        },
        Server: {
            // ToDo: get/set server configuration
            databases: function (callback) {
                callback = (callback || function () {}).bind(_self.Server);

                _createHttpClient(_preparePath('_all_dbs', true), 'GET', callback, true)
                    .end();

                return _self.Server;
            },
            get: function (callback) {
                callback = (callback || function () {}).bind(_self.Server);

                _createHttpClient(_preparePath(null, true), 'GET', callback)
                    .end();

                return _self.Server;
            },
            login: function () { throw new Error('NotImplemented'); }, // ToDo: Implement
            logout: function () { throw new Error('NotImplemented'); }, // ToDo: Implement
            parent: function () {
                return _self;
            },
            session: function () { throw new Error('NotImplemented'); } // ToDo: Implement
        },
        View: {
            parent: function () {
                return _self;
            },
            query: function (options, callback) {
                callback = (callback || function () {}).bind(_self.View);

                options.designDocumentId && 0 !== options.designDocumentId.indexOf('_design/') && (options.designDocumentId = _utils.stringFormat('_design/{0}', options.designDocumentId));

                _createHttpClient(_preparePath(_utils.stringFormat((options.designDocumentId ? '{designDocumentId}/_view/' : '') + '{view}?{query}', options)), 'GET', callback)
                    .end();

                return _self.View;
            },
            transform: function (options, action, callback) {
                options.action = action;

                return _self.View.traverse(options, callback);
            },
            traverse: function (options, callback) {
                callback = (callback || function () {}).bind(_self.View);

                var query = function (limit, key, startKey, startKeyDocId) {
                        var _startKey;
                        if (Array.isArray(startKey)) {
                            _startKey = '[';
                            for (var i in startKey) {
                                if (!startKey.hasOwnProperty(i)) continue;

                                _startKey += _utils.stringFormat('string' === typeof (startKey[i]) ? '"{0}",' : '{0},', encodeURIComponent(startKey[i]));
                            }
                            _startKey = _startKey.replace(/,$/, '') + ']';
                        }

                        return (_utils.stringFormat('limit={limit}&startkey={startKey}&include_docs=true', {
                            limit: 1 + (limit || 100),
                            startKey: _startKey || _utils.stringFormat('"{0}"', encodeURIComponent(startKey || ''))
                        }) + (startKeyDocId ? _utils.stringFormat('&startkey_docid={0}', encodeURIComponent(startKeyDocId)) : '') + (key ? _utils.stringFormat('&key={0}', key) : ''));
                    },
                    _data = [],
                    nextPage = function (options, callback, metaData) {
                        metaData = _utils.extend({
                            processedDocuments: 0,
                            processedPages: 0,
                            startKey: '',
                            startKeyDocId: null
                        }, metaData || {});

                        options = _utils.extend(options, {
                            query: query(options.limit, options.key, metaData.startKey, metaData.startKeyDocId)
                        });

                        _createHttpClient(_preparePath(_utils.stringFormat((null !== options.designDocumentId ? '{designDocumentId}/_view/' : '') + '{view}?{query}', options)), 'GET', function (error, data) {
                            if (error) {
                                callback(error);

                                return;
                            }

                            if (null !== data && 'rows' in data) {
                                var handledPageDocuments = 0,
                                        pageDocuments = Math.min(options.limit, data.rows.length),
                                        pageDocumentsHandled = function () {
                                            handledPageDocuments = 0;

                                            ++metaData.processedPages;

                                            if ((null !== options.pages ? metaData.processedPages < options.pages : true) && options.limit < data.rows.length) {
                                                metaData.startKey = data.rows[options.limit].key;
                                                metaData.startKeyDocId = data.rows[options.limit].id;

                                                nextPage(options, callback, metaData);
                                            }
                                            else {
                                                callback(null, {
                                                    response: _data,
                                                    processedDocuments: metaData.processedDocuments,
                                                    processedPages: metaData.processedPages
                                                });
                                            }
                                        };
                                for (var j = 0; pageDocuments > j; j++) {
                                    ++metaData.processedDocuments;

                                    if ('function' === typeof (options.action)) {
                                        (function (result, doc) {
                                            if ('string' === typeof (result) && 'Delete' === result) {
                                                _self.Document.delete(doc, function (error, response) {
                                                    if (pageDocuments === ++handledPageDocuments) {
                                                        pageDocumentsHandled();

                                                        return;
                                                    }

                                                    error && callback({
                                                        action: 'Delete',
                                                        error: error,
                                                        id: doc._id
                                                    });
                                                });
                                            }
                                            else if (result) {
                                                _self.Document.update(result, function (error, response) {
                                                    if (pageDocuments === ++handledPageDocuments) {
                                                        pageDocumentsHandled();

                                                        return;
                                                    }

                                                    error && callback({
                                                        action: 'Update',
                                                        error: error,
                                                        id: doc._id
                                                    });
                                                });
                                            }
                                            else {
                                                ++handledPageDocuments;

                                                pageDocuments === handledPageDocuments && pageDocumentsHandled();
                                            }
                                        })(options.action(data.rows[j].doc), data.rows[j].doc);
                                    }
                                    else {
                                        ++handledPageDocuments;

                                        _data.push(data.rows[j].doc);

                                        pageDocuments === handledPageDocuments && pageDocumentsHandled();
                                    }
                                }

                                pageDocuments === handledPageDocuments && pageDocumentsHandled();
                            }
                        }).end();
                    };

                options = _utils.extend({
                    designDocumentId: null,
                    key: null,
                    limit: 100,
                    pages: null,
                    view: '_all_docs'
                }, options || {});

                options.designDocumentId && (0 !== options.designDocumentId.indexOf('_design/') && (options.designDocumentId = _utils.stringFormat('_design/{0}', options.designDocumentId)));

                nextPage(options, callback, {});

                return _self.View;
            }
        }
    });
};