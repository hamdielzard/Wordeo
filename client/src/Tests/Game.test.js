import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Game from '../Pages/Game';

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
});

