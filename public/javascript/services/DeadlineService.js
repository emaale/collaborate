app.factory('DeadlineService', ['$http', '$auth', function ($http, $auth) {
	var DeadlineService = {
		deadlines: {
			content: [],
			loading: true
		},
		deadline: {
			content: [],
			loading: true
		}
	};

	DeadlineService.all = function() {
		// Start Animation
		DeadlineService.deadlines.loading = true;

		return $http.get('/api/deadlines', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			DeadlineService.deadlines.loading = false;
			
    		angular.copy(res.data, DeadlineService.deadlines.content);

    		return res.data;
  		});
	};

	DeadlineService.get = function(id) {
		// Start Animation
		DeadlineService.deadline.loading = true;

		return $http.get('/api/deadlines/' + id, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			DeadlineService.deadline.loading = false;
			
    		angular.copy(res.data, DeadlineService.deadline.content);

    		return res.data;
  		});
	};

	DeadlineService.create = function(deadline) {
		return $http.post('/api/deadlines', deadline, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res.data;
  		});
	};

	DeadlineService.update = function(id, deadline) {
		return $http.put('/api/deadlines/' + id, deadline, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res.data;
  		});
	};

	return DeadlineService;
}]);