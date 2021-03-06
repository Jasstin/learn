var path = require('path');
var fs = require('fs');
const { resourceLimits } = require('worker_threads');

function getFileInDir(dir) {
    var dirList = [path.resolve(dir)];
    var fileList = fs.readdirSync(dir, 'utf-8');
    fileList.forEach(function (file) {
        file = path.resolve(dir, file);
        var stas = fs.statSync(file);
        if (stas.isFile()) {
            dirList.push(file);
        } else if (stas.isDirectory()) {
            dirList.concat(getFileInDir(file));
        }
    });
    return dirList;
}

console.log(getFileInDir('../'));