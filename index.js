/**
 * Created by stripa4 on 28/08/16.
 */
var http = require('http');
let request = require('request');
let destinationUrl = '127.0.0.1:8000';

var echoServer = http.createServer((request, response) => {
    for (let header in request.headers) {
        response.setHeader(header, request.headers[header])
    }
    request.pipe(response);
    });
echoServer.listen(8000);


http.createServer((req,res) => {
    process.stdout.write('\n\n\n' + JSON.stringify(req.headers))
    req.pipe(process.stdout);
    let options = {
        headers: req.headers,
        url: `http://${destinationUrl}${req.url}`
    };
    options.method = req.method;
    var downstreamResponse = req.pipe(request(options));
    downstreamResponse.pipe(process.stdout);
    downstreamResponse.pid(res);
}).listen(9000);