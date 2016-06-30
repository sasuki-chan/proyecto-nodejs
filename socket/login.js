//modulos necesarios para el servidor
var r = require('rethinkdb');
var moment = require('moment');
// modulos necesarios para el servidor

///////////////////////////////////////////////////////////////////////////////////////////
// Login del usuario para acceder al lado privado
module.exports.login = function(req,res){
	var user = req.body.user;
	var password = req.body.password;
	console.log('Se recibieron datos en post de login');
	console.log('El nombre del usuario es: ' + user);
	console.log('La contrasena del usuario es: '+password);

	var connection = null;
  r.connect({host:'localhost', port:28015, db:'alamode'},function(err, conn){
    if (err) throw err;
        connection = conn;
        r.table('login_prueba').filter({user: user, password: password}).limit(1).run(connection, function(err, cursor) {
      if (err) throw err; 
      cursor.toArray(function(err,result) {
        if(err) throw err;
          //console.log(result);
          var result = result // guarda el valor result en una variable
          if (result =='') { //comprueba si la variable result esta vacia
          console.log('Incorrecto los datos'); //como esta vacia devuelve este mensaje

          console.log(req.session.id)
        }
        else{
          GLOBAL.usuario = result[0].user;
          req.session.user = result[0].user;
          console.log(req.session)
          console.log(req.session.user) //muestra los datos que si fueron correctos
          console.log('Usuario recuperado de RethinkDB es '+JSON.stringify(result[0].user,2,null));
          res.redirect('/')
        }
  });
  });

});
}