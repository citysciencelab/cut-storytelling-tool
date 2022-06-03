# Story Backend

This backend can save stories that were created by the Story Creation Tool and provides endpoints to retrieve these stories. 

The API is structured as the following: 


## API OVERVIEW

**GET**
```
/story              get list of all stories
/story/1            get metadata-json of story 1
/step/1/2/3/        get story 1's step 2.3 html & image
```
**POST**
```
/add/story/         add new story
/add/step/1/2/3/    add to story 1 step 2.3
```

**DELETE**
```
/delete/story/1     delete story 1
/delete/step/1      delete all steps to story 1
/delete/step/1/2    delete all steps belonging to major step 2 of story 1
/delete/step/1/2/3  delete step 2.3 of story 1

```


## GET


### _GET /story_

```

Returns an overview of all stories 


```

### _GET /story/:storyId_

```

Returns the story.json file of a story with the respective id


```

### _GET /step/_

```
Returns an overview over all steps


```

### _GET /step/:storyId/:step_major/:step_minor_

```
Returns image and html of a specific step of a specific story
```

## POST 

### _POST /add/story/_

```
 
Creates a new story entry. (metadata only)

expects in body
	- name (string): the name of the story
	- category (string): the story category
	- story_json (string): the story structure as  json (originally the "story json file")

example curl:
`curl -XPOST -d '{"name": "My New Story", "category" : "test", "story_json" : "{\"relevant json\" : \"as a string\"}"}' -H 'content-type: application/json' localhost:3000/add/story`


```

### _POST /add/step/:storyId/:step_major/:step_major_

```


Creates a story "step" for the story specified in `:storyID` (as created by /add/story). The `:step_major` and `:step_major` parameters are the equivalent of the `1-2.html` notation we originally have in the file names.

expects in body
    - html content of the step (as character string)
    - (image for the step - not yet implemented) 

example  curl:

`curl -XPOST -d '{"html": "<blink>does this html tag still work?</blink>"}' -H 'content-type: application/json' localhost:3000/add/step/1/2/3`

```

## DELETE

### _DELETE /story/:storyId_

```
delete a story and all its steps. Note: Stories can only be deleted if ALL steps belonging to that story have been deleted first (see /delete/step/)!
example curl:

curl -X "DELETE" localhost:3000/delete/story/1

```

### _DELETE /step/:storyId_
```
delete all steps belonging to a story
example curl (delete all steps of story 1):

curl -X "DELETE" localhost:3000/delete/step/1

```

### _DELETE /step/:storyId/:step_major_

```
delete all steps with the same major step belonging to a story
example curl (delete step 2.x of story 1):

curl -X "DELETE" localhost:3000/delete/step/1/1

```

### _DELETE /step/:storyId/:step_major/:step_minor_

```
delete a minor step in a story
example curl (delete step 2.3 of story 1):

curl -X "DELETE" localhost:3000/delete/step/1/2/3

```






# Database setup

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





