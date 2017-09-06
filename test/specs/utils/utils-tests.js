describe('When testing the node-couch module\'s utils', function () {
    var utils;
    beforeAll(function (done) {
        done();
    });

    describe('When enumerating an object', function () {
        var object, key, value;
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');
            object = {
                a: 1
            };

            done();
        });

        it('it should enumerate an object', function (done) {
            utils.enumerate(object, function (k, v) {
                key = k;
                value = v;
            });
            expect(key).toEqual('a');
            expect(value).toEqual(1);

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When checking if a value exists', function () {
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');

            done();
        });

        it('it should identify an existing value', function (done) {
            expect(utils.exists('')).toBe(true);

            done();
        });

        it('it should identify a non-existing value', function (done) {
            expect(utils.exists(undefined)).toBe(false);

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When extending an object', function () {
        var object;
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');
            object = {
                a: 1,
                b: 2,
                c: 3
            };

            done();
        });

        it('it should extend an object', function (done) {
            utils.extend(object, {
                a: 4,
                b: null,
                c: undefined
            });
            expect(object.a).toEqual(4);
            expect(object.b).toBeNull();
            expect(object.c).toEqual(3);

            done();
        });

        it('it should extend a nested object', function (done) {
            utils.extend(object, {
                d: {
                    e: 5
                }
            });
            expect(object.d.e).toEqual(5);

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When generating a guid', function () {
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');

            done();
        });

        it('it should generate a 36 character guid by default', function (done) {
            expect(utils.guid().length).toBe(36);

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When checking for functions', function () {
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');

            done();
        });

        it('it should identify a function', function (done) {
            expect(utils.isFunction(function () {})).toBe(true);

            done();
        });

        it('it should identify a non-function', function (done) {
            expect(utils.isFunction('')).toBe(false);

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When checking for objects', function () {
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');

            done();
        });

        it('it should identify an object', function (done) {
            expect(utils.isObject({})).toBe(true);

            done();
        });

        it('it should identify a non-object', function (done) {
            expect(utils.isObject('')).toBe(false);

            done();
        });

        afterEach(function (done) {
            done();
        });
    });

    describe('When formatting strings', function () {
        beforeEach(function (done) {
            utils = require('../../../lib/utils/utils');

            done();
        });

        it('it should format a string using an object with replacement properties', function (done) {
            expect(utils.stringFormat('{a}.{b}', {
                a: 1,
                b: 2
            })).toEqual('1.2');

            done();
        });

        it('it should format a string using positional arguments as replacements', function (done) {
            expect(utils.stringFormat('{0}.{1}', 'a', 'b')).toEqual('a.b');

            done();
        });

        it('it should format a string using an object with replacement properties and positional arguments as replacements', function (done) {
            expect(utils.stringFormat('{0}.{a}', 'a', {
                a: 1
            })).toEqual('a.1');

            done();
        });

        afterEach(function (done) {

            done();
        });
    });

    afterAll(function (done) {
        done();
    });
});