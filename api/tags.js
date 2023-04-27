const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) =>{
    console.log("A request is being made to /tags" )

    next();
} );

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
    console.log("These are tags:", tags);

    res.send({
        tags
    });
});





tagsRouter.get('/:tagName/posts', async (req, res) => {
   const { tagName } = req.params;
   
    try{
        const allPosts = await getPostsByTagName(tagName);
        
        const posts = allPosts.filter(post => {
            // the post is active, doesn't matter who it belongs to
            if (post.active) {
              return true;
            }
          
            // the post is not active, but it belogs to the current user
            if (req.user && post.author.id === req.user.id) {
              return true;
            }
          
            // none of the above are true
            return false;
          });
        
            res.send({ posts}); 

    }catch({ name, message}) {
     next({ name, message})
    }
    });
    



module.exports = tagsRouter;