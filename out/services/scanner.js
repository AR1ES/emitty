'use strict';
const path = require("path");
const readdir = require("readdir-enhanced");
const micromatch = require("micromatch");
const dependencies_1 = require("../parser/dependencies");
const paths_1 = require("../utils/paths");
const fs_1 = require("../utils/fs");
class Scanner {
    constructor(root, storage, language, options) {
        this.root = root;
        this.storage = storage;
        this.language = language;
        this.options = options;
        this.excludePatterns = [];
        this.excludePatterns = this.options.scanner.exclude;
    }
    scan(filepath, stats) {
        if (filepath && this.storage.keys().length !== 0) {
            return this.scanFile(filepath, stats);
        }
        return this.scanDirectory();
    }
    scanFile(filepath, stats) {
        let statPromise;
        if (stats) {
            statPromise = fs_1.pathExists(filepath).then((exists) => {
                if (exists) {
                    return Promise.resolve(stats);
                }
            });
        }
        else {
            statPromise = fs_1.statFile(filepath);
        }
        return statPromise.then((stat) => {
            const entry = this.makeEntryFile(filepath, stat.ctime);
            return this.makeDependenciesForDocument(entry);
        });
    }
    /**
     * Scans directory and saves the dependencies for each file in the Storage.
     */
    scanDirectory() {
        const listOfPromises = [];
        // Drop previous changed file
        this.changedFile = null;
        return new Promise((resolve, reject) => {
            const stream = readdir.readdirStreamStat(this.root, {
                basePath: path.resolve(this.root),
                filter: (stat) => this.scannerFilter(stat),
                deep: this.options.scanner.depth
            });
            stream.on('data', () => {
                // Because Stream
            });
            stream.on('file', (stat) => {
                const entry = this.makeEntryFile(stat.path, stat.ctime);
                // Return Cache if it exists and not outdated
                const entryFilePath = paths_1.relative(process.cwd(), entry.filepath);
                const cached = this.storage.get(entryFilePath);
                if (cached && cached.ctime >= entry.ctime) {
                    listOfPromises.push(cached);
                    return;
                }
                this.changedFile = entryFilePath;
                listOfPromises.push(this.makeDependenciesForDocument(entry));
            });
            stream.on('end', () => {
                Promise.all(listOfPromises).then(() => {
                    resolve(this.changedFile);
                });
            });
        });
    }
    makeDependenciesForDocument(entry) {
        // Remove base path
        const entryFilePath = paths_1.relative(process.cwd(), entry.filepath);
        const entryDir = path.dirname(entryFilePath);
        return fs_1.readFile(entry.filepath).then((data) => {
            const item = {
                dependencies: dependencies_1.parseDependencies(data, this.language),
                ctime: entry.ctime
            };
            // Calculating the path relative to the root directory
            item.dependencies = item.dependencies.map((filepath) => {
                if (!path.extname(filepath)) {
                    filepath = filepath + this.language.extensions[0];
                }
                return paths_1.join(entryDir, filepath);
            });
            this.storage.set(entryFilePath, item);
        });
    }
    makeEntryFile(filepath, ctime) {
        return {
            filepath,
            ctime: ctime.getTime()
        };
    }
    scannerFilter(stat) {
        if (this.excludePatterns && micromatch(stat.path, this.excludePatterns).length !== 0) {
            return false;
        }
        else if (stat.isFile()) {
            return this.language.extensions.indexOf(path.extname(stat.path)) !== -1;
        }
        return true;
    }
}
exports.Scanner = Scanner;
