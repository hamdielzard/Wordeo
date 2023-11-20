/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
import React from 'react';
import { render } from '@testing-library/react';
import Game from '../Pages/Game';
import CoreGame from '../Components/OldGame/CoreGame';

const stubData = [{
  word: 'DISCORD',
  hints: ['Communication Platform', 'Gamer-Friendly'],
  category: 'Applications',
  difficulty: 1,
},
{
  word: 'KERFUFFLE',
  hints: ['Commotion over a dispute'],
  category: 'Vocabulary',
  difficulty: 5,
},
{
  word: 'TORONTO',
  hints: ['Most populous city in Canada'],
  category: 'Geography',
  difficulty: 2,
}];

describe('The Game Page Acceptance tests', () => {
  test('Start a game\nCore Game should render upon lobby exit', () => {
    const { container } = render(<Game initialLoad={false} data={stubData} lobbyDebug />);

    expect(container.getElementsByClassName('gameMain').length).toBe(1);
  });

  test('View hints', () => {
    const { container } = render(<CoreGame wordData={stubData[0]} />);

    expect(container.getElementsByClassName('gameClue').length).toBe(1);
  });
});
