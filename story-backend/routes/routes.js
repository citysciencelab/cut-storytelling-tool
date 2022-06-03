const { Date } = require('core-js');
const express = require('express');
const controllers = require('../controllers/controllers')

const router = express.Router()

module.exports = router;


// GET


//Get by Story ID 
router.get('/story/:storyId', controllers.getStoryStructure)

//Get Story Steps
// router.get('/story/:storyId/:stepHTML', (req, res) => {
        
//     res.sendFile("dummyData/"+req.params.storyId+"/story/"+req.params.stepHTML+".html", {root: "."})
// })


//Get Story Steps
router.get('/story/:storyId/:step', controllers.getStoryStep)




router.get('/getStories', controllers.getStories)



router.get('/story', controllers.getStories) // copy of /getStories endpoint for easier debugging
// POST


router.post('/createStory', controllers.createStory)

router.post('/createStep/:storyId/:major_step/:minor_step', controllers.createStep)

