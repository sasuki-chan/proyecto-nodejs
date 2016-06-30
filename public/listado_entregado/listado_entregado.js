var app = angular.module('App', ['angularMoment']);

app.factory('socket', function(){
    var socket = io.connect('https://localhost:55555');
    return socket;
})

app.controller('controlador_de_tablas', ['$scope', '$http','socket','$window','$interval', function($scope,$http,socket,$window,$interval){
    
    $http.get("/mostrar_tabla_material_entregado").success(function(response){
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
        conection = conection+1
        console.log('el valor de conection es: ')
        console.log(conection)
        verificar_conexion(conection)
    });  
          }, 5000);
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


    //Empieza codigo de socket.on datos_nuevos_de_material_entregado
    //Actualizamos los nuevos datos que ingresan al sistema
    socket.on('datos_nuevos_de_material_entregado',function(data){
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

        if (datos.comentario == undefined){
            datos.comentario = ' '
        }
        var data = {id:datos.id,
            pagina:datos.pagina,
            fecha:datos.fecha,
            lote:datos.lote,
            material:datos.material,
            nombre_material:datos.nombre_material,
            tipo:datos.tipo,
            color:datos.color,
            cantidad:datos.cantidad,
            persona:datos.persona,
            comentario:datos.comentario,
            entregado_a:datos.entregado_a
            };

        socket.emit('actualizar_material_entregado', data);
        console.log('Se han Actualizado los datos:');
        console.log(data);

    }; // termina el scope.update

}]); //termina codigo del controlador_de_tablas

// create an angular controller
app.controller('mainController', function($interval) {
  
  // bind the controller to vm (view-model)
  var vm = this;
  
  // create a new time variable with the current date
  vm.time = new Date();
  vm.time = moment().locale('es').format("hh:mm:ss A");
  var reloj;

  reloj = $interval(function() {
            vm.time = new Date();
            vm.time = moment().locale('es').format("hh:mm:ss A");
          }, 1000);
  
});
