<!-- ABOUT THE PROJECT -->
## Wordeo Server

Backend server for Wordeo.

### Built With

- Node JS
- Express JS
- Mongo DB

#### Modules
- [mongoose](https://mongoosejs.com/docs/guide.html): ODM for MongoDB
- [dotenv](https://www.npmjs.com/package/dotenv): for managing and loading environment variables
- [jest](https://jestjs.io/): for testing
- [supertest](https://www.npmjs.com/package/supertest): for testing http
- [cross-env](https://www.npmjs.com/package/cross-env): for setting environments inline

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

The following software are required when running the backend server locally. Make sure you have all of these installed before getting started.
* npm
  ```sh
  npm install npm@latest -g
  ```
* MongoDB

### Build & Run

Follow the steps to start the backend server locally on your machine.

1. Clone the repo
   ```sh
   git clone https://github.com/hamdielzard/Wordeo.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Ensure that you are connected to your local mongo db server that is up and running.
   - Update the connectionString
4. Start the server
   ```sh
   npm run start
   ```

### Test
 
To run tests locally, make sure the database is running and execute the following command:
```sh
npm run test
```

## Additional Resources

### Project Structure
- `server`: root directory for backend server
   - `models`: store database schemas here
   - `routes`: store different routes for each component here
   - `tests`: store all backend related tests here
   - `.env`: store project configurations in this file; importing the module `dotenv` is required to access these configurations
   - `server.js`: this is the main entry point for the backend server

### MongoDB
- [Install MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
- [MongoDB Shell Reference](https://www.mongodb.com/docs/mongodb-shell/)
