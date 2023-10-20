import { render, screen } from '@testing-library/react';
import NotFound from '../Pages/NotFound';

test('Check if not found page renders', () => {
  render(<NotFound />);
  const tipText = screen.getByText(/This page does not exist!/i);
  expect(tipText).toBeInTheDocument();
});