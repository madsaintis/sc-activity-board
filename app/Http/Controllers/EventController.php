<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EventResource::collection(Event::query()->orderBy('id', 'asc')->paginate());
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(StoreEventRequest $request)
    // {
    //     //
    //     $data = $request->validated();

    //     $event = Event::create($data);
    //     $event->categories()->attach($request->categories);
        
    //     return response(new EventResource($event), 201);
    // }

    public function store(StoreEventRequest $request)
{
    $data = $request->validated();

    $event = Event::create($data);
    
    // Retrieve the selected category IDs
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

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $data = $request -> validated();
        $event->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {

        $event->categories()->detach();
        $event -> delete();
        return response("", 204);
    }
}
