import { createEvents } from 'ics';
import { writeFileSync } from 'fs';

const schoolAdresses = {
  'reservation-NATION1': { lat: 48.849268550623556, lon: 2.390034609231941 },
  'reservation-NATION2': { lat: 48.84957434988759, lon: 2.387387688351984 },
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
  return {
    uid: `${id}@myges-scraper`,
    title: courseTitle,
    location: room,
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
    geo: schoolAdresses[className],
    categories: ['ESGI'],
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
  }
};

export default (courses) => {
  const events = courses.map(parseEventsToIcsMap);

  const { error, value } = createEvents(events);

  if (error) {
    console.log('❌ Something went wrong with the create events');
    console.log(error);
    return;
  }

  writeFileSync(`./generated/event.ics`, value);
  console.log('📝 ICS file generated to `generated/event.ics`');
};
