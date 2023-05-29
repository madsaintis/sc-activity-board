<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this -> id,
            'title' => $this -> title,
            'description' => $this -> description,
            'date' => $this -> date,
            'start_time' => $this -> start_time,
            'end_time' => $this -> end_time,
            'organiser' => $this -> organiser,
            'location' => $this -> location,
            'isPublic' => $this -> is_public,
            'categories' => $this->categories,
            //'created_at' => $this -> created_at -> format('Y-m-d H:i:s'),
        ];
    }
}
