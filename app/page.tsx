import Event from '@/database/event.model';
import connectDB from '@/lib/mongodb';
import ExploreBtn from '../components/ExploreBtn'
import EventCard from './components/EventCard'
import { cacheLife } from 'next/cache';

const page = async () => {
  'use cache';
  cacheLife('hours');

if (!process.env.MONGODB_URI) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Events are coming soon</h1>
      <p className="mt-4">This workspace is waiting for its service setup. Please check back soon.</p>
    </main>
  );
}

await connectDB();
const events = await Event.find()
  .sort({ createdAt: -1 })
  .select('title image slug location date time -_id')
  .lean();

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
          {events.map((event) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
        {events.length === 0 && <p>No events yet. Check back soon.</p>}
      </div>
    </section>
  )
}

export default page

