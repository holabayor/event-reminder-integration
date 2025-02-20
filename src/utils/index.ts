import * as chrono from 'chrono-node';
import { ParsedEvent } from '../types';

export const parseEventCommand = (command: string): ParsedEvent => {
  // Regex to capture the event title (inside quotes) and the remainder as the date/time string.
  // It allows extra spaces between parts.
  const regex = /\/event\s*"([^"]+)"\s*(.+)/i;
  const match = command.match(regex);
  if (!match) {
    throw new Error(
      `
      Invalid command format.
      Use: /event "Event Title" [date/time]
      Example: /event "Team Meeting" tomorrow at 10am
      `
    );
  }
  const title = match[1].trim();
  const dateTimeText = match[2].trim();

  // Use chrono-node to parse the natural language date/time
  const parsedDate = chrono.parseDate(dateTimeText);
  if (!parsedDate) {
    throw new Error(
      `
      Could not parse the date/time. Please try a different format.
      Use: /event "Event Title" [date/time]
      Example: /event "Team Meeting" tomorrow at 10am
      `
    );
  }

  const date = parsedDate.toISOString().split('T')[0];

  const hours = String(parsedDate.getHours()).padStart(2, '0');
  const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;
  return { title, date, time };
};

export const sendMessageToTelex = async (
  message: string,
  channel_id: string,
  status: 'success' | 'error' = 'success'
) => {
  try {
    await fetch(`https://ping.telex.im/v1/webhooks/${channel_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_name: status === 'error' ? 'Error' : 'Event Scheduled',
        username: 'Event Scheduler',
        status,
        message,
      }),
    });
    console.log('Message sent to Telex');
  } catch (error) {
    console.error('Error sending message to Telex:', error);
  }
};
