var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandler');
var handle = {}

//uploading
handle['/upload'] = requestHandlers.upload;

//angular api stuff
handle['/'] = requestHandlers.start;
handle['/list'] = requestHandlers.list;
handle['/scripts'] = requestHandlers.scripts;
handle['/styles'] = requestHandlers.styles;

//little printer api stuff
handle['/meta.json'] = requestHandlers.lpMeta;
handle['/edition/'] = requestHandlers.lpEdition;
handle['/sample/'] = requestHandlers.lpSample;
handle['/icon.png'] = requestHandlers.lpIcon;

server.start(router.route, handle);