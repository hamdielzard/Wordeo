import React from "react";
import Button from "../Components/Button";
import Achievement from "../Components/Achievement";
import Card from "../Components/Card";

// Styles
import "../Styles/Home.css";

// Testing Components
const testAchievement = (<Achievement
    name={'Locked Achievement'}
    description={'Locked achievement'}
    locked={true} />);

const testCard = (<Card
    name="hello world"
    image="https://i.imgur.com/Z70EgNO.png"
    foreColour="#FFFFFF"
    backColour="#eda218"
    owner={true}
/>);

/**
 * **Debug menu used to test pages, calls, and components**
 * 
 * This page is only accessible by pressing the CapsLock key on any page
 * **AND if the DEBUG variable in src/App.js is set to true**
 * @returns React page for a debug menu
 */
function Debug() {
    const [renderingAnotherComponent, setRenderingAnotherComponent] = React.useState();


    const reloadComponent = () => {
        const previous = renderingAnotherComponent;
        setRenderingAnotherComponent((<div></div>))
        setTimeout(() => {
            setRenderingAnotherComponent(previous)
        }, 300);
    }


    if (renderingAnotherComponent) {
        return (
            <div className="homepage" style={{ width: '100%', maxWidth: '100%' }}>
                <div className="homepageHeader" style={{ width: '100%', maxWidth: '100%' }}>
                    <div className="largeLabel">
                        Debug Menu
                    </div>
                </div>
                Given Component:
                <div style={{ width: '90%', height: '100%', paddingLeft: '20px', paddingRight: '20px' }}>
                    {renderingAnotherComponent}
                </div>
                <div className="homepageInteractive" style={{ width: '100%', maxWidth: '100%' }}>
                    <br></br>
                    <Button label="Stop" onClick={() => { setRenderingAnotherComponent() }} type="ternary" size={32} />
                    <Button label="Re-render" onClick={() => { reloadComponent() }} type="ternary" size={32} />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="homepage">
                <div className="homepageHeader">
                    <div className="largeLabel">
                        Debug Menu
                    </div>
                </div>
                <div className="homepageInteractive">
                    <Button label="Game.js (no code)" onClick={() => { window.location.pathname = '/game' }} type="gray" size={32} />
                    <br></br>
                    <Button label="Account.js (unauth)" onClick={() => { window.location.pathname = '/account' }} type="gray" size={26} />
                    <br></br>
                    <Button label="Achievement Component" onClick={() => {
                        setRenderingAnotherComponent(testAchievement)
                    }} type="gray" size={22} />
                    <br></br>
                    <Button label="All cookies" onClick={() => {
                        setRenderingAnotherComponent(
                            <code >
                                {document.cookie ? document.cookie : "No cookies"}
                            </code>
                        )
                    }} type="gray" size={32} />
                    <br></br>
                    <Button label="Card Component" onClick={() => {
                        setRenderingAnotherComponent(testCard)
                    }} type='gray' size={32} />
                    <br></br>
                    <Button label="Go back to home" onClick={() => { window.location.pathname = '/' }} type="ternary" size={32} />
                </div>
            </div>
        )
    }
}

export default Debug;