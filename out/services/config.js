'use strict';
exports.builtInConfigs = {
    jade: {
        extensions: ['.jade'],
        matcher: /(?:^|:)\s*(?:include|extends):?.*\s+(.*)/,
        comments: {
            start: '//',
            end: ''
        },
        indentBased: true
    },
    pug: {
        extends: 'jade',
        extensions: ['.pug']
    },
    nunjucks: {
        extensions: ['.njk'],
        matcher: /{%\s*(?:include|import|extends)\s['"]([^'"]+)['"]\s.*?%}/,
        comments: {
            start: '{#',
            end: '#}'
        }
    },
    sugarml: {
        extends: 'pug',
        extensions: ['.sgr', '.sml'],
        matcher: /(?:^|:)\s*(?:include|extends)\(?src=['"]([^'"]+)['"].*\)/
    },
    posthtml: {
        extensions: ['.html'],
        matcher: /<(?:extends|include).*?src=['"]([^'"]+)['"].*?>/,
        comments: {
            start: '<!--',
            end: '-->'
        }
    },
    less: {
        extensions: ['.less'],
        matcher: /@import.*?['"]([^'"]+)['"]\s*/,
        comments: {
            start: '//',
            end: '\n'
        }
    },
    stylus: {
        extensions: ['.styl'],
        matcher: /^\s*@(?:import|require).*?['"]([^'"]+)['"]\s*/,
        comments: {
            start: '//',
            end: '\n'
        },
        indentBased: true
    },
    sass: {
        extends: 'less',
        extensions: ['.sass'],
        indentBased: true
    },
    scss: {
        extends: 'less',
        extensions: ['.scss']
    }
};
class Config {
    constructor(language) {
        if (typeof language === 'object') {
            this.matcher = language.matcher;
            this.extensions = language.extensions;
            this.extends = language.extends;
            this.comments = language.comments;
            this.assertExtensions();
            this.assertMatcher();
            this.assertComments();
            this.config = this.resolveConfig(language);
            return;
        }
        if (typeof language === 'string') {
            this.config = this.resolveConfig({ extends: language });
            return;
        }
        throw new TypeError('language must be a string or an object');
    }
    getConfig() {
        return this.config;
    }
    assertExtensions() {
        if ((!this.extends && !this.extensions) || (this.extensions && !Array.isArray(this.extensions))) {
            throw new TypeError('the "extensions" field must be an Array of strings');
        }
    }
    assertMatcher() {
        if ((!this.extends && !this.matcher) || (this.matcher && this.matcher instanceof RegExp === false)) {
            throw new TypeError('the "matcher" field must be a RegExp');
        }
    }
    assertComments() {
        let showError = false;
        if (!this.extends && !this.comments) {
            showError = true;
        }
        else if (!this.extends && this.comments && this.comments.start && this.comments.end) {
            if (typeof this.comments.start !== 'string' || typeof this.comments.end !== 'string') {
                showError = true;
            }
        }
        if (showError) {
            throw new TypeError('the "comment.start" and "comment.end" fields must be a string');
        }
    }
    assertName(name) {
        if (!exports.builtInConfigs.hasOwnProperty(name)) {
            throw new Error(`the configuration "${name}" clound not found`);
        }
    }
    resolveConfig(language) {
        if (!language.extends) {
            return language;
        }
        this.assertName(language.extends);
        let config = Object.assign({}, exports.builtInConfigs[language.extends]);
        while (config.extends) {
            const next = Object.assign({}, exports.builtInConfigs[config.extends]);
            delete config.extends;
            config = Object.assign(next, config);
        }
        delete language.extends;
        return Object.assign(config, language);
    }
}
exports.Config = Config;
