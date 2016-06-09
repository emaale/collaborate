<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use Auth;
use App\User;
use GuzzleHttp\Client;

class UserController extends Controller
{
    // Fetches all users
    public function index() {
        // Return users
        return User::all();
    }

	// Fetches the user profile
    public function show() {
    	// Return the authorized user
    	return Auth::user();
    }

    // Updates the user profile
    public function update(Request $request) {
    	// Get the authoriuzed user
    	$user = User::find(Auth::user()->id);

    	// Update the fields
    	$user->displayName = $request->input('displayName');
    	$user->phone = $request->input('phone');

    	// Save
    	$user->save();
    }

    // Gets the user repos
    public function getUserRepos() {
        $client = new Client();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/user/repos', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        return $res->getBody();
    }

    // Get the user orgs
    public function getUserOrgs(Request $request) {
        $client = new Client();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/user/memberships/orgs', [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        $pendingOrgs = json_decode($res->getBody(), true);

        $orgs = array();

        // Only keep the ones with admin roles
        foreach ($pendingOrgs as $org) {
            if($org['role'] == "admin") array_push($orgs, $org);
        }

        return $orgs;
    }

    // Searches for users based on username
    public function searchUsers($query, Request $request) {
        $client = new Client();

        // Get the users organizations
        $res = $client->request('GET', 'https://api.github.com/search/users?q=' . $query, [
            'auth' => [
                null,
                $request->github_token
            ]
        ]);

        $members = json_decode($res->getBody(), true);
        $members = $members['items'];
        
        // Loop through the members, and check each one for a linked account, if they are linked, isLinked should be set to true, on the member
        foreach ($members as &$member) {
            $user = User::where('github', $member['id'])->get();
            
            // Check if a user exist with the GitHub ID
            if($user->first()) {
                // Add isLinked to the member
                $member['isLinked'] = true;
                
                // Set display name
                $member['display_name'] = $user->first()->displayName;
            } else {
                $member['isLinked'] = false;
            }
        }

        return $members;
    }
}
