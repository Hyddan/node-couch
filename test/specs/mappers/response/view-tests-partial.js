module.exports = describe('When mapping document responses using the document response mapper', function () {
    var nodeCouch;
    beforeAll(function (done) {
        done();
    });

    var viewResponse, viewResponseMapper, mappedViewResponse;
    beforeEach(function (done) {
        nodeCouch = require('../../../../index');

        viewResponseMapper = new nodeCouch.Mappers.Response.View();
        viewResponse = {
            rows: [
                {
                    value: {
                        _id: 'id',
                        _rev: 'revision',
                        property: 'value'
                    }
                }
            ]
        };

        done();
    });

    it('it should map document properties', function (done) {
        mappedViewResponse = viewResponseMapper.map(viewResponse);

        expect(mappedViewResponse[0].property).toEqual('value');

        done();
    });

    it('it should preserve internal properties by default', function (done) {
        mappedViewResponse = viewResponseMapper.map(viewResponse);

        expect(mappedViewResponse[0]._id).toEqual('id');
        expect(mappedViewResponse[0]._rev).toEqual('revision');

        done();
    });

    it('it should be able to remove internal properties', function (done) {
        mappedViewResponse = viewResponseMapper.map(viewResponse, true);

        expect(mappedViewResponse[0]._id).toBeUndefined();
        expect(mappedViewResponse[0]._rev).toBeUndefined();

        done();
    });

    afterEach(function (done) {
        done();
    });

    afterAll(function (done) {
        done();
    });
});