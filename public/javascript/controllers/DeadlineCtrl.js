// Controller for the deadlines page
app.controller('DeadlineCtrl', ['$scope', '$state', '$stateParams', 'DeadlineService', 'ProjectService', 'deadlineData', function($scope, $state, $stateParams, DeadlineService, ProjectService, deadlineData) {
	$scope.deadlineData = deadlineData;

	// Create deadline
	$scope.createDeadline = function() {
		// Validate fields
		if($scope.name == "" || !$scope.added_project || $scope.date == "") {
			$scope.error = {
				state: true,
				message: "Make sure you have selected a project and filled in the name and date."	
			};
			
			return;
		}

		// Construct the deadline
		var deadline = {
			name: $scope.name,
			project: $scope.added_project,
			deadline_date: $scope.date
		};

		// Create the deadline
		DeadlineService.create(deadline).then(function(res) {
			// Go to the deadline
			$state.go('deadline', { deadlineId: res.id });
		});
	};

	$scope.updateDeadline = function() {
		// Validate fields
		if($scope.deadlineData.content.name == "" || $scope.deadlineData.content.deadline_date == "") {
			$scope.error = {
				state: true,
				message: "Make sure you have filled in the name and date."	
			};
			
			return;
		}

		// Construct the deadline
		var deadline = {
			name: $scope.deadlineData.content.name,
			deadline_date: $scope.deadlineData.content.deadline_date
		};
		
		// Create the deadline
		DeadlineService.update($stateParams.deadlineId, deadline).then(function(res) {
			console.log(res);
		});
	};

	// Get the projects to be searched through
	$scope.getProjects = function() {
		$scope.projects = ProjectService.projects;

		// Get projects
		ProjectService.all().then(function(res) {
			console.log(res);
		});
	};

	// Select the project from the list
	$scope.selectProject = function(project) {
		$scope.projectSearch = "";

		$scope.added_project = project;
	};

}]);