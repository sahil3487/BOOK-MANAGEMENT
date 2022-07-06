const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const { default: mongoose } = require('mongoose')

const createBook = async (req, res) =>{
    try{
        let body = req.body
        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to create a new book." })
        let {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt} = body

        //---------[Required fields]
        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is required" })
        if (!userId) return res.status(400).send({ status: false, message: "userId is required" }) 
        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is required" })
        if (!category) return res.status(400).send({ status: false, message: "category is required" })
        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is required" })
        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is required" })

        //-------------[Validations for Unique fields]

        let checkTitle = await bookModel.findOne({title})
        if(checkTitle) return res.status(400).send({status: false, message: "Title is already used"})

        let checkUserid = await userModel.findById(userId)
        if(!mongoose.Types.ObjectId.isValid(checkUserid)) return res.status(400).send({status: false, message: "Invalid UserId"})
        if(!checkUserid) return res.status(404).send({status: false, message: "userId not found"})

        
        let checkISBN = await bookModel.findOne({ISBN})
        if(checkISBN) return res.status(400).send({status: false, message: "ISBN is already used"})
        
        let validateDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm
        if (!validateDate.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!" })
        }
        
        //----------[Authorisation]
        const token = req.userId
        if (token !== userId) res.status(403).send({ status: false, msg: "you cannot create other users blogs please provide your author ID" });

        let book = await bookModel.create(body)
        // let data = {
        //     _id: book._id,
        //     title: book.title,
        //     excerpt: book.excerpt,
        //     userId: book.userId,
        //     ISBN: book.ISBN,
        //     category: book.category,
        //     subcategory: book.subcategory,
        //     releasedAt: book.releasedAt.splice(0,10),
        //     isDeleted: book.isDeleted,
        //     createdAt: book.createdAt,
        //     updatedAt: book.updatedAt,
        // }
        return res.status(201).send({status: true, message: "Success", data: book})
    }catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}

module.exports.createBook = createBook