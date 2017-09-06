module.exports = describe('When testing the document api', function () {
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

    require('./node-couch-tests-document-bulk-partial');

    it('it should be able to create a document', function (done) {
        var _doc = {
                    _id: 'a',
                    prop: 'val'
                },
                _requestBody = JSON.stringify(_doc);
        httpMock.response({
            body: {
                _id: 'a',
                _rev: '1-XXXXX',
                prop: 'val'
            },
            statusCode: 200
        });
        client.Document.create(_doc, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: ''
            });

            expect(result.request.options.method).toEqual('POST');
            expect(result.request.body).toEqual(_requestBody);
            expect(result.response.body.prop).toEqual('val');

            done();
        });
    });

    it('it should be able to delete a document', function (done) {
        var _doc = {
            _id: 'a',
            _rev: '1-XXXXX',
            prop: 'val'
        };
        httpMock.response({
            body: {
                id: 'a',
                ok: true,
                rev: '2-YYYYY'
            },
            statusCode: 200
        });
        client.Document.delete(_doc, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: _doc._id + '?rev=' + _doc._rev
            });

            expect(result.request.options.method).toEqual('DELETE');
            expect(result.response.body.ok).toEqual(true);

            done();
        });
    });

    it('it should be able to check if a document exists', function (done) {
        httpMock.response({
            body: {},
            statusCode: 200
        });
        client.Document.exists('a', function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: 'a'
            });

            expect(result.request.options.method).toEqual('HEAD');
            expect(result.response.body).toEqual({});

            done();
        });
    });

    it('it should be able to get a document by id', function (done) {
        httpMock.response({
            body: {
                _id: 'a',
                _rev: '1-XXXXX',
                prop: 'val'
            },
            statusCode: 200
        });
        client.Document.get('a', function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: 'a'
            });

            expect(result.request.options.method).toEqual('GET');
            expect(result.response.body.prop).toEqual('val');

            done();
        });
    });

    it('it should be able to navigate to the parent namespace', function (done) {
        expect(client.Document.parent()).toBe(client);

        done();
    });

    it('it should be able to update a document', function (done) {
        var _doc = {
                _id: 'a',
                prop: 'newVal'
            },
            _requestBody = JSON.stringify(_doc);
        httpMock.response({
            body: {
                _id: 'a',
                _rev: '2-YYYYY',
                prop: 'newVal'
            },
            statusCode: 200
        });
        client.Document.update(_doc, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: _doc._id
            });

            expect(result.request.options.method).toEqual('PUT');
            expect(result.request.body).toEqual(_requestBody);
            expect(result.response.body.prop).toEqual('newVal');

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