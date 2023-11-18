import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import GameOver from '../Components/OldGame/GameOver';
import ItemPopup from "../Components/Store/ItemPopup";
import CoreGame from '../Components/OldGame/CoreGame';
import OldTimer from "../Components/OldGame/OldTimer"
import { Powerup } from '../Components/Game/Powerups/Powerup';

const stubData = [{
    "name": "Add Time",
    "description": "Add 5 seconds to the timer for the current word",
    "category": "powerup",
    "price": 500,
},
{
    "name": "Reveal Letter",
    "description": "Reveal one random letter in the word",
    "category": "powerup",
    "price": 1000
},
{
    "name": "Royal",
    "description": "",
    "category": "icon",
    "price": 2500
},    
{
    "name": "Halloween",
    "description": "Reveal one random letter in the word",
    "category": "icon",
    "price": 2500
}]

describe('The Store Page Acceptance Tests', () => {
    test('View item description', () => {
        const { container } = render(<ItemPopup item = {stubData[0]} isVisible={true}/>);
        const expectedDescription = "Add 5 seconds to the timer for the current word"
       

        expect(container.getElementsByClassName('item-popup-description')[0].textContent).toBe(expectedDescription);
    });

    test('Purchase items\nOn click runs a function that returns item information to be sent to back end', () => {
        const popupOnExit = jest.fn()
        const { container } = render(<ItemPopup item = {stubData[0]} isVisible={true} popupOnExit={popupOnExit} />);

        const button = container.getElementsByClassName('button-secondary')[0]
        fireEvent.click(button)

        expect(popupOnExit).toHaveBeenCalledWith(true, stubData[0], 1, 500);
    });

    test('Earn currency\nGetting 60 points in the game should earn 2 coins', () => { 
        const { container } = render(<GameOver score = {60}/>);

        expect(container.getElementsByClassName('gameOver--coins')[0].textContent).toBe("+ 2 Coins");
    });

    test('Use power up items (Reveal letter)\nThere should be at least one correct box upon using Reveal letter powerup', () => { 
        const wordData = {
            "word": "DISCOR",
            "hints": ["Communication Platform", "Gamer-Friendly"],
            "category": "Applications",
            "difficulty": 1
        }
        const powerupOnConsume = jest.fn()

        const { container } = render(<CoreGame wordData = {wordData} activePowerup={"Reveal Letter"} powerupOnConsume = {powerupOnConsume}/>);

        expect(container.getElementsByClassName('letterBox correctLetter').length).toBe(1);
    });

    test('Use power up items (Add time)\nTime should be five seconds more', () => { 
        const onEnd = jest.fn()
        const powerupOnConsume = jest.fn()
        const { container } = render(<OldTimer initialTime = {25} onEnd = {onEnd} activePowerup = {"Add Time"} powerupOnConsume = {powerupOnConsume}/>);

        expect(container.getElementsByClassName('timer-text')[0].textContent).toBe("30");
    });
});