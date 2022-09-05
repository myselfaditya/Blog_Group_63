const mongoose = require('mongoose')
const objectid = mongoose.Schema.Types.ObjectId

const blogScehma = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        tyep: objectid,
        ref: authorSchemagit ,
        required: true
    },
    tags: ["String"],

    category: {
        type: String,
        required: true
    },
    subcategory: ["String"],

    deletedAt: Date,

    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('Blog', blogScehma)