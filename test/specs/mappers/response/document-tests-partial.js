module.exports = describe('When mapping document responses using the document response mapper', function () {
    var nodeCouch;
    beforeAll(function (done) {
        done();
    });

    var documentResponse, documentResponseMapper, mappedDocumentResponse;
    beforeEach(function (done) {
        nodeCouch = require('../../../../index');

        documentResponseMapper = new nodeCouch.Mappers.Response.Document();
        documentResponse = {
            _id: 'id',
            _rev: 'revision',
            property: 'value'
        };

        done();
    });

    it('it should map document properties', function (done) {
        mappedDocumentResponse = documentResponseMapper.map(documentResponse);

        expect(mappedDocumentResponse.property).toEqual('value');

        done();
    });

    it('it should preserve internal properties by default', function (done) {
        mappedDocumentResponse = documentResponseMapper.map(documentResponse);

        expect(mappedDocumentResponse._id).toEqual('id');
        expect(mappedDocumentResponse._rev).toEqual('revision');

        done();
    });

    it('it should be able to remove internal properties', function (done) {
        mappedDocumentResponse = documentResponseMapper.map(documentResponse, true);

        expect(mappedDocumentResponse._id).toBeUndefined();
        expect(mappedDocumentResponse._rev).toBeUndefined();

        done();
    });

    afterEach(function (done) {
        done();
    });

    afterAll(function (done) {
        done();
    });
});