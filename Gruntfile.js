/*
 * node-couch
 * https://github.com/Hyddan/node-couch
 *
 * Copyright (c) 2016 Daniel Hedenius
 * Licensed under the WTFPL-2.0 license.
 */

'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: {
            options: {
                force: true
            },
            lib: [
                'lib/**/*'
            ]
        },
        copy: {
            src: {
                files: [{
                    cwd: 'src/',
                    dest: 'lib/',
                    expand: true,
                    src: ['**/*']
                }]
            }
        },
        jasmine_nodejs: {
            nodeCouch: {
                specs: [
                    'test/specs/**/*.js',
                    '!test/specs/**/*-partial.js'
                ]
            }
        }
    });

    grunt.registerTask('compile', ['clean:lib', 'copy:src']);
    grunt.registerTask('test', ['jasmine_nodejs']);
    grunt.registerTask('default', ['compile', 'test']);
};