var app = angular.module('App', ['angularMoment']);

app.factory('socket', function(){
    var socket = io.connect('https://localhost:55555');
    return socket;
})

app.controller('controlador_de_tablas', ['$scope', '$http','socket','$window','$interval', function($scope,$http,socket,$window,$interval){
    //llamamos al metodo http para conectar con el servidor para recibir los datos
    $http.get("/mostrar_tabla_info_general").success(function(response){
	console.log("He recibido los datos pedidos");
	console.log(response);
	$scope.datos_tabla = response[0];

    //codigo nuevo
    var conection

    socket.on('disconnect', function(){
        conection = 0
        verificar_conexion(conection)

        var reconect = $interval(function() {
        socket.on('reconect', function(data){
        conection = 0
        conection = conection +1
        console.log('el valor de conection es: ')
        console.log(conection)
        verificar_conexion(conection)
    });  
          }, 5000);
    });

    socket.on('connection', function(data){
        var conection = 0
        conection = conection +1
        console.log('el valor de conection es: ')
        console.log(conection)
        verificar_conexion(conection)
    });

    function verificar_conexion(conection){
        if (conection =='0'){
        document.body.style.backgroundColor="red"
         }

        if (conection =='1'){
        document.body.style.backgroundColor="#F9F7ED"
         }
    }

    //codigo nuevo

    //Empieza codigo de socket.on datosdevueltos
    //Actualizamos los nuevos datos que ingresan al sistema
    socket.on('datosdevueltos',function(data){
            console.log('datos devueltos por el servidor numero de lote: '+data.new_val.lote);
            $scope.$apply(function() {
            if(data.new_val.id){
            for(var i=0,len=$scope.datos_tabla.length;i<len;i++){
                if($scope.datos_tabla[i].id === data.new_val.id){
                    $scope.datos_tabla.splice(i,1);
                    $scope.datos_tabla.push(data.new_val);
                    break;
                    };
             };
            };

            if(!data.old_val){
                console.log('Entran datos nuevos');
                $scope.datos_tabla.push(data.new_val);
                
                //comienza codigo para eliminar valores duplicados
                var unique = function(origArr) {
                var newArr = []
                var origLen = origArr.length
                var found, x, y;
                console.log('Cantidad de elementos contados')
                console.log(origLen)

                for (x = 0; x < origLen; x++) {
                    found = undefined;
                    for (y = 0; y < newArr.length; y++) {
                        if (origArr[x] === newArr[y]) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                    newArr.push(origArr[x]);
                    }
                }
                return newArr;
                console.log(newArr);
            }

            var arrUnique = unique($scope.datos_tabla);
            $scope.datos_tabla = arrUnique;
                
            //termina codigo para eliminar valores duplicados

            };

            }); //cierra scope.apply
        });
    //Termina el codigo de socket.on datosdevueltos

	});
    
    $scope.editarDatos = {};
    
    for (var i = 0, length = 'datos_tabla'; i < length; i++) {
      $scope.editarDatos['datos_tabla'[i].id] = false;
    }

    $scope.exportData = function () {
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "reporte_informacion_general.xls");
    };

    $scope.modify = function(datos){
        $scope.editarDatos[datos.id] = true;
        console.log('Datos que se han llamado para modificar:');
        console.log(datos);
    };

    $scope.salir = function(datos){
        $http.get("logout")
            .success(function(res){
              console.log(res);
              $window.location.href = '/';
            });
    };

    $scope.update = function(datos){
        $scope.editarDatos[datos.id] = false;
        var data = {id:datos.id,
            select:datos.select,
            contenedor:datos.contenedor,
            lote:datos.lote,
            estilo:datos.estilo,
            hilo:datos.hilo,
            cantidad_piezas:datos.cantidad_piezas,
            metal:datos.metal,
            emblema: datos.emblema,
            velcro:datos.velcro,
            cantidad_velcro:datos.cantidad_velcro,
            estado:datos.estado};

        socket.emit('actualizar_datos_info_general', data);
        console.log('Se han Actualizado los datos:');
        console.log(data);

    }; // termina el scope.update

}]); //termina codigo del controlador_de_tablas 


// controlador de tiempo
app.controller('mainController', function($interval) {

  var vm = this;
  
  // variables que manejaran la fecha y la otra la transformara con moment.js
  vm.time = new Date();
  vm.time = moment().locale('es').format("hh:mm:ss A");
  var reloj;
  // actualizamos la vista cada 1000 milisengundos la hora
  reloj = $interval(function() {
            vm.time = new Date();
            vm.time = moment().locale('es').format("hh:mm:ss A");
          }, 1000);
  
});
