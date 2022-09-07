
const jwt = require("jsonwebtoken");

// /### Authentication
// - Add an authorisation implementation for the JWT token that validates the token before every protected endpoint is called. If the validation fails, return a suitable error message with a corresponding HTTP status code
// - Protected routes are create a blog, edit a blog, get the list of blogs, delete a blog(s)
// - Set the token, once validated, in the request - `x-api-key`
// - Use a middleware for authentication purpose.
//Authentication
const tokenverify = async function (req, res, next) {
    
        let token = req.headers["x-auth-token"]
    //If no token is present in the request header return error. This means the user is not logged in.
    if (!token)
        return res.status(400).send({ status: false, msg: "token must be present" });

    let decodedToken = jwt.verify(token, "FunctionUp Group No 63")
    if (!decodedToken) return res.status(400).send({ status: false, message: "invalid token" });

    req.userId = decodedToken.userId  //Set an attribute in request object 
    next();
};


    
module.exports.tokenverify = tokenverify
