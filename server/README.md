# 1Fi EMI Store — Backend

Backend API for the 1Fi EMI Store application.

## Current Status

This is the initial backend setup. At this stage, the server only exposes a
health check endpoint. There is no database connection, no data models, and
no business logic yet — those will be added in later steps.

## Tech Stack

- Node.js
- Express.js
- ES Modules

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (or copy `.env.example`):

```bash
cp .env.example .env
```

## Running in Development

```bash
npm run dev
```

Starts the server with `nodemon`, restarting automatically on file changes.

## Running in Production

```bash
npm start
```

## Testing the Health Check

With the server running, visit or curl:

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "1Fi EMI Store API is running"
}
```
