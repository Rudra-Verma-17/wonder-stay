# WonderStay

WonderStay is a full-stack vacation-rental listing application inspired by Airbnb. Users can browse available stays, create accounts, publish and edit their own listings, upload listing images, and leave reviews.

## Live application

Use the deployed application here:

**[https://wonder-stay-kuc2.onrender.com/](https://wonder-stay-kuc2.onrender.com/)**

## Features

- Browse all available listings
- View listing details, prices, locations, images, and reviews
- User signup, login, logout, and session-based authentication
- Create, edit, and delete listings
- Cloudinary image uploads
- Owner-only listing management
- Add and delete reviews with 1–5 star ratings
- Review author authorization
- Joi request validation
- Mapbox geocoding and listing maps when a Mapbox token is configured
- Flash messages for success and error feedback
- Responsive EJS and Bootstrap-based interface
- Render deployment support with environment-based configuration

## Tech stack

- Node.js
- Express 5
- MongoDB and Mongoose
- EJS and EJS-Mate
- Passport and Passport-Local-Mongoose
- Cloudinary and Multer
- Mapbox Geocoding API
- Bootstrap
- Render

## Run locally

### Requirements

- Node.js 22 or later
- MongoDB, either locally or through MongoDB Atlas
- Optional: Cloudinary account for image uploads
- Optional: Mapbox token for maps and geocoding

### Installation

```bash
git clone https://github.com/Rudra-Verma-17/wonder-stay.git
cd wonder-stay
npm install
```

Create a `.env` file using `.env.example`:

```env
mongo_url=mongodb://127.0.0.1:27017/wonderstay
map_token=
CLOUD_NAME=
CLOUD_KEY=
CLOUD_API=
SESSION_SECRET=replace-this-with-a-long-random-secret
USE_MONGO_SESSION=false
```

Start the application:

```bash
npm start
```

The local application runs at:

```text
http://localhost:8080
```

For development with automatic restarts:

```bash
npm run dev
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start the server with Nodemon |
| `npm test` | Validate the main application JavaScript syntax |

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `mongo_url` | Yes for database features | MongoDB connection string |
| `SESSION_SECRET` | Recommended | Secret used to sign sessions |
| `USE_MONGO_SESSION` | Optional | Set to `true` to persist sessions in MongoDB |
| `CLOUD_NAME` | Required for uploads | Cloudinary cloud name |
| `CLOUD_KEY` | Required for uploads | Cloudinary API key |
| `CLOUD_API` | Required for uploads | Cloudinary API secret |
| `map_token` | Optional | Mapbox public access token |
| `PORT` | Automatically provided in production | HTTP port used by Render |

Never commit real credentials. The `.env` file is ignored by Git; use `.env.example` as the template.

## Deploy on Render

Create a Render Web Service connected to the `main` branch of this repository with:

```text
Build command: npm install
Start command: npm start
```

Add the required environment variables in Render. For MongoDB Atlas, allow Render connections in Atlas Network Access and use the complete connection string copied from the Atlas Drivers page.

## Project structure

```text
.
├── app.js                 # Express application and server startup
├── controller/            # Listing controllers
├── models/                # Mongoose models
├── routes/                # Listing and authentication routes
├── views/                 # EJS pages and layouts
├── public/                # CSS and browser-side JavaScript
├── middleware.js          # Authentication and authorization middleware
├── schema.js              # Joi validation schemas
└── .env.example           # Environment variable template
```

## Security notes

- Keep production secrets in Render environment variables.
- Use a strong, unique `SESSION_SECRET` in production.
- Restrict database users to the permissions the application needs.
- Do not expose Cloudinary API secrets or MongoDB credentials in client-side code.

## License

This project is provided for learning and portfolio purposes.
