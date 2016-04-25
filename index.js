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
var chalk = require('chalk');
var through = require('through2');
var shell = require('shelljs');
var PLUGIN_NAME = 'gulp-potomo';


function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function gulpPotomo(customOptions, cb) {

  var defaultOptions = {
    poDel: false
  };

  var options = customOptions ? R.merge(defaultOptions, customOptions) : defaultOptions;

  function bufferContents(file, enc, cb) {
    
    /* jshint validthis: true */

    // Return warning if not found msgfmt command
    if (!shell.which('msgfmt')) {
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

    
    if(!fileExists(file.path)){
      this.emit('error', new PluginError(PLUGIN_NAME, 'Source file "' + file.path + '" not found.'));
      cb();
      return;
    }
    
    // Run external tool synchronously.
    var command = 'msgfmt -o ' + file.dest + ' ' + file.src[0];
    if (shell.exec(command).code !== 0) {
      console.log(chalk.red('Failed to Compile "*.po" files into binary "*.mo" files with "msgfmt".'));
      shell.exit(1);
    } else {
      console.log('File ' + chalk.cyan(file.dest) + ' Created.');
    }

    // Delete Source PO file(s).
    if (options.poDel && fileExists(file.src[0])) {
      fs.removeSync(file.src[0]);
    }

		// Process the Message.
		if (this.files.length > 1) {
      var message = "Total compiled " + this.files.length + ' ".mo" files.';
      if (options.poDel) {
        message = "Total compiled " + this.files.length + " and deleted " + this.files.length + ' ".po" files.';
      }
      console.log(chalk.green(message));
    }
   
    this.push(file);

    cb();

  }

  return through.obj(bufferContents, cb);

}

// Exporting the plugin main function
module.exports = gulpPotomo;