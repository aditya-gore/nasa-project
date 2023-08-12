NASA Mission Control Project

Getting Started - </br>
Ensure you have Node.js installed.</br>
Create a free Mongo Atlas database online or start a local MongoDB database.</br>
Create a server/.env file with a MONGO_URL property set to your MongoDB connection string.</br>
In the terminal, run: npm install</br>
Running the Project</br>
In the terminal, run: npm run deploy</br>
Browse to the mission control frontend at localhost:8000 and schedule an interstellar launch!</br>
Docker</br>
Ensure you have the latest version of Docker installed</br>
Run docker build -t nasa-project .</br>
Run docker run -it -p 8000:8000 nasa-project</br>
Running the Tests</br>
To run any automated tests, run npm test. This will:</br>
Run all the client-side tests: npm test --prefix client</br>
Run all the server-side tests: npm test --prefix server</br>
