const {sign, verify} = require("jsonwebtoken");

const createTokens = (user) => {
    const accessToken = sign(
        {email: user.email,  id: user.id},
         "friendsSecret"
         );

         return accessToken;
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if(!accessToken)
     return res.status(400).json({error:"User not authenticated!"});

    try {
        const validToken = verify(accessToken, "friendsSecret");
        if(validToken){
            req.authenticated = true
            return next();
        }
        
    } catch (err) {
        return res.status(400).json({error: err});
    }  
}

module.exports = { createTokens, validateToken };