module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/**\n' + ' * <%= pkg.name %>\n' +
		' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
		' * @author <%= pkg.author.name %>\n' +
		' * @link <%= pkg.homepage %>\n' +
        ' * @license <%= pkg.license %>\n */\n\n'
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        tasks: ['jshint', 'karma:unit']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['src/**/*.js'],
        tasks: ['jshint', 'karma:unit', 'concat', 'copy:demo']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        eqeqeq: true,
        globals: {
          angular: true
        }
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
        process: function(src, filepath) {
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
    }

  });

  grunt.registerTask('default', ['jshint', 'karma:unit']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('build', ['jshint', 'karma:unit', 'concat:src', 'ngmin', 'uglify']);

  // For development purpose.
  grunt.registerTask('dev', ['jshint', 'karma:unit',  'concat', 'copy:demo', 'watch:livereload']);
};
