/* eslint-disable no-undef */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../Pages/SignIn';

const path = '/account/signin';

test('check if sign in renders logo', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>,
  );
  const logo = screen.getByAltText(/Wordeo/);
  expect(logo).toBeInTheDocument();
});

test('Check if sign in renders sign up box', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>,
  );
  const upText = screen.getAllByText(/Sign Up/i);
  expect(upText[0]).toBeInTheDocument();
  const upButton = screen.getAllByText(/Sign Up/i);
  expect(upButton[0]).toBeInTheDocument();
});

test('Check if all input fields are present', () => {
  const usernames = screen.findAllByPlaceholderText(/username/i);
  waitFor(() => expect(usernames[0]).toBeInTheDocument());
  waitFor(() => expect(usernames[1]).toBeInTheDocument());

  const passwords = screen.findAllByPlaceholderText(/password/i);
  waitFor(() => expect(passwords[0]).toBeInTheDocument());
  waitFor(() => expect(passwords[1]).toBeInTheDocument());
});

test('Check if sign in renders sign in box', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>,
  );
  const upText = screen.getAllByText(/Sign In/i);
  expect(upText[0]).toBeInTheDocument();
  const upButton = screen.getAllByText(/Sign In/i);
  expect(upButton[0]).toBeInTheDocument();
});

test('check footer', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>,
  );
  expect(screen.getByText(/Creating an account saves your progress and allows you to earn achievements!/i)).toBeInTheDocument();
});

test('check create account warning update', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>,
  );

  const signupButton = Array.from(document.querySelectorAll('button'))
    .find((element) => element.textContent === 'Sign Up');
  const username = document.querySelector('#username');

  fireEvent.click(signupButton);
  expect(screen.getByText(/Username required./i)).toBeInTheDocument();
  const value = 'test';
  fireEvent.change(username, { target: { value } });
  fireEvent.click(signupButton);
  expect(screen.getByText(/Password required./i)).toBeInTheDocument();
});

test('check login warning update', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>,
  );

  const signinButton = Array.from(document.querySelectorAll('button'))
    .find((element) => element.textContent === 'Sign In');
  const username = document.querySelector('#signInUser');

  fireEvent.click(signinButton);
  expect(screen.getByText(/Username required./i)).toBeInTheDocument();
  const value = 'test';
  fireEvent.change(username, { target: { value } });
  fireEvent.click(signinButton);
  expect(screen.getByText(/Password required./i)).toBeInTheDocument();
});
