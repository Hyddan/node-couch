module.exports = describe('When testing the server api', function () {
    var client, httpMock, httpsMock, mockery, nodeCouch;
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
                expect(result.request.options.path).toEqual( '/' + (_config.relativePath ?_config.relativePath : ''));
                expect(result.request.options.headers['Authorization']).toEqual('Basic dXNlcjpwYXNz');
            };
    beforeEach(function (done) {
        nodeCouch = require('../../index');
        mockery.enable();
        mockery.warnOnUnregistered(false);
        mockery.registerMock('http', httpMock = new (require('../mocks/http'))());
        mockery.registerMock('https', httpsMock = new (require('../mocks/http'))());
        client = new nodeCouch.Client().initialize(_configuration);

        done();
    });

    it('it should be able to list all databases', function (done) {
        httpMock.response({
            body: [
                'dummyDatabase',
                'dummyDatabase2'
            ],
            statusCode: 200
        });

        client.Server.databases(function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_all_dbs'
            });

            expect(result.response.body.length).toEqual(2);

            done();
        });
    });

    it('it should be able to list all databases using https', function (done) {
        httpsMock.response({
            body: [
                'dummyDatabase',
                'dummyDatabase2'
            ],
            statusCode: 200
        });

        client.configuration({
            url: {
                protocol: 'https'
            }
        }).Server.databases(function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_all_dbs'
            });

            expect(result.response.body.length).toEqual(2);
            expect(httpMock.callCount().request).toEqual(0);
            expect(httpsMock.callCount().request).toEqual(1);

            done();
        });
    });

    it('it should be able to get info about the server', function (done) {
        httpMock.response({
            body: {
                coudhdb: 'Welcome'
            },
            statusCode: 200
        });
        client.Server.get(function (error, result) {
            _expectConfigurationToBeUsed(result);

            expect(result.request.options.method).toEqual('GET');
            expect(result.response.body.coudhdb).toEqual('Welcome');

            done();
        });
    });

    it('it should be able to navigate to the parent namespace', function (done) {
        expect(client.Server.parent()).toBe(client);

        done();
    });

    afterEach(function (done) {
        mockery.deregisterMock('http');
        mockery.deregisterMock('https');
        mockery.disable();

        done();
    });

    afterAll(function (done) {
        mockery.deregisterAll();

        done();
    });
});