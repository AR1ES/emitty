'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path = require("path");
const through2 = require("through2");
const Vinyl = require("vinyl");
const scanner_1 = require("../services/scanner");
const resolver_1 = require("../providers/resolver");
const paths_1 = require("../utils/paths");
const fs_1 = require("../utils/fs");
class Stream {
    constructor(root, storage, language, options) {
        this.root = root;
        this.storage = storage;
        this.language = language;
        this.options = options;
        this.scanner = new scanner_1.Scanner(root, storage, language, options);
        this.resolver = new resolver_1.Resolver(storage);
    }
    /**
     * Starts scanning the directory and push Vinyl file to a Stream if it is required.
     */
    run(filepath, stats) {
        const _this = this;
        // Protection against undefined
        if (typeof filepath !== 'string') {
            filepath = null;
            stats = null;
        }
        return through2.obj(function (file, enc, cb) {
            let mainFile = _this.makeMainFilePath(_this.root, file);
            // Update Storage
            _this.scanner.scan(filepath, stats).then((lastChangedFile) => {
                // Protection against bad paths
                if (!filepath && !lastChangedFile) {
                    _this.pushFile(this, file, mainFile);
                    return cb();
                }
                filepath = filepath ? filepath : lastChangedFile;
                _this.filterFileByDependencies(filepath, mainFile, this, file, cb);
            }).catch(cb);
        });
    }
    /**
     * Push Vinyl file to a Stream if it is required.
     */
    filter(filepath) {
        const _this = this;
        return through2.obj(function (file, enc, cb) {
            let mainFile = _this.makeMainFilePath(_this.root, file);
            // Protection against bad paths
            if (!filepath) {
                _this.pushFile(this, file, mainFile);
                return cb();
            }
            _this.filterFileByDependencies(filepath, mainFile, this, file, cb);
        });
    }
    /**
     * Determines whether to send the Vinyl file to a Stream.
     */
    filterFileByDependencies(filepath, mainFile, streamCtx, file, cb) {
        const changedFile = paths_1.normalize(filepath);
        if (this.resolver.checkDependency(mainFile, changedFile)) {
            if (this.options.makeVinylFile) {
                return this.makeVinylFile(mainFile).then((vFile) => {
                    this.pushFile(streamCtx, vFile, mainFile);
                    return cb();
                });
            }
            this.pushFile(streamCtx, file, mainFile);
            return cb();
        }
        return cb();
    }
    /**
     * Push Vinyl file to a Stream.
     */
    pushFile(ctx, file, filepath) {
        ctx.push(file);
        this.options.log(filepath);
    }
    /**
     * Calculates relative path of the Vinyl file in Stream.
     */
    makeMainFilePath(root, file) {
        let filepath = '';
        if (file.path) {
            filepath = path.relative(file.cwd, file.path);
        }
        if (!filepath.startsWith(root)) {
            filepath = path.join(root, filepath);
        }
        return paths_1.normalize(filepath);
    }
    /**
     * Creates Vinyl File for filepath.
     */
    makeVinylFile(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield fs_1.pathExists(filepath);
            if (!exists) {
                return null;
            }
            const stat = yield fs_1.statFile(filepath);
            const content = yield fs_1.readFile(filepath);
            const fullpath = path.join(process.cwd(), filepath);
            return new Vinyl({
                base: path.dirname(fullpath),
                path: fullpath,
                contents: new Buffer(content),
                stat
            });
        });
    }
}
exports.Stream = Stream;
