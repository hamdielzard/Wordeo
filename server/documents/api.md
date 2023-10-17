## API Documentation
1. [Accounts](#accounts)
2. [Words](#words)
3. [Scores](#scores)

### Accounts

### Words
---
#### Create a Word
`POST /words/word`

Creates a single word in the database

##### Request Body
- `word` (string): The word to be created
- `hints` (string[]): List of hints or descriptions for the given word
- `category` (string): The category of the given word
- `difficulty` (number): The difficulty of the word, where a higher number would indicate a harder difficulty
##### Returns
Returns the created word document in the database.

##### Example
```
const payload = { word: "my word", hints: ["hint1", "hint2"], category: "word", difficulty: 0 };

request.post('/words/word', payload);

```

---
#### Get a Word
`GET /words/word`

Finds a list of words in the database by a given "word"

##### Request Body
- `word` (string): The word to search for

##### Returns
Returns a list of words that match the given word.

##### Example
```
const payload = { word: "my word" };

request.get('/words/word', payload);
```

---
#### Update a Word
`PATCH /words/word`

Finds a single word from the database

##### Request Body
- `word` (string): The word to be updated
- `hint` (string): A single hint to identify the word from the database
- `newHints` (string[]): A list of new hints to be updated. Note that this will override all of the existing hints of this word

##### Returns
Returns the update status (e.g., `res.body.updatedCount == 1` for success).

##### Example
```
const payload = { word: "my word", hint: "hint1", newHints: ["new hint1", "new hint2"] };

request.patch('/words/word', payload);
```

---
#### Delete a Word
`DELETE /words/word`

Deletes a single word from the database

##### Request Body
- `word` (string): The word to be deleted
- `hint` (string): A single hint to identify the word from the database

##### Returns
Returns the delete status (e.g., `res.body.deletedCount == 1` for success). 

##### Example
```
const payload = { word: "my word", hint: "hint1" };

request.delete('/words/word', payload);
```

---
#### Create multiple words
`POST /words`

Creates multiple words in the database

##### Request Body
- `words` (words[]): The list of words to be inserted. Note that a single word have all of the required components.
   - `word` (string): The word to be created
   - `hints` (string[]): List of hints or descriptions for the given word
   - `category` (string): The category of the given word
   - `difficulty` (number): The difficulty of the word, where a higher number would indicate a harder difficulty

##### Returns
Returns the list of inserted word documents.

##### Example
```
const payload = { words: [
   { word: "my word1", hints: ["hint1", "hint2"], category: "word", difficulty: 0 },
   { word: "my word2", hints: ["hint3", "hint4"], category: "word", difficulty: 1 }
]};

request.post('/words', payload);
```

---
#### Get Words
`GET /words`

Gets a list of words or all words in the database

##### Request Parameters
- `category` (string): The category of the words to get
- `difficulty` (number): The difficulty of the words to get
- `count` (number): Number of words to get (note that when specifying the count, the list will be randomized)


##### Returns
Returns the list of word documents.

##### Example
```
request.get('/words');                 // gets all words
request.get('/words?category=word');   // gets all words with the category "word"
request.get('/words?difficulty=1');    // gets all words with the difficulty 1
request.get('/words?count=1');         // gets 1 random word from the database
```

---

### Scores