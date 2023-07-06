<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{

    public function sendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return [
                'message' => 'Already Verified'
            ];
        }

        $request->user()->sendEmailVerificationNotification();

        return ['status' => 'verification-link-sent'];
    }

    public function verify(Request $request)
    {

        $user = User::findOrFail($request->id);

    if ($user->hasVerifiedEmail()) {
        return redirect('http://127.0.0.1:3000/verify-success');
    }

    if (!URL::hasValidSignature($request)) {
        return response()->json([
            'message' => 'Invalid verification link'
        ], 400);
    }

    if ($user->markEmailAsVerified()) {
        event(new Verified($user));
    }

    return redirect('http://127.0.0.1:3000/verify-success');
    }

    public function resend(Request $request)
    {
        try {
            $request->user()->sendEmailVerificationNotification();
            return [
                'message' => 'Email resent successfully'
            ];
        } catch (ThrottleRequestsException $e) {
            $retryAfter = RateLimiter::availableIn('default', $request->user()->id);
            throw new \Exception('Too Many Attempts. Please try again later.', 429);
        } catch (\Exception $e) {
            return [
                'message' => 'Email resent failed, please try again later'
            ];
        }
    }
}

