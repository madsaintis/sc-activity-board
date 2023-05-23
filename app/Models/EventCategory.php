<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventCategory extends Model
{
    use HasFactory;

    protected $table = 'event_categories'; // Specify the table name if it's different from the default convention

    // Define the fillable fields for mass assignment
    protected $fillable = [
        'event_id',
        'category_id',
    ];

    // Define the relationships
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // Other custom logic or methods related to event_categories table
}
