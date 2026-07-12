import { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => {
          const emailRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

          return emailRegex.test(email);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Validate that the referenced event exists before saving a booking.
BookingSchema.pre('save', async function () {
  const booking = this as IBooking;

  if (!booking.isNew && !booking.isModified('eventId')) {
    return;
  }

  try {
    const eventExists = await Event.exists({ _id: booking.eventId });

    if (!eventExists) {
      const error = new Error(
        `Event with ID ${booking.eventId.toString()} does not exist`
      );
      error.name = 'ValidationError';
      throw error;
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      throw error;
    }

    const validationError = new Error(
      'Invalid event ID format or database error'
    );
    validationError.name = 'ValidationError';
    throw validationError;
  }
});

// Helps queries such as: Booking.find({ eventId }).sort({ createdAt: -1 })
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Helps look up all bookings made by one email address.
BookingSchema.index({ email: 1 });

// Prevents duplicate bookings for the same event by the same email.
BookingSchema.index(
  { eventId: 1, email: 1 },
  {
    unique: true,
    name: 'uniq_event_email',
  }
);

const Booking =
  models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;