const { Date } = require('core-js');
const express = require('express');
const controllers = require('../controllers/controllers')

const router = express.Router()

module.exports = router;


// GET


//Get by Story ID 
router.get('/story/:storyId', controllers.getStoryStructure)

//Get Story Steps 
router.get('/story/:storyId/:stepHTML', (req, res) => {
        
    res.sendFile("dummyData/"+req.params.storyId+"/story/"+req.params.stepHTML+".html", {root: "."})
})



router.get('/getStories', controllers.getStories)



// POST


router.post('/createStory', controllers.createStory)





