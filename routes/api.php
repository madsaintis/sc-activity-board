<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FavoriteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('/users', UserController::class);
    Route::apiResource('/events', EventController::class);
    Route::apiResource('/categories', CategoryController::class);
    Route::post('/favourites', [FavoriteController::class, 'store']);
    Route::delete('/favourites/{userId}/{eventId}', [FavoriteController::class, 'destroy']);

    // Route::get('/email/verify', function () {
    //     return redirect('http://localhost:3000/verify');
    // })->middleware('auth')->name('verification.notice');

    // Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    //     $request->fulfill();

    //     return redirect('http://localhost:3000/home');
    // })->middleware(['auth', 'signed'])->name('verification.verify');

    // Route::post('/email/verification-notification', function (Request $request) {
    //     $request->user()->sendEmailVerificationNotification();
     
    //     return back()->with('message', 'Verification link sent!');
    // })->middleware(['auth', 'throttle:6,1'])->name('verification.send');

    Route::get('/email/verify', [EmailVerificationController::class, 'notice'])
    ->middleware('auth:sanctum')
    ->name('verification.notice');

Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
    ->middleware('throttle:1,60')
    ->name('verification.send');

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])->name('verification.verify');
