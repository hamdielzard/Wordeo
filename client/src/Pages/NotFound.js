import React from 'react';

/**
 * Just returns a not found page with a link to go back to /.
 * 
 * @returns React page for the 404 page
 */
const NotFound = () => {
    return (
        <div>
            <h1 style={{ textAlign: 'center', borderRadius: 20, padding: 40, backgroundColor: 'red', color: 'white' }}>
                This page does not exist!
                <br></br>
                <a style={{ color: 'white' }} href='/'>Go back home</a>
            </h1>
        </div>
    )
}

export default NotFound