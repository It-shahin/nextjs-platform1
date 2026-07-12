import { Document, model, models, Schema } from 'mongoose';

export type EventMode = 'online' | 'offline' | 'hybrid';

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },

    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },

    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    date: {
      type: String,
      required: [true, 'Date is required'],
      trim: true,
    },

    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
    },

    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },

    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },

    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: 'At least one agenda item is required',
      },
    },

    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },

    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generate the slug and normalize date/time before saving.
// No `next()` is needed: synchronous middleware completes on return,
// and any thrown error automatically aborts the save.
EventSchema.pre('save', function () {
  const event = this as IEvent;

  if (event.isNew || event.isModified('title')) {
    event.slug = generateSlug(event.title);

    if (!event.slug) {
      const error = new Error(
        'Title must contain at least one letter or number to generate a slug'
      );
      error.name = 'ValidationError';
      throw error;
    }
  }

  if (event.isNew || event.isModified('date')) {
    event.date = normalizeDate(event.date);
  }

  if (event.isNew || event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeDate(dateString: string): string {
  const value = dateString.trim();

  // Avoid timezone conversion changing a valid YYYY-MM-DD date.
  const yyyyMmDd = /^\d{4}-\d{2}-\d{2}$/;

  if (yyyyMmDd.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    const isValidDate =
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day;

    if (isValidDate) {
      return value;
    }
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    const error = new Error('Invalid date format');
    error.name = 'ValidationError';
    throw error;
  }

  return parsedDate.toISOString().split('T')[0];
}

function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    const error = new Error(
      'Invalid time format. Use HH:MM or HH:MM AM/PM'
    );
    error.name = 'ValidationError';
    throw error;
  }

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();

  if (minutes < 0 || minutes > 59) {
    const error = new Error('Minutes must be between 00 and 59');
    error.name = 'ValidationError';
    throw error;
  }

  if (period) {
    if (hours < 1 || hours > 12) {
      const error = new Error(
        'For AM/PM format, hours must be between 1 and 12'
      );
      error.name = 'ValidationError';
      throw error;
    }

    if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    }
  } else if (hours < 0 || hours > 23) {
    const error = new Error(
      'For 24-hour format, hours must be between 00 and 23'
    );
    error.name = 'ValidationError';
    throw error;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

// Supports common filtering/sorting patterns by date and mode.
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;