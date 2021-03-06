'use strict';
const storage_1 = require("./services/storage");
const config_1 = require("./services/config");
const scanner_1 = require("./services/scanner");
const resolver_1 = require("./providers/resolver");
const stream_1 = require("./providers/stream");
const paths_1 = require("./utils/paths");
const fs_1 = require("./utils/fs");
function assertInput(directory, language) {
    if (!directory) {
        throw new TypeError('directory must be a string');
    }
    const type = typeof language;
    if (!language || (type !== 'string' && type !== 'object')) {
        throw new TypeError('language must be a string or an object');
    }
    if (!fs_1.pathExistsSync(directory)) {
        throw new Error('directory must exist');
    }
}
function setup(root, language, options) {
    assertInput(root, language);
    const storage = new storage_1.Storage();
    options = Object.assign({
        snapshot: {},
        cleanupInterval: null,
        log: (filepath) => console.log,
        vinylFile: false
    }, options);
    options.scanner = Object.assign({
        depth: 30,
        exclude: ['.git', '**/node_modules', '**/bower_components']
    }, options.scanner);
    // Loading data if provided dependency tree
    if (options.snapshot) {
        storage.load(options.snapshot);
    }
    // Run invalidation
    if (options.cleanupInterval) {
        storage.startInvalidation(options.cleanupInterval * 1000);
    }
    // Expanding of Glob-patterns that should be excluded during scanning
    if (options.scanner.exclude) {
        options.scanner.exclude = paths_1.expandGlobPatterns(options.scanner.exclude);
    }
    root = paths_1.normalize(root);
    const config = new config_1.Config(language);
    const scanner = new scanner_1.Scanner(root, storage, config.getConfig(), options);
    const resolver = new resolver_1.Resolver(storage);
    const stream = new stream_1.Stream(root, storage, config.getConfig(), options);
    return {
        storage: () => storage.snapshot(),
        keys: () => storage.keys(),
        load: (snapshot) => storage.load(snapshot),
        scan: (filepath, stats) => scanner.scan(filepath, stats),
        resolver,
        stream: (filepath, stats) => stream.run(filepath, stats),
        filter: (filepath) => stream.filter(filepath)
    };
}
exports.setup = setup;
