app.factory('UserService', ['$http', '$auth', function($http, $auth) {
	var UserService = {
		user: {
			content: {},
			loading: true
		},
		users: [],
	};

	UserService.all = function() {
		return $http.get('/api/users', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		angular.copy(res.data, UserService.users);
  		});
	};

	UserService.get = function() {
		// Start Animation
		UserService.user.loading = true;

		return $http.get('/api/user', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			UserService.user.loading = false;

    		angular.copy(res.data, UserService.user.content);
  		});
	};

	UserService.update = function(user) {
		return $http.put('/api/user', user, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		});
	};

	return UserService;
}]);