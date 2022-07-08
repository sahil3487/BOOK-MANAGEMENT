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

        let { rating, review } = data;

        let reviewedBy = data["reviewer's name"]

        if (!reviewedBy) return res.status(400).send({ status: false, msg: "please enter reviewer's name" });
        if (typeof reviewedBy != "string") return res.status(400).send({ status: false, msg: 'please enter valid reviewers name' })

        let reviewedAt= Date.now();

        if(!rating) return res.status(400).send({status: false, msg: 'ratings required and value should not be zero'})
        if(typeof rating!='number') return res.status(400).send({status: false, msg:'please enter a number'})
        if (!(rating<=5)) return res.status(400).send({ status: false, msg: 'please enter valid rating which is more than 0 and less than or equal to 5' });

        filter = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt,
            rating: rating,
            review: review
        };

        findBook.reviews = findBook.reviews + 1;
        findBook.save();

        let saveData = await reviewModel.create(filter);

        let response = await reviewModel.findById(saveData._id).select({__v:0,updatedAt:0,createdAt:0,isDeleted:0})

        res.status(201).send({ status: true, msg: 'success', data: response })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updateReview = async (req, res) => {
    try {
        let body = req.body;
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;

        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, msg: 'please enter data to update' })

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: 'please enter valid book id' });

        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, msg: 'book not found' })

        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: 'please enter valid review id' });

        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false });
        if (!findReview) return res.status(404).send({ status: false, msg: 'review not found' });

        if(body.rating) {
            if (typeof body.rating != "number") return res.status(400).send({ status: false, msg: 'please enter a number' });
            if (!(body.rating <= 5)) return res.status(400).send({ status: false, msg: 'please enter rating less than or equal to 5' });
        }else if(body.rating===0) {
            return res.status(400).send({ status: false, msg: 'please enter rating greater than 0' });
        }

        let update = {
            review: body.review,
            rating: body.rating,
            reviewedBy: body["reviewer's name"],
        }

        await reviewModel.findByIdAndUpdate({ _id: reviewId }, update);

        let { _id, title, category, userId, subcategory, excerpt, reviews, updatedAt, createdAt, releasedAt, isDeleted, } = findBook;

        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ __v: 0, isDeleted: 0 })

        let data = { _id, title, category, userId, subcategory, excerpt, reviews, updatedAt, createdAt, releasedAt, isDeleted, reviewsData }

        res.status(200).send({ status: true, message: 'Book list', data: data })
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }

}


let deleteReview = async (req, res) => {
    try {
        let bookId = req.params.bookId;
        let reviewId = req.params.reviewId;
    
        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: 'please enter valid book id' });
    
        let findBook = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, msg: 'book not found' })
    
        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: 'please enter valid review id' });
    
        let findReview = await reviewModel.findOne({ _id: reviewId, isDeleted: false });
        if (!findReview) return res.status(404).send({ status: false, msg: 'review not found' });
    
        await reviewModel.findOneAndUpdate({_id:reviewId, bookId:bookId},{isDeleted: true})
    
        findBook.reviews = findBook.reviews - 1;
        findBook.save();
    
        res.status(200).send({status: true, msg: 'successfully deleted'});
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.deleteReview = deleteReview
module.exports.updateReview = updateReview
module.exports.createReview = createReview