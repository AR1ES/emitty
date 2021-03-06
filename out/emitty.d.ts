/// <reference types="node" />
import * as fs from 'fs';
import * as stream from 'stream';
import { IStorage } from './services/storage';
import { ILanguage } from './services/config';
import { Resolver } from './providers/resolver';
export interface IScannerOptions {
    /**
     * The maximum number of nested directories to scan.
     */
    depth?: number;
    /**
     * List of Glob-patterns for directories that are excluded when scanning.
     */
    exclude?: string[];
}
export interface IOptions {
    /**
     * You can load the previous state of the project in the Storage using this option.
     */
    snapshot?: IStorage;
    /**
     * The function that will be called if the file needs to be compiled.
     */
    log?: (filepath: string) => void;
    /**
     * Cleanup interval time in seconds for Storage.
     */
    cleanupInterval?: number;
    /**
     * Options for Scanner.
     */
    scanner?: IScannerOptions;
    /**
     * Creates a Vinyl file for the file which should be compiled.
     */
    makeVinylFile?: boolean;
}
export interface IEmittyApi {
    /**
     * Returns a snapshot of the Storage.
     */
    storage: () => IStorage;
    /**
     * Returns the keys of the Storage.
     */
    keys: () => string[];
    /**
     * Clears the Storage and loads the new data.
     */
    load: (snapshot: IStorage) => void;
    /**
     * Scans directory and updates the Storage.
     */
    scan: (filepath?: string, stats?: fs.Stats) => Promise<void>;
    /**
     * Returns the methods for determining dependencies.
     */
    resolver: Resolver;
    /**
     * Scans directory or file and updates the Storage.
     */
    stream: (filepath?: string, stats?: fs.Stats) => stream.Transform;
}
export declare function setup(root: string, language: string | ILanguage, options?: IOptions): IEmittyApi;
