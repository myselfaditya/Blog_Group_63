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
        type: objectid,
        ref: "Author",
        required: true
    },
    tags: ["String"],

    category: {
        type: String,
        required: true
    },
    subcategory: ["String"],

    deletedAt:{ type:Date,
        default:null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type:Date,
        default:null
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

module.exports = mongoose.model('Blog', blogScehma)