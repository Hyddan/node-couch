module.exports = describe('When testing the document bulk api', function () {
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
                expect(result.request.options.path).toEqual('/' + _config.database + '/' + _config.relativePath);
                expect(result.request.options.headers['Authorization']).toEqual('Basic dXNlcjpwYXNz');
            };
    beforeEach(function (done) {
        nodeCouch = require('../../index');
        mockery.enable();
        mockery.warnOnUnregistered(false);
        mockery.deregisterMock('http');
        mockery.registerMock('http', httpMock = new (require('../mocks/http'))());
        client = new nodeCouch.Client().initialize(_configuration);

        done();
    });

    it('it should be able to bulk create documents', function (done) {
        var _docs = [
                    {
                        _id: 'a'
                    },
                    {
                        _id: 'b'
                    }
                ],
                _requestBody = JSON.stringify({
                    docs: _docs
                });
        httpMock.response({
            body: [
                {
                    ok: true,
                    id: 'a',
                    rev: '1-XXXXX'
                },
                {
                    ok: true,
                    id: 'b',
                    rev: '1-YYYYY'
                }
            ],
            statusCode: 200
        });
        client.Document.Bulk.create(_docs, function (error, result) {
            _expectConfigurationToBeUsed(result.response, {
                relativePath: '_bulk_docs'
            });

            expect(result.response.request.options.method).toEqual('POST');
            expect(result.response.request.body).toEqual(_requestBody);
            expect(result.response.response.body.length).toEqual(2);

            done();
        });
    });

    it('it should be able to bulk delete documents', function (done) {
        var _docs = [
                    {
                        _id: 'a',
                        _rev: '1-AAAAA'
                    },
                    {
                        _id: 'b',
                        _rev: '1-BBBBB'
                    }
                ],
                _requestBody = JSON.stringify({
                    docs: JSON.parse(JSON.stringify(_docs)).map(function (doc) {
                        doc._deleted = true;

                        return doc;
                    })
                });
        httpMock.response({
            body: [
                {
                    ok: true,
                    id: 'a',
                    rev: '2-XXXXX'
                },
                {
                    ok: true,
                    id: 'b',
                    rev: '2-YYYYY'
                }
            ],
            statusCode: 200
        });
        client.Document.Bulk.delete(_docs, function (error, result) {
            _expectConfigurationToBeUsed(result.response, {
                relativePath: '_bulk_docs'
            });

            expect(result.response.request.options.method).toEqual('POST');
            expect(result.response.request.body).toEqual(_requestBody);
            expect(result.response.response.body.length).toEqual(2);

            done();
        });
    });

    it('it should be able to navigate to the parent namespace', function (done) {
        expect(client.Document.Bulk.parent()).toBe(client.Document);

        done();
    });

    it('it should be able to bulk update documents', function (done) {
        var _docs = [
                {
                    _id: 'a',
                    _rev: '1-AAAAA'
                },
                {
                    _id: 'b',
                    _rev: '1-BBBBB'
                }
                ],
                _requestBody = JSON.stringify({
                    docs: _docs
                });
        httpMock.response({
            body: [
                {
                    ok: true,
                    id: 'a',
                    rev: '1-XXXXX'
                },
                {
                    ok: true,
                    id: 'b',
                    rev: '1-YYYYY'
                }
            ],
            statusCode: 200
        });
        client.Document.Bulk.create(_docs, function (error, result) {
            _expectConfigurationToBeUsed(result.response, {
                relativePath: '_bulk_docs'
            });

            expect(result.response.request.options.method).toEqual('POST');
            expect(result.response.request.body).toEqual(_requestBody);
            expect(result.response.response.body.length).toEqual(2);

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