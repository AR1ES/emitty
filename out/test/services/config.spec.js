'use strict';
const assert = require("assert");
const config_1 = require("../../services/config");
describe('Services/Config', () => {
    it('Error by non-exists language', () => {
        try {
            new config_1.Config('none');
        }
        catch (err) {
            assert.equal(err, 'Error: the configuration "none" clound not found');
        }
    });
    it('Error by language without extensions and extends', () => {
        try {
            new config_1.Config({});
        }
        catch (err) {
            assert.equal(err, 'TypeError: the "extensions" field must be an Array of strings');
        }
    });
    it('Error by language with broken extensions', () => {
        try {
            new config_1.Config({ extensions: 1 });
        }
        catch (err) {
            assert.equal(err, 'TypeError: the "extensions" field must be an Array of strings');
        }
    });
    it('Error by language with extensions, but without matcher', () => {
        try {
            new config_1.Config({ extensions: ['.pug'] });
        }
        catch (err) {
            assert.equal(err, 'TypeError: the "matcher" field must be a RegExp');
        }
    });
    it('Error by language with broken matcher', () => {
        try {
            new config_1.Config({ extensions: ['.pug'], matcher: 1 });
        }
        catch (err) {
            assert.equal(err, 'TypeError: the "matcher" field must be a RegExp');
        }
    });
    it('Error by language with non-exists extends', () => {
        try {
            new config_1.Config({ extends: 'nope' });
        }
        catch (err) {
            assert.equal(err, 'Error: the configuration "nope" clound not found');
        }
    });
    it('Built-in language config', () => {
        const config = new config_1.Config('jade').getConfig();
        assert.deepEqual(config, config_1.builtInConfigs.jade);
    });
    it('Custom language config', () => {
        const customConfig = {
            extensions: ['.hello'],
            matcher: /hello/,
            comments: {
                start: '',
                end: ''
            }
        };
        const config = new config_1.Config(customConfig).getConfig();
        assert.deepEqual(config, customConfig);
    });
    it('Custom language config with extends', () => {
        const customConfig = {
            extends: 'pug',
            extensions: ['.hello'],
            matcher: /hello/
        };
        const config = new config_1.Config(customConfig).getConfig();
        assert.deepEqual(config, {
            extensions: ['.hello'],
            matcher: /hello/,
            indentBased: true,
            comments: {
                start: '//',
                end: ''
            }
        });
    });
});
