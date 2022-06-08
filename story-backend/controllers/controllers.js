const fs = require('fs');
const uuid = require('uuid');

// usually this file should not be public but hey
// This info must match the details of a running postgres database. See readme.md for details on DB setup
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'stories',
  password: 'password',
  port: 5432,
})



// storing image files on disk
const multer = require('multer');// Create multer object


// AFTER : Create multer object
const imageUpload = multer({
  storage: multer.diskStorage(
  {
    destination: function (req, file, cb) {
      cb(null, 'images/');
    },
    filename: function (req, file, cb) {
      cb(
        null,
        new Date().valueOf() + 
        '_' + uuid.v4()
        );
    }
  }
  )
});



// GET



const getStories = (request, response, next) => {
    pool.query('SELECT storyid AS id, name, author, description, category  FROM stories', (error, results) => {
      if (error) {
        next(error)
      }
      try{response.status(200).json(results.rows)} catch(err) {next(err)}
      
    })
  }



const getStoryStructure  = (req, res, next) => {

    // Todo: Connection to the database
    // var data = require("../dummyData/"+req.params.storyId+"/story.json")
    query = {
      name: 'get-story-structure',
      text: 'SELECT story_json FROM stories WHERE storyID = $1',
      values: [req.params.storyId]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error);
      }

      try{ 

      console.log(results.rows)
      res.status(200).json(JSON.parse(results.rows[0].story_json))}  // the json is stored as a string, so we have to parse that string before sending back the data. Would be better to store json properly in the database.
      catch (err){next(err);}
  })

  }



  const getSteps = (request, response, next) => {
    pool.query('SELECT * FROM steps', (error, results) => {
      if (error) {
        next(error);
      }
      try{response.status(200).json(results.rows)}catch(err){next(err)}
      
    })
  }



const getStoriesAllData = (request, response, next) => {
    pool.query('SELECT * FROM stories', (error, results) => {
      if (error) {
        next(error);
      }
      try{response.status(200).json(results.rows)}catch(err){next(err)}
      
    })
  }


  const getStoryStep  = (req, res, next) => {

    // Todo: Connection to the database
    // var data = require("../dummyData/"+req.params.storyId+"/story.json")
    console.log(req.params)
    query = {
      name: 'get-story-step',
      // text: 'SELECT * FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3',
      text: 'SELECT * FROM steps WHERE storyID=$1 AND step_major=$2 AND step_minor=$3',
      values: [req.params.storyId, req.params.step_major,req.params.step_minor]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
         next(error);
      }
      try{res.status(200).json(results.rows)}catch(err){next(err)}
    })

  }


const getImage = (request, response, next) => {


    if(!request.params.imageId){
      request.params.imageId = 1
    }
    var query = {
      name: "get-image-file-path",
      text: "SELECT image[$4] FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3 LIMIT 1",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor, request.params.imageId]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error);
      }

      try{
      image_path = results.rows[0].image
      if(!image_path){response.status(400).send("nonexistent image id")}else{
              response.sendFile(image_path, { root: __dirname + "/../"});        
      }
    }catch(err){ next(err)}

    })


    

  }


  const getHtml = (request, response, next) => {

    var query = {
      name: "get-hml",
      text: "SELECT html FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3 LIMIT 1",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error);
      }
      try{
        console.log(results.rows.size);
        response.status(201).send(results.rows[0].html);        
      }catch(err){next(err)}
        
      
    })    

  }


  // POST/PUT


  const createStory = (request, response, next) => {

    const { name, category } = request.body
    console.log(request.body);
    const query_new_story = {
      name: 'new-story',
      text: 'INSERT INTO stories (name, category, story_json, author, description) VALUES ($1, $2, $3,$4,$5)',
      values: [request.body.name, request.body.category, request.body.story_json, request.body.author, request.body.description],
    }
    const query_latest_story_id = {
      name: 'latest-story-id',
      text: 'SELECT max(storyID) FROM stories',
      values: [],
    }

    pool.query(query_new_story,
      (error, results) => {
       if (error) {
        next(error)
      }

      // if successfully inserted, return latest story ID

      var storyID = null;
      
      pool.query(query_latest_story_id,
      (error, results) => {
       if (error) {
        next(error); 
      }
      try{response.status(201).send({success:true,storyID: results.rows[0].max})
    } catch(err){next(err);}
      
        
      })

    })
  }


  const createStep = (request, response, next) => {

    var query = {
      name: 'new-step',
      text: 'INSERT INTO steps (storyID, step_major, step_minor, html) VALUES ($1, $2, $3, $4)',
      values: [request.params.storyId, request.params.step_major, request.params.step_minor, request.body.html],
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error);
      }
      try{response.status(201).send(`step added`)}catch(err){next(err);}
    })
  }



  const addImagePath = (request, response, next) => {
    console.log("ADD IMAGE PATH")
    const filepath = request.file.path; 
    console.log(filepath)
console.log(request.params)
    var query = {
      name: "store-image-file-path",
      // UPDATE table SET array_field = array_field || '{"new item"}' WHERE ...
      text: 'UPDATE steps SET image = image || ARRAY[$4] WHERE storyID = $1 AND step_major = $2 AND step_minor = $3',
      values: [request.params.storyId, request.params.step_major,request.params.step_minor,filepath]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next (error)
      }
      try{response.json({sucess:true, filepath})}catch(err){next(err);}
    });
  }




  const addHtml = (request, response, next) => {
    console.log(request)
    var query = {
      name: "store-image-file-path",
      text: "UPDATE steps SET html = $4 WHERE storyID = $1 AND step_major = $2 AND step_minor = $3",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor,request.body.html]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error);
      }
      try{response.status(201).send(`added html`)}catch(err){next(err);}
    });
  }



  

// DELETE


  const deleteStory = (request, response, next) => {

    var query = {
      name: 'delete-story',
      text: 'DELETE FROM stories WHERE storyID = $1;',
      values: [request.params.storyId]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error);
      }
      try{response.status(201).send(`story deleted`)}catch(err){next(err);}
    })


  }



  const deleteAllStorySteps = (request, response, next) => {

    var query = {
      name: 'delete-step-all',
      text: 'DELETE FROM steps WHERE storyID = $1',
      values: [request.params.storyId]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error)
      }
      try{response.status(201).send(`all steps of story deleted`)}catch(err){next(err);}
    })


  }


  const deleteStepMajor = (request, response, next) => {

    var query = {
      name: 'delete-step-major',
      text: 'DELETE FROM steps WHERE storyID = $1 AND step_major = $2;',
      values: [request.params.storyId, request.params.step_major]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error)
      }
      try{response.status(201).send(`major step deleted`)}catch(err){next(err);}
    })


  }



  const deleteStepMinor = (request, response, next) => {

    var query = {
      name: 'delete-step-minor',
      text: 'DELETE FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3;',
      values: [request.params.storyId, request.params.step_major, request.params.step_minor]
    }

    pool.query(query,
      (error, results) => {
       if (error) {
        next(error)
      }
      try{response.status(201).send(`minor step deleted`)}catch(err){next(err);}
    })


  }






  module.exports = {
    imageUpload,
    getStories,
    getStoriesAllData,
    getStoryStructure,
    getSteps,
    getStoryStep,
    createStory,
    createStep,
    deleteStory,
    deleteAllStorySteps,
    deleteStepMajor,
    deleteStepMinor,
    addImagePath,
    addHtml,
    getImage,
    getHtml
  }

