# Using `manage.py` to manage word list

This Python script handles the `words.json` file, which is used to import words into Wordeo's Mongo Database.

## Backing up
Make sure before you do any large batches of adding to backup using [Option 4](#4-backup-wordsjson)

# Running the Python file
```bash
python3 manage.py
```
> **NOTE:** You will need the PrettyTable package to be able to run **Option 2: View all words**.
> 
> `pip install PrettyTable`

# Options
## 1. Add a word
```
Enter a word: [enter your word]
Enter hint 1: [enter hint 1]
Enter hint 2: [enter hint 2]
Enter hint 3: [enter hint 3] (You can leave this empty and the importer should disregard it)
Enter category: [enter category] (Try to keep the categories similar to ones existing in the file, but feel free to create your own!)
Enter difficulty: [1-10]
```
Script will automatically update the words.json file and add your word.

## 2. View all words
Prints all words in words.json to the terminal in a table, useful to check to see if your word is added

> **NOTE:** You will need the PrettyTable package to be able to run this command.
> 
> `pip install PrettyTable`

## 3. Add a word (loop)
Does the same as option 1, but will ask you if you would like to enter more or not, repeats till you answer (n)

## 4. Backup words.json
Do this often if you're importing large batches or adding words often. It will copy the words.json file to a backup[date].json file

## 5. Import from CSV
This is the most efficient way to add words, as they can be shared over Discord, uploaded very quickly, and can even be created in Excel.

Make sure the format is specifically
```csv
Word,Hint1,Hint2,Hint3,Category,Difficulty
```

If your Hint 3 is empty, make sure the cell relays that!
e.g.: `Glass,Material,Sand,,Object,1`

## 0. Exit
Exits the program
