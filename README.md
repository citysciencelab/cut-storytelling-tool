<p align="center">
<img src="https://user-images.githubusercontent.com/61881523/186185988-e0eeb32a-3d2c-4fcc-bd33-bfb4abd7a35c.png" alt="drawing" width="400"/>
</p>

# Storytelling Tool
## City Science Lab - Connected Urban Twin

The Storytelling Tool is a master portal add-on that can be used to add text, photos and images to geo-referenced data sets. In this way, the usually very technical and purely data-based representations can be supplemented with information and more descriptive representations. The data shown is contextualized and complex relationships become easier to understand. Users click their way through a story step by step.

The current version of the repository includes an example from the real-life experiment 'Mobilities of care'. Topics such as the mobility behavior of unpaid care workers can thus be communicated and located more easily. This is available under the portal configuration called '/mobility-data/'.


https://user-images.githubusercontent.com/36763878/161025746-b8ac51be-a687-4e63-8bcf-b1da01334ead.mp4

### Docker


Quick setup of a local version of the storytelling tool.

#### Docker Deployment

Deploy the frontend and backend applications including database to Docker.

```
docker-compose up
```

Default URL for the application deployed on your local machine is: http://localhost/mobility-data/


### Masterportal setup

You can also start the application with npm if you plan on connecting a database, creating a new story or adjusting the code to your needs.

#### Node.js

Install **[Node.js](http://nodejs.org)**. Last known working version is *v10.18.0 LTS* with *NPM version 6.13.4*.

#### Tool installation

Execute the git bash as admin and navigate to the folder the repository is to be cloned to.

Clone the repository and navigate to the folder created:

```console
git clone https://github.com/citysciencelab/cut-storytelling-tool.git
```

Install the `node_modules` required for the addons:

Step 1:
```console
cd cut-storytelling-tool\addons\storyTellingTool
npm install
```

Install the `node_modules` required for the Masterportal:

```console
cd masterportal
npm install
```

With this, all dependencies are installed.

In case you need further information about how add-ons configured and developed, please refer to the **[add-ons documentation](doc/addonsVue.md)** for further assistance.

This command will start a local development server.

```console
npm start
```

- After compilation, you may open the following links for comprehensive demo applications:
    - https://localhost:9001/portal/mobility-data Portal that includes the initial Faircare story as well as the data gathering tool

An example story can be found in the folder:
```
cut-storytelling-tool\portal\mobility-data\assets
```
The stories are referenced in the storyConf variable in the [config.js](portal\mobility-data\config.js).

---
#### Following is the official documentation of the Masterportal

Official website of the [Masterportal](https://www.masterportal.org/)

The Masterportal is a tool-kit to create geo web applications based on [OpenLayers](https://openlayers.org), [Vue.js](https://vuejs.org/) and [Backbone.js](https://backbonejs.org). The Masterportal is Open Source Software published under the [MIT License](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/License.txt).

The Masterportal is a project by [Geowerkstatt Hamburg](https://www.hamburg.de/geowerkstatt/).

###### Developer section

* [Developer documentation](doc/devdoc.md)
* [Tutorial 01: Creating a new module (Scale switcher)](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/vueTutorial.md)
* [Community board (Developer forum and issue tracker)](https://trello.com/c/qajdXkMa/110-willkommen)
