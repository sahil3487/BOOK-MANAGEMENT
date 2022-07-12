const jwt = require("jsonwebtoken")


// =================================[ Authentication ]================================
const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, message: "token must be present", });

        //-----(Decoding Token)
        let decodedToken = jwt.verify(token, "project-3")

        if(!decodedToken) return res.status(401).send({status: false,message: 'token invalid'})

        //----(Set Id In Request)
        req["userId"] = decodedToken.userId
    
        next()
        
    } catch (err) {

        if (err.message == "jwt expired") return res.status(400).send({ status: false, message: "JWT expired, login again" })
        if (err.message == "invalid signature") return res.status(400).send({ status: false, message: "Token is incorrect" })
        if (err.message == "invalid token") return res.status(400).send({ status: false, message: "Token is incorrect" })
        
        res.status(500).send({ status: false, message: err.message });
    }
}

module.exports.authenticate = authenticate;

