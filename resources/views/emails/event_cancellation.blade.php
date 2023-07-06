<x-mail::message>
# Event Cancelled Notice

We regret to inform you that the following event that 
you followed has been cancelled.

<x-mail::panel>
Title: **{{$event->title}}**

Start Time: **{{$formattedStartTime}}**
</x-mail::panel>

Thank you,
    
{{ config('app.name') }}
</x-mail::message>
