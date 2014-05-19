'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var LIVERELOAD_PORT = 35729;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/**\n' + ' * <%= pkg.name %>\n' +
        ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * @author <%= pkg.author.name %>\n' +
        ' * @link <%= pkg.homepage %>\n' +
        ' * @license <%= pkg.license %>\n */\n\n'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      test: {
        src: ['test/spec/**/*.js']
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      unit: {
        browsers: ['PhantomJS']
      },
      local: {
        browsers: ['Chrome']
      }
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>',
        process: function (src) {
          return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        }
      },
      src: {
        src: ['src/**/*.js'],
        dest: 'dist/angular-highcharts.js'
      }
    },
    ngmin: {
      src: {
        src: '<%= concat.src.dest %>',
        dest: '<%= concat.src.dest %>'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      src: {
        files: {
          'dist/angular-highcharts.min.js': '<%= concat.src.dest %>'
        }
      }
    },
    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:unit']
      },
      docs: {
        files: ['src/**/*.js', 'test/**/*.js', 'docs/content/**/*'],
        tasks: ['gendoc'],
        options: {
          livereload: LIVERELOAD_PORT
        }
      }
    },
    clean: {
      docs: {
        dot: true,
        src: ['docs/*', '!docs/content/**']
      }
    },
    compass: {
      docs: {
        options: {
          sassDir: 'docs/content/css',
          cssDir: 'docs/content/css'
        }
      }
    },
    ngdocs: {
      options: {
        dest: 'docs/docs',
        html5Mode: false,
        title: 'angular-highcharts',
        titleLink: '/',
        startPage: '/guide',
        styles: ['docs/content/css/styles.css'],
        navTemplate: 'docs/content/html/nav.html',
        analytics: {
          account: 'UA-49037569-5',
          domainName: 'angular-highcharts.github.io'
        }
      },
      guide: {
        src: ['docs/content/guide/*.ngdoc'],
        title: 'Guide'
      },
      api: {
        src: [
          'src/**/*.js',
          'docs/content/api/*.ngdoc'
        ],
        title: 'API Documentation'
      }
    },
    copy: {
      docs_index: {
        files: [
          {
            src: ['index.html'],
            dest: 'docs/',
            cwd: 'docs/content/html/',
            expand: true
          }
        ]
      }
    },
    connect: {
      docs: {
        options: {
          open: {
            target: 'http://127.0.0.1:9005'
          },
          port: 9005,
          base: 'docs',
          livereload: LIVERELOAD_PORT
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint:all', 'karma:unit']);
  grunt.registerTask('test', ['jshint:all', 'karma:unit']);
  grunt.registerTask('build', ['jshint:all', 'karma:unit', 'concat:src', 'ngmin', 'uglify']);

  // Documentation generation
  grunt.registerTask('gendoc', ['clean:docs', 'compass:docs', 'ngdocs', 'copy:docs_index']);
  // Documentation server
  grunt.registerTask('docs', ['gendoc', 'connect:docs', 'watch:docs']);

  // dgeni documentation
  grunt.registerTask('dgeni', 'Generate docs via Dgeni.', function() {
    var dgeni = require('dgeni');
    var done = this.async();

    var generateDocs = dgeni.generator('dgeni/dgeni.conf.js');
    generateDocs().then(done);
  });

  // For development purpose.
  grunt.registerTask('debug', ['jshint:all', 'karma:unit', 'watch:scripts']);
};
