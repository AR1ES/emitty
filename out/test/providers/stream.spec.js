'use strict';
const assert = require("assert");
const Vinyl = require("vinyl");
const config_1 = require("../../services/config");
const storage_1 = require("../../services/storage");
const stream_1 = require("../../providers/stream");
const paths_1 = require("../../utils/paths");
let passedFiles = [];
const options = {
    scanner: {
        exclude: [],
        depth: 30
    },
    log: (filepath) => {
        passedFiles.push(paths_1.normalize(filepath));
    }
};
const config = new config_1.Config('pug');
const storage = new storage_1.Storage();
describe('Providers/Stream', () => {
    afterEach(() => {
        passedFiles = [];
    });
    it('Should work', (done) => {
        const stream = new stream_1.Stream('fixtures', storage, config.getConfig(), options);
        const s = stream.run('fixtures/pug/c.pug');
        s.on('data', (file) => {
            // Because Stream
        });
        s.on('error', (err) => {
            done(err);
        });
        s.on('end', () => {
            assert.deepEqual(passedFiles, [
                'fixtures/pug/a.pug',
                'fixtures/pug/b.pug',
                'fixtures/pug/c.pug',
                'fixtures/pug/nested/nested.pug'
            ]);
            done();
        });
        s.write(new Vinyl({ path: 'pug/a.pug' }));
        s.write(new Vinyl({ path: 'pug/b.pug' }));
        s.write(new Vinyl({ path: 'pug/c.pug' }));
        s.write(new Vinyl({ path: 'pug/nested/nested.pug' }));
        s.write(new Vinyl({ path: 'pug/parser.pug' }));
        s.end();
    });
    it('Vinyl file', (done) => {
        const vOptions = Object.assign({
            makeVinylFile: true
        }, options);
        const stream = new stream_1.Stream('fixtures', storage, config.getConfig(), vOptions);
        const s = stream.run('fixtures/pug/c.pug');
        s.on('data', (file) => {
            assert.ok(Buffer.isBuffer(file.contents));
        });
        s.on('error', (err) => {
            done(err);
        });
        s.on('end', () => {
            assert.deepEqual(passedFiles, [
                'fixtures/pug/a.pug',
                'fixtures/pug/b.pug',
                'fixtures/pug/c.pug',
                'fixtures/pug/nested/nested.pug'
            ]);
            done();
        });
        s.write(new Vinyl({ path: 'pug/a.pug' }));
        s.write(new Vinyl({ path: 'pug/b.pug' }));
        s.write(new Vinyl({ path: 'pug/c.pug' }));
        s.write(new Vinyl({ path: 'pug/nested/nested.pug' }));
        s.write(new Vinyl({ path: 'pug/parser.pug' }));
        s.end();
    });
    it('Filter method', (done) => {
        const stream = new stream_1.Stream('fixtures', storage, config.getConfig(), options);
        const s = stream.filter('fixtures/pug/parser.pug');
        s.on('data', (file) => {
            // Because Stream
        });
        s.on('error', (err) => {
            done(err);
        });
        s.on('end', () => {
            assert.deepEqual(passedFiles, [
                'fixtures/pug/parser.pug'
            ]);
            done();
        });
        s.write(new Vinyl({ path: 'pug/a.pug' }));
        s.write(new Vinyl({ path: 'pug/b.pug' }));
        s.write(new Vinyl({ path: 'pug/c.pug' }));
        s.write(new Vinyl({ path: 'pug/nested/nested.pug' }));
        s.write(new Vinyl({ path: 'pug/parser.pug' }));
        s.end();
    });
});
