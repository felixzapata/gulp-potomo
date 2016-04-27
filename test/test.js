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

  beforeEach(function(done) {
    var folder = path.join(__dirname, './fixtures/');
    fs.copy(folder, tmpFolder, function(err) {
      done();
    });
  });

  // We'll delete it when we're done.
  afterEach(function(done) {
    fs.remove(tmpFolder, done);
  });


  it('1) Should compile PO to MO with msgfmt.', function(done) {

    gulp.src(fixtures('en_GB.po'))
      .pipe(potomo())
      .pipe(sassert.first(function() {
        var expected = fs.readFileSync(path.join(__dirname,'expected/en_GB.mo')).toString();
        var actual = fs.readFileSync(path.join(__dirname, '../', 'en_GB.mo')).toString();
        actual.should.equal(expected);
      }))
      .pipe(sassert.end(done));


  });

  it('2) Should compile PO to MO with msgfmt.', function(done) {

    gulp.src(fixtures('ne_NP.po'))
      .pipe(potomo())
      .pipe(sassert.first(function() {
        var expected = fs.readFileSync(path.join(__dirname,'expected/ne_NP.mo')).toString();
        var actual = fs.readFileSync(path.join(__dirname, '../', 'ne_NP.mo')).toString();
        actual.should.equal(expected);

      }))
      .pipe(sassert.end(done));

  });
  
  it('3) Should emit error on streamed file', function (done) {
    
      gulp.src(fixtures('*'), { buffer: false })
        .pipe(potomo())
        .on('error', function (err) {
          err.message.should.eql('Streaming not supported');
          done();
        });
    });

});
