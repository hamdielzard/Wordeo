# API Documentation

- [API Documentation](#api-documentation)
- [Authentication](#authentication)
  - [`POST /auth/regiser` - Register new account](#post-authregiser---register-new-account)
  - [`POST /auth/login` - Login to existing account](#post-authlogin---login-to-existing-account)
- [User Management](#user-management)
  - [`GET /user` - Get user(s) info](#get-user---get-users-info)
  - [`PATCH /user` - Update user details](#patch-user---update-user-details)
  - [`DELETE /user/` - Delete user](#delete-user---delete-user)
- [Words (v1)](#words-v1)
  - [Note](#note)
  - [`POST /words/word` - Create a word](#post-wordsword---create-a-word)
  - [`GET /words/word` - Get a word](#get-wordsword---get-a-word)
  - [`PATCH /words/word` - Update a word](#patch-wordsword---update-a-word)
  - [`DELETE /words/word` - Delete a word](#delete-wordsword---delete-a-word)
  - [`POST /words` - Create multiple words](#post-words---create-multiple-words)
  - [`GET /words` - Get words](#get-words---get-words)
- [Scores](#scores)
  - [`POST /scores` - Create a score](#post-scores---create-a-score)
  - [`GET /scores` - Get scores](#get-scores---get-scores)


# Authentication
## `POST /auth/regiser` - Register new account
*Registers a new account and saves it*

**Request Body**
```json
{
   "userName": "name",
   "password": "password"
}
```
- `userName` (string): userName to register
- `password` (string): password to secure the account
- `displayName` (string) (**optional**): Display name shown, defaults to `userName` if not given.

**Response Body**
>**409** | userName already exists (taken)
>```json
>{
>   "message": "User already exists!"
>}
>```
>
>**400** | Password-related error
>```json
>{
>   "message": "Failed to sign up at this time"
>}
>```
>
>**200** | Success
>```json
>{
>   "message": "User registered successfully!",
>   "userName": "name",
>   "displayName": "name"
>}
>```
>
>**500** | Database not online
>```json
>{
>   "message": "An error occured!"
>}
>```

## `POST /auth/login` - Login to existing account
*Logs in to an account by verifying its details.*

**Request Body**
```json
{
   "userName": "name",
   "password": "password"
}
```
- `userName` (string): userName to register
- `password` (string): password to secure the account

**Response Body**
>**404** | Account does not exist
>```json
>{
>   "message": "No such user found!"
>}
>```
>
>**400** | Password is incorrect
>```json
>{
>   "message": "Password does not match!"
>}
>```
>
>**200** | Success
>```json
>{
>   "message": "Login successful!",
>   ... // Token data
>   "userName": "name",
>   "displayName": "name"
>}
>```
>
>**500** | Server-side related to hashing password
>```json
>{
>   "message": "An error occured!"
>}
>```

# User Management
## `GET /user` - Get user(s) info 
*Get all users or single user information.*

**Request Query**
```ts
   userName: hello,
   
   // URL: /user?userName=hello
```
- `userName` (string) (**optional**): The userName assigned to the user.

**Response Body**
> **200** | (No body or `userName` is blank)
>
>Returns all users and their info in JSON.

> **500** | (No body or `userName` is blank)
> ```json
> {
>    "message": "Failed to get all users!"
> }
> ```

> **200** | (`userName` given)
>
>Returns `userName`'s information in JSON.

> **500** | (`userName` given)
>```json
>{
>   "message": "Failed to get user!"
>}
>```

**Example**
```ts
// Fetch the user hello
fetch("/user?userName=hello")
// Fetch all users
fetch("/user")
```

## `PATCH /user` - Update user details
*Updates display name and bio of the user.*

**Request Body**
```json
{
   "userName": "username",
   "displayName": "bestpuzzler",
   "description": "hello world!"
}
```
- `userName` (string): User to change
- `displayName` (string): Display name to change to.
- `description` (string) (**optional**): User's bio to change to. If empty, clears the bio.

**Response Body**

> **200**
>```json
>{
>   "message": "User username updated successfully!",
>   "displayName": "newName",
>   "description": "hello world!"
>}
>```

> **400** | If `userName` or `displayName` are missing
>```json
>{
>   "message": "Bad request! userName is required!",
>}
>```

> **500**
>```json
>{
>   "message": "Failed to update user!"
>}
>```

## `DELETE /user/` - Delete user

*Deletes a user from the database, and returns its final information before deletion.*

**Request Body**
```json
{
   "userName": "username"
}
```
- `userName` (string): The userName of the user to delete.

**Response Body**
> 200
>```json
>{
>   "message": "User username was deleted successfully!",
>   ...
>   // user information is returned before deletion
>}
>```

> 500
>```json
>{
>   "message": "Failed to delete user!",
>}
>```

----

# Words (v1)
## Note
This backend endpoint has not been updated yet.
## `POST /words/word` - Create a word
*Creates a single word in the database*

**Request Body**
- `word` (string): The word to be created
- `hints` (string[]): List of hints or descriptions for the given word
- `category` (string): The category of the given word
- `difficulty` (number): The difficulty of the word, where a higher number would indicate a harder difficulty
**Response Body**
Returns the created word document in the database.

**Example**
```
const payload = { word: "my word", hints: ["hint1", "hint2"], category: "word", difficulty: 0 };

request.post('/words/word', payload);

```

## `GET /words/word` - Get a word
*Finds a list of words in the database by a given "word"*

**Request Body**
- `word` (string): The word to search for

**Response Body**
Returns a list of words that match the given word.

**Example**
```
const payload = { word: "my word" };

request.get('/words/word', payload);
```

## `PATCH /words/word` - Update a word
*Finds a single word from the database*

**Request Body**
- `word` (string): The word to be updated
- `hint` (string): A single hint to identify the word from the database
- `newHints` (string[]): A list of new hints to be updated. Note that this will override all of the existing hints of this word

**Response Body**
Returns the update status (e.g., `res.body.updatedCount == 1` for success).

**Example**
```
const payload = { word: "my word", hint: "hint1", newHints: ["new hint1", "new hint2"] };

request.patch('/words/word', payload);
```

## `DELETE /words/word` - Delete a word
*Deletes a single word from the database*

**Request Body**
- `word` (string): The word to be deleted
- `hint` (string): A single hint to identify the word from the database

**Response Body**
Returns the delete status (e.g., `res.body.deletedCount == 1` for success). 

**Example**
```
const payload = { word: "my word", hint: "hint1" };

request.delete('/words/word', payload);
```

## `POST /words` - Create multiple words
*Creates multiple words in the database*

**Request Body**
- `words` (words[]): The list of words to be inserted. Note that a single word have all of the required components.
   - `word` (string): The word to be created
   - `hints` (string[]): List of hints or descriptions for the given word
   - `category` (string): The category of the given word
   - `difficulty` (number): The difficulty of the word, where a higher number would indicate a harder difficulty

**Response Body**
Returns the list of inserted word documents.

**Example**
```
const payload = { words: [
   { word: "my word1", hints: ["hint1", "hint2"], category: "word", difficulty: 0 },
   { word: "my word2", hints: ["hint3", "hint4"], category: "word", difficulty: 1 }
]};

request.post('/words', payload);
```

## `GET /words` - Get words
*Gets a list of words or all words in the database*

**Request Query**
- `category` (string): The category of the words to get
- `difficulty` (number): The difficulty of the words to get
- `count` (number): Number of words to get (note that when specifying the count, the list will be randomized)

**Response Body**
Returns the list of word documents.

**Example**
```
request.get('/words');                 // gets all words
request.get('/words?category=word');   // gets all words with the category "word"
request.get('/words?difficulty=1');    // gets all words with the difficulty 1
request.get('/words?count=1');         // gets 1 random word from the database
```

# Scores
## `POST /scores` - Create a score
*Creates a score in the database*

**Request Body**
```json
{
   "userName": "name",
   "score": 100,
   "gameMode": "multi"
}
```
- `score` (number): The user's score
- `userName` (string): userName to filter by
- `gameMode` (string, enum): The game mode this score was obtained from `["multi", "solo"]`

**Response Body**
> **200** | Success
>```json
>{
>  "message": "Score was added successfully!",
>  "score": 999,
>  "userName": "player",
>  "gameMode": "solo"
>}
>```

> **400** | Missing gameMode, userName, and/or negative/missing score
>```json
>{
>   "message": "No userName was provided",
>}
>```

> **404** | Invalid gameMode or userName.
>```json
>{
>   "message": "No user with given userName: name was found",
>}
>```

> **500** | Database not online
>```json
>{
>   "message": "An error occured!",
>}
>```

**Example**
```ts
const res = await fetch(apiURL + '/scores', {
            method: 'POST',
            body: {
               "userName": "player", 
               "score": 500,
               "gameMode": "multi" 
            }
         });
```

## `GET /scores` - Get scores
*Gets scores from the database, and can be filtered by count, userName, and gameMode*

**Request Query**
```ts
   userName: hello,
   gameMode: solo,
   count: 80
   
   // URL: /scores?userName=hello&gameMode=solo&count=80
```
- `userName` (string) (**optional**): Filters scores by `userName`
- `gameMode` (string, enum) (**optional**): Filters scores by `gameMode` between `["solo","multi"]`
- `count` (int) (**optional**) (*default:* `10`): Shows top `count` scores, defaults to top 10 or less.

**Response Body**
> **200** | Success
>```json
>{
>   "response": [
>      ...
>   ]
>}
>```

> **400** | Invalid gameMode
>```json
>{
>   "message": "The provided game mode: gameMode was invalid",
>}
>```

> **404** | Non-existing userName
>```json
>{
>   "message": "No user with given userName: name",
>}
>```

> **500** | Database not online
>```json
>{
>   "message": "Failed to get scores!",
>}
>```

**Example**
```ts
// Fetch hello's score in Solo play, by top 80.
fetch("/scores?userName=hello&gameMode=solo&count=80")
// Fetch hello's score in Multiplayer, by top 10
fetch("/scores?userName=hello&gameMode=multi")
// Fetch all scores
fetch("/scores")
```