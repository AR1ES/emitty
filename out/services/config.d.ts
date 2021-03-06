export interface ILanguageComment {
    start: string;
    end: string;
}
export interface ILanguage {
    extensions?: string[];
    matcher?: RegExp;
    extends?: string;
    comments?: ILanguageComment;
    indentBased?: boolean;
}
export declare const builtInConfigs: {
    jade: ILanguage;
    pug: ILanguage;
    nunjucks: ILanguage;
    sugarml: ILanguage;
    posthtml: ILanguage;
    less: ILanguage;
    stylus: ILanguage;
    sass: ILanguage;
    scss: ILanguage;
};
export declare class Config {
    private matcher;
    private extensions;
    private extends;
    private comments;
    private config;
    constructor(language: string | ILanguage);
    getConfig(): ILanguage;
    private assertExtensions();
    private assertMatcher();
    private assertComments();
    private assertName(name);
    private resolveConfig(language);
}
