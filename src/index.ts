import express, { Application, Request, Response } from 'express';
import Storage from './data/storage';
import { EventData, TelexEventRequest } from './types';
import { parseEventCommand, sendMessageToTelex } from './utils';
import { BackgroundTaskQueue } from './queue';
import { eventValidator } from './validators';
import { validationResult } from 'express-validator';
import cors from 'cors';
import morgan from 'morgan';

const app: Application = express();
const PORT = process.env.PORT || 3000;

const storage = new Storage();
const taskQueue = new BackgroundTaskQueue();

app.use(cors());

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hi there!');
});

app.get('/integration-json', (req, res) => {
  const baseUrl = req.protocol + '://' + req.get('host');
  res.json({
    author: 'Aanuoluwapo Liasu',
    data: {
      date: {
        created_at: '2025-02-18',
        updated_at: '2025-02-18',
      },
      descriptions: {
        app_name: 'Event Scheduler and Reminder',
        app_description:
          'Schedules events and sends reminders to a Telex channel',
        app_logo:
          'https://res.cloudinary.com/dev-storage/image/upload/v1739805541/event-icon.png',
        app_url: baseUrl,
        background_color: '#fff',
      },
      integration_category: 'Communication & Collaboration',
      integration_type: 'interval',
      is_active: true,
      key_features: [
        'Schedules events',
        'Reminds users of upcoming events',
        'Set default reminder interval',
        'Set reminder interval for an event to the Telex channel',
      ],
      settings: [
        {
          label: 'reminder-interval',
          description: 'The default reminder interval in minutes',
          type: 'text',
          default: '2',
          required: true,
        },
        {
          label: 'interval',
          type: 'text',
          required: true,
          default: '* * * * *',
        },
      ],
      target_url: `${baseUrl}/event`,
      tick_url: `${baseUrl}/tick`,
    },
  });
});

app.post('/event', eventValidator, (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }


  const { message, channel_id, settings } = req.body as TelexEventRequest;
  try {
    // Remove any HTML tags and trim whitespace
    const cleanedMessage = message.replace(/<[^>]*>/g, ' ').trim();

    // Check if message begins with '/event'
    if (cleanedMessage.startsWith('/event') === true) {


      const { title, date, time } = parseEventCommand(cleanedMessage);

      // Find the default reminder interval from settings
      const reminderIntervalSetting = settings.find(
        (setting) => setting.label === 'reminder-interval'
      );
      if (!reminderIntervalSetting) {
        throw new Error('Reminder interval setting not found');
      }
      const reminderInterval = reminderIntervalSetting.default;

      const eventData: EventData = {
        id: Date.now().toString(),
        title,
        date,
        time,
        channelId: channel_id,
        reminders: [
          {
            intervalInMinutes: parseInt(reminderInterval),
            label: `${reminderInterval} minutes before`,
          },
        ],
      };

      storage.addEvent(eventData);
      sendMessageToTelex(`${title} scheduled for ${date} at ${time}`, channel_id);

      // console.log(`Event added: ${eventData}`);

      res.status(200).send({
        event_name: 'Event Scheduled',
        message: `${title} scheduled for ${date} at ${time}`,
        status: 'success',
        username: 'Event Scheduler',
      });
      return;
    }

  } catch (error) {
    let message = 'An error occurred';
    if (error instanceof Error) {
      message = error.message;
    }
    sendMessageToTelex(message, channel_id, 'error');
    res.status(500).send({ message });
    return;
  }
});

app.post('/tick', (req: Request, res: Response) => {

  taskQueue.addTask(async () => {
    const events = storage.getEvents();
    const now = new Date();

    events.forEach((event) => {
      const eventDateTime = new Date(`${event.date}T${event.time}`);

      // Delete past events.
      if (eventDateTime < now) {
        storage.deleteEvent(event.id);
      }

      event.reminders.forEach(async (reminder) => {
        const reminderTime = new Date(
          eventDateTime.getTime() - reminder.intervalInMinutes * 60000
        );

        // Send reminder if the reminder time is within a minute of the current time
        if (Math.abs(now.getTime() - reminderTime.getTime()) < 60000) {
          sendMessageToTelex(
            `Event Reminder: ${event.title} is scheduled for ${event.date} at ${event.time}`,
            event.channelId
          );
        } else {
          console.log('No reminders due');
        }
      });
    });
  });
  res.status(202).json({ status: 'accepted' });
  return;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
