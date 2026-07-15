'use client';

import { createBooking } from '@/lib/actions/booking.actions';
import { useState } from 'react';
import posthog from 'posthog-js';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createBooking({ eventId, slug, email });
      console.log('createBooking result:', result);

      if (result?.success) {
        setSubmitted(true);
        posthog.capture('event booked', { eventId, slug, email });
      } else {
        console.warn('Booking failed:', result);
        alert(JSON.stringify(result));
        posthog.captureException(new Error('booking creation failed'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      posthog.captureException(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Enter your email address"
            />
          </div>

          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Sign Up'}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;