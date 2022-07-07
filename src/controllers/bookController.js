const userModel = require('../models/userModel')
const bookModel = require('../models/bookModel')
const reviewModel = require('../models/reviewModel')
const { default: mongoose } = require('mongoose')

const createBook = async (req, res) => {
    try {
        let body = req.body
        if (Object.keys(body).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to create a new book." })
        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = body

        //---------[Required fields]
        if (!title) return res.status(400).send({ status: false, message: "title is required" })
        if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is required" })
        if (!userId) return res.status(400).send({ status: false, message: "userId is required" })
        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is required" })
        if (!category) return res.status(400).send({ status: false, message: "category is required" })
        if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is required" })
        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is required" })

        //-------------[Validations for Unique fields]

        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) return res.status(400).send({ status: false, message: "Title is already used" })
        if (!(/^[a-zA-Z0-9][a-zA-Z0-9\s\-,?_.]+$/.test(data.title))) return res.status(400).send({ status: false, message: "Please enter valid title" })

        let checkUserid = await userModel.findById(userId)
        if (!mongoose.Types.ObjectId.isValid(checkUserid)) return res.status(400).send({ status: false, message: "Invalid UserId" })
        if (!checkUserid) return res.status(404).send({ status: false, message: "userId not found" })

        if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))) return res.status(400).send({ status: false, message: "Invalid ISBN Number" })
        let checkISBN = await bookModel.findOne({ ISBN })
        if (checkISBN) return res.status(400).send({ status: false, message: "ISBN is already used" })

        let validateDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm
        if (!validateDate.test(releasedAt)) {
            return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!" })
        }

        //----------[Authorisation]
        const token = req.userId
        if (token !== userId) res.status(403).send({ status: false, msg: "you cannot create other users books please provide your user ID" });

        let book = await bookModel.create(body)
        return res.status(201).send({ status: true, message: "Success", data: book })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


let getBook = async (req, res) => {
    try {
        let filterBook = req.query
        filterBook.isdeleted = false
        if (!mongoose.Types.ObjectId.isValid(filterBook.userId)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })
        let data = await bookModel.find(filterBook).select({ title: 1, excerpt: 1, category: 1, releasedAt: 1, userId: 1, reviews: 1 }).sort({ title: 1 })
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, message: 'Book not found' })

        return res.status(200).send({ status: true, message: 'Book list', data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
let getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId
        bookId.isdeleted = false
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })

        let checkBook = await bookModel.findById(bookId).select({ ISBN: 0, __v: 0 })
        if (!checkBook) return res.status(404).send({ status: false, message: "Book Not Found" });

        let reviewsData = await reviewModel.find({ _id: bookId, isdeleted: false })

        let { _id, title, category, subcategory, excerpt, reviews, updatedAt, createdAt, releasedAt, isDeleted, } = checkBook
        let data = { _id, title, category, subcategory, excerpt, reviews, updatedAt, createdAt, releasedAt, isDeleted, reviewsData }

        return res.status(200).send({ status: true, message: 'Book list', data: data })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



let updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId
        bookId.isdeleted = false
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })

        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to Update a book." })

        let checkBook = await bookModel.findById(bookId)
        if (!checkBook) return res.status(404).send({ status: false, message: "Book Not Found" });

        const token = req.userId
        if (token !== checkBook.userId.toString()) return res.status(403).send({ status: false, msg: "you cannot update other users book" });

        if (data.title) {
            if (!(/^[a-zA-Z0-9][a-zA-Z0-9\s\-,?_.]+$/.test(data.title))) return res.status(400).send({ status: false, message: "Please enter valid title" })
            let uniqueTittle = await bookModel.findOne({ title: data.title })
            console.log(uniqueTittle)
            if (uniqueTittle) return res.status(400).send({ status: false, message: "Title already exists" });
            checkBook.title = data.title
        }
        if (data.ISBN) {
            let uniqueISBN = await bookModel.findOne({ ISBN: data.ISBN })
            if (uniqueISBN) return res.status(400).send({ status: false, message: "ISBN already exists" });
            if (!(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(data.ISBN))) return res.status(400).send({ status: false, message: "Invalid ISBN Number" })
            checkBook.ISBN = data.ISBN
        }
        if (data.excerpt) {
            checkBook.excerpt = data.excerpt
        }
        if (data.releasedAt) {
            let validateDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm
            if (!validateDate.test(data.releasedAt)) {
                return res.status(400).send({ status: false, message: "date must be in format  YYYY-MM-DD!!!" })
            }
            checkBook.releasedAt = data.releasedAt
        }

        checkBook.save()


        return res.status(200).send({ status: true, message: 'Book list', data: checkBook })



    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createBook = createBook
module.exports.getBook = getBook
module.exports.getBookById = getBookById
module.exports.updateBook = updateBook