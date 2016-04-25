/*
 * gulp-potomo
 * https://github.com/felixzapata/gulp-potomo
 *
 * Copyright (c) 2016 Félix Zapata
 * Licensed under the ISC license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var R = require('ramda');
var through = require('through2');
var shell = require( 'shelljs' );
var PLUGIN_NAME = 'gulp-potomo';


function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function gulppotomo(customOptions, cb) {

  var defaultOptions = {
			poDel: false
  };

  var options = customOptions ? R.merge(defaultOptions, customOptions) : defaultOptions;
  
  function bufferContents(file, enc, cb) {
    
    /* jshint validthis: true */
    
    // Return warning if not found msgfmt command
		if ( ! shell.which( 'msgfmt' ) ) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'GNU gettext is not installed in your system PATH.'));
      cb();
      return;
    }

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      cb();
      return;
    }

    this.push(file);

    cb();


  }

  return through.obj(bufferContents, cb);

}

// Exporting the plugin main function
module.exports = gulppotomo;