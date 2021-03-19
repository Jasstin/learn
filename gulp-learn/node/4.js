var fs = require('fs');
var fileCont = fs.readFileSync('./extra/1.jpg');
fs.writeFile('./extra/2.jpg', fileCont, function (error) {
    if (error) throw error;
    console.log('文件写入成功');
});

