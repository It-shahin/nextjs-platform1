import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  if (!BASE_URL) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
  }

  const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: 'no-store',
  });

  if (!request.ok) {
    return notFound();
  }

  const contentType = request.headers.get('content-type');

  if (!contentType?.includes('application/json')) {
    const text = await request.text();
    throw new Error(`Expected JSON, got: ${text}`);
  }

  const { event } = await request.json();

  if (!event) return notFound();

  return (
    <section id="event">
      <h1>Event Details: {slug}</h1>
    </section>
  );
};

export default EventDetailsPage;