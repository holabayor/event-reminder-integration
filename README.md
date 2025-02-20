# Telex Reminder Integration

Telex Reminder Integration is an Express and TypeScript-based project designed to schedule events and send reminders to a Telex channel. This lightweight and efficient integration helps teams stay organized by automating event notifications with customizable reminder intervals.

## Features

- Schedule events with titles, dates, and times.
- Set default and event-specific reminder intervals.
- Send automated event reminders to a Telex channel.
- Manage event data with in-memory storage.
- Validate incoming event commands and handle errors gracefully.
- Built with TypeScript for type safety and maintainability.

## Tech Stack

- _Backend:_ Node.js, Express.js, TypeScript
- _Data Storage:_ JSON file (can be replaced with a database)
- _Task Queue:_ Background task processing
- _API Integration:_ Telex webhook for sending reminders

## Project Structure

```
├── src
│   ├── data
│   │   └── storage.ts
│   ├── queue
│   │   └── index.ts
│   ├── utils
│   │   └── index.ts
│   ├── validators
│   │   └── index.ts
│   ├── types
│   │   └── index.ts
│   ├── index.ts
├── package.json
├── tsconfig.json
├── ecosystem.config.js
├── .gitignore
├── .env
└── README.md
```

## Installation

1. _Clone the repository:_

```bash
 git clone https://github.com/telexintegrations/event-reminder-integration.git
 cd event-reminder-integration
```

2. _Install dependencies:_

```bash
 npm install
```

3. _Set up environment variables:_

Create a .env file in the root directory and specify:

```
PORT=3000
```

4. _Compile TypeScript:_

```bash
 npm run build
```

5. _Run the server:_

```bash
 npm start
```

The server should be running on http://localhost:3000

## How It Works

1. _Event Creation:_

   - `POST /event` endpoint processes a message that starts with /event, extracts event details (title, date, time), and saves the event with a reminder interval.
     e.g. `/event "Team Meeting" 2025-03-10 15:00`

2. _Reminder Scheduling:_
   - `POST /tick` endpoint is triggered periodically.
   - Checks if any events are due for a reminder.
   - Sends a message to the specified Telex channel via webhook.

## Validation & Error Handling

- The eventValidator ensures that all required fields (message, channel_id, and settings) are present.
- Invalid or improperly formatted requests return 400 Bad Request with a detailed error message.
- Edge cases (e.g., missing reminder interval settings) are handled gracefully.

## Task Queue

- Uses a background task queue to manage reminder sending.
- Prevents blocking the main event loop and ensures smooth performance even with high traffic.

## Future Improvements

- [ ] Persistent event storage (e.g., MongoDB, PostgreSQL).
- [ ] Advanced scheduling with customizable recurrence rules.
