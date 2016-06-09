<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;
use Illuminate\Http\Request;
use Socialite;
use \Firebase\JWT\JWT;

class AuthController extends Controller
{
    /**
     * Login with GitHub.
     */
    public function github(Request $request)
    {   
        // Set up Github as a provider with Socialite
        $provider = Socialite::driver("github");
        $provider->stateless();

        // Get the GitHub user profile
        $profile = $provider->user();

        // Return existing user, or create a new one
        return $this->findOrCreateUser($profile, $request);
    }

    /**
     * Find or create a new user
     */
    public function findOrCreateUser($profile, $request) {
        // Check if the user is providing authentication, if so, link the accounts
        if ($request->header('Authorization'))
        {
            $user = User::where('github', '=', $profile->getId());

            if ($user->first())
            {
                return response()->json(['message' => 'There is already a GitHub account that belongs to you'], 409);
            }

            $token = explode(' ', $request->header('Authorization'))[1];
            $payload = (array) JWT::decode($token, Config::get('app.token_secret'), array('HS256'));

            $user = User::find($payload['sub']);
            $user->email = $profile['email'];
            $user->github = $profile['id'];
            $user->displayName = $profile['email'];
            $user->githubLogin = $profile['login'];
            $user->save();

            return response()->json(['token' => $this->createToken($user, $profile->token)]);
        }
        // Create a new user with the profile
        else
        {
            $user = User::where('github', '=', $profile->getId());

            if ($user->first())
            {
                return response()->json(['token' => $this->createToken($user->first(), $profile->token)]);
            }

            $user = new User;
            $user->email = $profile['email'];
            $user->github = $profile['id'];
            $user->displayName = $profile['email'];
            $user->githubLogin = $profile['login'];
            $user->save();
            
            return response()->json(['token' => $this->createToken($user, $profile->token)]);
        }
    }

    /**
     * Generate JSON Web Token.
     * @param  User  $user
     * @return string
     */
    protected function createToken($user, $token)
    {   
        // Set up the payload
        $payload = [
          'github_token' => $token,
          'sub' => $user->getAuthIdentifier(),
          'iat' => time(),
          'exp' => time() + (365 * 24 * 60 * 60), // 1 year
        ];

        // Encode the token
        return JWT::encode($payload, env('JWT_KEY'), 'HS256');
    }
}
