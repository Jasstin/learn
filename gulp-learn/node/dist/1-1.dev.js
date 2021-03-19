"use strict";

var _require = require('util'),
    promisify = _require.promisify;

var exec = promisify(require('child_process').exec);
exec('node -v').then(function (res) {
  console.log(res);
  var stdout = res.stdout,
      stderr = res.stderr;
  console.log(stdout);
  console.log(stderr);
});
console.log('------------------');

(function _callee() {
  var _ref, stdout, stderr;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(exec('node -v'));

        case 2:
          _ref = _context.sent;
          stdout = _ref.stdout;
          stderr = _ref.stderr;
          console.log('stdout:', stdout, 'stderr:', stderr);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
})();