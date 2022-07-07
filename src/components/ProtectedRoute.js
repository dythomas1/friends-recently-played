import React, { useEffect, useState } from 'react'
import {Route,  Redirect, useLocation} from 'react-router-dom';
import axios from 'axios';
import FriendsListening from './FriendsListening';
//pass a variable isAuth into here.
function ProtectedRoute({isAuth: isAuth, component: Component, ...rest}) { 
    const[isSheAuth, setIsSheAuth] = useState(false);
    //const params = useParams();
    
    useEffect((props) => {

    
        axios.get("http://localhost:5000/isUserAuth", {
          headers: {
            "x-access-token": localStorage.getItem("token")
          }
    
          
      
      }).then((response) => {
    
      console.log(response);
      setIsSheAuth(true);
      });
      
          

});
    
    

    return (
        
        <Route {...rest }
         render={(props) => {
            if(isSheAuth){
                //const search1 = window.location.href;
                console.log("Protected Route");
                return <FriendsListening />
            }
            else{
                console.log(isSheAuth);
                return(<Redirect to={{pathname:'/', state: { from: props.location}}} />);
            }
        }} />
    )
}

export default ProtectedRoute
