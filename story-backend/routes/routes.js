const express = require('express');

const router = express.Router()

module.exports = router;

//Get by Story ID 
router.get('/story/:storyId', (req, res) => {
    
    // Todo: Connection to the database
    var data = require("../dummyData/"+req.params.storyId+"/story.json")
    
    res.send(data)
})

//Get Story Steps 
router.get('/story/:storyId/:stepID', (req, res) => {
    
    // Connection to the database here
    var data = {
        "story": {
            "id": req.params.storyId
        }
    }; 
    
    res.send(data)
})