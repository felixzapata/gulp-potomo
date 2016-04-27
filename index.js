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
var gutil = require('gulp-util');
var PLUGIN_NAME = 'gulp-potomo';


function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch(e) {
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
    
    var fileDestName;
    var command;
    var message;

    // Return warning if not found msgfmt command
    if (!shell.which('msgfmt')) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'GNU gettext is not installed in your system PATH.'));
      cb();
      return;
    }
    
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
      cb();
      return;
    }

    
    // Run external tool synchronously.
    fileDestName = path.basename(file.path,'.po') + '.mo'; 
    command = 'msgfmt -o ' + fileDestName + ' ' + file.path;
    
    if (shell.exec(command).code !== 0) {
      this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Failed to Compile "*.po" files into binary "*.mo" files with "msgfmt".'));
      cb();
      return;
    } else {
      console.log('File ' + chalk.cyan(fileDestName) + ' Created.');
    }

    // Delete Source PO file(s).
    if (options.poDel && fileExists(file.path)) {
      fs.removeSync(file.path);
    }
    
    // Process the Message.

    message = 'Compiled ' + file.path + ' file.';
    if (options.poDel) {
      message = 'Deleted ' + file.path + ' files.';
    }
    console.log(chalk.green(message));
    
   
    this.push(file);

    cb();

  }

  return through.obj(bufferContents, cb);

}

// Exporting the plugin main function
module.exports = gulpPotomo;