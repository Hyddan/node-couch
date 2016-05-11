module.exports = function () {
	var _self = global !== this ? this : {},
			_utils = require('./utils/utils.js'),
			_http = require('http'),
			_createHttpClient = function (relativePath, method, onSuccess, onError) {
				return _http.request({
					hostname: _self.configuration.url.hostName,
					port: _self.configuration.url.port,
					path: _self.configuration.url.path + relativePath,
					method: method,
					headers: {
						Authorization: ('object' === typeof (_self.configuration.credentials) && _self.configuration.credentials.userName && _self.configuration.credentials.password)
                                            ? 'Basic ' + (new Buffer(_self.configuration.credentials.userName + ':' + _self.configuration.credentials.password)).toString('base64')
                                            : null,
						'Content-Type': 'application/json'
					}
				}, function (response) {
					if (399 < response.statusCode) {
						onError(response.statusCode);
					}
					else {
						var responseData = '';
						response.on('data', function (_data) {
							responseData += _data;
						});
						response.on('end', function () {
							onSuccess(JSON.parse(responseData));
						});
					}
				});
			};
	
	return _utils.extend(_self, {
		initialize: function (configuration) {
			return _utils.extend(_self, {
				configuration: configuration
			});
		},
		bulk: {
			delete: function (documents, onSuccess, onError) {
				for (var doc in documents) {
                    if (!documents.hasOwnProperty(doc)) continue;

					documents[doc]._deleted = true;
				}
				
				return _self.bulk.post(documents, onSuccess, onError);
			},
			post: function (records, onSuccess, onError) {
				var request = _createHttpClient('_bulk_docs', 'POST', function (data) {
					var failed = [],
						successful = [];
					
					for (var d in data) {
                        if (!data.hasOwnProperty(d)) continue;

						data[d].error ? failed.push(data[d]) : successful.push(data[d]);
					}
					
					onSuccess(data, successful, failed);
				}, onError);
				
				request.on('error', function (error) {
					onError(error.message);
				});
				
				request.write(JSON.stringify({
					docs: records
				}));

				request.end();

                return _self;
			},
			put: function (documents, onSuccess, onError) {
				return _self.bulk.post(documents, onSuccess, onError);
			}
		},
		delete: function (documentInfo, onSuccess, onError) {
			var request = _createHttpClient(_utils.stringFormat('{0}?rev={1}', documentInfo._id, documentInfo._rev), 'DELETE', onSuccess, onError);
			
			request.on('error', function (error) {
				onError(error.message);
			});

			request.end();

            return _self;
		},
		get: function (documentId, onSuccess, onError) {
			var request = _createHttpClient(documentId, 'GET', onSuccess, onError);
			
			request.on('error', function (error) {
				onError(error.message);
			});

			request.end();

            return _self;
		},
		post: function (data, onSuccess, onError) {
			var request = _createHttpClient(String.empty, 'POST', onSuccess, onError);
			
			request.on('error', function (error) {
				onError(error.message);
			});
			
			request.write(JSON.stringify(data));

			request.end();

            return _self;
		},
		put: function (document, onSuccess, onError) {
			var request = _createHttpClient(document._id, 'PUT', onSuccess, onError);
			
			request.on('error', function (error) {
				onError(error.message);
			});
			
			request.write(JSON.stringify(document));

			request.end();

            return _self;
		},
		queryView: function (designDocument, view, query, onSuccess, onError) {
			var request = _createHttpClient(_utils.stringFormat('_design/{designDocument}/_view/{view}?{query}', {
				designDocument: designDocument,
				view: view,
				query: query
			}), 'GET', function (data) {
				if (null !== data && 'rows' in data) {
					data = data.rows;
				}
				
				onSuccess(data);
			}, onError);
			
			request.on('error', function (error) {
				onError(error.message);
			});

			request.end();

            return _self;
		},
		transformer: function (options, action, onSuccess, onError) {
			options.action = action;

            return _self.viewTraverser(options, onSuccess, onError);
		},
		viewTraverser: function (options, onSuccess, onError) {
			var query = function (limit, key, startKey, startKeyDocId) {
						var _startKey;
						if (Array.isArray(startKey)) {
							_startKey = '[';
							for (var i in startKey) {
                                if (!startKey.hasOwnProperty(i)) continue;

								_startKey += _utils.stringFormat('string' === typeof (startKey[i]) ? '"{0}",' : '{0},', startKey[i]);
							}
							_startKey = _startKey.replace(/,$/, '') + ']';
						}

						return (_utils.stringFormat('limit={limit}&startkey={startKey}&include_docs=true', {
							limit: 1 + (limit || 100),
							startKey: _startKey || _utils.stringFormat('"{0}"', startKey || '')
						}) + (startKeyDocId ? _utils.stringFormat('&startkey_docid={0}', startKeyDocId) : '')
						+ (key ? _utils.stringFormat('&key={0}', key) : ''));
					},
					_data = [],
					request = null,
					nextPage = function (options, onSuccess, onError, metaData) {
						metaData = _utils.extend({
							processedDocuments: 0,
							processedPages: 0,
							startKey: '',
							startKeyDocId: null
						}, metaData || {});

						options = _utils.extend(options, {
							query: query(options.limit, options.key, metaData.startKey, metaData.startKeyDocId)
						});
						
						request = _createHttpClient(_utils.stringFormat((null !== options.designDocument ? '_design/{designDocument}/_view/' : '') + '{view}?{query}', options), 'GET', function (data) {
							if (null !== data && 'rows' in data) {
								for (var j = 0; Math.min(options.limit, data.rows.length) > j; j++) {
									if (options.action && 'function' === typeof (options.action.apply)) {
                                        (function (result, doc) {
                                            if ('string' === typeof (result) && 'Delete' === result) {
                                                _self.delete(doc, function (data) { }, function (error) {
                                                    onError({
                                                        action: 'Delete',
                                                        error: error,
                                                        id: doc._id
                                                    });
                                                });
                                            }
                                            else {
                                                _self.put(result, function (data) { }, function (error) {
                                                    onError({
                                                        action: 'Update',
                                                        error: error,
                                                        id: doc._id
                                                    });
                                                });
                                            }

                                        })(options.action.apply(data.rows[j].doc), data.rows[j].doc);
                                    }
                                    else {
                                        _data.push(data.rows[j].doc);
                                    }
									
									++metaData.processedDocuments;
								}
								++metaData.processedPages;

								if ((null !== options.pages ? metaData.processedPages < options.pages : true) && options.limit < data.rows.length) {
									metaData.startKey = data.rows[options.limit].key;
									metaData.startKeyDocId = data.rows[options.limit].id;

									nextPage(options, onSuccess, onError, metaData);
								}
								else {
									onSuccess({
										data: _data,
										processedDocuments: metaData.processedDocuments,
										processedPages: metaData.processedPages
									});
								}
							}
						}, onError);

						request.on('error', onError);

						request.end();
					};

            options = _utils.extend({
                designDocument: null,
				key: null,
				limit: 100,
				pages: null,
				view: '_all_docs'
            }, options || {});
			
			nextPage(options, onSuccess, onError, {});

			request.on('error', onError);

			request.end();

            return _self;
		}
	});
};