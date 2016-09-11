/**
 * Created by stripa4 on 28/08/16.
 */
var http = require('http');
let request = require('request');
let argv = require('yargs').argv;
let scheme = 'http://';
let host = argv.host || '127.0.0.1';
let port = argv.port || (host === '127.0.0.1' ? 8000 : 80);
// Build the destinationUrl using the --host value
let destinationUrl = scheme + host + ':' + port;

let path = require('path');
let fs = require('fs');
let logPath = argv.log && path.join(__dirname, argv.log);
let logStream = logPath ? fs.createWriteStream(logPath) : process.stdout;

var echoServer = http.createServer((request, response) => {
    for (let header in request.headers) {
        response.setHeader(header, request.headers[header])
    }
    request.pipe(response);
    });
echoServer.listen(8000);


http.createServer((req,res) => {
    logStream.write('Request headers: ' + JSON.stringify(req.headers));
    req.pipe(logStream, {end: false});
    let options = {
        headers: req.headers,
        url: `${destinationUrl}${req.url}`
    };
    options.method = req.method;
    var downstreamResponse = req.pipe(request(options));
    downstreamResponse.pipe(process.stdout);
    downstreamResponse.pipe(res);
}).listen(8001);