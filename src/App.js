import React, { Fragment, useState } from 'react'
import './App.css';
import  AccountBox from './components/accountBox';
import styled from "styled-components";
import FriendsListening from "./components/FriendsListening";
import EditFriends from './components/EditFriends';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';


const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
//components
//        <Route exact path="/listen" component={() => <FriendsListening authorized={false} />} />
//<ProtectedRoute path="/Listen" component={FriendsListening} changeisAuth={isAuth => setIsAuth(isAuth)} />



function App() {
  const[isAuth, setIsAuth] = useState(true);
  
  
  
//IF you dont want the protected authentication, then just replace the "ProtectedRoute" with "Route"
return (
  <Router>
    <Switch>
      <AppContainer>
        <Route exact path="/"  component={AccountBox}  isAuth={isAuth}/> 
        <ProtectedRoute path="/Listen" isAuth={isAuth}>
          <FriendsListening/>
        </ProtectedRoute>
        <ProtectedRoute path="/Listen#:id" isAuth={isAuth}>
          <FriendsListening/>
        </ProtectedRoute>


      </AppContainer>
      
      
    </Switch>
    
  </Router>
  
  )

}

export default App;
