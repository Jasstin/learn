"use strict";

/**
 * zlib
 */
var fs = require('fs');

var zlib = require('zlib');

var gzip = zlib.createGzip();
var infile = fs.createReadStream('./extra/1.js');
var outfile = fs.createWriteStream('./extra/1.js.gz');
infile.pipe(gzip).pipe(outfile);
var gunZip = zlib.createGunzip();
var infile = fs.createReadStream('./extra/1.js.gz');
var outfile = fs.createWriteStream('./extra/2.js');
infile.pipe(gzip).pipe(outfile);