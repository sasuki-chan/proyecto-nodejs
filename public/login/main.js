var app = angular.module('Alamode', [])

app.factory('socket', function(){
	var socket = io.connect('https://localhost:55555');
	return socket;
})

app.controller('Register', ['$scope', '$http','socket','$window', function($scope,$http,socket,$window){
    
    $scope.sendMsg = function(){
          $http.post("login", $scope.msg.text)
            .success(function(res){
              console.log(res);
              $window.location.href = '/tablas.html';
              //por supuesto podrás volcar la respuesta al modelo con algo como vm.res = res;
            });
		$scope.msg.text.user = ''
		$scope.msg.text.password = ''
		}
	socket.on('register-recibir', function(data){
		$scope.msgs.push(data);
		console.log(data);
		$scope.$digest();
		})

}]); //termina codigo del app.controller('Register')
