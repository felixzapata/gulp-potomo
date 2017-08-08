'use strict';

var pluginPath = '../index';
var potomo = require(pluginPath);
var gulp = require('gulp');
var fs = require('fs-extra');
var path = require('path');
var should = require('should');
var assert = require('assert');
var sassert = require('stream-assert');
require('mocha');

var fixtures = function(glob) { return path.join(__dirname, './fixtures', glob); }


describe('gulp-potomo', function() {

  var tmpFolder = path.join(__dirname, 'temp');

  // We'll delete it when we're done.
  afterEach(function(done) {
    fs.remove(tmpFolder, done);
  });


  it('1) Should compile PO to MO with msgfmt.', function(done) {

    gulp.src(fixtures('en_GB.po'))
      .pipe(potomo())
      .pipe(sassert.length(1))
      .pipe(gulp.dest(tmpFolder))
      .pipe(sassert.end(function(){
        var expected = fs.readFileSync(path.join(__dirname,'expected/en_GB.mo')).toString();
        var actual = fs.readFileSync(path.join(__dirname, 'temp/en_GB.mo')).toString();
        actual.should.equal(expected);
        done();
      }));


  });

  it('2) Should compile PO to MO with msgfmt.', function(done) {

    gulp.src(fixtures('ne_NP.po'))
      .pipe(potomo())
      .pipe(sassert.length(1))
      .pipe(gulp.dest(tmpFolder))
      .pipe(sassert.end(function(){
        var expected = fs.readFileSync(path.join(__dirname,'expected/ne_NP.mo')).toString();
        var actual = fs.readFileSync(path.join(__dirname, 'temp/ne_NP.mo')).toString();
        actual.should.equal(expected);
        done();
      }))
  });

  it('3) Should emit error on streamed file', function (done) {

      gulp.src(fixtures('*'), { buffer: false })
        .pipe(potomo())
        .on('error', function (err) {
          err.message.should.eql('Streaming not supported');
          done();
       });
   });

   xit('4) Should emit error when file is not found', function (done) {

      var missing = path.join(__dirname, './fixtures', 'foobar.po');
      console.log(missing);
      gulp.src(missing)
        .pipe(potomo())
        .on('error', function (err) {
          err.message.should.eql('Source file ' + missing + ' not found.');
          done();
       });
   });

    it('5) Should compile PO to MO with msgfmt when path has a space.', function(done) {

        gulp.src(path.join(__dirname, './fixtures/directory with spaces', 'en_GB.po'))
            .pipe(potomo())
            .pipe(sassert.length(1))
            .pipe(gulp.dest(tmpFolder))
            .pipe(sassert.end(function(){
                var expected = fs.readFileSync(path.join(__dirname,'expected/en_GB.mo')).toString();
                var actual = fs.readFileSync(path.join(__dirname, 'temp/en_GB.mo')).toString();
                actual.should.equal(expected);
                done();
            }));


    });

});
