"use strict";

var fs = require('fs');

var util = require('util');

fs.access('./extra/5.js', function (err) {
  if (err) return console.log(err);
  console.log('文件存在');
});
var mkdir = util.promisify(fs.mkdir);
var access = util.promisify(fs.access);

(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(access('./test'));

        case 2:
          if (!_context.sent) {
            _context.next = 5;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(mkdir('./test'));

        case 5:
          access('./test/index.js').then(function (res) {
            fs.readFile('./test/index.js', 'utf-8', function (err, con) {
              console.log(con);
            });
          })["catch"](function (err) {
            fs.writeFileSync('./test/index.js', '这是一段测试文本');
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
})();