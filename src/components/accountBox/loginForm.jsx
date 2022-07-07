import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { useHistory } from "react-router-dom";


export function LoginForm(props) {
  let history = useHistory();

  const { switchToSignup } = useContext(AccountContext);
  
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  
  const [loginStatus, setLoginStatus] = useState("");
  const [isAuth, setIsAuth] = useState(false);

  axios.defaults.withCredentials = true;
  const login = (props) => { 
    if (!emailLogin.trim()) {
      setLoginStatus('Email required');
    }
    else if(!passwordLogin.trim()) {
      setLoginStatus('Password required');
    }
    else{
      
      axios.post('http://localhost:5000/login',{
        Email: emailLogin,
        Password: passwordLogin
    }).then((response) => {
        //console.log(response.data);
        if(!response.data.auth){
          setLoginStatus(response.data.message);
        }
        else{ 
          
          //Successful Login
          console.log(response.data);
          localStorage.setItem("token",response.data.token);
          setIsAuth(true);
          
          
        }
    });
  }
    
}
  useEffect((props) => {
    
            if(isAuth == true){
              
              console.log("is auth" + isAuth);
                history.push({
                pathname: "/Listen",
                state: { isAuth: isAuth }
              });
            }
            else{
               console.log("incorrect login or pass.");
              }

              

  }, [isAuth]);







useEffect(() => {
  axios.get("http://localhost:5000/login").then((response) => {
    if(response.data.user){
      console.log(response.data.user.rows[0].fullname);
      //console.log("yes");
      
      setIsAuth(true);
    }else{
      console.log("not logged in");
    }
    
  });

}, []);


  return (
    <BoxContainer>
      <FormContainer>
        <Input type="email" placeholder="Email" onChange={(e) => {
            setEmailLogin(e.target.value);
        }}  />
        <Input type="password" placeholder="Password"onChange={(e) => {
            setPasswordLogin(e.target.value);
        }}  />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <MutedLink href="#">Forget your password?</MutedLink>
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit" onClick={login}>Signin</SubmitButton>
      <p style={{color:"red", textAlign:"center"}}>{loginStatus}</p>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Don't have an account?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}