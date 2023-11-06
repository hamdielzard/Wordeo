import React from "react";
import { useState, useLayoutEffect, useEffect } from 'react';
import BoardEntry from "../Components/BoardEntry";
import WordeoLogo from '../Images/WordeoLogo.png';
import magGlass from "../Images/search.png";
import '../Styles/Leaderboard.css'

const Leaderboard = () => {

    const baseUrl = "http://localhost:8080"
    const [scores,setScores] = useState([])
    const [cookie,setCookieName] = useState("")

    //stub data for running tests - not visible normally
    const testData = [
        {userName:"stub",score:600,_v:0,gameMode:"solo",_id:"653af6dec943c85e1dda9d68"},
        {userName:"test",score:8000,_v:0,gameMode:"solo",_id:"6531a1afc7f225a59f167478"},
        {userName:"multi",score:8000,_v:0,gameMode:"multi",_id:"6931a1bcc7f225a59f257478"}
    ]

    useLayoutEffect(() => {
        document.body.style.backgroundColor = "#393939"
    })

    useEffect(() => {

        if((document.cookie.split(";").some((item) => item.trim().startsWith("userName="))))
        {
            const cookie = ('; '+document.cookie).split(`; userName=`).pop().split(';')[0];
            if(cookie)
                setCookieName(cookie);
        }

        fetchScoreData('solo')
    },[])

    const fetchScoreData = async (mode) => {
        let scoreData = []
        try {
            if ((process.env.JEST_WORKER_ID === undefined || process.env.NODE_ENV !== 'test'))
            {
                const res = await fetch(`${baseUrl}/scores/?gameMode=${mode}`);
                const data = await res.json();
                if (data.response) {
                    scoreData=data.response
                    console.log(data.response)
                }
            }
            else
                //use stub data when testing
                if(mode=='solo')
                    scoreData=[testData[0],testData[1]];
                else
                    scoreData=[testData[2]]
        } catch (err) {
            console.log(err);
        }

        // set state with the result
        setScores(scoreData);

        return scoreData;
    }

    function showScores()
    {
        if(scores.length)
        {
            let index=0;
            return (
                scores.map(({ score,userName}) => {
                    let place = index+1;
                    if(userName!==cookie)
                    return (
                        <BoardEntry key={index++} user={userName} score={score} rank={place} col="white"/>
                    )
                    else
                    return (
                        <BoardEntry key={index++} user={userName} score={score} rank={place} col="#4285F4    "/>
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
                let searched = list.filter(function (entry) {
                    return (entry.userName==(nameSearch))
                })
                console.log(searched)
                setScores(searched)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className="leaderboard">
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

            <p style={{fontSize:12}}>(Clear search by searching when search bar is empty.)</p>

            <table style={{justifyContent:"center",textAlign:"center",tableLayout:"fixed",width:"600px",borderCollapse:"separate"}}>
                <tbody>
                    <tr className="scoreRow">
                        <td style={{paddingRight:"120px",minwidth:"100px",fontWeight:"bold"}}>Rank</td>
                        <th style={{paddingRight:"120px",width:"100px",fontWeight:"bold"}}>Player</th>
                        <th style={{width:"100px",fontWeight:"bold"}}>Score</th>
                    </tr>
                    {showScores()}
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard