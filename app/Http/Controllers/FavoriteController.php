<?php

namespace App\Http\Controllers;

use App\Models\Favourite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'userId' => 'required',
            'eventId' => 'required',
        ]);

        // Create a new favorite record
        Favourite::create([
            'user_id' => $validatedData['userId'],
            'event_id' => $validatedData['eventId'],
        ]);

        return response()->json(['message' => 'Event added to favorites']);
    }

    public function destroy($userId, $eventId)
    {
        // Find the favorite record based on user ID and event ID
        $favorite = Favourite::where('user_id', $userId)->where('event_id', $eventId)->first();

        if ($favorite) {
            // Delete the favorite record
            Favourite::where('user_id', $userId)->where('event_id', $eventId)->delete();
            return response()->json(['message' => 'Event removed from favorites']);
        }

        return response()->json(['message' => 'Favorite record not found'], 404);
    }
}
