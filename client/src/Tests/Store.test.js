import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Game from '../Pages/Game';
import Store from '../Pages/Store';
import ItemPopup from '../Components/Store/ItemPopup';

const stubData = [
    {
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
    },
]

describe('The Store Page', () => {
    test('should render the coins', () => {
        const { container } = render(<Store />);

        expect(container.getElementsByClassName('currency').length).toBe(1);
    });

    test('should render the store items', () => {
        const { container } = render(<Store initialItems={stubData}/>);

        expect(container.getElementsByClassName('item-icon').length).toBe(4);
    });
    
    test('store page should render a text box containing the description of an item', () => {
        const { container } = render(<ItemPopup item = {stubData[0]} isVisible={true}/>);
        const expectedDescription = "Add 5 seconds to the timer for the current word"
       

        expect(container.getElementsByClassName('item-popup-description')[0].textContent).toBe(expectedDescription);
    });

    test('store page should render available power ups', () => {
        const { container } = render(<Store initialItems={stubData}/>);

        // First store item is the timer, we expect it to have a price of 500
        expect(container.getElementsByClassName('item-icon-price')[0].textContent).toBe("500");
        // Second store item is reveal letter, we expect it to have a price of 1000
        expect(container.getElementsByClassName('item-icon-price')[1].textContent).toBe("1000");
    })

    test('number of coins should be adjusted appropriately', () => {
        const { container } = render(<Store initialItems={stubData}/>);
        const item = screen.getByTestId("Add Time")
        fireEvent.click(item)
        const purchaseButton = screen.getByText(500, {selector:".button-secondary"})
        fireEvent.click(purchaseButton)

        expect(container.getElementsByClassName('currency')[0].textContent).toBe("4500");
    })
});

