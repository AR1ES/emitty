'use strict';
const fs = require("fs");
function pathExists(filepath) {
    return new Promise((resolve) => {
        fs.access(filepath, (err) => {
            resolve(!err);
        });
    });
}
exports.pathExists = pathExists;
function pathExistsSync(filepath) {
    return fs.existsSync(filepath);
}
exports.pathExistsSync = pathExistsSync;
function readFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString());
        });
    });
}
exports.readFile = readFile;
function statFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) {
                return reject(err);
            }
            resolve(stat);
        });
    });
}
exports.statFile = statFile;
