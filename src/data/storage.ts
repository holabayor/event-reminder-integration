import fs from 'fs';
import { EventData } from '../types';

const EVENTS_FILE = './events.json';

export default class Storage {
  private eventsFile: string;

  constructor(filePath: string = EVENTS_FILE) {
    this.eventsFile = filePath;

    if (!fs.existsSync(this.eventsFile)) {
      fs.writeFileSync(this.eventsFile, JSON.stringify([]));
    }
  }

  public getEvents(): EventData[] {
    try {
      const data = fs.readFileSync(this.eventsFile, { encoding: 'utf-8' });
      return JSON.parse(data) as EventData[];
    } catch (error) {
      console.error('Error reading events file', error);
      return [];
    }
  }

  public saveEvents(events: EventData[]): void {
    fs.writeFileSync(this.eventsFile, JSON.stringify(events));
  }

  public addEvent(event: EventData): void {
    const events = this.getEvents();
    events.push(event);
    this.saveEvents(events);
  }
  public deleteEvent(eventId: string): void {
    const events = this.getEvents();
    const updatedEvents = events.filter((event) => event.id !== eventId);
    this.saveEvents(updatedEvents);
  }
}
