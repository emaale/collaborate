// Controller for the authentication
app.controller('AuthCtrl', ['$scope', '$state', '$auth', function($scope, $state, $auth) {
	
	// Authenticate user
	$scope.authenticate = function(provider) {
    	$auth.authenticate(provider).then(function(response) {
		    $state.go('user');
		});
    }

}]);