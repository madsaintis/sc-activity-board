<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';
    public $incrementing = false;

    // Define the fillable fields for mass assignment
    protected $fillable = [
        'category_name',
    ];

    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_categories', 'category_id', 'event_id');
    }
}
