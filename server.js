//Variable para restify
var restify = require('restify');
//Variable para conseguir el get de la base de datos
var http = require('http');

//Variables necesarias para poder realizar la conexion a MongoDB
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/restify";

/*****************
//TODO: Hacer lo siguiente
Cosas por hacer:
1.-Hacer un repo público en github y ponerme como colaborador palmeroh@gmail.com
2.-Hacer la app
3.-Subir la app al repositorio, esta debe tener por lo menos 10 commits explicando que se hizo (aunque sean cambios moleculares
4.-Crear tres branch nuevo y modificar X cosa
5.- hacer un merge de 2 branch

Datos Extras, los branches deben llamarse: ( master, branch1, branch2, branchN,  ... ) estos mas un ultimo branch que se llame "merge"

Ahora Descripción de la app:
Esta app deberá tener 2 end points:
1.- El primer endpoint debe recibir por medio de post recibirá una string(plano, no json ni nada plain text) en base64 (la cual es una imagen) y guardarla en la BD (mongo) en una collecion (Coleccion es como decir tabla, pero es el termino que se le da en Mongo) llamada "imagenes"  la información que debes guardar en la collecion es: la String cuyo nombre del campo será "imagen", un Date cuyo nombre del campo será created
2.- El segundo endpoint es para poder revisar las imágenes que se han subido, el cual es get. al recibir la peticion el endpoint debe regresar a modo de lista una serie de json el cual tendrá los campos guardados en la coleccion

Herramientas extras:
Convertidor de imagenes a base64 se utilizará para comprobar que la información sea correcta (como la que se envia como la que recibe)
https://codebeautify.org/base64-to-image-converter#

PostMan es un cliente para hacer solicitudes REST, con el podrás hacer solicitudes a tu API y comprobar que funcione (es lo que utilizaré para comprobar si funciona)
https://www.getpostman.com/

*/


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

    var myobj = { imagen: req.body.imagen, created:today };
    db.collection("imagenes").insertOne(myobj, function(err, res) {
      if (err){
        throw err;
      }

      console.log("1 document inserted");
      db.close();
    });
  });
}

function getImagen(req,res,next){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    db.collection("customers").findOne({}, function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}

var server = restify.createServer();




server.get('/paquete',getImagen);
server.post('/paquete',postImagen);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
