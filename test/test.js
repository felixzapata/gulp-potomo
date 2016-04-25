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

var fixtures = function(glob) { return path.join(__dirname, './temp', glob); }


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

    gulp.src(fixtures('en_GB.mo'))
      .pipe(potomo())
      .pipe(sassert.first(function() {
        var actual = fs.readFileSync(fixtures('en_GB.mo')).toString();
        var expected = fs.readFileSync('test/expected/en_GB.mo').toString();
        corrected.should.equal(expected);

      }))
      .pipe(sassert.end(done));


  });

  it('2) Should compile PO to MO with msgfmt.', function(done) {

    gulp.src(fixtures('ne_NP.mo'))
      .pipe(potomo())
      .pipe(sassert.first(function() {

        var actual = fs.readFileSync(fixtures('ne_NP.mo')).toString();
        var expected = fs.readFileSync('test/expected/ne_NP.mo').toString();
        corrected.should.equal(expected);

      }))
      .pipe(sassert.end(done));

  });

});
