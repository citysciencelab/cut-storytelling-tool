# Story Backend

This backend can save stories that were created by the Story Creation Tool and provides endpoints to retrieve these stories. 

The API is structured as the following: 

## POST

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

1. install postgresql with [homebrew](https://brew.sh/) (on Linux / OsX):
`brew install postgresql`
`brew services start postgresql`
(you can stop services with `brew services stop postgresql`)

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

