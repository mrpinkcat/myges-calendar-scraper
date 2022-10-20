import { createEvents } from 'ics';
import { writeFileSync } from 'fs';

export default (courses) => {
  const events = courses.map(({ date, start, end, title, room }) => ({
    start: [
      parseInt(`20${date.split('/')[2]}`), // Year
      parseInt(date.split('/')[1]), // Month
      parseInt(date.split('/')[0]), // Day
      parseInt(start.split(':')[0]), // Hour
      parseInt(start.split(':')[1]), // Minute
    ],
    end: [
      parseInt(`20${date.split('/')[2]}`), // Year
      parseInt(date.split('/')[1]), // Month
      parseInt(date.split('/')[0]), // Day
      parseInt(end.split(':')[0]), // Hour
      parseInt(end.split(':')[1]), // Minute
    ],
    title,
    location: room,
    url: 'https://myges.fr/student/planning-calendar',
    // geo: { lat: 40.0095, lon: 105.2669 },
    categories: ['ESGI'],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  }));

  const { error, value } = createEvents(events);

  if (error) {
    console.log('❌ Something went wrong with the create events');
    console.log(error);
    return;
  }

  writeFileSync(`./generated/event.ics`, value);
  console.log('📝 ICS file generated to `generated/event.ics`');
};
