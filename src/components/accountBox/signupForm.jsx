import React, { useContext, useState } from "react";
import axios from "axios";
import validate from "../validateInfo";
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



export function SignupForm(props) {
    const { switchToSignin } = useContext(AccountContext);
    const [nameReg, setNameReg] = useState('');
    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    const [password2Reg, setPassword2Reg] = useState('');
    const [errors, setErrors] = useState('');
    const [registerStatus, setRegisterStatus] = useState("");
    const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    
    const register = () => {
        //can potentially refactor the below code later with one of the form validaotr things that 
        if (!nameReg.trim()) {
            setRegisterStatus('Name required');
        }
        else if(!emailValidator.test(emailReg)){
            setRegisterStatus("Email is not valid address");
        }
        else if (!passwordReg) {
            setRegisterStatus('Password is required');
        } 
        else if (passwordReg < 6) {
            setRegisterStatus('Password needs to be 6 characters or more');
        }
        else if (!password2Reg) {
            setRegisterStatus('Confirming your password is required');
        }
        else if (password2Reg !== passwordReg) {
            setRegisterStatus('Passwords do not match');
        }
        else{
            
            axios.post('http://localhost:5000/register',{
            FullName: nameReg,
            Email: emailReg,
            Password: passwordReg,
            Password2: password2Reg
        }).then((response) => {
            if(response.data.message){
                setRegisterStatus(response.data.message);
              }
              else{ 
                  //Successful register;
                console.log(response.data);
                setRegisterStatus(""); //Clearing the data.
              }
            
        })
        }
        
    }





  return (
    <BoxContainer>
      <FormContainer>
        <Input type="text"
         onChange={(e) => {
            setNameReg(e.target.value);
        }} 
        placeholder="Full Name" />
        <Input id="email"
        type="email"
        onChange={(e) => {
            setEmailReg(e.target.value);
        }} 
        placeholder="Email" />
        <Input type="password"
        onChange={(e) => {
            setPasswordReg(e.target.value);
        }} 
        placeholder="Password" />
        <Input type="password"
        onChange={(e) => {
            setPassword2Reg(e.target.value);
        }} 
        placeholder="Confirm Password" />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit" onClick={register}>Signup</SubmitButton>
      <p style={{color:"red", textAlign:"center"}}>{registerStatus}</p>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink href="#">
        Already have an account?
        <BoldLink href="#" onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedLink>
    </BoxContainer>
  );
}