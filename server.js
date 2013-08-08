var http = require('http');
var url = require('url');

function start(route, handle) {
    function onRequest(request, response) {
        var postData = '';
        var pathname = url.parse(request.url).pathname;

        request.setEncoding('utf8');

        request.addListener('data', function(postDataChunk) {
            postData += postDataChunk;
            if(postData.length > 1e6) {
                request.connection.destroy();
            }
        });

        request.addListener('end', function() {
            var header = request.headers['authorization']||'',  // get the header
                token = header.split(/\s+/).pop()||'',            // and the encoded auth token
                auth = new Buffer(token, 'base64').toString(),    // convert from base64
                parts = auth.split(/:/),                          // split on colon
                username = parts[0],
                password = parts[1];

            console.log('login: ' + username + ' ' + password);

            route(handle, pathname, response, postData);
        });
    }

    http.createServer(onRequest).listen(8000);
    console.log('Server has started.');
}

exports.start = start;