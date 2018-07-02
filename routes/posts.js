const
    express = require('express'),
    postsRouter = new express.Router(),
    Post = require('../models/Post')

postsRouter.get('/new', (req, res) => {
    res.render('posts/new')
})

postsRouter.post('/', (req, res) => {
    Post.create({ ...req.body, _by: req.user }, (err, newPost) => {
        if(err) throw err
        res.redirect('/users/profile')
    })
})

module.exports = postsRouter