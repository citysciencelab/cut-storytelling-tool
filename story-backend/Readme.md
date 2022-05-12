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