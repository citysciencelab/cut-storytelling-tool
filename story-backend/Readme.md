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
`curl -XPOST -d '{"name": "My New Story", "category" : "test", "story_json" : "{\"some json\" : \"as a string\"}"}' -H 'content-type: application/json' localhost:3000/add/story`





## GET

```
_GET /story_
```

Returns an overview of all stories 


```
_GET /story/:storyId_
```

Returns the story.json file of a story with the respective id


```
_GET /step/
```
Returns an overview over all steps


```
_GET /step/:storyId/:step_major/:step_minor_
```
Returns image and html of a specific step of a specific story


## POST 
```
_POST /story/1_
```
Returns an overview of all stories 


```
_POST /story/:storyId_
```
Returns the story.json file of a story with the respective id


```
_POST /step/:storyId/:step_major/:step_minor
```


```
_POST /createStep/:storyID/:step_major/:step_major_
```

Creates a story "step" for the story specified in `:storyID` (as created by /add/story). The `:step_major` and `:step_major` parameters are the equivalent of the `1-2.html` notation we originally have in the file names.

expects in body
    - html content of the step (as character string)
    - (image for the step - not yet implemented) 

example  curl:

`curl -XPOST -d '{"html": "<blink>does this html tag still work?</blink>"}' -H 'content-type: application/json' localhost:3000/add/step/1/2/3`

```
_GET /step/:storyId/:step_major/:step_minor_
```

Returns image and html of a specific step of a specific story


## DELETE
```
_DELETE /story/:storyId_
```
delete a story and all its steps. Note: Stories can only be deleted if ALL steps belonging to that story have been deleted first (see /delete/step/)!
example curl:

curl -X "DELETE" localhost:3000/delete/story/1

```

_DELETE /step/:storyId_
```
delete all steps belonging to a story
example curl (delete all steps of story 1):

curl -X "DELETE" localhost:3000/delete/step/1

```

_DELETE /step/:storyId/:step_major_
```
delete all steps with the same major step belonging to a story
example curl (delete step 2.x of story 1):

curl -X "DELETE" localhost:3000/delete/step/1/1

```

_DELETE /step/:storyId/:step_major/:step_minor_
```
delete a minor step in a story
example curl (delete step 2.3 of story 1):

curl -X "DELETE" localhost:3000/delete/step/1/2/3

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






