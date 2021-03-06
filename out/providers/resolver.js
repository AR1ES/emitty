'use strict';
const micromatch = require("micromatch");
const paths_1 = require("../utils/paths");
class Resolver {
    constructor(storage) {
        this.storage = storage;
        // :)
    }
    /**
     * Returns all files that depends on the specified file.
     */
    getDependencies(filepath) {
        filepath = paths_1.normalize(filepath);
        if (!this.storage.has(filepath)) {
            return [filepath];
        }
        const dependencies = this.traverse(filepath, this.storage.keys(), [], 1000);
        dependencies.unshift(filepath);
        return dependencies;
    }
    /**
     * Returns True if A depends on B.
     */
    checkDependency(filepath, filepathToCheck) {
        filepathToCheck = paths_1.normalize(filepathToCheck);
        return this.getDependencies(filepath).indexOf(filepathToCheck) !== -1;
    }
    traverse(filepath, keys, result, maxIterations) {
        const dependencies = this.storage.get(filepath).dependencies;
        // Prevent infinite recursion
        maxIterations--;
        for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i];
            if (result.indexOf(dependency) === -1) {
                result.push(dependency);
            }
            const matches = micromatch(keys, dependency);
            for (let j = 0; j < matches.length; j++) {
                const match = matches[j];
                if (match === filepath) {
                    continue;
                }
                if (result.indexOf(match) === -1) {
                    result.push(match);
                }
                if (this.storage.has(match) && maxIterations > -1) {
                    this.traverse(match, keys, result, maxIterations);
                }
            }
        }
        return result;
    }
}
exports.Resolver = Resolver;
