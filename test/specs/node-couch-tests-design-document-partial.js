module.exports = describe('When testing the design document api', function () {
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

    it('it should be able to create a design document', function (done) {
        var _doc = {
                    _id: 'a',
                    views: {
                        ById: {
                            map: function () {}
                        }
                    }
                };
        httpMock.response({
            body: {
                _id: '_design/a',
                _rev: '1-XXXXX',
                language: 'javascript',
                views: {
                    ById: {
                        map: function () {}
                    }
                }
            },
            statusCode: 200
        });
        client.Design.create(_doc, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_design/a'
            });

            var requestBody = JSON.parse(result.request.body);
            expect(result.request.options.method).toEqual('PUT');
            expect(requestBody._id).toEqual('_design/a');
            expect(requestBody.language).toEqual('javascript');

            done();
        });
    });

    it('it should be able to delete a design document', function (done) {
        var _doc = {
            _id: 'a',
            _rev: '1-XXXXX',
            views: {
                ById: {
                    map: function () {}
                }
            }
        };
        httpMock.response({
            body: {
                id: '_design/a',
                ok: true,
                rev: '2-YYYYY'
            },
            statusCode: 200
        });
        client.Design.delete(_doc, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_design/a?rev=1-XXXXX'
            });

            expect(result.request.options.method).toEqual('DELETE');
            expect(result.response.body.ok).toEqual(true);

            done();
        });
    });

    it('it should be able to check if a design document exists', function (done) {
        httpMock.response({
            body: {},
            statusCode: 200
        });
        client.Design.exists('a', function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_design/a'
            });

            expect(result.request.options.method).toEqual('HEAD');
            expect(result.response.body).toEqual({});

            done();
        });
    });

    it('it should be able to get a design document by id', function (done) {
        httpMock.response({
            body: {
                _id: 'a',
                _rev: '1-XXXXX',
                language: 'javascript',
                views: {
                    ById: {
                        map: function () {}.toString()
                    }
                }
            },
            statusCode: 200
        });
        client.Design.get('a', function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_design/a'
            });

            expect(result.request.options.method).toEqual('GET');
            expect(result.response.body.views.ById).toBeDefined();

            done();
        });
    });

    it('it should be able to navigate to the parent namespace', function (done) {
        expect(client.Design.parent()).toBe(client);

        done();
    });

    it('it should be able to update a design document', function (done) {
        var _doc = {
            _id: 'a',
            _rev: '1-XXXXX',
            views: {
                ById: {
                    map: function () {}
                },
                ByName: {
                    map: function () {}
                }
            }
        };
        httpMock.response({
            body: {
                _id: '_design/a',
                _rev: '2-YYYYY',
                language: 'javascript',
                views: {
                    ById: {
                        map: function () {}
                    },
                    ByName: {
                        map: function () {}
                    }
                }
            },
            statusCode: 200
        });
        client.Design.update(_doc, function (error, result) {
            _expectConfigurationToBeUsed(result, {
                relativePath: '_design/a'
            });

            var requestBody = JSON.parse(result.request.body);
            expect(result.request.options.method).toEqual('PUT');
            expect(requestBody._id).toEqual('_design/a');
            expect(requestBody.views.ByName).toBeDefined();

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