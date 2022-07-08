const mongoose = require('mongoose')
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");

let createReview = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: 'please eneter data to create review' })

        let bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: 'please enter the bookId' });

        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!findBook) return res.status(404).send({ status: false, msg: 'book does not exists' })

        let { reviewedBy, reviewedAt, rating, review } = data;

        reviewedAt = new Date()

        if (!rating) return res.status(400).send({ status: false, msg: 'rating is required' });
        if(!(rating > 0 && rating <= 5)) return res.status(200).send({ status: false, msg: 'please enter valid rating which is more than 0 and less than or equal to 5'})

        let filter = {
            bookId: bookId,
            reviewedBy,
            reviewedAt: reviewedAt,
            rating: rating,
            review: review
        };

        findBook.reviews = findBook.reviews + 1;
        findBook.save();

        let savedData = await reviewModel.create(filter);

        let response = await reviewModel.findById(savedData._id).select({__v:0,isDeleted:0})

        res.status(201).send({ status: true, msg: 'success', data: response })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}




module.exports.createReview = createReview
