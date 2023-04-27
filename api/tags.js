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
        const posts = await getPostsByTagName(tagName);
        
        if (posts) {
            console.log(`These are posts with the tagnames: ${tagName}:`, posts[0].tags);
            res.send({ posts}) 
console.log()
        }else {
        next({
            name:"get post by tagname Error",
            message: "Unable to get posts by tagname."
        }) 
        }

    }catch({ name, message}) {
     next({ name, message})
    }
    });
    



module.exports = tagsRouter;