"""
Developer tool to manage the words.json file.

The words.json file contains a list of words, their hints, category, and difficulty.
This words.json file is then imported into the game's database to be used as the word bank.
"""

import json


def add_word():
    # Load the words.json file
    with open("words.json", "r") as f:
        words = json.load(f)["words"]

    # Prompt the user for the word, hints, category, and difficulty
    word = input("Enter the word: ")
    hints = []
    for i in range(3):
        hint = input(f"Enter hint {i+1}: ")
        hints.append(hint)
    category = input("Enter the category: ")
    difficulty = int(input("Enter the difficulty (1-10): "))

    # Create a new dictionary for the word and its attributes
    new_word = {
        "word": word,
        "hints": hints,
        "category": category,
        "difficulty": difficulty,
    }

    # Add the new word to the words dictionary
    words.append(new_word)

    # Save the updated words dictionary to the words.json file
    with open("words.json", "w") as f:
        json.dump({"words": words}, f)


def view_words():
    from prettytable import PrettyTable

    # Load the words.json file
    with open("words.json", "r") as f:
        words = json.load(f)["words"]

    # Create a table to display the words
    table = PrettyTable()
    table.field_names = ["Word", "Hints", "Category", "Difficulty"]
    for word in words:
        table.add_row(
            [
                word["word"],
                ", ".join(word["hints"]),
                word["category"],
                word["difficulty"],
            ]
        )

    # Print the table
    print(table)


import shutil
import os
import datetime

import csv


def main():
    while True:
        print("\n")
        print("Main Menu")
        print("1. Add a word")
        print("2. View all words")
        print("3. Add a word (loop)")
        print("4. Backup words.json")
        print("5. Import from CSV")
        print("0. Exit")
        choice = input("Enter your choice: ")
        if choice == "1":
            add_word()
        elif choice == "2":
            view_words()
        elif choice == "3":
            while True:
                add_word()
                cont = input("Add another word? (y/n): ")
                if cont.lower() != "y":
                    break
        elif choice == "4":
            backup_file_name = (
                "backup"
                + str(datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S"))
                + ".json"
            )
            shutil.copyfile("words.json", backup_file_name)
            print(f"Backup created: {backup_file_name}")
        elif choice == "5":
            print("\n\nMake sure CSV is in this format:")
            print("word,hint1,hint2,hint3,category,difficulty\n")
            csv_file_name = input(
                "Enter the name of the CSV file (including extension): "
            )
            with open(csv_file_name, "r") as f:
                reader = csv.reader(f)
                for row in reader:
                    word = row[0]
                    hints = [row[1], row[2], row[3]]
                    category = row[4]
                    difficulty = int(row[5])
                    new_word = {
                        "word": word,
                        "hints": hints,
                        "category": category,
                        "difficulty": difficulty,
                    }
                    with open("words.json", "r") as f:
                        words = json.load(f)["words"]
                    words.append(new_word)
                    with open("words.json", "w") as f:
                        json.dump({"words": words}, f)
        elif choice == "0":
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
