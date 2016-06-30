//modulos necesarios para el servidor
var r = require('rethinkdb');
var moment = require('moment');
// modulos necesarios para el servidor

// Accede a la base de datos para devolverle al servidor los datos que necesita para ser
// mostrado en el navegador
module.exports.mostrar_notas =function(req,res){
	GLOBAL.usuario_actual = req.session.user;
	var connection = null;
	r.connect({host:'localhost', port:28015, db:'alamode'},function(err, conn){
		if (err) throw err;
        connection = conn;
        r.table('notas').run(connection,function(err,cursor) { 
			if (err) throw err; 
			cursor.toArray(function(err,result) {
				if(err) throw err;
		var result = result; 		//Guarda los datos de rethinkdb en esta variable
		var tabla = [result]; //Pone los datos en un array
		res.json(tabla); 		//Enviar datos al navegador en formato json
		console.log(result); 		//muestra los datos en la consola de nodejs
}
)}
)}
)

}//cierra el module notas
//////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////
//agrega nuevos datos para la tabla informacion general
module.exports.agregar = function(data){
	var connection = null;
		var asunto = data.asunto;
		var para = data.para;
		var comentario = data.comentario;
		var lote = data.lote
		var moment = require('moment');
		var fecha = moment().locale('es').format("Do MMMM YYYY");
		var hora = moment().locale('es').format("hh:mm A");

		console.log("Datos recibidos para agregar",data);
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("notas").insert({asunto: asunto,lote:lote, para: para,
			comentario: comentario,fecha: fecha,hora:hora}).run(connection);
			}); //Termina el codigo de r.connect de socket data_new
}
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
//Actualiza los datos de un registro ya existente en la tabla de informacion general
module.exports.actualizar = function(data) {
var connection = null;
var id = data.id
		var asunto = data.asunto;
		var para = data.para;
		var comentario = data.comentario;
		var fecha = data.fecha;
		var hora = data.hora;
		if (comentario == undefined){
	    		var comentario = '  ';
	    	}
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("notas").filter({id: id}).update({asunto: asunto, para: para,
			comentario: comentario,fecha: fecha,hora:hora}).run(connection);
			});
}
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
//Borra la nota por el valor de id
module.exports.borrar = function(data) {
	var connection = null;
	var id = data.id
	console.log('El valor de id a borrar es:')
	console.log(id);
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("notas").filter({id: id}).delete().run(connection);
			});
}
///////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
// Revisa si hay cambios en la base de datos ya sea si se agrego un nuevo registro
// o si se modifico uno ya existente para la tabla informacion general
module.exports.cambios_notas = function(){
	r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn){
   			 if (err) throw err;
      		  connection = conn;

			r.table("notas").changes().run(connection ,function(err,cursor){ 
					if(err) throw err ; 
					cursor.each(function(err, row){
							if(err) throw err;
							console.log('Desde el changessfeed: '); 
							console.log(JSON.stringify(row,null,2));
							io.sockets.emit('datos_actualizados_notas', row);
						});
				});
	});//Termina el codigo del changessfedd()
}