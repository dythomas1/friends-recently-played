import React from 'react'

const RecentPlays = ({id, name, artistName, image}) => {
    return(
        <div key={id}>
            <h1 >{name}</h1>
            <p>{artistName}</p>
            <img src={image} alt=""/>
            
            
        </div>
    );
}
  
  export default RecentPlays;
  