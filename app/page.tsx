import { IEvent } from '@/database/event.model';
import ExploreBtn from '../components/ExploreBtn'
import EventCard from './components/EventCard'
import events from '@/lib/constants';
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const page = async () => {
  'use cache';
  cacheLife('hours');

if (!process.env.MONGODB_URI || !BASE_URL) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Events are coming soon</h1>
      <p className="mt-4">This workspace is waiting for its service setup. Please check back soon.</p>
    </main>
  );
}

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
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page
