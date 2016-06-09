// Controller for the navigation
app.controller('NavCtrl', ['$scope', '$state', '$auth', 'UserService', function($scope, $state, $auth, UserService) {
	// Get the user profile
	UserService.get();
	$scope.user = UserService.user;
	
	// The items to be displayed in the nav
	$scope.menuItems = [
		{
			name: 'User',
			url: 'user',
			icon: 'user',
		},
		{
			name: 'Teams',
			url: 'teams',
			icon: 'users',
		},
		{	
			name: 'Projects',
			url: 'projects',
			icon: 'embed',
		},
		{
			name: 'Deadlines',
			url: 'deadlines',
			icon: 'clock2',
		},
		{
			name: 'Chat',
			url: 'chat',
			icon: 'bubble2',
		},
	];

	// Extract the current menu item
	for(var i = 0; i < $scope.menuItems.length; i++) {
		if($state.current.name === $scope.menuItems[i].url) {
			// The currently active menu item
			$scope.activeMenu = $scope.menuItems[i];
		}
	}

	// Change active menu item when called
	$scope.setActive = function(menuItem) {
		// Set the new active menu item
		$scope.activeMenu = menuItem;

		// Go to the new url
		$state.go(menuItem.url);
	}

	// Logout the user
	$scope.logout = function() {
		$auth.logout();

		$state.go('login');
	}

}]);