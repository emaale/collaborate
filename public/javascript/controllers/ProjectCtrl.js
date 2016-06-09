// Controller for the projects page
app.controller('ProjectCtrl', ['$scope', '$state', 'TeamService', 'ProjectService', 'projectData', 'project', function($scope, $state, TeamService, ProjectService, projectData, project) {
	$scope.added_users = [];
	$scope.projectData = projectData;
	$scope.project = project;

	// Creates project
	$scope.createProject = function() {
		// Make sure name is filled in, and repo is added
		if($scope.name == "" || !$scope.added_repo) {
			$scope.error = {
				state: true,
				message: "Make sure you have selected a repository and filled in the name."	
			};
			
			return;
		}

		// Create the project
		ProjectService.create($scope.name, $scope.added_repo, $scope.added_users).then(function(res) {
			// Go to the project page
			$state.go('project', { projectId: res.id });
		});
	};

	$scope.getRepos = function() {
		// Setup databinding
		$scope.repos = ProjectService.repos;

		ProjectService.getRepos();
	};

	$scope.searchUsers = function(query) {
		// Setup databinding
		$scope.searchedUsers = TeamService.searchedUsers;

		// Only perform search if query isn't empty
		if(query == "") return;

		TeamService.getUsersByName(query);
	};

	$scope.searchTeams = function() {
		// Setup databinding
		$scope.searchedTeams = TeamService.organizations;

		// Get teams to be searched
		TeamService.getOrgsWithTeams().then(function(res) {
		});
	};

	$scope.selectUser = function(user) {
		// Close the list
		$scope.userSearch = "";

		// Add user to added users
		$scope.added_users.push(user);
	};

	$scope.selectTeam = function(team) {
		// Close the list
		$scope.teamSearch = "";

		// Add the teams users to added users
		for(var i = 0; i < team.members.length; i++) {
			$scope.added_users.push(team.members[i]);
		}
	};

	$scope.selectRepo = function(repo) {
		// Close the list
		$scope.repoSearch = "";

		// Add the user to the team
		$scope.added_repo = repo;
	};

	$scope.deploy = function() {
		// Validate fields
		if($scope.host == undefined || $scope.password == undefined || $scope.username == undefined || $scope.directory == undefined) {
			$scope.error = {
				state: true,
				message: "Please fill in all fields."
			};

			return;
		}

		// Setup config
		var config = {
			host: $scope.host,
		    username: $scope.username,
		    password: $scope.password,
		    directory: $scope.directory,
		    owner: $scope.project.content.repository_owner_name,
		    repo: $scope.project.content.repository_name
		};

		// Start loading
		$scope.loading = true;

		// Deploy using config
		ProjectService.deploy($scope.project.content.id, config).then(function(res) {
			// Set success message
			$scope.success = {
				state: true,
				message: "Project deployed!"
			};

			// End loading
			$scope.loading = false;
		});
	};
}]);