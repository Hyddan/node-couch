module.exports = describe('When testing the view api', function () {
    var client, httpMock, mockery, nodeCouch;
    beforeAll(function (done) {
        mockery = require('mockery');

        done();
    });

    var _configuration = {
            credentials: {
                userName: 'user',
                password: 'pass'
            },
            database: 'dummyDatabase',
            url: {
                hostName: 'dummyHost',
                port: 5984
            }
        },
            _expectConfigurationToBeUsed = function (result, configurationOverrides) {
                var _config = Object.assign({}, _configuration, configurationOverrides);
                expect(result.request.options.hostname).toEqual(_config.url.hostName);
                expect(result.request.options.port).toEqual(_config.url.port);
                expect(result.request.options.path).toEqual('/' + _config.database + (_config.relativePath ? '/' + _config.relativePath : ''));
                expect(result.request.options.headers['Authorization']).toEqual('Basic dXNlcjpwYXNz');
            };
    beforeEach(function (done) {
        nodeCouch = require('../../index');
        mockery.enable();
        mockery.warnOnUnregistered(false);
        mockery.registerMock('http', httpMock = new (require('../mocks/http'))());
        client = new nodeCouch.Client().initialize(_configuration);

        done();
    });

    it('it should be able to navigate to the parent namespace', function (done) {
        expect(client.View.parent()).toBe(client);

        done();
    });

    it('it should be able to query a view', function (done) {
        var utils = require('../../lib/utils/utils'),
                options = {
                    designDocumentId: 'dummyDesignDocument',
                    query: 'key=["a","b"]',
                    view: 'dummyView'
                };
        httpMock.response({
            body: {
                rows: [
                    {
                        doc: {
                            a: 'a',
                            b: 'b'
                        }
                    }
                ]
            },
            statusCode: 200
        });
        client.View.query(options, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: utils.stringFormat('{designDocumentId}/_view/{view}?{query}', options)
            });

            expect(result.request.options.method).toEqual('GET');
            expect(result.response.body.rows[0].doc.a).toEqual('a');

            done();
        });
    });

    it('it should be able to transform a view', function (done) {
        var utils = require('../../lib/utils/utils'),
                options = {
                    designDocumentId: 'dummyDesignDocument',
                    key: '["a","b"]',
                    pages: 1,
                    view: 'dummyView'
                },
                actionCallCount = 0,
                requestOptions;
        httpMock.response({
            body: {
                rows: [
                    {
                        doc: {
                            a: 'a',
                            b: 'b'
                        }
                    }
                ]
            },
            statusCode: 200
        }).on('request', function (options) {
            requestOptions = options;
        });
        client.View.transform(options, function () {
            ++actionCallCount;

            return null;
        }, function (error, result) {
            _expectConfigurationToBeUsed({
                request: {
                    options: requestOptions
                }
            }, {
                relativePath: utils.stringFormat('_design/{designDocumentId}/_view/{view}?{query}', Object.assign({
                    query: 'limit=101&startkey=""&include_docs=true&key=["a","b"]'
                }, options))
            });

            expect(requestOptions.method).toEqual('GET');
            expect(result.processedDocuments).toEqual(1);
            expect(result.processedPages).toEqual(1);
            expect(actionCallCount).toEqual(1);

            done();
        });
    });

    it('it should be able to traverse a view', function (done) {
        var utils = require('../../lib/utils/utils'),
                options = {
                    designDocumentId: 'dummyDesignDocument',
                    key: '["a","b"]',
                    pages: 1,
                    view: 'dummyView'
                },
                requestOptions;
        httpMock.response({
            body: {
                rows: [
                    {
                        doc: {
                            a: 'a',
                            b: 'b'
                        }
                    }
                ]
            },
            statusCode: 200
        }).on('request', function (options) {
            requestOptions = options;
        });
        client.View.traverse(options, function (error, result) {
            _expectConfigurationToBeUsed({
                request: {
                    options: requestOptions
                }
            }, {
                relativePath: utils.stringFormat('_design/{designDocumentId}/_view/{view}?{query}', Object.assign({
                    query: 'limit=101&startkey=""&include_docs=true&key=["a","b"]'
                }, options))
            });

            expect(requestOptions.method).toEqual('GET');
            expect(result.response[0].a).toEqual('a');
            expect(result.processedDocuments).toEqual(1);
            expect(result.processedPages).toEqual(1);

            done();
        });
    });

    afterEach(function (done) {
        mockery.deregisterMock('http');
        mockery.disable();

        done();
    });

    afterAll(function (done) {
        mockery.deregisterAll();

        done();
    });
});