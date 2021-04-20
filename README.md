# priority-tasks-api

## Quick Start
```
# Install dependencies for server
npm install

# Run tests
npm run test

# Run the server in development
npm run dev

# Server runs on http://localhost:5000
```

## Endpoint Documentation with Swagger
https://priority-tasks.herokuapp.com/swagger/#/Auth/post_auth_signup

## Database Connection
If the app is unable to connect to Heroku Postgres Database, you will need to update the credentials in the `.env` file to reflect Heroku's. The credentials do rotate and will need to be change routinely.

https://data.heroku.com/datastores/b05b8047-149c-45f1-9ee4-6888ec5aaabb#administration

If a .env file does not exist, create a new on from the .env-template file

## Manual Testing with VSCode REST Client
Test individual end points with the Visual Studio Code REST Client add-on using .http files found in ./src/tests/manual-tests. 
