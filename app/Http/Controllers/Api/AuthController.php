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

        $data = $request->validated();

        if (Str::endsWith($data['email'], ['@utm.my', '@graduate.utm.my'])) {
            $data['role'] = 'Event Organiser';
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
            'role' => $data['role'] ?? 'Event Participant', // Default role if not set
        ]);

        event(new Registered($user));
        Auth::login($user);
        $token = $user-> createToken('main')->plainTextToken;
        
        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request) {
        
        $credentials = $request->validated();
        if(!Auth::attempt($credentials)) {
            return response([
                'message' => 'Wrong email address or password.'
            ], 422);
        }

        /**@var User $user */
        $user = Auth::user();
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
