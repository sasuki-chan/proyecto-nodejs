var app = angular.module('app', [])

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

    $scope.msgs = []
    $scope.sendMsg = function(){
        socket.emit('agregar_nota', $scope.msg.text);
        $scope.msg.text.asunto = ''
        $scope.msg.text.lote = ''
        $scope.msg.text.para = ''
        $scope.msg.text.comentario = ''
        }
}]);
