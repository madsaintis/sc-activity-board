<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Mail\EventCancellation;
use App\Mail\EventUpdate;
use Illuminate\Support\Facades\Mail;
use App\Models\Favourite;
use App\Models\User;

class EventController extends Controller
{
    
    // Controller to retrieve events
    public function index()
    {
        // Retrieve all public events
        $publicEvents = Event::where('is_Public', true)->orderBy('id', 'asc')->get();

        // Retrieve all current user private events
        $privateEvents = Event::where('is_Public', false)
                            ->where('organiser_id', auth()->id())
                            ->orderBy('id', 'asc')
                            ->get();

        // Combine both arrays into one
        $events = $publicEvents->concat($privateEvents);

        // Return event array in JSON format
        return EventResource::collection($events);
    }

    // Controller for creating new event
    public function store(StoreEventRequest $request)
{
    $data = $request->validated();

    // Handle poster upload
    if ($request->hasFile('poster')) {
        $poster = $request->file('poster');
        $data['poster'] = file_get_contents($poster);
    }

    // Create new event model into the database
    $event = Event::create($data);
    
    // Create many to many relationships based on the event categories
    if (isset($data['categories']) && is_array($data['categories'])) {
        $event->categories()->attach($data['categories']);
    }

    return response(new EventResource($event), 201);
}

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return new EventResource($event);
    }

    // Controller for updating existing event
    public function update(UpdateEventRequest $request, Event $event)
    {
        $data = $request->validated();
    
        // Check if the 'changed' value from the request is true
        $changed = $request->input('changed') === 'true';
    
        // Handle poster upload if the image file has changed
        if ($changed && $request->hasFile('poster')) {
            $poster = $request->file('poster');
            $data['poster'] = file_get_contents($poster);
        } elseif ($changed) {
            $data['poster'] = null;
        }
    
        // Update the event data
        $event->update($data);
    
        // Update the event category table based on new event categories
        if (isset($data['categories']) && is_array($data['categories'])) {
            $event->categories()->sync($data['categories']);
        } else {
            // If no categories are provided, detach all categories
            $event->categories()->detach();
        }
    
        // Send update email notification if the event details (excluding poster) have changed
        if ($event->wasChanged() && !($changed && $request->hasFile('poster'))) {

            // Get the list of user IDs who have favorited the event
            $userIds = Favourite::where('event_id', $event->id)->pluck('user_id');

            // Retrieve the users based on the user IDs
            $users = User::whereIn('id', $userIds)->get();
    
            // Send notification emails to the users
            foreach ($users as $user) {
                Mail::to($user->email)->send(new EventUpdate($event));
            }
        }
    
        return response(new EventResource($event), 201);
    }

    // Controller for deleting existing event
    public function destroy(Event $event)
    {
    
        // Get the list of user IDs who have favorited the event
        $userIds = Favourite::where('event_id', $event->id)->pluck('user_id');

        // Retrieve the users based on the user IDs
        $users = User::whereIn('id', $userIds)->get();

        // Send notification emails to the users
        foreach ($users as $user) {
            Mail::to($user->email)->send(new EventCancellation($event));
        }

        // Remove all entries in event category table that related 
        // to this event
        $event->categories()->detach();

        // Remove event from the database
        $event -> delete();
        return response("", 204);
    }

}
