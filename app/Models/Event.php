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
        'organiser',
        'is_public',
        'poster'
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'event_categories', 'event_id', 'category_id');
    }

    public function favouritedByUsers()
    {
        return $this->belongsToMany(User::class, 'favourites', 'event_id', 'user_id');
    }

}
