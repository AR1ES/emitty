/// <reference types="node" />
import * as fs from 'fs';
import { ILanguage } from './config';
import { Storage } from './storage';
import { IOptions } from '../emitty';
export interface IFile {
    filepath: string;
    ctime: number;
}
export declare class Scanner {
    private root;
    private storage;
    private language;
    private options;
    private changedFile;
    private excludePatterns;
    constructor(root: string, storage: Storage, language: ILanguage, options: IOptions);
    scan(filepath?: string, stats?: fs.Stats): Promise<any>;
    private scanFile(filepath, stats);
    /**
     * Scans directory and saves the dependencies for each file in the Storage.
     */
    private scanDirectory();
    private makeDependenciesForDocument(entry);
    private makeEntryFile(filepath, ctime);
    private scannerFilter(stat);
}
