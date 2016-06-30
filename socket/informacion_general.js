//modulos necesarios para el servidor
var r = require('rethinkdb');
var moment = require('moment');
// modulos necesarios para el servidor

// Accede a la base de datos para devolverle al servidor los datos que necesita para ser
// mostrado en el navegador
module.exports.mostrar_tabla_info_general =function(req,res){
	var connection = null;
	r.connect({host:'localhost', port:28015, db:'alamode'},function(err, conn){
		if (err) throw err;
        connection = conn;
        r.table('requisicion_prueba').run(connection,function(err,cursor) { 
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
)}
//////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
//agrega nuevos datos para la tabla informacion general
module.exports.agregar = function(data){
	var connection = null;
	    var select = data.select;
	    var tipo_de_lote = data.tipo_de_lote;
		var contenedor = data.contenedor;
		var lote = data.lote;
		var hilo = data.hilo;
		var estilo = data.estilo;
		var cantidad_piezas = data.cantidadpiezas;
		var metal = data.metal;
		var emblema = data.emblema;
		var velcro = data.velcro;
		var cantidad_velcro = data.cantidadvelcro;
		var estado = data.estado;
		if (estado == undefined){
	    		var estado = 'no';
	    	}
	    if (velcro == undefined){
	    		var velcro = 'no';
	    	}
	    if (cantidad_velcro == undefined){
	    		var cantidad_velcro = 'no';
	    	}
	    if (select == undefined){
	    		var select = false;
	    	}
	    if (metal == undefined){
	    		var metal = 'no';
	    	}
	    if (emblema == undefined){
	    		var emblema = 'no';
	    	}

		console.log("Datos recibidos para agregar",data);
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("requisicion_prueba").insert({select:select,contenedor: contenedor, lote: lote,
			hilo: hilo,cantidad_piezas: cantidad_piezas,velcro:velcro,
			cantidad_velcro:cantidad_velcro, estilo:estilo,estado:estado,
			tipo_de_lote:tipo_de_lote,emblema:emblema,metal:metal}).run(connection);
			}); //Termina el codigo de r.connect de socket data_new
}
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
//Actualiza los datos de un registro ya existente en la tabla de informacion general
module.exports.actualizar = function(data) {
var connection = null;
		var data = data;
		var id = data.id;
		var select = data.select;
		var contenedor = data.contenedor;
		var lote = data.lote;
		var estilo = data.estilo;
		var hilo = data.hilo;
		var cantidad_piezas = data.cantidad_piezas;
		var metal = data.metal;
		var emblema = data.emblema;
		var velcro = data.velcro;
		var cantidad_velcro = data.cantidad_velcro;
		var estado = data.estado;
		
		if (select == true){
	    		var select = false;
	    	}
	    if (metal == undefined){
	    		var metal = 'no';
	    	}
	    if (emblema == undefined){
	    		var emblema = 'no';
	    	}
		
		r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn) 
			{
   			 if (err) throw err;
      		  connection = conn;

			r.table("requisicion_prueba").filter({id: id}).update({select:select,contenedor: contenedor, lote: lote,
			hilo: hilo,cantidad_piezas: cantidad_piezas,velcro:velcro,
			cantidad_velcro:cantidad_velcro,estilo:estilo,estado:estado,metal:metal,
			emblema:emblema}).run(connection);
			});
}
///////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
// Revisa si hay cambios en la base de datos ya sea si se agrego un nuevo registro
// o si se modifico uno ya existente para la tabla informacion general
module.exports.cambios_info_general = function(){
	r.connect({host:'localhost', port:28015, db:'alamode'}, function(err, conn){
   			 if (err) throw err;
      		  connection = conn;

			r.table("requisicion_prueba").changes().run(connection ,function(err,cursor){ 
					if(err) throw err ; 
					cursor.each(function(err, row){
							if(err) throw err;
							console.log('Desde el changessfeed: '); 
							console.log(JSON.stringify(row,null,2));
							io.sockets.emit('datosdevueltos', row);
						});
				});
	});//Termina el codigo del changessfedd()
}