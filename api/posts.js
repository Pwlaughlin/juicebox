const express = require('express');
const postsRouter = express.Router();
const { requireUser } = require('./utils');
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');

postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();
});


postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();


    res.send({
        posts
    });
});

postsRouter.post('/', requireUser, async (req, res, next) => {
    const {title, content, tags = "" } = req.body;

    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagArr.length) {
        postData.tags = tagArr;
    }

    try{
        postData.authorId = req.user.id;
        postData.title = title;
        postData.content = content;
        console.log(postData);
        const post = await createPost(postData);

         if(post) {
            res.send({post})
         
        }else {
            next({
                name: 'Create Post Error',
                message: 'Unable to create post'
            })
        }


    } catch ({name, message}) {
        next({ name, message });
    }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = postsRouter;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJwYXNzd29yZCI6ImJlcnRpZTk5IiwibmFtZSI6Ik5ld25hbWUgU29nb29kIiwibG9jYXRpb24iOiJMZXN0ZXJ2aWxsZSwgS1kiLCJhY3RpdmUiOnRydWUsImlhdCI6MTY4MjU3MTk5NCwiZXhwIjoxNjgzMTc2Nzk0fQ.94fF_KFr3J-DEaylu9J9I4dKSUF1q0PglSKVtnW4gh8