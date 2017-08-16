//Variable para restify
var restify = require('restify');
//Variable para conseguir el get de la base de datos
var http = require('http');
//var https = require('https');

//Variables necesarias para poder realizar la conexion a MongoDB
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/restify";


function postImagen(req,res,next){
  //Código para la conexion a la base de Datos
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    //Código para conseguir la fecha actual
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    console.log("body:"+req.body);
    imagenBD=req.body.imagen+"";

    var myobj = { imagen: imagenBD, created:today };
    db.collection("imagenes").insertOne(myobj, function(err, res) {
      if (err){
        //res.send(500,"Error al insertar");
        throw err;
      }

      console.log("1 document inserted");
      console.log(myobj);
      //res.send(200,"Archivo insertado");
      db.close();
    });
  });

  res.send(200);

  next();
}

function getImagen(req,res,next){
  MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("imagenes").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
    db.close();
  });
});

  next();
}

var server = restify.createServer();

server.use(restify.plugins.bodyParser());




server.get('/consultar',getImagen);
server.post('/insertar',postImagen);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
