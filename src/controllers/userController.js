//=================[Imports]==============

const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken")

//=================[Validation Function]==============
const isvalid = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) === -1
}

// ==+==+==+==+===+==+==+==[ Create User ]==+==+==+==+===+==+==+==+=

const createUser = async (req, res) => {
    try {
        let body = req.body
        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to create a new user." })
        let { name, email, phone, password, title, address } = body

        //---------[Required fields]
        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!name) return res.status(400).send({ status: false, message: "Name is required" })
        if (!email) return res.status(400).send({ status: false, message: "email is required" })
        if (!phone) return res.status(400).send({ status: false, message: "Phone is required" })
        if (!password) return res.status(400).send({ status: false, message: "password is required" })

        //----------[Check Validations]
        if (isvalid(title)) return res.status(400).send({ status: false, message: "title must be Mr , Miss , Mrs" })
        //---(Name)
        if (!(/^[A-Za-z_ ]+$/.test(name))) return res.status(400).send({ status: false, message: "Name is Invalid " })
        if(typeof name!= "string") return res.status(400).send({status:false, message:"Name should be string"})
        //---(Phone)
        if (!(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone))) return res.status(400).send({ status: false, message: "Phone Number Is Invalid" })
        //---(Email)
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        //---(Password)
        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password))) {
            return res.status(400).send({ status: false, message: `password shoud be 8 to 15 characters which contain at least one numeric digit, one uppercase and one lowercase letter` })
        }
        //---(Address)
        if (address) {
            if (typeof address !== 'object' || Array.isArray(address) || Object.keys(address).length == 0) {

                return res.status(400).send({ status: false, message: "address should be of type object and if address is given it should not be empty" })
            }

            let street = address.street
            let city = address.city
            let pincode = address.pincode
            if(!pincode) return res.send({msg:false})
            console.log(street, city, pincode)
            if (street) {
                let validateStreet = /^[a-zA-Z0-9]/
                if (!validateStreet.test(street)) {
                    return res.status(400).send({ status: false, message: "enter valid street name" })
                }
            }

            if (city) {
                let validateCity = /^[a-zA-z',.\s-]{1,25}$/gm
                if (!validateCity.test(city)) {
                    return res.status(400).send({ status: false, message: "enter valid city name" })
                }
            }

            if (pincode) {
                let validatePincode = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/gm  //must not start with 0,6 digits and spaces
                if (!validatePincode.test(pincode)) {
                    return res.status(400).send({ status: false, message: "enter valid pincode" })
                }
            }
        }

        //----------[Unique Fields]
        let checkEmail = await userModel.findOne({ email })
        if (checkEmail) return res.status(400).send({ status: false, message: "Email is already used" })

        let checkPhone = await userModel.findOne({ phone })
        if (checkPhone) return res.status(400).send({ status: false, message: "Phone is already used" })

        //----------[create]

        const savedData = await userModel.create(body)
        res.status(201).send({ status: true, message: "Success", data: savedData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


// ==+==+==+==+===+==+==+==[ Login User ]==+==+==+==+===+==+==+==+=

const loginUser = async function (req, res) {
    try {
        let body = req.body
        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, msg: "please provide body to login" })
        let { email, password } = body

        //---------[Required fields]
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })

        //---------[Validation]
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) return res.status(400).send({ status: false, msg: "email Id is invalid" })
        let Email = await userModel.findOne({ email })
        if (!Email) return res.status(400).send({ status: false, msg: "email is not correct" })

        let user = await userModel.findOne({ email: email, password: password })
        if (!user) return res.status(400).send({ status: false, msg: "password is not corerct" });

        // ---------[Create Token JWT]---------
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
            },
            "project-3"
        )
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: "Success", data: { token: token } });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};





module.exports.createUser = createUser
module.exports.loginUser = loginUser
