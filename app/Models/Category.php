<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'tag_id';
    public $incrementing = false;
    public $timestamps = false;

    // Define the fillable fields for mass assignment
    protected $fillable = [
        'tag_name',
    ];

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_categories', 'tag_id', 'event_id');
    }
}
