import React from "react";
import Menu from "../Components/Store/Menu"
import ItemGrid from "../Components/Store/ItemGrid"
import ItemPopup from "../Components/Store/ItemPopup";
import SuccessPopup from "../Components/Store/SuccessPopup";
import Currency from "../Components/Store/Currency";
import "../Styles/Store.css"
import itemData from "../TEMPDB/itemdata.js"

const Store = () => {
    const [storeStatus, updateStoreStatus] = React.useState({
        selection: "all"
    })

    const [itemPopupStatus, updateItemPopupStatus] = React.useState({
        isVisible: false,
        item: null
    })

    const [accountBalance, updateAccountBalance] = React.useState(5000)

    const [successPopupStatus, updateSuccessPopup] = React.useState({
        isVisible: false,
        success: true
    })

    // This function is called whenver the user selects a new category
    function updateSelection(newSelection) {
        updateStoreStatus({ selection: newSelection})
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
                updateAccountBalance(prev => prev-cost)
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
                selection = {storeStatus.selection}
                updateSelection = {updateSelection}
            />
            <ItemGrid
                items = {itemData}
                selection = {storeStatus.selection}
                itemOnClick = {itemOnClick}
            />
            <ItemPopup
                isVisible = {itemPopupStatus.isVisible}
                item = {itemPopupStatus.item}
                popupOnExit = {popupOnExit}
            />
            <SuccessPopup
                isVisible = {successPopupStatus.isVisible}
                success = {successPopupStatus.success}
                successPopupOnExit = {updateSuccessPopup}
            />
            <Currency 
                balance = {accountBalance}
            />
        </div>
    )
}

export default Store