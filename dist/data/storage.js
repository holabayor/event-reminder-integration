"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const EVENTS_FILE = './events.json';
class Storage {
    constructor(filePath = EVENTS_FILE) {
        this.eventsFile = filePath;
        if (!fs_1.default.existsSync(this.eventsFile)) {
            fs_1.default.writeFileSync(this.eventsFile, JSON.stringify([]));
        }
    }
    getEvents() {
        try {
            const data = fs_1.default.readFileSync(this.eventsFile, { encoding: 'utf-8' });
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading events file', error);
            return [];
        }
    }
    saveEvents(events) {
        fs_1.default.writeFileSync(this.eventsFile, JSON.stringify(events));
    }
    addEvent(event) {
        const events = this.getEvents();
        events.push(event);
        this.saveEvents(events);
    }
    deleteEvent(eventId) {
        const events = this.getEvents();
        const updatedEvents = events.filter((event) => event.id !== eventId);
        this.saveEvents(updatedEvents);
    }
}
exports.default = Storage;
