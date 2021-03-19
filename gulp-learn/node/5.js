var fs = require('fs');
var util = require('util');
fs.access('./extra/5.js', function (err) {
    if (err) return console.log(err);
    console.log('文件存在');
})

var mkdir = util.promisify(fs.mkdir);
var access = util.promisify(fs.access);
(async () => {
    if (await access('./test')) {
        await mkdir('./test');
    }
    access('./test/index.js').then(res => {
        fs.readFile('./test/index.js', 'utf-8', function (err, con) {
            console.log(con);
        });
    }).catch(err => {
        fs.writeFileSync('./test/index.js', '这是一段测试文本');
    });
})();