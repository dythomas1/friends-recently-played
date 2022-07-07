const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const bcrypt = require('bcrypt');
//const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const {createTokens, validateToken} = require("../src/components/JWT");
const saltRounds = 10;
const jwt = require('jsonwebtoken');

//middleware

app.use(express.json()); //Line to give us access to request.body for data access: Gettin data from the client side.
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
})
);
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}))
//routes

//register a user
app.post("/register", async(req, res) => {
    try{
        const { FullName, Email, Password, Password2 } = req.body;
        
        //Need to pass in password 2 here as well and check to make sure the passwords are the same.
        if(Password != Password2){
            res.json({message: "Your passwords do not match. Please make sure they do."});
        }
        
        else{
            const emailCheck = await pool.query("Select * FROM friends WHERE email like $1", [Email]);
            if (emailCheck.rowCount > 0){
                res.json({message: "This Email already exists. Please choose another."});
            }
            else{
                bcrypt.hash(Password, saltRounds, async(err, hash) => {
                    if(err){
                        console.log(err);
                    }
                    const friend = await pool.query("INSERT INTO friends (FullName, Email, Password) VALUES($1, $2, $3)",
                    [FullName, Email, hash]); 
                    res.json({emailCheck});
                    
                });
            }
        }
    }
    catch ( err) {
        console.log(err.message);
    }
})

//using for seeing if session is already open for the user.
app.get("/login", (req, res)=> {
    if(req.session.user){
        res.send({ loggedIn: true, user: req.session.user});
    }
    else{
        res.send({ loggedIn: false});
    }
})
//JWT token api deal
app.get("/profile", validateToken, (req, res)=> {
    res.json("profile");
})

const verifyJWT = (req, res, next) =>  {
    const token = req.headers["x-access-token"]

    if(!token){
        res.send("We don't have a token!");
    }
    else{
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if(err) {
                res.json({auth: false, message: "You did not authenticate!"})
            }
            else{
                req.userID = decoded.id;
                next();
            }
        })
    }
}

app.get("/isUserAuth", verifyJWT, (req, res)=> {
    res.send("You are Authenticated!");
})




//Check if user is in database.
app.post("/login", async(req, res) => {
    try{
        console.log(req.body);
        const { Email, Password } = req.body;
        const friend = await pool.query("SELECT * FROM friends WHERE email like $1",
        [Email]);
        //The below code is written on the idea that there is only one email allowed in the database.
        if (friend.rowCount > 0){
            
            bcrypt.compare(Password, friend.rows[0].password, (err, response) =>{
            if(response){
                
                const accessToken = createTokens(friend);
                res.cookie("access-token", accessToken, {
                    maxAge: 60*60*24*30*1000,
                    httpOnly: true,
                });
                req.session.user = friend;
                //JWT stuff
                const id = friend[0];
                console.log(friend[0]);
                const token = jwt.sign({id}, "jwtSecret", {
                    expiresIn: 300,
                })//TODO: Need to create a .ENV variable and replace here on the string of JWTSecret

                res.json({auth: true, token: token, friend: friend});
            }
            else{
                res.json({auth: false, message: "You're password is not valid"});
            }
        });
        }
        else{
            res.json({auth: false, message: "No User Exists"});
        };
    }
    catch(err){
        console.error(err.message)
    }
})

//post tracks
app.post("/tracks", async(req, res) => {
    try{
        
        const  { tracksString } = req.body;
        const stringgy = "";
        const newTracks = await pool.query(tracksString);
        res.json(newTracks);

    }
    catch (err) {
        console.log(err.message);
    }
})
//get all users
app.get("/friends", async(req, res) => {
    try{
        const allFriends = await pool.query("SELECT * FROM friends");
        res.json(allFriends.rows)
    }
    catch(err){
        console.error(err.message)
    }
})
//Saving just an email for a new user. this honestly could be the signup mechanism probably.
app.post("/friendsEmail", async(req, res) => {
    try{
        const { Email } = req.body;
        
        const newFriend = await pool.query("INSERT INTO friends (Email) VALUES($1)",
        [Email]
        );

    res.json(newFriend);
    }
    catch ( err) {
        console.log(err.message);
    }
})
//get a user
app.get("/friends/:id", async (req, res) => {
    try{
        const { id } = req.params;
        const friend = await pool.query("SELECT * FROM friends WHERE friendID = $1", [id])
        console.log(req.params);
        //const allFriends = await pool.query("SELECT * FROM friends");
        res.json(friend.rows);
    }
    catch(err){
        console.error(err.message)
    }
})
//update a user
app.put("/friends/:id",  async (req, res) => {
    try {
        const{id}= req.params;
        const{email} = req.body;
        const updateTodo = await pool.query("UPDATE friends SET email = $1 WHERE friendID = $2",//$1 and $2 are basically value holders
        [email, id]
        );//$1 and $2 are basically value holders
        res.json("Todo was updated");
    } catch (error) {
        console.error(err.message)
        
    }
})
//get tracks
app.get("/tracks", async(req, res) => {
    try{
        const allTracks = await pool.query("SELECT * FROM tracks");
        res.json(allTracks.rows)
    }
    catch(err){
        console.error(err.message)
    }
})




//update tracks


app.listen(5000, () => {
    console.log("server has started on port 5000");
});

