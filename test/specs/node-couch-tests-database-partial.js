module.exports = describe('When testing the database api', function () {
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
                expect(result.request.options.path).toEqual('/' + _config.database);
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

    it('it should be able to create a database', function (done) {
        httpMock.response({
            body: {
                ok: true
            },
            statusCode: 200
        });

        client.Database.select('newDb')
                            .create(function (error, result) {
                                _expectConfigurationToBeUsed(result, {
                                    database: 'newDb'
                                });

                                expect(result.request.options.method).toEqual('PUT');

                                done();
                            });
    });

    it('it should be able to delete a database', function (done) {
        httpMock.response({
            body: {
                ok: true
            },
            statusCode: 200
        });
        client.Database.delete(function (error, result) {
            _expectConfigurationToBeUsed(result);

            expect(result.request.options.method).toEqual('DELETE');

            done();
        });
    });

    it('it should be able to check if a database exists', function (done) {
        httpMock.response({
            body: {},
            statusCode: 200
        });
        client.Database.exists(function (error, result) {
            _expectConfigurationToBeUsed(result);

            expect(result.request.options.method).toEqual('HEAD');
            expect(result.response.body).toEqual({});

            done();
        });
    });

    it('it should be able to get info about a database', function (done) {
        httpMock.response({
            body: {
                doc_count: 5
            },
            statusCode: 200
        });
        client.Database.get(function (error, result) {
            _expectConfigurationToBeUsed(result);

            expect(result.request.options.method).toEqual('GET');
            expect(result.response.body.doc_count).toEqual(5);

            done();
        });
    });

    it('it should be able to navigate to the parent namespace', function (done) {
        expect(client.Database.parent()).toBe(client);

        done();
    });

    it('it should be able to select a database', function (done) {
        client.Database.select('selectedDatabase');
        expect(client.configuration().database).toEqual('selectedDatabase');

        done();
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