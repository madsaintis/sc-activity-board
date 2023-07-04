<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        $user = Auth::user();

        return [
            'id' => $this -> id,
            'title' => $this -> title,
            'description' => $this -> description,
            'date' => $this -> date,
            'start_time' => $this -> start_time,
            'end_time' => $this -> end_time,
            'organiser' => $this->organizer->name,
            'location' => $this -> location,
            'isPublic' => $this -> is_public,
            'categories' => $this->categories,
            'poster' => base64_encode($this->poster),
            'isFavourite' => $this->isFavorite($user),
            'isOrganiser' => $this->organizer->id === $user->id,
            //'created_at' => $this -> created_at -> format('Y-m-d H:i:s'),
        ];
    }

    private function isFavorite($user)
    {
        return $user ? $user->favourites->contains('event_id', $this->id) : false;
    }
}

