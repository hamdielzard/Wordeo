# API Documentation

- [API Documentation](#api-documentation)
- [Authentication](#authentication)
  - [`POST /api/regiser` - Register new account](#post-authregiser---register-new-account)
  - [`POST /api/login` - Login to existing account](#post-authlogin---login-to-existing-account)
- [User Management](#user-management)
  - [`INFO` - Achievements for Users](#info---achievements-for-users)
  - [`GET /user` - Get user(s) info](#get-user---get-users-info)
  - [`PATCH /user` - Update user details](#patch-user---update-user-details)
  - [`PATCH /user/inventory` - Update user inventory](#patch-user---update-user-inventory)
  - [`DELETE /user/` - Delete user](#delete-user---delete-user)
- [Multiplayer: Game](#multiplayer-game)
  - [`POST /game` - Request new lobby](#post-game---request-new-lobby)
  - [`customSettings` Object](#customsettings-object)
- [Words](#words)
  - [`POST /words` - Create multiple words (V2)](#post-words---create-multiple-words-v2)
  - [`GET /words` - Get words (V2)](#get-words---get-words-v2)
  - [Deprecated (V1)](#deprecated-v1)
    - [`POST /words/word` - Create a word](#post-wordsword---create-a-word)
    - [`GET /words/word` - Get a word](#get-wordsword---get-a-word)
    - [`PATCH /words/word` - Update a word](#patch-wordsword---update-a-word)
    - [`DELETE /words/word` - Delete a word](#delete-wordsword---delete-a-word)
- [Scores](#scores)
  - [`POST /scores` - Create a score](#post-scores---create-a-score)
  - [`GET /scores` - Get scores](#get-scores---get-scores)
- [Store](#store)
  - [`GET /store` - Retrieve all store items](#get-store---retrieve-store-items)
  - [`POST /store` - Buy item](#post-store---buy-item)


# Authentication
## `POST /api/regiser` - Register new account
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

## `POST /api/login` - Login to existing account
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
## `INFO` - Achievements for Users
Currently, client-side expects the achievements section of the user to be populated with an array of objects.
```ts
User = {
   // .. other user information
   "achievements": [
      {
         "name": "Puzzler Junior",
         "description": "Solve 10 puzzles"
         "locked": true
      },
      {
         "name": "Typist",
         "description": "Give your account a description!"
         "locked": false
      }
   ]
}
```
The array is populated with all achievements available in Wordeo, and therefore is shown to the user. Locked ones appear transparent, while unlocked ones appear solid and complete. It is important that `name`, `description`, and `locked` are all available. `description` is best to be limited to a short sentence.

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

## `PATCH /user/inventory` - Update user inventory
*Updates the inventory for a user*

**Request Body**
```json
{
   "userName": "Puz",
   "itemName": "bestpuzzler",
   "quantity": "hello world!"
}
```
- `userName` (string): User to change
- `itemName` (string): Name of the item to add
- `quantity` (number): Number of item quantity to update

**Response Body**

> **200**
>```json
>{
>   "message": "Inventory updated successfully",
>   //Updated user info...
>}
>```

> **400** | If `userName` or `itemName` or `quantity` are missing
>```json
>{
>   "message": "Please provide userName, itemName, and quantity in the request body.",
>}
>```

> **404** | If `userName` is not found
>```json
>{
>   "message": "User Puz not found!"
>}
>```

> **500** | Inventory update error
>```json
>{
>   "message": "Inventory update error occurred for Puz!"
>}
>```

## `PATCH /user/coin` - Update user coin balance
*Updates the number of coins for a user*

**Request Body**
```json
{
   "userName": "Puz",
   "quantity": 10
}
```

- `userName` (string): User to change
- `quantity` (number): Number of item quantity to update

> **200**
>```json
>{
>   "message": "Coins updated successfully",
>   //Updated user info...
>}
>```

> **400** | If `userName` or `quantity` is not found
>```json
>{
>   "message": "Please provide userName and a valid quantity in the request body."
>}
>```

> **404** | If `userName` is not found
>```json
>{
>   "message": "User Puz not found!"
>}
>```

> **500**
>```json
>{
>   "message": "Failed to update coins!"
>}
>```

## `GET /user/coin` - Get user coin balance
*Gets the number of coins for a user*

**Request Body**
```json
{
   "userName": "Puz"
}
```

- `userName` (string): User to change

> **200**
>```json
>{
>   //Updated user coin balance
>}
>```

> **400** | If `userName` is not provided
>```json
>{
>   "message": "User Puz not found!"
>}
>```

> **500**
>```json
>{
>   "message": "Failed to retrieve coin balance!"
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

# Multiplayer: Game
**NOT FINAL**: These endpoints could be changed, replaced, or removed at any time.
## `POST /game` - Request new lobby
**NOT FINAL**
*Requests the server for a new lobby*

**Request Body**
```json
{
   "userName": "name",
   "gameMode": "multi",
   "customSettings": {
      
   }
}
```
- `userName` (string): User requesting the creation of a new game
- `gameMode` (string, enum): Game mode requested by the user's client [`solo`, `multi`]
- `customSettings` (Object) (**optional**): Object referring to changing game settings. Refer to [this section](#customsettings-object) for more details on what to pass here. Defaults to regular game settings.

**Response Body (Solo Play)**
```json
{
   "message": "Solo game created",
   "gameDetails": {
      "countOfPuzzles": 10,
      "category": "all",
      "gameMode": "solo",
      "gameCode": "ABCDEF",
   },
   "players": [], // Empty at creation
   "createdAt": "dateOfCreation",
   "privateGame": true,
   "userName": "name"
}
```

**Response Body (Multiplayer)**
```json
{
   "message": "Multi game created",
   "gameDetails": {
      "countOfPuzzles": 10,
      "category": "all",
      "gameMode": "multi",
      "gameCode": "ABCDEF",
   },
   "players": [], // Empty at creation
   "createdAt": "dateOfCreation",
   "privateGame": false,
   "userName": "name"
}
```


**Response Body**
> **200**
>```json
>{
>   "message": "JOIN Game exists",
>   "gameDetails": {
>      "countOfPuzzles": 10,
>      "category": "all",
>      "gameMode": "multi",
>      "gameCode": "ABCDEF",
>   },
>   "players": [
>      "name2","name3"
>   ],
>   "createdAt": "dateOfCreation",
>   "privateGame": false,
>   "userName": "name"
>}
>```

> **404**
>```json
>{
>   "message": "EMPTY Game ABCDEF does not exist",
>   "userName": "name"
>}
>```

## `customSettings` Object
**NOT FINAL**
*The `customSettings` parameter allows for editing the game prior to creation. Put these in an object in your JSON request.*

All of the options shown are optional, anything in [square brackets] means their default options.

Your options are:
- `puzzleCount` (int) [10] - Number of puzzles in a game, maximum 30.
- `category` (string, enum) [`'all'`] - Category to restrict words from when the game gets started
- 

# Words
## `POST /words` - Create multiple words (V2)
*Creates multiple words in the database*

**Request Body**
- `words` (words[]): The list of words to be inserted. Note that a single word have all of the required components.
   - `word` (string): The word to be created
   - `hints` (string[]): Array of hints or descriptions for the given word, **required to have 3 in the array, but use `""` for an empty hint.**
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

## `GET /words` - Get words (V2)
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
## Deprecated (V1)
The following endpoints still exist, but should be removed as they do not serve any use. Manage words using `manage.py` under `./server/data` locally. Server will always pull the word list there by every restart.

### `POST /words/word` - Create a word
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

### `GET /words/word` - Get a word
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

### `PATCH /words/word` - Update a word
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

### `DELETE /words/word` - Delete a word
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

# Store
## `GET /store` - GET request to retrieve all store items
*Gets all the store items from the database*

**Response Body**
> **200** | Success
>```json
>{
>    "storeItems": [
>        {
>            "_id": "xxx",
>            "name": "Add Time",
>            "description": "Add 5 seconds to the timer",
>            "category": "powerup",
>            "price": 500,
>            "enabled": false,
>            "__v": 0
>        },
>        {
>            "_id": "xxx",
>            "name": "Reveal Letter",
>            "description": "Reveal one random letter in the word",
>            "category": "powerup",
>            "price": 2500,
>            "enabled": false,
>            "__v": 0
>        }
>    ]
>}
>```
> **500** | Error occurred while retrieving store items
>```json
>{
>   "message": "Failed to retrieve store items!"
>}
>```
## `POST /store` - POST request to buy an item
*Gets all the store items from the database*

**Request Body**
```json
{
    "userName": "Mac",
    "itemName": "Cup",
    "quantity": 10
}
```
- `userName` (string): The user's name
- `itemName` (string): The item's name
- `quantity` (number): The quantity of items to modify

**Response Body**
> **200** | Success
>```json
>{
>   "message": "Item purchase successful for Mac"
>}
>```
> **400** | Invalid userName, itemName, and quantity in the request body.
>```json
>{
>   "message": "Please provide userName, itemName, and quantity in the request body."
>}
>```
> **500** | Purchase failed
>```json
>{
>   "message": "Item purchase error occurred for Mac"
>}
>```
> **500** | User not found
>```json
>{
>   "message": "User lookup error occurred for Mac"
>}
>```