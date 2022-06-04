const fs = require('fs');


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
                    '_' +
                    file.originalname
                );
            }
        }
    ), 
});





const getStoryStructure  = (req, res) => {

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
        throw error
      }
    res.status(200).json(JSON.parse(results.rows[0].story_json)) // the json is stored as a string, so we have to parse that string before sending back the data. Would be better to store json properly in the database.
  })

  }

  const getStoryStep  = (req, res) => {

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
        throw error
      }
      res.status(200).json(results.rows)
    })

  }



  const createStory = (request, response) => {

    const { name, category } = request.body
    console.log(request.body);
    const query_new_story = {
      name: 'new-story',
      text: 'INSERT INTO stories (name, category, story_json) VALUES ($1, $2, $3)',
      values: [request.body.name, request.body.category, request.body.story_json],
    }

    pool.query(query_new_story,
      (error, results) => {
       if (error) {
        throw error
      }
      response.status(201).send(`story added`)
    })
  }


  const createStep = (request, response) => {

var query = {
  name: 'new-step',
  text: 'INSERT INTO steps (storyID, step_major, step_minor, html) VALUES ($1, $2, $3, $4)',
  values: [request.params.storyId, request.params.step_major, request.params.step_minor, request.body.html],
}

pool.query(query,
  (error, results) => {
   if (error) {
    throw error
  }
  response.status(201).send(`step added`)
})
}




const getStories = (request, response) => {
  pool.query('SELECT storyid AS id, name, category FROM stories', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getSteps = (request, response) => {
  pool.query('SELECT * FROM steps', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const deleteStory = (request, response) => {

  var query = {
    name: 'delete-story',
    text: 'DELETE FROM stories WHERE storyID = $1;',
    values: [request.params.storyId]
  }

  pool.query(query,
    (error, results) => {
     if (error) {
      throw error
    }
    response.status(201).send(`story deleted`)
  })


}



const deleteAllStorySteps = (request, response) => {

  var query = {
    name: 'delete-step-all',
    text: 'DELETE FROM steps WHERE storyID = $1',
    values: [request.params.storyId]
  }

  pool.query(query,
    (error, results) => {
     if (error) {
      throw error
    }
    response.status(201).send(`all steps of story deleted`)
  })


}


const deleteStepMajor = (request, response) => {

  var query = {
    name: 'delete-step-major',
    text: 'DELETE FROM steps WHERE storyID = $1 AND step_major = $2;',
    values: [request.params.storyId, request.params.step_major]
  }

  pool.query(query,
    (error, results) => {
     if (error) {
      throw error
    }
    response.status(201).send(`major step deleted`)
  })


}



const deleteStepMinor = (request, response) => {

  var query = {
    name: 'delete-step-minor',
    text: 'DELETE FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3;',
    values: [request.params.storyId, request.params.step_major, request.params.step_minor]
  }

  pool.query(query,
    (error, results) => {
     if (error) {
      throw error
    }
    response.status(201).send(`minor step deleted`)
  })


}





const addImagePath = (request, response) => {
  console.log("ADD IMAGE PATH")
    const filepath = request.file.path; 
    // console.log(filepath)
    var query = {
      name: "store-image-file-path",
      text: "UPDATE steps SET image = $4 WHERE storyID = $1 AND step_major = $2 AND step_minor = $3",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor,filepath]
    }

   pool.query(query,
  (error, results) => {
   if (error) {
    throw error
  }
 response.json({sucess:true, filepath})
});
 }




const addHtml = (request, response) => {
  console.log(request)
       var query = {
      name: "store-image-file-path",
      text: "UPDATE steps SET html = $4 WHERE storyID = $1 AND step_major = $2 AND step_minor = $3",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor,request.body.html]
    }

   pool.query(query,
  (error, results) => {
   if (error) {
    throw error
  }
 response.status(201).send(`added html`)
});
 }



const getImage = (request, response) => {



    var query = {
      name: "get-image-file-path",
      text: "SELECT image FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3 LIMIT 1",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor]
    }

   pool.query(query,
  (error, results) => {
   if (error) {
    throw error
  }
  image_path = results.rows[0].image
    response.sendFile(image_path, { root: __dirname + "/../"});
});


    

}


const getHtml = (request, response) => {

    var query = {
      name: "get-hml",
      text: "SELECT html FROM steps WHERE storyID = $1 AND step_major = $2 AND step_minor = $3 LIMIT 1",
      values: [request.params.storyId, request.params.step_major,request.params.step_minor]
    }

   pool.query(query,
  (error, results) => {
   if (error) {
    throw error
  }
    response.status(201).send(results.rows[0].html)
});


    

}








module.exports = {
  imageUpload,
  getStories,
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


