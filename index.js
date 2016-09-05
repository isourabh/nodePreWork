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
console.log("Destination URL "+destinationUrl);
var echoServer = http.createServer((request, response) => {
    for (let header in request.headers) {
        response.setHeader(header, request.headers[header])
    }
    request.pipe(response);
    });
echoServer.listen(8000);


http.createServer((req,res) => {
    process.stdout.write('\n\n\n' + JSON.stringify(req.headers));
    req.pipe(process.stdout);
    let options = {
        headers: req.headers,
        url: `${destinationUrl}${req.url}`
    };
    options.method = req.method;
    var downstreamResponse = req.pipe(request(options));
    downstreamResponse.pipe(process.stdout);
    downstreamResponse.pipe(res);
}).listen(8001);