import React, { Fragment, useState } from "react";
import App from "../App";

const InputFriend = () => {
    const [Email , setEmail] = useState("");
    const onSubmitForm =  async (e) => {
        e.preventDefault();
        try {
            const body = {Email};
            const response = await fetch("http://localhost:5000/friendsEmail",
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })
            console.log(response);
        } catch (err) {
            console.log(err.message);
        }
    }

//Noted - Changed the namin mechanism of the Email from "email" to "Email" and it solved the problem.
    return(
        <Fragment>
        <h1 className = "text-center mt-5" >Friend List </h1>
        <form className="d-flex mt-5" onSubmit={onSubmitForm}> 
            <input type = "text" className="form-control" value={Email} onChange={e => setEmail(e.target.value)} />
            <button className="btn btn-success">Add</button>
        </form>
        </Fragment>
    )
}
export default InputFriend;