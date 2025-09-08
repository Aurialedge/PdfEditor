# PDF Editor Backend

This is the backend service for the PDF Editor application, providing API endpoints for managing extracted PDF data with MongoDB as the database.

## Prerequisites

- Node.js (v16 or later)
- npm (v7 or later) or yarn
- MongoDB (local or Atlas)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pdf-editor
   CORS_ORIGIN=http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript project
- `npm start` - Start the production server (make sure to build first)
- `npm run build:watch` - Watch for changes and rebuild

## API Endpoints

### Extracted Data

- `GET /api/extracted-data` - Get all extracted data with pagination
  - Query params: `page`, `limit`, `search`
- `GET /api/extracted-data/:id` - Get a single extracted data entry
- `POST /api/extracted-data` - Create a new extracted data entry
- `PUT /api/extracted-data/:id` - Update an extracted data entry
- `DELETE /api/extracted-data/:id` - Delete an extracted data entry

## Environment Variables

- `PORT` - Port to run the server on (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Allowed origin for CORS

## Development

This project uses TypeScript for type safety. The following tools are used:

- Express.js - Web framework
- Mongoose - MongoDB ODM
- TypeScript - Type checking and compilation
- Nodemon - Development server with hot-reload

## License

MIT
