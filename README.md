# gulp-potomo

[![Build Status](https://travis-ci.org/felixzapata/gulp-potomo.png)](https://travis-ci.org/felixzapata/gulp-potomo)

[![Package Quality](http://npm.packagequality.com/badge/gulp-potomo.png)](http://npm.packagequality.com/badge/gulp-potomo.png)

A Gulp plugin to compile .po files into binary .mo files with msgfmt.

Inspired by [grunt-potomo](https://github.com/axisthemes/grunt-potomo).

## Requirements
* This plugin requires Gulp
* [GNU gettext](http://www.gnu.org/software/gettext/) installed and in your PATH. Installation instructions: [Mac](http://brewformulas.org/Gettext), [Windows](http://gnuwin32.sourceforge.net/packages/gettext.htm) and [Linux](http://ftp.gnu.org/pub/gnu/gettext/)

## Getting Started

```shell
npm install gulp-potomo --save-dev
```

## The "potomo" task

### Options

#### options.poDel
Type: `Boolean`  
Default: `false`

Whether the `PO` file(s) used from source should be deleted or remove after the creation of `MO` file(s).

### Example config

```js
var options: {                       
  poDel: true
};

gulp.src(['en_GB.po', 'ne_NP.po'])
  .pipe(potomo(options))
  .pipe(gulp.dest('dest/languages'));
```

## License

ISC © [Félix Zapata](http://github.com/felixzapata)