import { IEvent } from '@/database/event.model';
import ExploreBtn from '../components/ExploreBtn'
import EventCard from './components/EventCard'
import events from '@/lib/constants';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const page = async () => {

const response = await fetch(`${BASE_URL}/api/events`);
const { events } = await response.json();

  return (
    <section>
      <h1 className=" text-center">
        The Hub for Every Developer <br/> Event You Can`t Miss
      </h1>
      <p className="text-center mt-5">Hackatons, Meetups and Conferences, all In One Place</p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events && events.length > 0 && events.map((event : IEvent) => (
            <li key={event.title} className="event">
              <EventCard title={event.title} image={event.image} 
              slug={event.slug} location={event.location} 
              date={event.date} time={event.time} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page
