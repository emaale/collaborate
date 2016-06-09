<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use GuzzleHttp\Client;
use GuzzleHttp\Promise;
use App\User;

class TeamController extends Controller
{
	// Creates a team, given admin role
	public function create(Request $request) {
		$client = new Client([
			'base_uri' => 'https://api.github.com/',
			'auth' => [ null, $request->github_token ]
		]);

		// Get post data
		$post_data = $request->json()->all();

		// Create the team
		$res = $client->request('POST', '/orgs/' . $post_data['org']['login'] . '/teams', [
			'json' => [
				'name' => $post_data['name'],
			]
		]);

		return $res->getBody();
	}

	// Returns teams within organization
	public function getTeams(Request $request) {
		$client = new Client([
			'base_uri' => 'https://api.github.com/',
			'auth' => [ null, $request->github_token ]
		]);

		// Get the users organizations
		$res = $client->request('GET', '/user/orgs');

		// Decode response body
		$orgs = json_decode($res->getBody(), true);

		// Teams
		$teams = array();

		// Loop through organizations and request the teams for all
		foreach ($orgs as &$org) {
			// Get organizations teams
			$res = $client->request('GET', '/orgs/' . $org['login'] . '/teams');

			// Decode response body
			$requestedTeams = json_decode($res->getBody(), true);

			// Add the organization to each team
			foreach ($requestedTeams as &$team) {
				$team['org'] = $org;

				// Fetch team members
				$team['members'] = $this->getTeamMembers($request, $team['id']);
			}

			// Push the fetched teams to the teams array
			$teams = array_merge($teams, $requestedTeams);
		}

		// Return organizations
		return $teams;
	}

	// Returns team
	public function getTeam(Request $request, $id) {
		$client = new Client([
			'base_uri' => 'https://api.github.com/',
			'auth' => [ null, $request->github_token ]
		]);

		// Get the team
		$res = $client->request('GET', '/teams/' . $id);

		$team = json_decode($res->getBody(), true);

		// Fetch team members
		$team['members'] = $this->getTeamMembers($request, $id);

		// Fetch user role
		$res = $client->request('GET', '/user/memberships/orgs/' . $team['organization']['login']);
		$membership = json_decode($res->getBody(), true);
		$team['role'] = $membership['role'];

		return $team;
	}

	// Updates the team name and description
	public function update(Request $request) {
		$client = new Client([
			'base_uri' => 'https://api.github.com/',
			'auth' => [ null, $request->github_token ]
		]);

		// Get post data
		$post_data = $request->json()->all();

		// Create the team
		$res = $client->request('PATCH', '/teams/' . $post_data['id'], [
			'json' => [
				'name' => $post_data['name'],
				'description' => $post_data['description'],
			]
		]);

		return $res->getBody();
	}

	// Returns team members
	public function getTeamMembers(Request $request, $id) {
		$client = new Client();

		// Get the users organizations
		$res = $client->request('GET', 'https://api.github.com/teams/' . $id . '/members', [
			'auth' => [
	            null,
	            $request->github_token
			]
		]);

		$members = json_decode($res->getBody(), true);

		// Loop through the members, and check each one for a linked account, if they are linked, isLinked should be set to true, on the member
		foreach ($members as &$member) {
			$user = User::where('github', $member['id'])->get();
			
			// Check if a user exist with the GitHub ID
			if($user->first()) {
				// Add isLinked to the member
				$member['isLinked'] = true;
				
				// Set display name
				$member['displayName'] = $user->first()->displayName;
				$member['github'] = $user->first()->github;
			} else {
				$member['isLinked'] = false;
			}
		}

		return $members;
	}

	// Returns team member
	public function getTeamMember(Request $request, $id, $user) {
		$client = new Client();

		// Get the users organizations
		$res = $client->request('GET', 'https://api.github.com/teams/' . $id . '/members/' . $user, [
			'auth' => [
	            null,
	            $request->github_token
			]
		]);

		// If not 404, then user is member, so we need to fetch the user from GitHub, then add some additional data if account is linked

		return $res->getBody();
	}

	// Searches for teams the user is part of
	public function searchTeams(Request $request, $query) {

	}

	// Adds member to the team
	public function addTeamMember(Request $request) {
		$client = new Client([
			'base_uri' => 'https://api.github.com/',
			'auth' => [ null, $request->github_token ]
		]);

		$json = $request->json()->all();

		// Add the team member
		$res = $client->request('PUT', '/teams/' . $json['team']['id'] . '/memberships/' . $json['user']['login']);

		return $res->getBody();
	}
}
