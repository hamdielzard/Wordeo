import React from "react";
import Menu from "../Components/Store/Menu"
import ItemGrid from "../Components/Store/ItemGrid"
import ItemPopup from "../Components/Store/ItemPopup";
import SuccessPopup from "../Components/Store/SuccessPopup";
import Currency from "../Components/Store/Currency";
import "../Styles/Store.css"
// import itemData from "../TEMPDB/itemdata.js"

// API URL
const API_URL = 'http://localhost:8080';

const Store = ({initialItems = null, initialBalance = 5000 }) => {
    const [storeStatus, updateStoreStatus] = React.useState({
        selection: "all"
    })

    const [itemPopupStatus, updateItemPopupStatus] = React.useState({
        isVisible: false,
        item: null
    })

    const [accountBalance, updateAccountBalance] = React.useState(initialBalance)

    const [successPopupStatus, updateSuccessPopup] = React.useState({
        isVisible: false,
        success: true
    })

    const [itemData, updateItems] = React.useState(initialItems)

    // fetch userName
    const userNameExists = document.cookie.split(";").some((item) => item.trim().startsWith("userName="));
    let userName;

    if (userNameExists) {
        userName = ('; ' + document.cookie).split(`; userName=`).pop().split(';')[0];
    }

    React.useEffect(() => {
        if (initialItems == null)
        {
            const fetchUserData = async () => {
                const res = await fetch(`${API_URL}/user/coin?userName=${userName}`);
                const data = await res.json();
    
                updateAccountBalance(data.coinBalance);
            }
    
            const fetchStoreData = async () => {
                const res = await fetch(`${API_URL}/store`);
                const data = await res.json();
    
                updateItems(data.storeItems);
            }

            fetchUserData();
            fetchStoreData();
        }
    }, [])

    // This function is called whenver the user selects a new category
    function updateSelection(newSelection) {
        updateStoreStatus({ selection: newSelection })
    }

    // This function is called whenever a user selects an item
    function itemOnClick(itemClicked) {
        // Display popup with item information
        updateItemPopupStatus({
            isVisible: true,
            item: itemClicked
        })
    }

    // This function is called after user interacts with item popup
    // wasPurchased is true if the user purchased the item
    function popupOnExit(wasPurchased, item, quantitity, cost) {
        if (wasPurchased) {
            // Sufficient balance
            if (accountBalance - cost >= 0) {
                updateAccountBalance(prev => prev - cost)
                updateSuccessPopup({
                    isVisible: true,
                    success: true
                })
            }
            // Insufficient balance
            else {
                updateSuccessPopup({
                    isVisible: true,
                    success: false
                })
            }
        }

        // Hide the popup window
        updateItemPopupStatus(prev => ({
            ...prev,
            isVisible: false,
        }))
    }

    // BACKEND INTEGRATION
    // Store/item data goes to <ItemGrid items = {}
    return (
        <div className="store">
            <Menu
                selection={storeStatus.selection}
                updateSelection={updateSelection}
            />
            {itemData && <ItemGrid
                items={itemData}
                selection={storeStatus.selection}
                itemOnClick={itemOnClick}
            />}
            <ItemPopup
                isVisible={itemPopupStatus.isVisible}
                item={itemPopupStatus.item}
                popupOnExit={popupOnExit}
            />
            <SuccessPopup
                isVisible={successPopupStatus.isVisible}
                success={successPopupStatus.success}
                successPopupOnExit={updateSuccessPopup}
            />
            <Currency
                balance={accountBalance}
            />
        </div>
    )
}

export default Store