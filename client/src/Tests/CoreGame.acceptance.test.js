import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Game from '../Pages/Game';
import CoreGame from '../Components/OldGame/CoreGame';
import Timer from '../Components/OldGame/OldTimer'
import GameOver from '../Components/OldGame/GameOver';

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

describe('The Game Page Acceptance tests', () => {
    test('Start a game\nCore Game should render upon lobby exit', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} lobbyDebug={true}/>);

        expect(container.getElementsByClassName('gameMain').length).toBe(1);
    });

    test('View hints', () => {
        const { container } = render(<CoreGame wordData = {stubData[0]}/>);

        expect(container.getElementsByClassName('gameClue').length).toBe(1);
    });

    test('View guessed letters\nCorrect letters should update the letter boxes. Boxes hosting correct letters should turn green and have visible letters', () => { 
        const { container } = render(<CoreGame wordData = {stubData[0]} initialCorrectLetters = {'d'}/>);

        // Affected word boxes should be the first and last box
        // These letter boxes should have the extra class correctLetter
        const box0 = container.getElementsByClassName('letterBox correctLetter')[0];
        const box6 = container.getElementsByClassName('letterBox correctLetter')[1];
        

        // Check if the affected boxes are the correct one by checking the letter
        expect(box0.textContent).toBe("d")
        expect(box6.textContent).toBe("d")
    });

    test('View remaining time\nTimer should match time given', () => { 
        const { container } = render(<Timer initialTime = {30} wordGuessed = {false} />);

        expect(container.getElementsByClassName('timer-text')[0].textContent).toBe('30');
    });


});