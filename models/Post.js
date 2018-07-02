const
    mongoose = require('mongoose'),
    postSchema = new mongoose.Schema({
        title: String,
        body: String,
        _by: {
            ref: 'User', type: mongoose.Schema.Types.ObjectId
        }
    })

const Post = mongoose.model('Post', postSchema)

module.exports = Post 