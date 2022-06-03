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
      text: 'SELECT * FROM steps WHERE $1=$1 AND $2=$2 AND $3=$3',
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
// table we're trying to populate looks like this: 
//   storyID INT,
//   step_major INT,
//   step_minor INT,
//   html TEXT,
//   image bytea

  console.log(request.body);
  const query_new_story = {
    name: 'new-story',
    text: 'INSERT INTO steps (storyID, step_major, step_minor, html) VALUES ($1, $2, $3, $4)',
    values: [request.params.storyId, request.params.step_major, request.params.step_minor, request.body.html],
  }

  pool.query(query_new_story,
    (error, results) => {
     if (error) {
      throw error
    }
    response.status(201).send(`story added`)
  })
}




// curl --data "a=test1&b=test2" http://localhost:3000/




const getStories = (request, response) => {
    pool.query('SELECT storyid AS id, name, category FROM stories', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

module.exports = {
  getStories,
  getStoryStructure,
  getStoryStep,
  createStory,
  createStep
}


