import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import Account from '../Pages/Account';

const user = 'testname'
const path = '/account/'+user

test('check if wordeo logo renders',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account/>
    </MemoryRouter>
  )

  const logo = screen.getByAltText(/Wordeo/)
  expect(logo).toBeInTheDocument()
})

test('check buttons',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account/>
    </MemoryRouter>
  )

  const edit = screen.getByText(/Edit/)
  const logout = screen.getByText(/Logout/)
  expect(edit).toBeInTheDocument()
  expect(logout).toBeInTheDocument()
})

test ('check headers render',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account/>
    </MemoryRouter>
  )
  expect(screen.getByText(/Highest Score/)).toBeInTheDocument()
  expect(screen.getByText(/Games Played/)).toBeInTheDocument()
  expect(screen.getByText(/Achievements/)).toBeInTheDocument()
})

test('check edit mode',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account/>
    </MemoryRouter>
  )

  const edit = screen.getByText(/Edit/)
  fireEvent.click(edit)

  waitFor (()=> expect(screen.getByText(/Apply/)).toBeInTheDocument())
  waitFor (()=> expect(screen.getByText(/Delete Account/)).toBeInTheDocument())
  waitFor (()=> expect(screen.getByText(/Description/)).toBeInTheDocument())
})

test ('check confirm delete',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account/>
    </MemoryRouter>
  )

  const edit = screen.getByText(/Edit/)
  fireEvent.click(edit)
  waitFor (()=>{
    const del = screen.getByText(/Delete Account/)
    fireEvent.click(del)
    waitFor (()=> expect(screen.getByText(/Cancel/)).toBeInTheDocument())
    waitFor (()=> expect(screen.getByText(/Delete/)).toBeInTheDocument())
    waitFor (()=> expect(screen.getByText(/Are you sure you want to delete your account?/)).toBeInTheDocument())
  })
})

test ('check update description',()=>{
  render(
    <MemoryRouter initialEntries={[path]}>
      <Account/>
    </MemoryRouter>
  )

  const edit = screen.getByText(/Edit/)
  fireEvent.click(edit)
  const value = 'words go like this'
  waitFor (()=>{
    const input = document.getElementById('descInput')
    const apply = document.getByText(/Apply/)
    fireEvent.change(input,{target:value})
    fireEvent.click(apply)
    waitFor (()=> expect(screen.getByText(value)).toBeInTheDocument())
  })

})