<?php

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create Admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('abc12345'),
            'role' => 'Admin',
        ]);

        // Create Event Participant user
        User::create([
            'name' => 'Ali',
            'email' => 'ali@gmail.com',
            'password' => bcrypt('abc12345'),
            'role' => 'Event Participant',
        ]);
    }
}