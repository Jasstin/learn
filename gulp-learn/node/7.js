var http = require('http');
var url = require('url');
var queryString = require('querystring');
var server = http.createServer(function (req, res) {
    var r = {
        url: url.parse(req.url),
        httpVersion: req.httpVersion,
        method: req.method,
        headers: req.headers,
        search: queryString.parse(url.parse(req.url).query)
    }
    res.end(JSON.stringify(r));
});
server.listen(3000);