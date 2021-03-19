var fs = require('fs');
var util = require('util');
var data;
//  同步读取文件
try {
    data = fs.readFileSync('./extra/1.js', 'utf-8');
    console.log(data, 'data');
} catch (e) {
    console.log(e);
}
console.log('---------------');
//  异步读取文件
fs.readFile('./extra/1.js', 'utf-8', function (err, cont) {
    if (err) {
        return console.log(err);
    }
    console.log(cont);
})
console.log('-----------------------------------');
var readfile = util.promisify(fs.readFile);
(async () => {
    const data = await readfile('./extra/1.js', 'utf-8');
    console.log('data:', data);
})();
console.log('----------------------------------------');
fs.createReadStream('./extra/1.js').on('data', function (chunk) {
    console.log('二进制文件读取', chunk);
    console.log('********************')
}).on('error', function (err) {
    console.log('error',err);
});
console.log('--------------------------------------');
