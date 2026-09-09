# DevEvent — Developer Event Platform

A full-stack event discovery and booking experience for developer conferences, meetups, and hackathons.

## Overview

DevEvent presents developer events in a responsive card-based directory with dedicated detail pages, related-event discovery, and email booking. Its Next.js application uses route handlers and server actions with MongoDB, while Cloudinary supports event image uploads and PostHog records product analytics. The repository demonstrates full-stack data flow, schema validation, database indexing, media integration, and analytics instrumentation.

## Screenshots

Screenshots are not included yet. A genuine application capture requires a configured MongoDB database with event records and the environment variables listed below.

## Features

- Event directory backed by MongoDB
- Slug-based event detail pages
- Event agendas, audience, organizer, location, mode, date, and tag presentation
- Similar-event recommendations based on shared tags
- Email booking through a server action
- Email validation and duplicate-booking prevention per event
- Event creation API with streamed Cloudinary image uploads
- PostHog page-view and booking analytics
- Responsive Tailwind CSS layout with a custom animated light-ray background

## Tech Stack

### Application

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Next.js route handlers and server actions

### Data

- MongoDB
- Mongoose

### Services and UI

- Cloudinary
- PostHog
- OGL
- Phosphor Icons

## Architecture

```text
Next.js pages and client components
  -> route handlers and server actions
  -> cached Mongoose connection
  -> MongoDB

Event creation route -> Cloudinary image upload
Client analytics      -> PostHog
```

Server-rendered pages fetch event data through the application's API routes. Shared Mongoose models enforce validation, normalize event slugs and date/time values, and define indexes for event lookup and booking uniqueness. The booking form calls a server action directly, while analytics run in a client-side provider.

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database
- Cloudinary credentials if you plan to create events through the API
- A PostHog project if you want analytics enabled

### Installation

```bash
git clone https://github.com/It-shahin/nextjs-platform1.git
cd nextjs-platform1
npm install
```

### Environment Variables

Create `.env.local` in the repository root:

```dotenv
MONGODB_URI=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
CLOUDINARY_URL=
```

`CLOUDINARY_URL` is needed by the Cloudinary SDK for `POST /api/events`. Keep real credentials out of version control; `.env*` files are ignored by this repository.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

A fresh database displays no event cards because the repository does not include a seed command. Event records can be added through the multipart event-creation API after MongoDB and Cloudinary are configured.

### Production Build

```bash
npm run build
npm run start
```

The current source contains an incomplete declaration in `app/api/test-db/route.ts`; repair or remove that development-only route before relying on the production build.

## API Overview

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/events` | List events, newest first |
| `POST` | `/api/events` | Create an event and upload its image to Cloudinary |
| `GET` | `/api/events/{slug}` | Retrieve an event by slug |

The booking workflow is implemented as a server action rather than a public route handler.

## Project Structure

```text
app/
  api/events/        Event route handlers
  events/[slug]/     Dynamic event detail page
  components/        Event cards, booking form, navigation, and analytics

database/            Mongoose event and booking models
lib/actions/         Booking and related-event server actions
lib/mongodb.ts       Reused MongoDB connection
public/              Event artwork and UI assets
```

## Key Technical Highlights

- Mongoose middleware generates URL-safe slugs and normalizes date and time values before persistence.
- Schema indexes support date/mode queries, booking lookups, and one booking per email address and event.
- A global connection cache avoids opening a new Mongoose connection during every development reload.
- The event API streams uploaded image buffers to Cloudinary before storing event metadata.
- Similar events are queried by shared tags, while PostHog tracks page views and booking outcomes.

## Future Improvements

- Repair or remove the incomplete database test route and re-enable strict build-time TypeScript checks.
- Protect event creation, validate upload size/type, add rate limits, and avoid returning internal error details.
- Review analytics privacy before sending booking email addresses as event properties.
- Add a create-event interface, database seed workflow, and automated tests.
- Replace the canary framework dependency with a stable, pinned Next.js release when compatible.

## Author

**Chahin Boudra**

- GitHub: [It-shahin](https://github.com/It-shahin)
- LinkedIn: [chahin-boudra](https://www.linkedin.com/in/chahin-boudra/)
