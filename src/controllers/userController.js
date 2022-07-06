//=================[Imports]==============

const userModel = require('../models/userModel')


//=================[Validation Function]==============
const isvalid = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) === -1
}

//=================[Create Users]==============

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
            if (address.pincode) {
                if (!(/^(\+\d{1,3}[- ]?)?\d{6}$/.test(address.pincode))) return res.status(400).send({ status: false, message: "please provide valid pincode" })
            }
        }

        //----------[Unique Fields]
        let checkEmail = await userModel.findOne({ email })
        if (checkEmail) return res.status(400).send({ status: false, message: "Email is already used" })

        let checkPhone = await userModel.findOne({ phone })
        if (checkPhone) return res.status(400).send({ status: false, message: "Phone is already used" })

        //----------[create]

        const savedData = await userModel.create(body)
        res.status(201).send({ status: true, message: savedData })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.createUser = createUser