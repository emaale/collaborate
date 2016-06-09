<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Project;
use GuzzleHttp\Client;
use Auth;

class RepoController extends Controller
{   // Repo ID 40629640 for testing
    // Fetches the collaborators in the repo
    public function getCollaborators(Request $request, $id) {
        $client = new Client();

        // Get project that the repo is connected to
        $project = Project::where('id', $id)->first();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/repos/' . $project->repository_owner_name . '/' . $project->repository_name . '/collaborators', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }

    // Adds a collaborator to the repo
    public function addCollaborator(Request $request, $id, $collaborator) {
        $client = new Client();

        // Get project that the repo is connected to
        $project = Project::where('id', $id)->first();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/repos/' . $project->repository_owner_name . '/' . $project->repository_name . '/collaborators/' . $collaborator, [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }

    // Removes a collaborator from the repo
    public function removeCollaborator(Request $request, $id, $collaborator) {
        $client = new Client();

        // Get project that the repo is connected to
        $project = Project::where('id', $id)->first();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/repos/' . $project->repository_owner_name . '/' . $project->repository_name . '/collaborators/' . $collaborator, [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }

    // Fetches the commits with comments from the repo
    public function getCommits(Request $request, $id) {
    	$client = new Client();

        // Get project that the repo is connected to
        $project = Project::where('id', $id)->first();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/repos/' . $project->repository_owner_name . '/' . $project->repository_name . '/commits', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }

    // Fetches the ReadMe file from the repo
    public function getReadme(Request $request, $id) {
    	$client = new Client();

        // Get project that the repo is connected to
        $project = Project::where('id', $id)->first();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/repos/' . $project->repository_owner_name . '/' . $project->repository_name . '/readme', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        // Decode content and translate its markup to html
        $readme = json_decode($res->getBody(), true);
        $readme['content'] = base64_decode($readme['content']);

        $res = $client->request('POST', 'https://api.github.com/markdown', [
            'json' => [
                'text' => $readme['content']
            ]
        ]);

        // Set html content
        $readme['content'] = base64_encode($res->getBody());
        
        return $readme;
    }

    // Updates the ReadMe file in the repo
    public function updateReadme(Request $request, $id) {
    	$client = new Client();

        // Get project that the repo is connected to
        $project = Project::where('id', $id)->first();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/repos/' . $project->repository_owner_name . '/' . $project->repository_name . '/contents/README.md', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }

    // Fetches all user repos that can be used in the client
    public function getRepos(Request $request) {
    	$client = new Client();

        // Get the users repos
        $res = $client->request('GET', 'https://api.github.com/user/repos', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }
}
