<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    
    // Controller for retrieving users
    public function index()
    {
        // Return users list in JSON format
        return UserResource::collection(
            User::query()
                ->where('role', '<>', 'Admin')
                ->orderBy('id', 'asc')
                ->paginate()
        );
    }

    // Controller for creating new user
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);
        return response(new UserResource($user), 201);
    }

    // Controller for showing users
    public function show(User $user)
    {
        return new UserResource($user);
    }

    // Controller for update a user
    public function update(UpdateUserRequest $request, User $user)
    {
        // Validate user input
        $data = $request -> validated();

        // Hash user's new password
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        // Update database entry based on new user
        $user->update($data);
    }

    // Controller for deleting a user
    public function destroy(User $user)
    {
        // Deletes user based on retrieved user params
        $user -> delete();
        return response("", 204);
    }
}
