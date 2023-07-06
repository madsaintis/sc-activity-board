<x-mail::message>
# Event Updated

We wanted to inform you that the following event has been updated:

<x-mail::panel>

**{{$event->title}}**

Time: **{{$formattedStartTime}} - {{$formattedEndTime}}**

Location: **{{$event->location}}**

Description: **{{$event->description}}**

</x-mail::panel>
    
Thank you for your attention.
    
Regards,<br>
{{ config('app.name') }}
</x-mail::message>
