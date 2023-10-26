import React from "react";
import { useState, useLayoutEffect, useEffect } from 'react';
import BoardEntry from "../Components/BoardEntry";
import WordeoLogo from '../Images/WordeoLogo.png';
import magGlass from "../Images/search.png";
import '../Styles/Leaderboard.css'

const Leaderboard = () => {

    const baseUrl = "http://localhost:8080"
    const [scores,setScores] = useState([])
    const [username,setUsername] = useState("")

    useLayoutEffect(() => {
        document.body.style.backgroundColor = "#393939"
    })

    useEffect(() => {

        if((document.cookie.split(";").some((item) => item.trim().startsWith("userid="))))
        {

            //currently compares with display name and will not match the placeholder userid
            //wait for backend to be done to correct
            //you can change your account display name to match an entry name to test highlighting

            const cookie = ('; '+document.cookie).split(`; userid=`).pop().split(';')[0];
            if(cookie)
                setUsername(cookie);
        }

        fetchScoreData('solo')
    },[])

    const fetchScoreData = async (mode) => {
        let scoreData = []
        try {
            const res = await fetch(`${baseUrl}/scores/leaderboard?gamemode=${mode}`);
            const data = await res.json();
            if (data.length) {
                scoreData=data
                console.log(data)
            }
        } catch (err) {
            console.log(err);
        }

        // set state with the result
        setScores(scoreData);

        return scoreData;
    }

    function showScores()
    {
        if(scores.length>0)
        {
            let index=0;
            return (
                scores.map(({ highestScore,userName,displayName,_id}) => {
                    if(_id!==username)
                    return (
                        <BoardEntry key={index++} user={userName} display={displayName} score={highestScore} col="white"/>
                    )
                    else
                    return (
                        <BoardEntry key={index++} user={userName} display={displayName} score={highestScore} col="#4285F4    "/>
                    )
                })
            )
        }
        else
        {
            return (
                <tr>
                    <td>
                    No scores submitted yet. Play some games to get scores! Only logged in users can submit scores.
                    </td>
                </tr>
            )
        }
    }

    async function handleSearch() {
        const nameSearch = document.getElementById("nameSelect").value
        const modeSearch = document.getElementById("modeSelect").value

        try {
            let list = await fetchScoreData(modeSearch)
            if(nameSearch.length)
            {
                const searched = list.filter(function (entry) {
                    return (entry.userName==(nameSearch) || entry.displayName==(nameSearch))
                })
                console.log(searched)
                setScores(searched)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div style={{textAlign:"center"}}>
            <img src={WordeoLogo} alt='Wordeo' style={{ height: 128, cursor: 'pointer'}} onClick={() => { window.location = "/" }} />
            <h1>Leaderboards</h1>
            <div className="scoreRow" style={{justifyContent:"center"}}>
                <input className="searchBar" id="nameSelect"></input>
                <img src={magGlass} alt='search' onClick={() => handleSearch()} style={{height:"32px",cursor:"pointer",marginLeft:"32px",marginRight:"32px"}} className="searchButton"/>
                <select className="searchBar" name="modes" id="modeSelect">
                    <option value="solo">Solo</option>
                    <option value="multi">Multiplayer</option>
                </select>
            </div>

            <table style={{justifyContent:"center",textAlign:"center",tableLayout:"fixed",width:"600px",borderCollapse:"separate"}}>
                <tbody>
                    <tr className="scoreRow">
                        <th style={{paddingRight:"180px",width:"100px",fontWeight:"bold"}}>Player</th>
                        <th style={{width:"100px",fontWeight:"bold"}}>Score</th>
                    </tr>
                    {showScores()}
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard