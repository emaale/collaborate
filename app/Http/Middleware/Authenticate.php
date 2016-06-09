<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use \Firebase\JWT\JWT;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next)
    {   
        // Check whether or not the visitor is providing authentication
        if ($request->header('Authorization')) {
            $token = explode(' ', $request->header('Authorization'))[1];

            $payload = (array) JWT::decode($token, env('JWT_KEY'), ['HS256']);

            // Make sure it hasn't expired
            if ($payload['exp'] < time()) {
                return response()->json(['message' => 'Token has expired']);
            }

            // Set github token so it can be used to make API calls
            $request->merge(['github_token' => $payload['github_token']]);

            // Make use of the Auth class, so we can use it later to get the authenticated user
            Auth::onceUsingId($payload['sub']);
        } else {
            // Let the client know that the user isn't authenticated
            return response()->json(['message' => 'Not authenticated']);
        }

        return $next($request);
    }
}
