import { render, screen } from '@testing-library/react';
import Home from './Pages/Home';

test('Check if Home page renders', () => {
  render(<Home />);
  // Find image
  const wordeoLogo = screen.getByAltText(/Wordeo Logo/i);
  expect(wordeoLogo).toBeInTheDocument();
});