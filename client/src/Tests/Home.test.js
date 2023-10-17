import { render, screen } from '@testing-library/react';
import Home from '../Pages/Home';

test('Check if Home page renders tip', () => {
  render(<Home />);
  const tipText = screen.getByText(/Login to save your progress, compete on the leaderboards, play online, and earn coins!/i);
  expect(tipText).toBeInTheDocument();
});

test('Check if Home page renders PLAY button', () => {
  render(<Home />);
  const playButton = screen.getAllByText(/PLAY/i);
  expect(playButton[0]).toBeInTheDocument();
});

test('Check if Home page renders Leaderboards button', () => {
  render(<Home />);
  const leaderboardsButton = screen.getAllByText(/Leaderboards/i);
  expect(leaderboardsButton[0]).toBeInTheDocument();
});

test('Check if Home page renders Music button', () => {
  render(<Home />);
  const musicButton = screen.getByText(/Music/i);
  expect(musicButton).toBeInTheDocument();
});

test('Check if Home page renders SFX button', () => {
  render(<Home />);
  const sfxButton = screen.getByText(/SFX/i);
  expect(sfxButton).toBeInTheDocument();
});

test('Check if Home page renders Sign In button', () => {
  render(<Home />);
  const signInButton = screen.getByText(/Not signed in/i);
  expect(signInButton).toBeInTheDocument();
});
