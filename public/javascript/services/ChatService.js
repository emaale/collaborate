app.factory('ChatService', ['$http', '$auth', '$interval', function($http, $auth, $interval) {
	var ChatService = {
		conversations: {
			content: [],
			loading: true
		},
		conversation: {
			content: {},
			loading: true,

		},
		conversationUsers: {
			content: [],
			loading: true	
		},
		searchedUsers: {
			content: [],
			loading: true	
		},
	};

	ChatService.getConversations = function() {
		// Start Animation
		ChatService.conversations.loading = true;
		
		return $http.get('/api/conversations', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ChatService.conversations.loading = false;
			
    		angular.copy(res.data, ChatService.conversations.content);
    		console.log(res.data);
  		});
	};

	ChatService.getConversationWithMessages = function(conversationId) {
		// Start Animation
		ChatService.conversation.loading = true;
		
		// Wrap in self-invoking named function, that takes an option to send with last known message id
		return $http.get('/api/conversations/' + conversationId, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ChatService.conversation.loading = false;
			
    		angular.copy(res.data, ChatService.conversation.content);
  		});
	};

	ChatService.getConversationUsers = function(conversationId) {
		// Start Animation
		ChatService.conversationUsers.loading = true;
		
		return $http.get('/api/conversations/' + conversationId + '/users', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End Animation
			ChatService.conversationUsers.loading = false;
			
    		angular.copy(res.data, ChatService.conversationUsers.content);
  		});
	};

	ChatService.createConversation = function(conversation) {		
		return $http.post('/api/conversations', conversation, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// Push conversation to array
    		return res.data;
  		});
	};

	ChatService.sendMessage = function(conversationId, message) {
		return $http.post('/api/conversations/' + conversationId + '/messages', {
			message: message
		}, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// Push message to messages array
    		angular.copy(res.data, ChatService.conversation.content.messages);
  		});
	};

	ChatService.searchCollaborateUsers = function() {
		// Start Animation
		ChatService.searchedUsers.loading = true;

		return $http.get('/api/users', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// End animation
			ChatService.searchedUsers.loading = false;

    		angular.copy(res.data, ChatService.searchedUsers.content);
  		});
	};

	ChatService.addConversationUsers = function(conversationId, users) {
		return $http.post('/api/conversations/' + conversationId + '/users', {
			users: users
		}, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// Push users to conversation
  		});
	};

	ChatService.markAsRead = function() {
		return $http.put('/api/conversations/' + conversationId + '/read', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			return res;
  		});
	};

	ChatService.clearConversation = function(conversationId) {
		return $http.put('/api/conversations/' + conversationId + '/clear', {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
			// Clear conversation
			ChatService.conversation.content.messages = [];
  		});
	};

	ChatService.deleteConversationUsers = function(conversationId, users) {
		return $http.put('/api/conversations/' + conversationId + '/users', {
			users: users
		}, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// Update array of users

  		});
	};

	ChatService.deleteMessage = function(conversationId, messageId) {
		return $http.delete('/api/conversations/' + conversationId + '/messages/' + messageId, {
			headers: { Authorization: 'Bearer ' + $auth.getToken() }
		}).then(function(res){
    		// Update array of messages
    		
  		});
	};	

	return ChatService;
}]);