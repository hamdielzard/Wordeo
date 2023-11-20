/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Account from '../Pages/Account';

const user = 'testname';
const path = `/account/${user}`;

test('Check if Wordeo logo appears correctly', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account />
    </MemoryRouter>,
  );

  const logo = screen.getByAltText(/Wordeo Logo/);
  expect(logo).toBeInTheDocument();
});

test('Check buttons appear', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account />
    </MemoryRouter>,
  );

  const edit = screen.getByText(/Edit.../);
  const logout = screen.getByText(/Sign Out/);
  expect(edit).toBeInTheDocument();
  expect(logout).toBeInTheDocument();
});

test('Check all text renders', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account />
    </MemoryRouter>,
  );
  expect(screen.getByText(/Highest Score/)).toBeInTheDocument();
  expect(screen.getByText(/Words Guessed/)).toBeInTheDocument();
  expect(screen.getByText(/Games Played/)).toBeInTheDocument();
  expect(screen.getByText(/Achievements/)).toBeInTheDocument();
});

test('Check edit mode', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account />
    </MemoryRouter>,
  );

  const edit = screen.getByText(/Edit/);
  fireEvent.click(edit);

  waitFor(() => expect(screen.getByText(/Apply Changes/)).toBeInTheDocument());
  waitFor(() => expect(screen.getByText(/Delete Account/)).toBeInTheDocument());
  waitFor(() => expect(screen.getByText(/Description/)).toBeInTheDocument());
});

test('Check delete mode', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account />
    </MemoryRouter>,
  );

  const edit = screen.getByText(/Edit/);
  fireEvent.click(edit);
  waitFor(() => {
    const del = screen.getByText(/Delete Account/);
    fireEvent.click(del);
    waitFor(() => expect(screen.getByText(/This action is irreversible and will delete all your progress!/)).toBeInTheDocument());
    waitFor(() => expect(screen.getByText(/Yes I am sure./)).toBeInTheDocument());
    waitFor(() => expect(screen.getByText(/No - I'd like to play more Wordeo!/)).toBeInTheDocument());
    waitFor(() => expect(screen.getByText(/Deleting account, are you sure?/)).toBeInTheDocument());
  });
});

test('Check update description', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account />
    </MemoryRouter>,
  );

  const edit = screen.getByText(/Edit/);
  fireEvent.click(edit);
  const value = 'words go like this';
  waitFor(() => {
    const input = document.getElementById('descriptionEditBox');
    const apply = document.getByText(/Apply Changes/);
    fireEvent.change(input, { target: value });
    fireEvent.click(apply);
    waitFor(() => expect(screen.getByText(value)).toBeInTheDocument());
  });
});
