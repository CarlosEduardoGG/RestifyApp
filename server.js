var restify = require('restify');

/*
function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}


server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
*/

var server = restify.createServer();
server.get('/paquete/:mensaje',);
server.post('/paquete/:mensaje',);
server.delete('/paquete/:id',);
server.put('/paquete/:id',);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
