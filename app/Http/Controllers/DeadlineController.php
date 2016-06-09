<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use GuzzleHttp\Client;
use Auth;
use App\Deadline;
use App\Project;
use App\User;

class DeadlineController extends Controller
{
    public function index(Request $request) {
    	// Get the deadlines that has a project with the authenticated user in it
    	return Deadline::whereHas('project.users', function ($query) {
		    $query->where('id', Auth::id());
		})->get();
    }

    public function create(Request $request) {
    	// Get json data
    	$post_data = $request->json()->all();

    	// Set up deadline
    	$deadline = new Deadline();
    	$deadline->name = $post_data['name'];
    	$deadline->deadline_date = $post_data['deadline_date'];
    	$deadline->project_id = $post_data['project']['id'];

  		$deadline->save();

  		// Add project relationship
  		$project = Project::where('id', $post_data['project']['id'])->first();
  		$deadline->project()->associate($project);
  		$deadline->save();

  		return $deadline;
    }

    public function get(Request $request, $id) {
    	// Get the deadline that has a project with the authenticated user in it
    	$deadline = Deadline::whereHas('project.users', function ($query) {
		    $query->where('id', Auth::id());
		})->where('id', $id)->first();

    	// Get project connected to the deadline
    	$project = $deadline->project()->first();
    	
    	// Setup HTTP client to connect with GitHub
    	$client = new Client([
			'base_uri' => 'https://api.github.com/',
			'auth' => [ null, $request->github_token ]
		]);

    	// Get repository
    	$res = $client->request('GET', 'repos/' . $project->repository_owner_name . '/' . $project->repository_name);

    	// Get repo and set up its owner
		$repo = json_decode($res->getBody(), true);

    	// Check if the authenticated user has permissions to manage the repo
    	$deadline->permissions = $repo['permissions'];

        // Add the project as well
        $deadline->project = $project;

		return $deadline;
    }

    public function update(Request $request, $id) {
    	// Get json data
    	$post_data = $request->json()->all();

    	// Update deadline
    	$deadline = Deadline::where('id', $id)->first();
    	
    	$deadline->name = $post_data['name'];
    	$deadline->deadline_date = $post_data['deadline_date'];

    	$deadline->save();

    	return $deadline;
    }
}
