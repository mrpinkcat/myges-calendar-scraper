import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const pushoverCreds = {
  token: process.env.PUSHOVER_TOKEN,
  user: process.env.PUSHOVER_USER,
}

export const write = (message) => {
  const actualTime = new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
  });
  fs.appendFileSync('./logs.txt', `[${actualTime}] ${message}`);
}

export const notify = async (title, message) => {
  if (!pushoverCreds.token || !pushoverCreds.user) {
    console.warn('⚠️ Pushover credentials not found');
    return;
  }
  await axios.post('https://api.pushover.net/1/messages.json', {
    ...pushoverCreds,
    title,
    message,
  });
};