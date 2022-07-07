import React, { Fragment, useState, useEffect, useHistory } from 'react'
import '../App.css';
import RecentPlays from './RecentPlays';    
import axios from 'axios';
import format from 'pg-format';
import { Redirect, withRouter, useParams } from "react-router-dom";




function FriendsListening() {
  const params = useParams();
  //console.log(params);
  
  console.log("Friends Listening here");
  const [spotifyToken, setSpotifyToken] = useState("");
  const CLIENT_ID = "2920bd4b10b54829814fcaeb8d076e91";
  const REDIRECT_URI = "http:%2F%2Flocalhost:3000%2FListen";
  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user-read-recently-played%20user-read-email&response_type=token&state=123`
  const [tracks, setTracks] = useState([]);
  const [tracksCompleted, setTracksCompleted] = useState([]);
  const [tracksString, setTracksString] = useState("");
  const check = [];
  var format = require('pg-format');
  //let history


  //hooks

  useEffect(() => {
    
    // action on update of tracks
    console.log(tracks);
    if(tracks.length > 0) {
      postTracks();
    }
  }, [tracks]);

  useEffect(() => {
    // action on updated array
    if (tracksCompleted.length > 0){
      cutTracks();
    }
  }, [tracksCompleted]);

  useEffect(() => {
    // action on value set.
    if(tracksCompleted.length > 0) {
      
    console.log("Tracks string function is getting hit.");
      postTracksToDB();
    }
  }, [tracksString]);
  

  
  
//this actually might need to be a useEffect. becuase I dont think this is workable rn.
  const getRecentlyPlayedTracks = e => {
    
    const search1 = window.location.href;
    const a1 = search1.search("=");
    const first1 = search1.substr(a1);
    const b = first1.search("&token_type");
    const spotifyToken1 = first1.substr(1,(b-1));
    
    //console.log(spotifyToken1);
    if(!spotifyToken1 && !spotifyToken)
    {
      spotifyRedirect();
    }
    else{
      
      setSpotifyToken(spotifyToken1);
      spotifyAPICall(spotifyToken1);
    }

  }

//TODO: Refactor this. Its not needed.
  const spotifyRedirect = () => {
    window.location.href = url;

  };



  const postTracksToDB = async () => {
    console.log("posting to api is doing it")
    try {
        const body = { tracksString };
        console.log(body);
        const response = await fetch("http://localhost:5000/tracks",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        })
        
        console.log(response);
    } catch (err) {
        console.log(err.message);
        console.log("Issue here");
    }
  }

  const spotifyAPICall = async (spotifyToken1) => {
    console.log(spotifyToken1);
    let spotifyToken = "";
    if (spotifyToken1 != ""){
      spotifyToken = spotifyToken1;
    }
    console.log("the above is being passed through to our json");
    
    axios({
      //TODO: We need to pass in the ArtistID from the DB.
      url: "	https://api.spotify.com/v1/me/player/recently-played",
      method: 'get',
      headers: { Accept: "application/json",
                Authorization: "Bearer " + spotifyToken,
                "Content-Type": "application/json",
                }
    })
      .then(res => {
        
        setTracks(res.data.items);
        console.log(`Axios Call completed`);
        });
  }
  const cutTracks = e => {
    let sql = "";
    sql = format('INSERT INTO tracks (TrackName, Artist, TrackSpotifyId, friendID) VALUES %L', tracksCompleted);
    setTracksString(sql);
  }

  const postTracks = e => {
    console.log("trying to run");
    const a = 20;
    let trackSave= "";
    let trackSave1 = "";
    let trackSave2 = "";
      
    for (var i = 0; i < a; i++) {
      trackSave = tracks[i].track.name;
      trackSave1 = tracks[i].track.artists[0].name;
      trackSave2 = tracks[i].track.id;
      //the 1 is the id of the person, which will need to be changed.
      check.push([trackSave, trackSave1, trackSave2, 1])
    }
    setTracksCompleted(check);
    console.log(tracks);
  }


  return (
    <div className="FriendsListening">
      
        <button className="btn btn-success" onClick={getRecentlyPlayedTracks}>
          Get Recent Played Songs
        </button>
          <div className= "tracks">
          {tracks.map(track => (
          <div>
          <RecentPlays
          
          key= {track}
          name={track.track.name}
          artistName={track.track.artists[0].name}
          image={track.track.album.images[0].url}
            
          />
          </div>
          
        ))}
        </div>
    </div>
  );
}

export default withRouter(FriendsListening);
