<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(SignupRequest $request){

        // Validate data
        $data = $request->validated();

        // Set user role to Event Organiser if user register with utm email
        if (Str::endsWith($data['email'], ['@utm.my', '@graduate.utm.my'])) {
            $data['role'] = 'Event Organiser';
        }

        // Create new user in database
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role' => $data['role'] ?? 'Event Participant', // Default role if not set
        ]);

        // Send email verification
        event(new Registered($user));

        // Set user as logged in
        Auth::login($user);

        // Create authorization token for the user
        $token = $user-> createToken('main')->plainTextToken;
        
        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request) {
        
        // Validate user credentials
        $credentials = $request->validated();

        // Attempts to authenticate the credentials with the one stored in database
        if(!Auth::attempt($credentials)) {
            return response([
                'message' => 'Wrong email address or password.'
            ], 422);
        }

        /**@var User $user */
        // Log users into the website
        $user = Auth::user();

        // Create access token for user
        $token = $user->createToken('main')->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function logout(Request $request){
        
        /**  @var App\Models\User $user*/
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response('', 204);
    }

    public function sendEmailVerification(Request $request){
        $user = $request->user();

        if ($user && !$user->hasVerifiedEmail()) {
            $user->sendEmailVerificationNotification();
        }

        return response()->json(['message' => 'Verification email sent']);
}

}
