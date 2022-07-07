// const bookModel = require('../models/bookModel')
// const reviewModel = require('../models/reviewModel')
// const { default: mongoose } = require('mongoose')


// const createReviews = async (req, res) => {
//     const id = req.params.bookId;
//     const data = req.body
//     id.isdeleted = false
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, message: 'Invalid UserId Format' })
//     if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please Provide data to create review." })

//     const findBook = await bookModel.findById(id);
//     if(!findBook) return res.status(404).send({ status: false, message: 'Book not found' })

//     let {reviewedBy, rating, review, bookId, reviewdAt} = data

//     if(!reviewedBy) return res.status(400).send({ status: false, message: "Please Provide reviewers name" })
//     if(!rating) return res.status(400).send({ status: false, message: "Please give ratings" })

//     // let update = await bookModel.findByIdAndUpdate({reviews:})
//     let create = await reviewModel.create({reviewedBy, rating, review, bookId, reviewdAt})

//     let newData = {
//         _id: create._id,
//         reviewedBy: reviewedBy,
//         bookId: id,
//         rating: rating,
//         reviewedAt: new Date(),
//         review : review,

//     }
//     return res.status(200).send({ status: true, message: "Success",data: newData })
// }


// module.exports.createReviews = createReviews