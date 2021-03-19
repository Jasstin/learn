"use strict";

var fs = require('fs');

var util = require('util');

var data; //  同步读取文件

try {
  data = fs.readFileSync('./extra/1.js', 'utf-8');
  console.log(data, 'data');
} catch (e) {
  console.log(e);
}

console.log('---------------'); //  异步读取文件

fs.readFile('./extra/1.js', 'utf-8', function (err, cont) {
  if (err) {
    return console.log(err);
  }

  console.log(cont);
});
console.log('-----------------------------------');
var readfile = util.promisify(fs.readFile);

(function _callee() {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(readfile('./extra/1.js', 'utf-8'));

        case 2:
          data = _context.sent;
          console.log('data:', data);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
})();

console.log('----------------------------------------');
fs.createReadStream('./extra/1.js').on('data', function (chunk) {
  console.log('二进制文件读取', chunk);
  console.log('********************');
}).on('error', function (err) {
  console.log('error', err);
});
console.log('--------------------------------------');