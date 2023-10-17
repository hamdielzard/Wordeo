import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../Pages/Home';

test('Check if Home page renders tip', () => {
  render(<Home />);
  const tipText = screen.getByText(/Login to save your progress and earn coins!/i);
  expect(tipText).toBeInTheDocument();
});

test('Check if Home page renders PLAY button', () => {
  render(<Home />);
  const playButton = screen.getAllByText(/PLAY/i);
  expect(playButton[0]).toBeInTheDocument();
});

test('Check if Home page renders Sign In button', () => {
  render(<Home />);
  const signInButton = screen.getByText(/Not signed in/i);
  expect(signInButton).toBeInTheDocument();
});


// Potential tests:
// Sign in Button after signing in should be updated to say "Account"
// PLAY button should redirect to game page
// Sign in button should redirect to sign in page