<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Event;
use Illuminate\Support\Carbon;

class EventUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public $event;

    /**
     * Create a new message instance.
     *
     * @param Event $event
     */
    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $formattedStartTime = Carbon::parse($this->event->start_time)->format('d/m/Y h:i A');
        $formattedEndTime = Carbon::parse($this->event->end_time)->format('d/m/Y h:i A');

        return $this->markdown('emails.event_update')
            ->subject('Event Updated')
            ->with('formattedStartTime', $formattedStartTime)
            ->with('formattedEndTime', $formattedEndTime);
    }
}
