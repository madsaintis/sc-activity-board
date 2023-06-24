<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'title', 
        'location', 
        'description', 
        'start_time', 
        'end_time',
        'date',
        'organiser_id',
        'is_public',
        'poster'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'event_categories', 'event_id', 'tag_id');
    }

    public function favouritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favourites', 'event_id', 'user_id');
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organiser_id', 'id');
    }
}
