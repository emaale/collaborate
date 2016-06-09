app.factory('ProjectService', ['$http', '$auth', '$sce', function ($http, $auth, $sce) {
	var ProjectService = {
		repos: {
			content: [],
			loading: true
		},
		project: {
			content: [],
			loading: true
		},
		projects: {
			content: [],
			loading: true
		},
		documentation: {
			content: [],
			loading: true
		},
		commits: {
			content: [],
			loading: true
		},
		collaborators: {
			content: [],
			loading: true
		}
	};

	ProjectService.all = function() {
		// Start Animation
		ProjectService.projects.loading = true;

		return $http.get('/api/projects', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// End Animation
    		ProjectService.projects.loading = false;

    		angular.copy(res.data, ProjectService.projects.content);

    		return res.data;
  		});
	};

	ProjectService.get = function(id) {
		// Start Animation
		ProjectService.project.loading = true;

		return $http.get('/api/projects/' + id, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// End Animation
    		ProjectService.project.loading = false;

    		angular.copy(res.data, ProjectService.project.content);

    		return res.data;
  		});
	};

	ProjectService.create = function(name, repo, users) {
		return $http.post('/api/projects', {
			name: name,
			repo: repo,
			users: users
		}, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res.data;
  		});
	};

	ProjectService.getRepos = function(query) {
		// Start Animation
		ProjectService.repos.loading = true;

		return $http.get('/api/repos', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ProjectService.repos.loading = false;
			
    		angular.copy(res.data, ProjectService.repos.content);

    		return res;
  		});
	};

	ProjectService.getDocumentation = function(id) {
		// Start Animation
		ProjectService.documentation.loading = true;

		return $http.get('/api/repos/' + id + '/readme', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ProjectService.documentation.loading = false;

			// Decode base64 data
			res.data.content = window.atob(res.data.content);

			// Make html trustable
			res.data.content = $sce.trustAsHtml(res.data.content);
			
    		angular.copy(res.data, ProjectService.documentation.content);

    		return res;
  		});
	};

	ProjectService.getCommits = function(id) {
		// Start Animation
		ProjectService.commits.loading = true;

		return $http.get('/api/repos/' + id + '/commits', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ProjectService.commits.loading = false;
			
    		angular.copy(res.data, ProjectService.commits.content);

    		return res;
  		});
	};

	ProjectService.getCollaborators = function(id) {
		// Start Animation
		ProjectService.collaborators.loading = true;

		return $http.get('/api/repos/' + id + '/collaborators', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ProjectService.collaborators.loading = false;
			
    		angular.copy(res.data, ProjectService.collaborators.content);

    		return res;
  		});
	};

	ProjectService.addCollaborator = function(id, collaborator) {
		return $http.put('/api/repos/' + id + '/collaborators/', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res.data;
  		});
	};

	ProjectService.deploy = function(id, config) {
		return $http.post('/api/projects/' + id + '/deploy', config, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		return res.data;
  		});
	};

	return ProjectService;
}])