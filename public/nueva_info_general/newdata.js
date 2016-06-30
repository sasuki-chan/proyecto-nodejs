var app = angular.module('alamode', [])

app.factory('socket', function(){
	var socket = io.connect('https://localhost:55555');
	return socket;
})

app.controller('Register', ['$scope', '$http','socket','$window','$interval', function($scope,$http,socket,$window,$interval){
	
	//codigo nuevo
    var conection;

    socket.on('disconnect', function(){
        conection = 0
        verificar_conexion(conection)

        var reconect = $interval(function() {
        socket.on('reconect', function(data){
        conection = 1
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


	$scope.msgs = []
	$scope.sendMsg = function(){
		socket.emit('agregar_datos_para_info_general', $scope.msg.text);
		$scope.msg.text.contenedor = ''
		$scope.msg.text.hilo = ''
		$scope.msg.text.estilo = ''
		$scope.msg.text.tipo_de_lote = ''
		$scope.msg.text.velcro = ''
		$scope.msg.text.cantidadvelcro = ''
		$scope.msg.text.cantidadpiezas = ''
		$scope.msg.text.metal = ''
		$scope.msg.text.emblema = ''
		$scope.msg.text.lote = ''
		$scope.msg.text.estado = ''
		}
}]);
