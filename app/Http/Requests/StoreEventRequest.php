<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'nullable|required',
            'description' => 'nullable|required',
            'location' => 'nullable|required',
            'start_time' => 'nullable|required',
            'end_time' => 'nullable|required',
            'date' => 'nullable|required',
            'organiser' => 'nullable|required',
            'categories' => 'nullable|array|required',
            
        ];
    }
}