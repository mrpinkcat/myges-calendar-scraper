import { createEvents } from 'ics';
import { writeFileSync } from 'fs';

const schoolAdresses = {
  'reservation-NATION1': 'Nation 1 - 242 rue du Faubourg Saint Antoine, Paris, 75012',
  'reservation-NATION2': 'Nation 2 - 220 Rue du Faubourg Saint-Antoine, Paris, 75012',
}

/** 
 * @param { {
 *  id: String,
 *  title: String',
 *  start: String,
 *  end: String,
 *  allDay: Boolean,
 *  editable: Boolean,
 *  className: String,
 * }[] } eventData
 */
const parseEventsToIcsMap = ({ id, title, start, end, className }) => {
  const room = title.split('\n')[1] === '' ? null : title.split('\n')[1];
  const courseTitle = title.split('\n')[0];
  const startDateTime = new Date(start);
  const endDateTime = new Date(end);
  let location = null;
  if (room !== '') {
    location = room;
  }
  if (className !== 'reservation-null') {
    location = `${location} - ${schoolAdresses[className]}`;
  }
  return {
    uid: `${id}@myges-scraper`,
    title: courseTitle,
    location,
    start: [
      startDateTime.getFullYear(), // Year
      startDateTime.getMonth() + 1, // Month (0 = January)
      startDateTime.getDate(), // Day
      startDateTime.getHours(), // Hour
      startDateTime.getMinutes(), // Minutes
    ],
    end: [
      endDateTime.getFullYear(), // Year
      endDateTime.getMonth() + 1, // Month (0 = January)
      endDateTime.getDate(), // Day
      endDateTime.getHours(), // Hour
      endDateTime.getMinutes(), // Minutes
    ],
    url: 'https://myges.fr/student/planning-calendar',
    categories: ['ESGI'],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  }
};

export default (courses) => {
  const events = courses.map(parseEventsToIcsMap);

  const { error, value } = createEvents(events);

  if (error) {
    console.error('❌ Something went wrong with the create events');
    console.error(error);
    return;
  }

  writeFileSync(`./generated/event.ics`, value);
  console.info('📝 ICS file generated to `generated/event.ics`');
};
