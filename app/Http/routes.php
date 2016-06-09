<?php

##################################
##	    	  Routes		  	##
##################################
##	1 	 	  	Authentication  ##
##------------------------------##
##  2 					 Teams  ##
##------------------------------##
##  3 				  Projects  ##
##------------------------------##
##  4 				 Deadlines  ##
##------------------------------##
##  5 					  Chat  ##
##------------------------------##
##  6 					  User  ##
##------------------------------##
##  6 					 Repos  ##
##------------------------------##
##  7	  Wildcard (Catch All)  ##
##################################


# 1 Authentication
Route::post('auth/github', 'Auth\AuthController@github');

# Make sure user is authenticated to reach these routes
Route::group(['middleware' => 'auth', 'prefix' => 'api'], function () {
	
	# 2 Teams
	Route::get('teams', 'TeamController@getTeams');
	Route::post('teams', 'TeamController@create');
	Route::get('teams/{id}', 'TeamController@getTeam');
	Route::put('teams/{id}', 'TeamController@update');
	Route::get('teams/{id}/members', 'TeamController@getTeamMembers');
	Route::post('teams/{id}/members', 'TeamController@addTeamMember');
	Route::get('teams/{id}/members/{user}', 'TeamController@getTeamMember');
	Route::get('teams/{id}/memberships/{user}', 'TeamController@getMembership');
	Route::put('teams/{id}/memberships/{user}', 'TeamController@addMembership');
	Route::delete('teams/{id}/memberships/{user}', 'TeamController@addMembership');
	Route::get('search/teams/{query}', 'TeamController@searchTeams');

	# 3 Projects
	Route::get('projects', 'ProjectController@index');
	Route::post('projects', 'ProjectController@create');
	Route::get('projects/{id}', 'ProjectController@get');
	Route::put('projects/{id}', 'ProjectController@update');
	Route::post('projects/{id}/deploy', 'ProjectController@deploy');
	Route::get('search/projects/{query}', 'ProjectController@search');

	# 4 Deadlines
	Route::get('deadlines', 'DeadlineController@index');
	Route::post('deadlines', 'DeadlineController@create');
	Route::get('deadlines/{id}', 'DeadlineController@get');
	Route::put('deadlines/{id}', 'DeadlineController@update');

	# 5 Chat
	Route::get('conversations', 'ChatController@index');
	Route::post('conversations', 'ChatController@create');
	Route::get('conversations/{id}', 'ChatController@get');
	Route::get('conversations/{id}/users', 'ChatController@listUsersByConversation');
	Route::post('conversations/{id}/messages', 'ChatController@createMessage');
	Route::put('conversations/{id}/read', 'ChatController@markAsRead');
	Route::put('conversations/{id}/clear', 'ChatController@clearMessages');
	Route::put('conversations/{id}/users', 'ChatController@removeUsers');
	Route::post('conversations/{id}/users', 'ChatController@addUsers');

	# 6 User
	Route::get('users', 'UserController@index');
	Route::get('user', 'UserController@show');
	Route::put('user', 'UserController@update');	
	Route::get('user/repos', 'UserController@getUserRepos');
	Route::get('user/orgs', 'UserController@getUserOrgs');
	Route::get('search/users/{query}', 'UserController@searchUsers');

	# Repos
	Route::get('repos', 'RepoController@getRepos');
	Route::get('repos/{id}/collaborators', 'RepoController@getCollaborators');
	Route::put('repos/{id}/collaborators/{collaborator}', 'RepoController@addCollaborator');
	Route::delete('repos/{id}/collaborators/{collaborator}', 'RepoController@removeCollaborator');
	Route::get('repos/{id}/commits', 'RepoController@getCommits');
	Route::get('repos/{id}/readme', 'RepoController@getReadme');
	Route::put('repos/{id}/readme', 'RepoController@updateReadme');
	
});

# Wildcard (Catch All)
Route::any('{catchall}', function ($page) {
    // Hand off to AngularJS
    return View("app");
} )->where('catchall', '(.*)');
