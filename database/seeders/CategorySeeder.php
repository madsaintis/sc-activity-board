<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['tag_id' => 1, 'tag_name' => 'Year 1'],
            ['tag_id' => 2, 'tag_name' => 'Year 2'],
            ['tag_id' => 3, 'tag_name' => 'Year 3'],
            ['tag_id' => 4, 'tag_name' => 'Year 4'],
            ['tag_id' => 5, 'tag_name' => 'Postgraduate'],
            ['tag_id' => 6, 'tag_name' => 'Academic'],
            ['tag_id' => 7, 'tag_name' => 'Career'],
            ['tag_id' => 8, 'tag_name' => 'Cultural'],
            ['tag_id' => 9, 'tag_name' => 'Examination'],
            ['tag_id' => 10, 'tag_name' => 'Sports'],
        ];

        DB::table('categories')->insert($categories);
    }
}
