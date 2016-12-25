'use strict';
const assert = require("assert");
const storage_1 = require("../../services/storage");
const config_1 = require("../../services/config");
const scanner_1 = require("../../services/scanner");
const storage = new storage_1.Storage();
const config = new config_1.Config('pug');
const options = {
    scanner: {
        depth: 30,
        exclude: ['.git', '**/node_modules', '**/bower_components']
    }
};
const scanner = new scanner_1.Scanner('fixtures', storage, config.getConfig(), options);
describe('Services/Scanner', () => {
    it('Scan directory', () => {
        return scanner.scan().then(() => {
            assert.equal(storage.keys().length, 5);
            assert.ok(storage.keys().indexOf('fixtures/pug/parser.pug') !== -1);
            assert.deepEqual(storage.get('fixtures/pug/a.pug').dependencies, [
                'fixtures/pug/b.pug',
                'fixtures/pug/c.pug'
            ]);
        });
    });
    it('Scan File', () => {
        storage.drop('fixtures/pug/parser.pug');
        return scanner.scan('fixtures/pug/parser.pug').then(() => {
            assert.equal(storage.keys().length, 5);
            assert.ok(storage.keys().indexOf('fixtures/pug/parser.pug') !== -1);
        });
    });
});
