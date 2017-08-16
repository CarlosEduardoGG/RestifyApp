//Variable para restify
var restify = require('restify');
//Variable para conseguir el get de la base de datos
var http = require('http');

//Variables necesarias para poder realizar la conexion a MongoDB
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/restify";

/**
postImagen es la funcion la cual se encarga de la inserción de la imagen
en la base de datos (codificada en base64), genera la fecha en javascript
y devuelve una respuesta para confirmar el envio del paquete
*/
function postImagen(req,res,next){
  //Código para la conexion a la base de Datos
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    //Código para conseguir la fecha actual
    var today = new Date();//Se crea el objeto de tipo Date
    var dd = today.getDate();//Se consigue el dia
    var mm = today.getMonth()+1;//Se consigue el mes y se aumenta en 1 (Enero=1)
    var yyyy = today.getFullYear();//Se consigue el año actual
    //Condicion para normalizar el dia
    if(dd<10) {
        dd = '0'+dd
    }
    //Condicion para normalizar el mes
    if(mm<10) {
        mm = '0'+mm
    }
    //Concatenación de la fecha
    today = dd + '/' + mm + '/' + yyyy;

    console.log("body:"+req.body);//Impresion del cuerpo de la solicitud
    imagenBD=req.body.imagen+"";//Concatenacion para guardar como texto

    //Se crea el objeto a guardar en MongoDB
    var myobj = { imagen: imagenBD, created:today };

    //Se inserta en la base de datos en la colleccion "imagenes"
    db.collection("imagenes").insertOne(myobj, function(err, res) {
      if (err){//En caso de error al insertar
        //res.send(500,"Error al insertar");
        throw err;
      }
      //Notificacion de que un documento se insertó
      console.log("1 document inserted");
      //Impresion del objeto insertado
      console.log(myobj);
      db.close();
    });
  });
  //Se envia una respuesta 200 para confirmar OK
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
