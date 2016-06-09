// Controller for the chat page
app.controller('ChatCtrl', ['$scope', '$state', '$stateParams', '$interval', 'conversations', 'chatData', 'ChatService', 'TeamService', 'UserService', '$timeout', function($scope, $state, $stateParams, $interval, conversations, chatData, ChatService, TeamService, UserService, $timeout) {
	// Get conversations
	$scope.conversations = conversations;

	// Set other chat data that can be used to group information from the routes
	$scope.chatData = chatData;

	$scope.added_users = [];

	// Clear intervals on state change
	$scope.$on("$destroy",function(){
	    if (angular.isDefined($scope.ConversationsTimer)) {
	        $interval.cancel($scope.ConversationsTimer);
	    }

	    if (angular.isDefined($scope.MessagesTimer)) {
	        $interval.cancel($scope.MessagesTimer);
	    }
	});

	// Fetch new conversations on the regular
	$scope.ConversationsTimer = $interval(function() {
		ChatService.getConversations();
	}, 10000);

	// Check if we are on the conversation page
	if($state.current.name == "conversation") {
		// Start polling for messages
		$scope.MessagesTimer = $interval(function() {
			ChatService.getConversationWithMessages($stateParams.conversationId).then(function() {
				// Scroll to bottom
				$scope.updateScrollbar('scrollTo', "bottom");
			});
		}, 1000);
	}

	$scope.getTeams = function() {
		// Setup databinding
		$scope.searchedTeams = TeamService.organizations;

		// Get teams to be searched
		TeamService.getOrgsWithTeams().then(function(res) {
		});
	};

	$scope.getUsers = function(query) {
		// Setup databinding
		$scope.searchedUsers = ChatService.searchedUsers;

		// Only perform search if query isn't empty
		if(query == "") return;

		ChatService.searchCollaborateUsers();
	};

	//  Creates a conversation
	$scope.createConversation = function() {
		// Validate fields
		if($scope.name == undefined || $scope.added_users.length == 0) {
			$scope.error = {
				state: true,
				message: "Please fill in all fields."
			};

			return;
		}

		users = [];

		// Extract ids from the added_users
		for (var i = 0; i < $scope.added_users.length; i++) {
			// Push added users id to the users array
			users.push($scope.added_users[i].id);
		}

		// Setup conversation
		var conversation = {
			name: $scope.name,
			users: users
		};

		// Create conversation
		ChatService.createConversation(conversation).then(function(res) {
			// Go to the created conversation
			$state.go('conversation', { conversationId: res.id });
		});
	};

	// Updates the participants after adding a new one
	$scope.updateParticipants = function() {
		// Validate fields
		if(!$scope.added_users) {
			$scope.error = {
				state: true,
				message: "You have not added any users yet!"
			};

			return;
		}

		users = [];

		// Extract ids from the added_users
		for (var i = 0; i < $scope.added_users.length; i++) {
			// Push added users id to the users array
			users.push($scope.added_users[i].id);
		}

		// Create conversation
		ChatService.addConversationUsers($stateParams.conversationId, users).then(function(res) {
			// Go to the created conversation
			$state.go('conversation', { conversationId: $stateParams.conversationId });
		});
	};

	// Sends a message
	$scope.sendMessage = function(message) {
		ChatService.sendMessage($stateParams.conversationId, message).then(function() {
			// Scroll to bottom
			$scope.updateScrollbar('scrollTo', "bottom");
		});

		// Clear message
		$scope.message = "";
	};

	// Deletes a message
	$scope.deleteMessage = function() {

	};

	// Clears a conversation
	$scope.clearConversation = function() {
		ChatService.clearConversation($stateParams.conversationId);
	};

	// Searches for users
	$scope.getCollaborateUsers = function() {
		// Setup databinding
		$scope.searchedUsers = ChatService.searchedUsers;
	};

	// Selects a user from the search to add to the added users
	$scope.selectUser = function(user) {
		// Close the list
		$scope.userSearch = "";

		// Users to be added
		$scope.added_users.push(user);
	};

	// Selects a users team and pushes them to the added_users array
	$scope.selectTeam = function(team) {
		// Close the list
		$scope.teamSearch = "";
		
		// Add the teams users to added users
		for(var i = 0; i < team.members.length; i++) {
			$scope.added_users.push(team.members[i]);
		}
	};
}]);