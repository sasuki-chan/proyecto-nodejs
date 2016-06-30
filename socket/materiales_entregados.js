//modulos necesarios para el servidor
var r = require('rethinkdb');
var moment = require('moment');
// modulos necesarios para el servidor

//////////////////////////////////////////////////////////////////////////////////////////
// Empiezan las funciones que se llaman para la pagina materiales entregados
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// Controla lo de la url /datos_tabla_listado_entregado el que le pide el navegador
// mostrar los datos de la tabla de listado de materiales entregados
module.exports.mostrar_tabla_material_entregado = function(req,res){
	console.log('Se ha recibido una peticion de datos');
	//Conectar a RethinkDB
	var connection = null;
	r.connect({host:'localhost', port:28015, db:'alamode'},function(err, conn){
		if (err) throw err;
        connection = conn;
        r.table('material_entregado').run(connection,function(err,cursor) { 
			if (err) throw err; 
			cursor.toArray(function(err,result) {
				if(err) throw err;
		var result = result; //Guarda los datos de rethinkdb en esta variable
		var tabla = [result]; //Pone los datos en un array
		res.json(tabla); //Enviar datos al navegador en formato json
		console.log(result); //muestra los datos en la consola de nodejs

  });
  });

}); //Aqui cierra la conexion que se inicio con r.connect
}
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
//Agrega datos nuevos para la lista de materiales entregados
module.exports.agregar = function(data){
		var connection = null;
		var pagina = data.pagina;
		var lote = data.lote;
		var material = data.material;
		var nombre_material = data.nombre_material;
		var tipo = data.tipo;
		var color = data.color;
		var cantidad = data.cantidad;
		var comentario = data.comentario;
		var persona = usuario;
		var entregado_a = data.entregado_a;
		if (tipo == undefined){
			var tipo = ' ';
		}
		if (color == undefined){
			var color = ' ';
		}
		if (comentario == undefined){
			var comentario = ' ';
		}

		var moment = require('moment');
		var fecha = moment().locale('es').format("D MMMM YYYY");

		console.log("Datos recibidos de material_new para agregar",data);
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("material_entregado").insert({pagina: pagina, lote: lote,
			nombre_material: nombre_material,tipo: tipo,color:color,
			cantidad:cantidad,comentario:comentario,persona:persona,fecha:fecha,material:material,entregado_a:entregado_a}).run(connection);
			}); //Termina el codigo de r.connect de socket data_new
}
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
//Actualiza los datos ya existentes de la tabla materiales entregados
module.exports.actualizar = function(data){
	var connection = null;
		var data = data;
		var id = data.id;
		var pagina = data.pagina;
		var fecha = data.fecha;
		var lote = data.lote;
		var material = data.material;
		var nombre_material = data.nombre_material;
		var tipo = data.tipo;
		var color = data.color;
		var cantidad = data.cantidad;
		var comentario = data.comentario;
		var persona = data.persona;
		var entregado_a = data.entregado_a;
		console.log('dato que entro para actualizar')
		console.log(data)
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("material_entregado").filter({id: id}).update({pagina: pagina, fecha: fecha,
			lote: lote,material: material,nombre_material:nombre_material,
			tipo:tipo,color:color,cantidad:cantidad,comentario:comentario,persona:persona,entregado_a:entregado_a}).run(connection);
			});
		}//Termina el codigo del socket.on('actualizar_material_entregado')
///////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
// Revisa si hay cambios en la base de datos ya sea si se agrego un nuevo registro
// o si se modifico uno ya existente
module.exports.cambio_material_entregado = function(){
	//Empieza el codigo del changessfeed
	r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("material_entregado").changes().run(connection ,function(err,cursor){ 
					if(err) throw err ; 
					cursor.each(function(err, row){
							if(err) throw err;
							console.log('Desde el changessfeed: '); 
							console.log(JSON.stringify(row,null,2));
							io.sockets.emit('datos_nuevos_de_material_entregado', row);
						});
				});
	});//Termina el codigo del changessfedd()
}
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
// Terminan las funciones que se llaman para la pagina materiales entregados
//////////////////////////////////////////////////////////////////////////////////////////
