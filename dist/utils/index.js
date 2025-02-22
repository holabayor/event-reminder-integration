"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToTelex = exports.parseEventCommand = void 0;
const chrono = __importStar(require("chrono-node"));
const parseEventCommand = (command) => {
    // Regex to capture the event title (inside quotes) and the remainder as the date/time string.
    // It allows extra spaces between parts.
    const regex = /\/event\s*"([^"]+)"\s*(.+)/i;
    const match = command.match(regex);
    if (!match) {
        throw new Error(`
      Invalid command format.
      Use: /event "Event Title" [date/time]
      Example: /event "Team Meeting" tomorrow at 10am
      `);
    }
    const title = match[1].trim();
    const dateTimeText = match[2].trim();
    // Use chrono-node to parse the natural language date/time
    const parsedDate = chrono.parseDate(dateTimeText);
    if (!parsedDate) {
        throw new Error(`
      Could not parse the date/time. Please try a different format.
      Use: /event "Event Title" [date/time]
      Example: /event "Team Meeting" tomorrow at 10am
      `);
    }
    const date = parsedDate.toISOString().split('T')[0];
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    return { title, date, time };
};
exports.parseEventCommand = parseEventCommand;
const sendMessageToTelex = (message_1, channel_id_1, ...args_1) => __awaiter(void 0, [message_1, channel_id_1, ...args_1], void 0, function* (message, channel_id, status = 'success') {
    try {
        yield fetch(`https://ping.telex.im/v1/webhooks/${channel_id}`, {
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
    }
    catch (error) {
        console.error('Error sending message to Telex:', error);
    }
});
exports.sendMessageToTelex = sendMessageToTelex;
