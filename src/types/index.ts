export interface Reminder {
  intervalInMinutes: number;
  label: string;
}

interface Settings {
  label: string;
  description?: string;
  type: string;
  required: any;
  default: string;
}

export interface TelexEventRequest {
  message: string;
  channel_id: string;
  settings: Settings[];
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  channelId: string;
  reminders: Reminder[];
}

export interface TickPayload {
  channel_id: string;
  return_url: string;
  settings: Settings[];
}

export interface ParsedEvent {
  title: string;
  date: string;
  time: string;
}
