NASA Mission Control Project

Getting Started - 
Ensure you have Node.js installed.
Create a free Mongo Atlas database online or start a local MongoDB database.
Create a server/.env file with a MONGO_URL property set to your MongoDB connection string.
In the terminal, run: npm install
Running the Project
In the terminal, run: npm run deploy
Browse to the mission control frontend at localhost:8000 and schedule an interstellar launch!
Docker
Ensure you have the latest version of Docker installed
Run docker build -t nasa-project .
Run docker run -it -p 8000:8000 nasa-project
Running the Tests
To run any automated tests, run npm test. This will:
Run all the client-side tests: npm test --prefix client
Run all the server-side tests: npm test --prefix server
