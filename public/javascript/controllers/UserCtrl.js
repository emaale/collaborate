// Controller for the user page
app.controller('UserCtrl', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {
	// Get the user profile
	$scope.user = UserService.user;
	
	// Update the user profile
	$scope.update = function() {
		// Call the update method on the UserService
		UserService.update($scope.user.content);
	}
}]);