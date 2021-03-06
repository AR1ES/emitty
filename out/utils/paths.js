'use strict';
const path = require("path");
// RegExp's
const reGlobBaseName = /^\*\*\/([\w\.-]+)\/?$/;
function normalize(filepath) {
    return filepath.replace(/\\/g, '/');
}
exports.normalize = normalize;
function join(a, b) {
    return normalize(path.join(a, b));
}
exports.join = join;
function relative(from, to) {
    return normalize(path.relative(from, to));
}
exports.relative = relative;
function expandGlobPatterns(toExclude) {
    const result = toExclude;
    // Expand **/name to  **/name + **/name/**
    if (result) {
        toExclude.forEach((pattern) => {
            if (reGlobBaseName.test(pattern)) {
                result.push(pattern + '/**');
            }
        });
    }
    return result;
}
exports.expandGlobPatterns = expandGlobPatterns;
