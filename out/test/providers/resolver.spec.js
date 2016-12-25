'use strict';
const assert = require("assert");
const storage_1 = require("../../services/storage");
const resolver_1 = require("../../providers/resolver");
const storage = new storage_1.Storage();
const resolver = new resolver_1.Resolver(storage);
describe('Providers/Resolver', () => {
    before(() => {
        storage.load({
            'pug/a.pug': {
                dependencies: ['pug/*.pug'],
                ctime: Date.now()
            },
            'pug/b.pug': {
                dependencies: ['pug/nested/c.pug', 'pug/nested/d.pug'],
                ctime: Date.now()
            },
            'pug/nested/c.pug': {
                dependencies: ['pug/nested/d.pug'],
                ctime: Date.now()
            },
            'pug/nested/d.pug': {
                dependencies: [],
                ctime: Date.now()
            }
        });
    });
    it('The list of dependencies for an existing item', () => {
        assert.deepEqual(resolver.getDependencies('pug/a.pug'), [
            'pug/a.pug',
            'pug/*.pug',
            'pug/b.pug',
            'pug/nested/c.pug',
            'pug/nested/d.pug'
        ]);
    });
    it('The list of dependencies for a non-existing item', () => {
        assert.deepEqual(resolver.getDependencies('none.pug'), ['none.pug']);
    });
    it('Check filepath as dependency', () => {
        assert.equal(resolver.checkDependency('pug/a.pug', 'pug/nested/d.pug'), true);
        assert.equal(resolver.checkDependency('pug/a.pug', 'pug/e.pug'), false);
    });
    it('Prevent infinity recursion', () => {
        storage.load({
            'a.pug': {
                dependencies: ['b.pug'],
                ctime: Date.now()
            },
            'b.pug': {
                dependencies: ['a.pug'],
                ctime: Date.now()
            }
        });
        assert.deepEqual(resolver.getDependencies('a.pug'), [
            'a.pug',
            'b.pug',
            'a.pug'
        ]);
    });
});
