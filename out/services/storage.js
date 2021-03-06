'use strict';
class Storage {
    constructor() {
        this.store = {};
        // :)
    }
    load(snapshot) {
        this.store = {};
        Object.keys(snapshot).forEach((uri) => {
            this.set(uri, snapshot[uri]);
        });
    }
    has(uri) {
        return this.store.hasOwnProperty(uri);
    }
    get(uri) {
        return this.store[uri] || null;
    }
    set(uri, item) {
        this.store[uri] = item;
    }
    drop(uri) {
        delete this.store[uri];
    }
    keys() {
        return Object.keys(this.store);
    }
    snapshot() {
        return this.store;
    }
    startInvalidation(timeInterval) {
        this.interval = setInterval(() => {
            const cutoffTime = Date.now() - timeInterval;
            this.keys().forEach((uri) => {
                if (this.get(uri).ctime < cutoffTime) {
                    this.drop(uri);
                }
            });
        }, timeInterval);
    }
    stopInvalidation() {
        clearInterval(this.interval);
    }
}
exports.Storage = Storage;
