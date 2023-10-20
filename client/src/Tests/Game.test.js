import React from 'react';
import { fireEvent, render, screen} from '@testing-library/react';
import Game from '../Pages/Game';
import CoreGame from '../Components/Game/CoreGame';
import Timer from '../Components/Game/Timer'

const testWord = {
    "word": "DISCORD",
    "hints": ["Communication Platform", "Gamer-Friendly"],
    "category": "Applications",
    "difficulty": 1
}

describe('The Game Page', () => {
    test('should render the header', () => {
        const { container } = render(<Game />, false);
        const score = screen.getByText(/Score/i);
        const round = screen.getByText(/Round/i);

        expect(container.getElementsByClassName('gameheader').length).toBe(1);
        expect(score).toBeInTheDocument();
        expect(round).toBeInTheDocument();
    });

    test('should render the core game component', () => {
        const { container } = render(<Game />);

        expect(container.getElementsByClassName('coreGame').length).toBe(1);
    });

    test('should render the timer component', () => {
        const { container } = render(<Game />);

        expect(container.getElementsByClassName('timer').length).toBe(1);
    });

    test('should render the letter boxes', () => {
        const { container } = render(<Game />);

        // one for the word, one for the incorrect letters
        expect(container.getElementsByClassName('lettergrid').length).toBe(2);
    });

    test('should render the game over component when gameEnd is true', () => { 
        const { container } = render(<Game initialState={true}/>);

        expect(container.getElementsByClassName('gameOver').length).toBe(1);
    });

    // NEW ONES

    test('number of word boxes should be the same as length of words given', () => { 
    const { container } = render(<CoreGame wordData = {testWord}/>);

    expect(container.getElementsByClassName('letterbox').length).toBe(testWord.word.length);
    });

    test('Correct letters should update the letter boxes. Boxes hosting correct letters should turn green and have visible letters', () => { 
        const { container } = render(<CoreGame wordData = {testWord} initialCorrectLetters = {'d'}/>);

        // Affected word boxes should be the first and last box
        const letter0Style = window.getComputedStyle(container.getElementsByClassName('letter')[0]);
        const box0Style = window.getComputedStyle(container.getElementsByClassName('letterbox')[0]);
        const letter6Style = window.getComputedStyle(container.getElementsByClassName('letter')[6]);
        const box6Style = window.getComputedStyle(container.getElementsByClassName('letterbox')[6]);

        expect(letter0Style.getPropertyValue('visibility')).toBe('visible');
        expect(box0Style.getPropertyValue('background-color')).toBe('rgb(171, 255, 104)');
        expect(letter6Style.getPropertyValue('visibility')).toBe('visible');
        expect(box6Style.getPropertyValue('background-color')).toBe('rgb(171, 255, 104)');
        });
    
    test('All letter boxes should contain each letter of the word', () => { 
        const { container } = render(<CoreGame wordData = {testWord} />);

        expect(container.getElementsByClassName('letter')[0].textContent).toBe('D')
        expect(container.getElementsByClassName('letter')[1].textContent).toBe('I')
        expect(container.getElementsByClassName('letter')[2].textContent).toBe('S')
        expect(container.getElementsByClassName('letter')[3].textContent).toBe('C')
        expect(container.getElementsByClassName('letter')[4].textContent).toBe('O')
        expect(container.getElementsByClassName('letter')[5].textContent).toBe('R')
        expect(container.getElementsByClassName('letter')[6].textContent).toBe('D')
    })

    test('incorrect letter boxes should contain the correct letter', () => { 
        const { container } = render(<CoreGame wordData = {testWord} initialIncorrectLetters = {['a']}/>);

        expect(container.getElementsByClassName('incorrectLetter')[0].textContent).toBe('a')
    })

    test('unguessed letter boxes should be white and invisible', () => { 
        const { container } = render(<CoreGame wordData = {testWord} initialCorrectLetters= {['d', 's', 'c', 'r']} />);

        console.log(container.getElementsByClassName('lettergrid')[0].innerHTML)
        
        const letter1Style = window.getComputedStyle(container.getElementsByClassName('letter')[1]);
        const box1Style = window.getComputedStyle(container.getElementsByClassName('letterbox')[1]);

        expect(letter1Style.getPropertyValue('visibility')).toBe('hidden');
        expect(box1Style.getPropertyValue('background-color')).toBe('rgb(255, 255, 255)');
    });

    test('When all correct words have been guessed it should call a function for game end', () => { 
        const roundEnd = jest.fn()
        const { container } = render(
            <CoreGame 
                wordData = {testWord} 
                initialCorrectLetters= {['d', 'i', 's', 'c', 'o', 'r']}
                roundEnd = {roundEnd}
            />)

        expect(roundEnd).toHaveBeenCalledTimes(1);
    });

    test('Number of incorrect boxes should match number of incorrect letters', () => { 
        const { container } = render(<CoreGame wordData = {testWord} initialIncorrectLetters= {['s', 'q']} />);
        
        expect(container.getElementsByClassName('incorrectLetterBox').length).toBe(2);
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

