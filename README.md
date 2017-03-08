# TodoSimpleApi
A simple implementation of Todo List with Token Based Authentication.

## How to install
* Instantiate a Mongo Database in localhost:27017/todo
* Download/Clone the repo.
* Install dependencies ("npm install").
* Run comman "npm start".
* Go to localhost:8080

## Authentication
The Application use 2 token types encripted with JWT Library:
* RefreshToken.
* AccessToken.

The RefreshToken has a duration of 12 hours, the SecretKey is based of the password and the user, and is different for all users.
The AccessToken has a duration of 15 minutes, the SecretKey is a global Key from .env file.

In order to get a new AccessToken you have to send the last AccessToken with its corresponded RefreshToken.

## Structure of responses
The structure is quite simple.
```javascript
let response = {
  error: "The error message if exists",
  message: 'DataRequested/DataReturned'
};
```

## Thing to do
- [ ] SSL Implementation.
- [ ] A simple client implementation.
