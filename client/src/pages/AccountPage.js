//account page for a logged in user

//currently any name can be given via localhost:300/account/username-go-here
//but later will reroute to sign in page if no login cookie (which is got after sign in confirms valid user with backend)

import React from 'react'
import { useParams } from 'react-router-dom'

const AccountPage = () =>
{
    const {user}=useParams();

    return(
        <div>Account Page for {user}</div>
    )
}

export default AccountPage