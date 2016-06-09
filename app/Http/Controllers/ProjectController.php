<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Project;
use App\User;
use Auth;
use Config;
use SSH;

class ProjectController extends Controller
{
	// Returns all user projects
    public function index(Request $request) {
    	return User::where('id', Auth::id())->first()->projects()->get();
    }

    // Create a new project
    public function create(Request $request) {
    	$post_data = $request->json()->all();

    	$users = array();
    	$hasAuthenticatedUser = false;

    	foreach ($post_data['users'] as $user) {
    		$userModel = User::where('github', $user['id']);

    		// If user has an account, push to $users
    		if($userModel->first()) {
    			array_push($users, $userModel->first());
    		}

    		// If the authenticated user is the user being iterated to, set hasAuthenticatedUser
    		if($user['id'] == Auth::id()) {
    			$hasAuthenticatedUser = true;
    		}
    	}

    	// If authenticated user is not in the array, push the user
    	if(!$hasAuthenticatedUser) {
    		array_push($users, Auth::user());
    	}

    	// Create a new project
    	$project = new Project();
    	$project->name = $post_data['name'];
    	$project->repository_name = $post_data['repo']['name'];
    	$project->repository_owner_name = $post_data['repo']['owner']['login'];
    	$project->save();
    	$project->users()->saveMany($users);

    	return $project;
    }

    // Get a project
    public function get(Request $request, $id) {
    	return Project::where('id', $id)->first();	
    }

    // Update a project
    public function update(Request $request, $id) {
    	// Update specified fields
    }

    // Deploys a project
    public function deploy(Request $request, $id) {
    	// Get post data
    	$post_data = $request->json()->all();

    	// Setup remote connection config
    	Config::set('remote.connections.production.host', $post_data['host']);
    	Config::set('remote.connections.production.username', $post_data['username']);
    	Config::set('remote.connections.production.password', $post_data['password']);

    	// Run SSH command that pulls from the repo
    	SSH::run([
    	    'cd ' . $post_data['directory'], // Change to directory
    	    'git pull https://' . $post_data['owner'] . ':' . $request->github_token . '@github.com/' . $post_data['owner'] . '/' . $post_data['repo'] . '.git', // Clone the repo
    	], function($line){
		    echo $line.PHP_EOL; // outputs server feedback
		});

    }

    // Searches through user projects
    public function search(Request $request, $query) {
    	return User::find(Auth::id())->projects()->where('name', 'LIKE', '%' . $query . '%')->get();
    }
}
