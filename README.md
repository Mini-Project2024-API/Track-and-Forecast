# Track and Forecast

## Overview

**Track and Forecast** is a web application designed to help users track Mumbai local trains by selecting a source station and a destination station. It provides real-time data on train schedules, status, and alternate paths to make commuting more convenient for users. The data is fetched through an API created by us using ChatGPT, as real-time data from official sources is unavailable.

### Contributors
- **Alfiya Inamdar**
- **Shreya Bagmare**
- **Arpita Gupta**

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** MongoDB 
- **API:** Custom API built with ChatGPT

## Features

- **Track Local Trains**: Allows users to select the source and destination stations to view real-time train schedules.
- **Alternate Path Suggestions**: Suggests alternate routes in case of delays or cancellations.
- **Train Status**: Provides information on the current status of trains.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) - Ensure Node.js is installed on your system.
- [MongoDB](https://www.mongodb.com/) - Set up a MongoDB database (if needed).

### Clone the Repository

```bash
git clone https://github.com/your-username/track-and-forecast.git
```

### Setup Backend
1. Navigate to the backend folder:

```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Set up your .env file for configuration (e.g., database connection URL).
```bash
MONGO_URI=your-mongo-uri
JWT_SECRET=your-secret
EMAIL_USER=your-email
EMAIL_PASS=your-password
```
4. Start the backend server:
```bash
npm start
```

### Setup Frontend

1. Navigate to the frontend folder:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
4. Start the frontend development server:
```bash
npm start
```

### API
Since real-time Mumbai local train data is not publicly available, we have created a custom API to simulate train data. This API is used by the frontend to fetch data based on user inputs.

## Usage
1. Open the app in your browser.
2. Select the source station and destination station.
3. View the available trains, train status.

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Create a new Pull Request
