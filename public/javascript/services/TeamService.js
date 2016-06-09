app.factory('TeamService', ['$http', '$auth', function($http, $auth) {
	var TeamService = {
		organizations: {
			content: [],
			loading: true
		},
		searchedOrgs: {
			content: [],
			loading: true
		},
		searchedUsers: {
			content: [],
			loading: true
		},
		team: {
			content: {},
			loading: true
		},
		teams: {
			content: {},
			loading: true
		},
		teamMember: {}
	};

	TeamService.getOrgsWithTeams = function() {
		// Start Animation
		TeamService.organizations.loading = true;

		return $http.get('/api/teams', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			TeamService.organizations.loading = false;
			
    		angular.copy(res.data, TeamService.organizations.content);
  		});
	};

	TeamService.getOrgs = function() {
		// Start Animation
		TeamService.searchedOrgs.loading = true;

		// Clear old results
		angular.copy([], TeamService.searchedOrgs.content);

		return $http.get('/api/user/orgs', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			TeamService.searchedOrgs.loading = false;
			
    		angular.copy(res.data, TeamService.searchedOrgs.content);
  		});
	};

	TeamService.getTeam = function(teamId) {
		// Start Animation
		TeamService.team.loading = true;

		// Reset array incase its populated with other teams
		angular.copy({}, TeamService.team.content);

		return $http.get('/api/teams/' + teamId, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			TeamService.team.loading = false;
			
    		angular.copy(res.data, TeamService.team.content);

    		return res.data;
  		});
	};

	TeamService.createTeam = function(team) {
		return $http.post('/api/teams/', team, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res;
  		});
	};

	TeamService.updateTeam = function(team) {
		return $http.put('/api/teams/' + team.id, team, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			console.log(res.data);
    		return res;
  		});
	};

	TeamService.getTeamMember = function(teamId, user) {
		return $http.get('/api/teams/' + teamId + '/members/' + user, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		angular.copy(res.data, TeamService.teamMember);
  		});
	};

	TeamService.getUsersByName = function(query) {
		// Start Animation
		TeamService.searchedUsers.loading = true;

		// Clear old results
		angular.copy([], TeamService.searchedUsers.content);

		return $http.get('/api/search/users/' + query, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// End Animation
			TeamService.searchedUsers.loading = false;

			angular.copy(res.data, TeamService.searchedUsers.content);
  		});
	};

	TeamService.addMember = function(team, user) {
		return $http.post('/api/teams/' + team.id + '/members', { team: team, user: user }, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res;
  		});
	};

	return TeamService;
}]);