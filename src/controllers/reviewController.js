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
        if (!findBook) return res.status(404).send({ status: false, msg: 'bookId does not exists' })

        let { reviewedBy, reviewedAt, rating, review } = data;

        let filter = { isDeleted: false };

        if (!reviewedBy) return res.status(400).send({ status: false, msg: 'please enter reviewedby' });
        if (typeof reviewedBy != "string") return res.status(400).send({ status: false, msg: 'please enter valid reviewers name' })

        if (!reviewedAt) return res.status(400).send({ status: false, msg: 'please enter reviewed date' });
        let validateDate = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/gm
        if (!validateDate.test(reviewedAt)) {
            return res.status(400).send({ status: false, message: "reviewed date must be in format  YYYY-MM-DD!!!" })
        }

        if (!rating) return res.status(400).send({ status: false, msg: 'please enter valid rating which is more than 0 and less than or equal to 5' });

        filter = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: reviewedAt,
            rating: rating,
            review: review
        };

        findBook.reviews = findBook.reviews + 1;
        findBook.save();

        await reviewModel.create(filter);

        let response = await reviewModel.findOne(filter).select({__v:0,updatedAt:0,createdAt:0,isDeleted:0})

        res.status(201).send({ status: true, msg: 'success', data: response })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.createReview = createReview
