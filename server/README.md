<!-- ABOUT THE PROJECT -->
## Wordeo Server

Backend server for Wordeo.
Find the API documentation [here](/server/documents/api.md).

## Table of Contents
1. [Built With](#built-with)
2. [Getting Started](#getting-started)
3. [Additional Resources](#additional-resources)

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

### Setting up the database

Once you have MongoDB installed locally and the server is running, you will to grab the connection string for the database and update it in the `.env` file.

From the mongodb shell, 

1. To get the connection string:
```sh
   db.getMongo()
```
- To connect to a specific database within the cluster, specify the db name after the port: `mongodb://HOST:PORT/database_name`
2. To get a list of existing databases:
```sh
   show dbs
```
3. To create a new database with the name `newDB` or to switch to another database:
```sh
   use newDB
```
- Note that a new database is not initialized until any data is populated, so if you run `show dbs` after this command, `newDB` will not be available yet.

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
   - `routes`: store different routes & controllers for each component here
   - `tests`: store all backend related tests here
   - `.env`: store project configurations in this file; importing the module `dotenv` is required to access these configurations
   - `index.js`: this is the main entry point for the backend server
   - `server.js`: all server settings & middleware are set here
   

### MongoDB
- [Install MongoDB](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
- [MongoDB Shell Reference](https://www.mongodb.com/docs/mongodb-shell/)
