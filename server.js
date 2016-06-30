var r = require('rethinkdb');
GLOBAL.moment = require('moment');
var materiales_entregados = require('./socket/materiales_entregados');
var informacion_general = require('./socket/informacion_general');
var login = require('./socket/login');
var notas = require('./socket/notas');
var port = process.env.PORT || 55555;
var bodyParser = require('body-parser');
var session = require('cookie-session');

var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    app = express();

var port = https.createServer({
      key: fs.readFileSync('private_key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(port);

GLOBAL.io = require('socket.io').listen(port);

//Para que pueda leer los datos que entren por post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Para leer las cookies del navegador
app.use(express.cookieParser());
app.use(express.methodOverride());

//definir el objeto de las sessiones
app.use(session({
	name: "session",
	keys: ["llave1","llave2"]
}));
//termina de definir el objeto de las sessiones


    ///////////////////////////////////////////////////////////////////////////////////////////
app.get('/', function(req,res){
	//Si el usuario no esta logeado entonces mostrar la pagina de login
	if (!req.session.user){
		app.use(express.static(__dirname + '/public/login'));
		console.log('Se ha entrado al /login');
		console.log('Desde / valor de req.session'+req.session)
		console.log('Desde / valor de req.session.id'+req.session.id);
		console.log('Desde / valor de req.session.user'+req.session.user);
		res.sendfile(__dirname, + 'index.html');
	}
	// si ya esta logeado entonces mostrar la pagina de /tablas.html
	else{
		res.redirect('/tablas.html');
		}
});
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// Al entrar a la tabla de informacion general
app.get("/tablas.html", function(req,res){
	if(req.session.user){
	app.use(express.static(__dirname + '/public/info_general'));
	res.sendfile(__dirname, 'tablas.html');
	console.log("Has entrado a tablas.html");
	}
	else{
		res.redirect('/');
	}
});
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
//Comienza el codigo de app.get newdata
// Pagina para agregar nuevos datos para la tabla de infomacion general
app.get("/newdata.html", function(req,res){
	if(req.session.user){
	app.use(express.static(__dirname + '/public/nueva_info_general'));
	res.sendfile(__dirname, 'newdata.html');
	console.log("Has entrado a newdata.html");
	}
	else{
		res.redirect('/');
	}
});
//Termina el codigo de app.get newdata
///////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////
//muestra la pagina de registrar-material.html
app.get("/registrar-material.html", function(req,res){
	if(req.session.user){
	app.use(express.static(__dirname + '/public/registrar_material'));
	res.sendfile(__dirname, 'registrar-material.html');
	console.log("Has entrado a registrar-material.html");
	}
	else{
		res.redirect('/');
	}
});
//////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
app.get("/listado_entregado.html", function(req,res){
	if(req.session.user){
	app.use(express.static(__dirname + '/public/listado_entregado'));
	res.sendfile(__dirname, 'listado_entregado.html');
	console.log("Has entrado a listado_entregado.html");
	}
	else{
		res.redirect('/');
	}
});
/////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
app.get("/notas.html", function(req,res){
	if(req.session.user){
	app.use(express.static(__dirname + '/public/nueva_nota'));
	res.sendfile(__dirname, 'notas.html');
	console.log("Has entrado a notas.html");
	}
	else{
		res.redirect('/');
	}
});
/////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
app.get("/listado_notas.html", function(req,res){
	if(req.session.user){
	app.use(express.static(__dirname + '/public/listado_notas'));
	res.sendfile(__dirname, 'listado_notas.html');
	console.log("Has entrado a listado_notas.html");
	}
	else{
		res.redirect('/');
	}
});
/////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
app.get('/mostrar_tabla_info_general',function(req, res){
	if(req.session.user){
		informacion_general.mostrar_tabla_info_general(req,res);
		informacion_general.cambios_info_general();
}   //Aqui cierra el if de req.session.user;
else{
		res.redirect('/');
	}
	});
////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////
// EL que le da los datos listado entregado
app.get('/mostrar_tabla_material_entregado',function(req, res){
	if(req.session.user){
		materiales_entregados.mostrar_tabla_material_entregado(req,res);
		materiales_entregados.cambio_material_entregado();
}   //Aqui cierra el if de req.session.user;
else{
		res.redirect('/');
	}
	});
//Termina el codigo de listado entregado que le da los datos de listas
//////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////
// EL que le da los datos a notas.html
app.get('/mostrar_notas',function(req, res){
	if(req.session.user){
		notas.mostrar_notas(req,res);
		notas.cambios_notas();
}   //Aqui cierra el if de req.session.user;
else{
		res.redirect('/');
	}
	});
//Termina el codigo que le da los datos a notas.html
//////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////
//El que procesa los datos del login
app.post('/login', function(req,res){
	login.login(req,res);
}); //Aqui cierra el codigo de app.post login
///////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////
app.get('/logout',function(req,res){
	req.session.user = null;
	console.log(req.session);
	res.redirect('/');
});
/////////////////////////////////////////////////////////////////////////////////////////



// Inicia el codigo del socket.io
GLOBAL.io.sockets.on('connection', function(socket){
	console.log('Se ha establecido una conexion');
	var data = 'reconectado'
	socket.emit('reconect', data)
//Actualiza los datos ya existentes en la tabla de informacion general	
	socket.on('actualizar_datos_info_general', informacion_general.actualizar);

//Empieza el codigo del socket.on(data_new)
//Agrega nuevos datos para la tabla informacion general
	socket.on('agregar_datos_para_info_general', informacion_general.agregar);


//Empieza el codigo del socket.on(material_new)
//Agrega nuevos datos para la tabla materiales entregados
	socket.on('agregar_datos_listado_entregado',materiales_entregados.agregar);

//Actualiza los datos ya existentes de la tabla materiales entregados
	socket.on('actualizar_material_entregado', materiales_entregados.actualizar);

//Empieza el codigo del socket.on(notas)
//Agrega nuevos datos para la tabla notas
	socket.on('agregar_nota',notas.agregar);

//Actualiza los datos ya existentes de la tabla notas
	socket.on('actualizar_nota', notas.actualizar);

//Borra la nota ya existentes de la tabla notas
	socket.on('borrar_nota', notas.borrar);

	socket.on('data', function(data){
		console.log(data);
	})

}); //Termina el codigo del socket.connection
// termina el codigo del socket.io


console.log('Servidor corriendo en https:localhost:55555')
