var http = require('http');
let request = require('request');
let argv = require('yargs')
            .usage('Usage: node index.js [options]')
    .example('node index.js -x google.com -p 80')
    .alias('p', 'port')
    .nargs('p', 1)
    .describe('port', 'Specify a forwarding port')
    .alias('x', 'host')
    .nargs('x', 1)
    .describe('host', 'Specify a forwarding host')
    .alias('l', 'log')
    .nargs('l', 1)
    .describe('log', 'Specify a output log file')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016').argv;
let scheme = 'http://';
let host = argv.host || '127.0.0.1';
let port = argv.port || (host === '127.0.0.1' ? 8000 : 80);
let destinationUrl = argv.url || scheme + host + ':' + port;
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
    if(req.headers['x-destination-url']){
        options.url = req.headers['x-destination-url'];
    }
    options.method = req.method;
    var downstreamResponse = req.pipe(request(options));
    downstreamResponse.pipe(process.stdout);
    downstreamResponse.pipe(res);
}).listen(8001);