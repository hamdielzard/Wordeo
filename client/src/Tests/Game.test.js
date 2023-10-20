import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Game from '../Pages/Game';

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
        const score = screen.getByText(/Score/i);
        const round = screen.getByText(/Round/i);

        expect(container.getElementsByClassName('gameheader').length).toBe(1);
        expect(score).toBeInTheDocument();
        expect(round).toBeInTheDocument();
    });

    test('should render the core game component', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} />);
        expect(container.getElementsByClassName('gameContainer').length).toBe(1);
    });

    test('should render the timer component', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} />);

        expect(container.getElementsByClassName('timer').length).toBe(1);
    });

    test('should render the letter boxes', () => {
        const { container } = render(<Game initialLoad={false} data={stubData} />);

        // one for the word, one for the incorrect letters
        expect(container.getElementsByClassName('lettergrid').length).toBe(2);
    });

    test('should render the game over component when gameEnd is true', () => {
        const { container } = render(<Game initialLoad={false} initialState={true} data={stubData} />);

        expect(container.getElementsByClassName('gameOver').length).toBe(1);
    });
});

