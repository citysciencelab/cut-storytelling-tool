# Story Backend

This backend can save stories that were created by the Story Creation Tool and provides endpoints to retrieve these stories. 

The API is structured as the following: 

## POST

_POST /createStory_

Save a new story's metadata to the database

expects in body
	- name (string)
	- category (string)
	- story_json (string)

example curl:
`curl -XPOST -d '{"name": "My New Story", "category" : "test", "story_json" : "{\"some json\" : \"as a string\"}"}' -H 'content-type: application/json' localhost:3000/createStory`


_POST /createStep/:storyID/:major_step/:minor_step_

Creates a story "step" for the story specified in `:storyID` (as created by /createStory). The `:major_step` and `:minor_step` parameters are the equivalent of the `1-2.html` notation we originally have in the file names.

expects in body
    - html content of the step (as character string)
    - (image for the step - not yet implemented) 

example  curl:
`curl -XPOST -d '{"html": "<blink>does this html tag still work?</blink>"}' -H 'content-type: application/json' localhost:3000/createStep/3/1/1`


## GET
_GET /getStories_

```
Returns an overview of all stories 
```


_GET /story/:storyId_

```
Returns the story.json file of a story with the respective id
```

_GET /story/:storyId/:stepHTML _
```
Returns the html file of a specific step in a specific story
```

_GET /story/:storyId/:stepHTML/:imageId _
```
Returns a specific image of a specific step in a specific story
```




## Database setup

(following [this tutorial](https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/))

### install postgres

1. install postgresql with [homebrew](https://brew.sh/) (on Linux / OsX):
`brew install postgresql`
`brew services start postgresql`
(you can stop services with `brew services stop postgresql`)


### create database
2. create a user
```
psql postgres
```
then in postgres console:

```
CREATE ROLE me WITH LOGIN PASSWORD 'password';
CREATE DATABASE stories;
\q
```
3. then run database init file in /db/setup/

`psql -U me -d stories -a -f ./db/setup/db_setup.sql`






