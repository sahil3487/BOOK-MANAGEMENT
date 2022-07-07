const jwt = require("jsonwebtoken")



const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];

        if (!token) return res.status(400).send({ status: false, msg: "token must be present", });

        let decodedToken = jwt.verify(token, "project-3", (err, decoded) => {
            if (err) {
                res.status(401).send({ status: false, message: err.message })
            } else {
                return decoded
            }
        })

        if (!decodedToken) return res.status(400).send({ status: false, msg: "token is invalid", });
        req["userId"] = decodedToken.userId

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
    next()
}

module.exports.authenticate = authenticate;