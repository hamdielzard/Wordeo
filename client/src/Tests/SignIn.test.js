import { fireEvent, render, screen } from '@testing-library/react';
import SignIn from '../Pages/SignIn';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';

const path = '/account/signin'

test('check if sign in renders logo',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>
  );
  const logo = screen.getByAltText(/Wordeo/)
  expect(logo).toBeInTheDocument();
});

test('Check if sign in renders sign up box', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>
  );
  const upText = screen.getAllByText(/Sign Up/i);
  expect(upText[0]).toBeInTheDocument();
  const upButton = screen.getAllByText(/Create Account/i);
  expect(upButton[0]).toBeInTheDocument();
});

test('Check if all input fields are present',()=>{
  const usernames = screen.findAllByPlaceholderText(/username/i);
  waitFor (()=> expect(usernames[0]).toBeInTheDocument())
  waitFor (()=> expect(usernames[1]).toBeInTheDocument())

  const passwords = screen.findAllByPlaceholderText(/password/i);
  waitFor (()=> expect(passwords[0]).toBeInTheDocument())
  waitFor (()=> expect(passwords[1]).toBeInTheDocument())
})

test('Check if sign in renders sign in box', () => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>
  );
  const upText = screen.getAllByText(/Sign In/i);
  expect(upText[0]).toBeInTheDocument();
  const upButton = screen.getAllByText(/Login/i);
  expect(upButton[0]).toBeInTheDocument();
});

test('check footer',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>
  );
  expect(screen.getByText(/Creating an account saves your progress and allows you to earn achievements!/i)).toBeInTheDocument();
});

test('check create account warning update',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>
  );

  const signupButton = screen.getByText(/Create Account/i);
  const username = screen.getAllByPlaceholderText(/username/i)

  fireEvent.click(signupButton);
  expect(screen.getByText(/Username required./i)).toBeInTheDocument();
  const value = 'test'
  fireEvent.change(username[0], {target:{value}})
  fireEvent.click(signupButton);
  expect(screen.getByText(/Password required./i)).toBeInTheDocument();
})

test('check login warning update',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <SignIn />
    </MemoryRouter>
  );

  const signinButton = screen.getByText(/Login/i);
  const username = screen.getAllByPlaceholderText(/username/i)

  fireEvent.click(signinButton);
  expect(screen.getByText(/Username required./i)).toBeInTheDocument();
  const value = 'test'
  fireEvent.change(username[1], {target:{value}})
  fireEvent.click(signinButton);
  expect(screen.getByText(/Password required./i)).toBeInTheDocument();
})