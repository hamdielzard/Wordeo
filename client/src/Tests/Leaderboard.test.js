import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@testing-library/react';
import Leaderboard from '../Pages/Leaderboard';

const path = '/leaderboard'

test('check if wordeo logo renders',()=>{
    render(
      <MemoryRouter initialEntries={[path]}>
        <Leaderboard/>
      </MemoryRouter>
    )
  
    const logo = screen.getByAltText(/Wordeo/)
    expect(logo).toBeInTheDocument()
  })

test('search info renders',()=>{
    render(
      <MemoryRouter initialEntries={[path]}>
        <Leaderboard/>
      </MemoryRouter>
    )
  
    waitFor (()=> expect(screen.getByAltText(/search/)).toBeInTheDocument());
    waitFor (()=> expect(document.getElementById(/nameSelect/)).toBeInTheDocument());
    waitFor (()=> expect(document.getElementById(/modeSelect/)).toBeInTheDocument());
  })

test('Check renders search tip', () => {
  render(    
  <MemoryRouter initialEntries={[path]}>
    <Leaderboard/>
  </MemoryRouter>);

    const tipText = screen.getByText(/(Clear search by searching when search bar is empty.)/i);
    expect(tipText).toBeInTheDocument();
});

test('Check renders leaderboard title', () => {
    render(    
    <MemoryRouter initialEntries={[path]}>
      <Leaderboard/>
    </MemoryRouter>);
  
      const tipText = screen.getByText(/Leaderboards/i);
      expect(tipText).toBeInTheDocument();
  });

  test('Check renders table headers', () => {
    render(    
        <MemoryRouter initialEntries={[path]}>
        <Leaderboard/>
        </MemoryRouter>
    )
    
    waitFor (()=> expect(screen.getByText(/Player/)).toBeInTheDocument())
    waitFor (()=> expect(screen.getByText(/Score/)).toBeInTheDocument())
    waitFor (()=> expect(screen.getByText(/Rank/)).toBeInTheDocument())
  });

  test('Check renders solo mode entries', () => {
    render(    
        <MemoryRouter initialEntries={[path]}>
            <Leaderboard/>
        </MemoryRouter>
    );

    waitFor (()=> expect(screen.getByText(/Solo/i)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/stubUser/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/(stub)/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/600/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/testData/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/8000/)).toBeInTheDocument());
  });

  test('Check renders multi mode entries', () => {
    render(    
        <MemoryRouter initialEntries={[path]}>
            <Leaderboard/>
        </MemoryRouter>
    );

    const modeSelect = document.getElementById('modeSelect');
    const searchButton = screen.getByAltText(/search/);
    const value = 'multi'
    fireEvent.change(modeSelect, {target:{value}})
    fireEvent.click(searchButton)

    waitFor (()=> expect(screen.queryByText(/testData/)).not.toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/Multiplayer/i)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/multimode/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/(multi)/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/8000/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/#1/)).toBeInTheDocument());
    waitFor (()=> expect(screen.queryByText(/#2/)).not.toBeInTheDocument());
  });

  test('Check search works', () => {
    render(    
        <MemoryRouter initialEntries={[path]}>
            <Leaderboard/>
        </MemoryRouter>
    );

    const nameSelect = document.getElementById('nameSelect');
    const searchButton = screen.getByAltText(/search/);
    const value = 'stub'
    fireEvent.change(nameSelect, {target:{value}})
    fireEvent.click(searchButton)

    waitFor (()=> expect(screen.getByText(/stubUser/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/(stub)/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/600/)).toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/#1/)).toBeInTheDocument());

    waitFor (()=> expect(screen.queryByText(/testData/)).not.toBeInTheDocument());
    waitFor (()=> expect(screen.queryByText(/8000/)).not.toBeInTheDocument());
    waitFor (()=> expect(screen.getByText(/#2/)).not.toBeInTheDocument());
  });  