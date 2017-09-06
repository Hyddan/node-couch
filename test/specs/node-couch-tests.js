describe('When testing the node-couch module', function () {
    var client, httpMock, mockery, nodeCouch;
    beforeAll(function (done) {
        mockery = require('mockery');

        done();
    });

    describe('When testing the exported public api', function () {
        beforeEach(function (done) {
            nodeCouch = require('../../index');

            done();
        });

        it('it should export the client', function (done) {
            expect(nodeCouch.Client).toEqual(jasmine.any(Function));

            done();
        });


        it('it should export the document response mapper', function (done) {
            expect(nodeCouch.Mappers.Response.Document).toEqual(jasmine.any(Function));

            done();
        });


        it('it should export the view response mapper', function (done) {
            expect(nodeCouch.Mappers.Response.View).toEqual(jasmine.any(Function));

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When testing the client setup', function () {
        describe('When testing the client configuration', function () {
            beforeEach(function (done) {
                nodeCouch = require('../../index');
                client = new nodeCouch.Client().initialize({
                    credentials: {
                        userName: 'user',
                        password: 'pass'
                    },
                    url: {
                        hostName: 'dummy',
                        port: 5984
                    }
                });

                done();
            });

            it('it should be able to return the configuration', function (done) {
                expect(client.configuration().url.hostName).toEqual('dummy');
                expect(client.configuration().url.port).toEqual(5984);

                done();
            });

            it('it should be able to update the configuration', function (done) {
                client.configuration({
                    url: {
                        hostName: 'newDummy',
                        port: 5985
                    }
                });
                expect(client.configuration().url.hostName).toEqual('newDummy');
                expect(client.configuration().url.port).toEqual(5985);

                done();
            });

            afterEach(function (done) {
                done();
            });
        });

        describe('When testing the client credentials', function () {
            beforeEach(function (done) {
                nodeCouch = require('../../index');
                client = new nodeCouch.Client().initialize({
                    credentials: {
                        userName: 'user',
                        password: 'pass'
                    },
                    url: {
                        hostName: 'dummy',
                        port: 5984
                    }
                });

                done();
            });

            it('it should be able to return the credentials', function (done) {
                expect(client.credentials().userName).toEqual('user');
                expect(client.credentials().password).toEqual('pass');

                done();
            });

            it('it should be able to update the credentials', function (done) {
                client.credentials({
                    userName: 'newUser',
                    password: 'newPass'
                });
                expect(client.credentials().userName).toEqual('newUser');
                expect(client.credentials().password).toEqual('newPass');

                done();
            });

            afterEach(function (done) {
                done();
            });
        });
    });

    describe('When testing the root functionality', function () {
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

        xit('it should be able to log in', function (done) {
            client.login(function (error, result) {
                expect(result.request.options.path).toEqual('/_session');
                expect(1).toEqual(2);

                done();
            });
        });

        xit('it should be able to log out', function (done) {
            client.logout(function (error, result) {
                expect(result.request.options.path).toEqual('/_session');
                expect(1).toEqual(2);

                done();
            });
        });

        xit('it should be able to return session information', function (done) {
            client.session(function (error, result) {
                expect(result.request.options.path).toEqual('/_session');
                expect(1).toEqual(2);

                done();
            });
        });

        afterEach(function (done) {
            mockery.deregisterMock('http');
            mockery.disable();

            done();
        });
    });

    require('./node-couch-tests-database-partial');

    require('./node-couch-tests-design-document-partial');

    require('./node-couch-tests-document-partial');

    require('./node-couch-tests-view-partial');

    require('./node-couch-tests-server-partial');

    afterAll(function (done) {
        mockery.deregisterAll();

        done();
    });
});