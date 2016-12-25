'use strict';
const assert = require("assert");
const paths_1 = require("../../utils/paths");
describe('Utils/Paths', () => {
    it('join', () => {
        assert.equal(paths_1.join('a\\b', 'c.txt'), 'a/b/c.txt');
    });
    it('normalize', () => {
        assert.equal(paths_1.normalize('a\\b\\c.txt'), 'a/b/c.txt');
    });
    it('relative', () => {
        const cwd = process.cwd();
        const filepath = paths_1.join(cwd, 'c.txt');
        assert.equal(paths_1.relative(cwd, filepath), 'c.txt');
    });
    it('expandGlobPatterns', () => {
        assert.deepEqual(paths_1.expandGlobPatterns(['.git', '**/node_modules']), [
            '.git',
            '**/node_modules',
            '**/node_modules/**'
        ]);
    });
});
