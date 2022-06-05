const { Date } = require('core-js');
const express = require('express');

const router = express.Router()

module.exports = router;

//Get by Story ID 
router.get('/getStories', (req, res) => {
    
    // Todo: Connection to the database
    var data = {
        fetchDate: Date.now(),
        stories: [
            {
                id: 1,
                title: "FairCare Verkehr",
                subtitle: "A story about unpaid careworkers",
                category: ["mobility"]
            }, 
            {
                id: 2,
                title: "Example story",
                subtitle: "A story about statuting an example",
                category: ["whatever"]
            }
        ]
    }
    
    res.send(data)
})


//Get by Story ID 
router.get('/story/:storyId', (req, res) => {
    
    // Todo: Connection to the database
    var data = require("../dummyData/"+req.params.storyId+"/story.json")
    
    res.send(data)
})

//Get Story Steps 
router.get('/story/:storyId/:stepHTML', (req, res) => {
        
    res.sendFile("dummyData/"+req.params.storyId+"/story/"+req.params.stepHTML+".html", {root: "."})
})