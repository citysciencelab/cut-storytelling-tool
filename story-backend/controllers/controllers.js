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
    console.log(req.params)
    query = {
      name: 'get-story-structure',
      text: 'SELECT story_json FROM stories WHERE storyid =$1',
      values: [req.params.storyId]
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
    text: 'INSERT INTO stories (name, category) VALUES ($1, $2)',
    values: [request.body.name, request.body.category],
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
  createStory,
  getStories,
  getStoryStructure
}


