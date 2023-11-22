import React from 'react';
import ItemIcon from './ItemIcon';

function ItemGrid({ items, selection, itemOnClick }) {
  // Determine which items to display based off selection
  let itemsToDisplay = [];
  if (selection !== 'all') {
    for (let i = 0; i < items.length; i++) {
      if (items[i].category === selection) {
        itemsToDisplay.push(items[i]);
      }
    }
  } else {
    itemsToDisplay = items;
  }

  const itemsDisplayed = itemsToDisplay.map((i) => (
    <ItemIcon
      key={i.name}
      item={i}
      itemOnClick={itemOnClick}
    />
  ));

  return (
    <div className="item-grid">
      {itemsDisplayed}
    </div>
  );
}

export default ItemGrid;
