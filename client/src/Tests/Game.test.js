import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Game from '../Pages/Game';
import CoreGame from '../Components/OldGame/CoreGame';
import Timer from '../Components/OldGame/OldTimer'

const stubData = [{
    "word": "DISCORD",
    "hints": ["Communication Platform", "Gamer-Friendly"],
    "category": "Applications",
    "difficulty": 1
},
{
    "word": "KERFUFFLE",
    "hints": ["Commotion over a dispute"],
    "category": "Vocabulary",
    "difficulty": 5
},
{
    "word": "TORONTO",
    "hints": ["Most populous city in Canada"],
    "category": "Geography",
    "difficulty": 2
}];

describe('The Game Page', () => {
    test('should render the header', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} />);

        expect(container.getElementsByClassName('lobbyHeader').length).toBe(1);
    });

    test('should render the core game component', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} lobbyDebug ={true}/>);
        expect(container.getElementsByClassName('gameMain').length).toBe(1);
    });

    test('should render the timer component', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} lobbyDebug ={true}/>);

        expect(container.getElementsByClassName('gameTimer').length).toBe(1);
    });

    test('should render the letter boxes', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} lobbyDebug ={true}/>);

        // one for the word, one for the incorrect letters
        expect(container.getElementsByClassName('gameLetterBoxes').length).toBe(2);
    });

    test('should render the game over component when gameEnd is true', () => {
        const { container } = render(<Game initialLoad={false} initialState={true} data={stubData} lobbyDebug ={true}/>);

        expect(container.getElementsByClassName('gameOver').length).toBe(1);
    });

    // NEW ONES

    test('Number of word boxes should be the same as length of words given', () => { 
    const { container } = render(<CoreGame wordData = {stubData[0]}/>);

    expect(container.getElementsByClassName('letterBox').length).toBe(stubData[0].word.length);
    });

    test('Correct letters should update the letter boxes. Boxes hosting correct letters should turn green and have visible letters', () => { 
        const { container } = render(<CoreGame wordData = {stubData[0]} initialCorrectLetters = {'d'}/>);

        // Affected word boxes should be the first and last box
        // These letter boxes should have the extra class correctLetter
        const box0 = container.getElementsByClassName('letterBox correctLetter')[0];
        const box6 = container.getElementsByClassName('letterBox correctLetter')[1];
        

        // Check if the affected boxes are the correct one by checking the letter
        expect(box0.textContent).toBe("d")
        expect(box6.textContent).toBe("d")
        });

    test('Incorrect letter boxes should contain the correct letter', () => { 
        const { container } = render(<CoreGame wordData = {stubData[0]} initialIncorrectLetters = {['a']}/>);

        expect(container.getElementsByClassName('letterBox inCorrectLetter')[0].textContent).toBe('a')
    })

    test('There should be an appropriate amount of blank boxes', () => { 
        const { container } = render(<CoreGame wordData = {stubData[0]} initialCorrectLetters= {['d', 's', 'c', 'o', 'r']} />);

        // There are seven boxes
        expect(container.getElementsByClassName('letterBox').length).toBe(7);
        // But only six of them are correct, meaning that their is one letterBox without correctLetter as a class
        expect(container.getElementsByClassName('letterBox correctLetter').length).toBe(6);
    });

    test('When all correct words have been guessed it should call a function for game end', () => { 
        const roundEnd = jest.fn()
        const { container } = render(
            <CoreGame 
                wordData = {stubData[0]} 
                initialCorrectLetters= {['d', 'i', 's', 'c', 'o', 'r']}
                roundEnd = {roundEnd}
            />)

        expect(roundEnd).toHaveBeenCalledTimes(1);
    });

    test('Number of incorrect boxes should match number of incorrect letters', () => { 
        const { container } = render(<CoreGame wordData = {stubData[0]} initialIncorrectLetters= {['s', 'q']} />);
        
        expect(container.getElementsByClassName('letterBox inCorrectLetter').length).toBe(2);
    });
    
    test('Timer should match time given', () => { 
        const { container } = render(<Timer initialTime = {30} wordGuessed = {false} />);

        expect(container.getElementsByClassName('timer-text')[0].textContent).toBe('30');
    });

    test('When timer ends it should call a function for round end', () => { 
        const onEnd = jest.fn()
        const { container } = render(<Timer initialTime = {0} onEnd = {onEnd} />);

        expect(onEnd).toHaveBeenCalledTimes(1);
    });
});

