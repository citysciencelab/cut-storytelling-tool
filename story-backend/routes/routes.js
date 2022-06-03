const { Date } = require('core-js');
const express = require('express');
const controllers = require('../controllers/controllers')

const router = express.Router()

module.exports = router;


// // GET


// //Get by Story ID 
// router.get('/story/:storyId', controllers.getStoryStructure)

// //Get Story Steps

// // router.get('/story/:storyId/:stepHTML', (req, res) => {        
// //     res.sendFile("dummyData/"+req.params.storyId+"/story/"+req.params.stepHTML+".html", {root: "."})
// // })


// router.get('/story/:storyId/:step_major/:step_major', controllers.getStoryStep)
// router.get('/getStories', controllers.getStories)
// router.get('/story', controllers.getStories) // copy of /getStories endpoint for easier debugging
// // POST
// router.post('/createStory', controllers.createStory)
// router.post('/createStep/:storyId/:step_major/:step_major', controllers.createStep)




// proposal for endpoints (v. similar to what we had): 





router.get('/story', controllers.getStories)
router.get('/story/:storyId', controllers.getStoryStructure)

router.get('/step/', controllers.getSteps)
router.get('/step/:storyId/:step_major/:step_minor', controllers.getStoryStep)


// POST add stories
// /add/story        add new story
// /add/story/1/2/3  add step 2.3 to story 1
router.post('/add/story', controllers.createStory)
router.post('/add/step/:storyId/:step_major/:step_minor', controllers.createStep)


// DELETE stories
// /delete/story/1      delete story 1
// /delete/step/1/2/3  delete story 1, step 2.3 

router.delete('/delete/story/:storyId', controllers.deleteStory)
router.delete('/delete/step/:storyId/', controllers.deleteAllStorySteps)
router.delete('/delete/step/:storyId/:step_major/', controllers.deleteStepMajor)
router.delete('/delete/step/:storyId/:step_major/:step_minor', controllers.deleteStepMinor)



// PUT update stories

// /update/story/1   update story 1  
// /update/step/1/2/3 update story 1 step 2.3

// router.put('/update/story/:storyId', controllers.updateStory) // TBD
// router.put('/update/step/:storyId/:step_major/:step_major', controllers.updateStep) // TBD









