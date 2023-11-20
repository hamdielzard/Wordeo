/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen } from '@testing-library/react';
import Home from './Pages/Home';

test('Check if Home page renders', () => {
  render(<Home />);
  // Find image
  const wordeoLogo = screen.getByAltText(/Wordeo Logo/i);
  expect(wordeoLogo).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});
