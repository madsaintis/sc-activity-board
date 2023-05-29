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
            ['category_id' => 1, 'category_name' => 'Year 1'],
            ['category_id' => 2, 'category_name' => 'Year 2'],
            ['category_id' => 3, 'category_name' => 'Year 3'],
            ['category_id' => 4, 'category_name' => 'Year 4'],
            ['category_id' => 5, 'category_name' => 'Postgraduate'],
            ['category_id' => 6, 'category_name' => 'Academic'],
            ['category_id' => 7, 'category_name' => 'Career'],
            ['category_id' => 8, 'category_name' => 'Cultural'],
            ['category_id' => 9, 'category_name' => 'Examination'],
            ['category_id' => 10, 'category_name' => 'Sports'],
        ];

        DB::table('categories')->insert($categories);
    }
}
