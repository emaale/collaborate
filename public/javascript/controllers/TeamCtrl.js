// Controller for the teams page
app.controller('TeamCtrl', ['$scope', '$state', 'TeamService', 'teamData', function($scope, $state, TeamService, teamData) {
		$scope.teamData = teamData;
		$scope.added_items = [];

		// Get a list of administratable orgs that can be filtered
		$scope.getSearchableOrgs = function() {
			// Setup databinding
			$scope.searchableOrgs = TeamService.searchedOrgs;

			// Get orgs
			TeamService.getOrgs();
		};

		// Selects an org to be associated with the team
		$scope.selectOrg = function(org) {
			// Close the list
			$scope.organizationSearch = "";

			// Set array to the chosen org
			$scope.added_items = [org];
		};

		// Creates a team
		$scope.createTeam = function() {
			// Validate data
			if ($scope.added_items !== undefined && $scope.name !== undefined) {
				// Construct team
				var team = {
					name: $scope.name,
					org: $scope.added_items[0].organization
				}

				// Send request
				TeamService.createTeam(team).then(function(res) {
					// Navigate user to the created team page
					$state.go('team', { teamId: res.data.id });
				});
			} else {
				$scope.error = {
					message: "Please select name and organization.",
					status: true
				}
			}

		};

		// Updates the team name and description
		$scope.updateTeam = function(team) {
			TeamService.updateTeam(team);
		};

		// Searches for users
		$scope.getUsersByName = function(query) {
			// Setup databinding
			$scope.searchedUsers = TeamService.searchedUsers;

			TeamService.getUsersByName(query);
		};

		// Selects a user from the search
		$scope.selectUser = function(team, user) {
			// Close the list
			$scope.userSearch = "";

			// Add the user to the team
			TeamService.addMember(team, user).then(function(res) {
				user.added_data = res.data;

				// Set array to the chosen org
				$scope.added_items.push(user);
				console.log(user);
			});
		};
}]);