import JSZip from "jszip";
import FileSaver from "file-saver";
import * as constants from "../constantsStoryCreationTool"
import axios from "axios";

import {
    getStepReference,
    getHTMLContentReference
} from "../../utils/getReference";

/**
 * Adds an HTML file to the temporary HTML contents state
 *
 * @param {Object} context actions context object.
 * @param {Number} parameters.chapterNumber the chapter number to identify the step the HTML content belongs to
 * @param {Number} parameters.stepNumber the step number to identify the step the HTML content belongs to
 * @param {String} parameters.htmlContent the HTML content
 * @param {Array} parameters.htmlContentImages the images in the HTML content
 * @param {String} parameters.previousHtmlReference the previous HTMl reference (for the case that it changed)
 * @returns {String} the HTML file name
 */
 function saveHtmlContent(
    { state, commit },
    {
        chapterNumber,
        stepNumber,
        htmlContent,
        htmlContentImages,
        previousHtmlReference
    }
    ) {
    const htmlContents = { ...state.htmlContents },
    htmlContentsImages = { ...state.htmlContentsImages },
    htmlReference = getHTMLContentReference(chapterNumber, stepNumber);

    if (previousHtmlReference) {
        delete htmlContents[previousHtmlReference];
        delete htmlContentsImages[previousHtmlReference];
    }

    commit("setHtmlContents", {
        ...htmlContents,
        [htmlReference]: htmlContent
    });
    commit("setHtmlContentsImages", {
        ...htmlContentsImages,
        [htmlReference]: htmlContentImages
    });

    return `${htmlReference}.html`;
}

/**
 * Adds a chapter to the story
 *
 * @param {Object} context actions context object.
 * @param {Object} chapter the chapter to add
 * @param {Number} chapter.chapterNumber the number of the chapter to add
 * @param {String} chapter.chapterTitle the title of the chapter to add
 * @returns {void}
 */
 function addStoryChapter({ state, commit }, chapter) {
    const chapters = state.storyConf.chapters,
    newStoryConf = {
        ...state.storyConf,
        chapters: [...chapters, chapter]
    };

    commit("setStoryConf", newStoryConf);
}

/**
 * Saves a step in the storyConf
 *
 * @param {Object} context actions context object.
 * @param {Object} parameters.step the step to update
 * @param {Object} parameters.previousStepReference the reference to the step in state (if already exists)
 * @returns {void}
 */
 function saveStoryStep({ state, commit }, { previousStepReference, step }) {
    const steps = state.storyConf.steps.filter(
        ({ associatedChapter, stepNumber }) => !previousStepReference ||
        previousStepReference !==
        getStepReference(associatedChapter, stepNumber)
        ),
        // Sort steps by chapter number then by step number
        sortedNewSteps = [...steps, step].sort(
            (stepA, stepB) => (stepA.associatedChapter > stepB.associatedChapter) -
            (stepA.associatedChapter < stepB.associatedChapter) ||
            (stepA.stepNumber > stepB.stepNumber) -
            (stepA.stepNumber < stepB.stepNumber)
            ),
        newStoryConf = {
            ...state.storyConf,
            steps: sortedNewSteps
        };

        commit("setStoryConf", newStoryConf);
    }

/**
 * Deletes a step from the storyConf
 * Deletes the associated chapter if it's not used anymore
 *
 * @param {Object} context actions context object.
 * @param {Number} parameters.associatedChapter the chapter of the step to delete
 * @param {Number} parameters.stepNumber the number of the step to delete
 * @returns {void}
 */
 function deleteStoryStep({ state, commit }, { associatedChapter, stepNumber }) {
    const newSteps = state.storyConf.steps.filter(
        step => associatedChapter !== step.associatedChapter ||
        stepNumber !== step.stepNumber
        ),
    chapterIsNotUsedAnymore = !newSteps.some(
        step => step.associatedChapter === associatedChapter
        ),
    newChapters = chapterIsNotUsedAnymore
    ? state.storyConf.chapters.filter(
        ({ chapterNumber }) => chapterNumber !== associatedChapter
        )
    : state.storyConf.chapters;

    commit("setStoryConf", {
        ...state.storyConf,
        chapters: newChapters,
        steps: newSteps
    });
}

/**
 * Collects all files needed for the created story and downloads them as zip
 *
 * @param {Object} context actions context object.
 * @returns {void}
 */
 function downloadStoryFiles({ state }) {
    const zip = new JSZip(),
    htmlContents = Object.entries(state.htmlContents),
    storyConf = { ...state.storyConf };

    // Add all HTML files used in the story to the story folder
    if (htmlContents.length) {
        const htmlFolder = "story";

        // Create a folder for the html files
        zip.folder(htmlFolder);
        storyConf.htmlFolder = htmlFolder;

        for (const htmlContent of htmlContents) {
            const stepReference = htmlContent[0],
            images = state.htmlContentsImages[stepReference] || [],
            imageFolder = `${htmlFolder}/images`,
            [htmlAssociatedChapter, htmlStepNumber] = stepReference
            .split(".")
            .map(Number),
            htmlFilePath = `${htmlFolder}/${stepReference}.html`;
            let html = htmlContent[1];

            // Create a folder for the image files
            if (images.length) {
                zip.folder(imageFolder);
            }

            // Add image files
            for (const [imageIndex, image] of images.entries()) {
                const imageNumber = imageIndex + 1,
                imageFilePath = `${htmlFolder}/images/${stepReference}_${imageNumber}.${image.fileExtension}`;

                zip.file(
                    imageFilePath,
                    image.dataUrl.replace(/data:.+?base64,/, ""),
                    { base64: true }
                    );

                // Replace the image src in the HTML with a relative path to the image
                html = html.replace(image.dataUrl, `assets/${imageFilePath}`);
            }

            // Update HTML file name in the storyConf
            storyConf.steps = storyConf.steps.map(step => {
                if (
                    step.associatedChapter !== htmlAssociatedChapter ||
                    step.stepNumber !== htmlStepNumber
                    ) {
                    return step;
            }

            return { step, htmlFile: htmlFilePath };
        });

            // Add HTML file
            zip.file(htmlFilePath, html);
        }
    }

    // Add the story.json file with the configuration for the story
    zip.file("story.json", JSON.stringify(storyConf));

    zip.generateAsync({ type: "blob" }).then(content => {
        FileSaver.saveAs(content, "story.zip");
    });
}



//////// helper functions. Not sure where these kind of methods should be stored


// returns array with major and minor step "step_1-2" => ["1", "2"]
function parseStepReference(stepReference){
    var step = stepReference.split("_")[1].split("-");
    return(step)
}


function postStoryHtmlContent(htmlContent, storyID){
    var step = parseStepReference(htmlContent[0]);
    var query_url = 'http://' + constants.backendConfig.url + "add/step/"+storyID+"/"+step[0]+"/"+step[1];
    console.log("query_url:");
    console.log(query_url);
    console.log(htmlContent);
     axios.post(query_url, {
        html: htmlContent[1]
    });
    // .then((response)=> {
    //     console.log(response);
    // })
    // .then(

    //     );
}

function postStoryImage(image, storyID, step_major, step_minor){
    console.log("post story html!");
    console.log(constants.backendConfig.url);
    var query_url = 'http://' + constants.backendConfig.url + "add/step/"+storyID+"/"+step_major+"/"+step_minor+"/"+"image";

     axios.post(query_url, {
        image
    })
    .then((response)=> {
        console.log(response);
    })
    .then(

        )
}







/**
 * Collects all files needed for the created story and uploads them to the story backend
 *
 * @param {Object} context actions context object.
 * @returns {void}
 */
 function uploadStoryFiles({ state, commit }) {

    const htmlContents = Object.entries(state.htmlContents);
    const storyConf = { ...state.storyConf };

    //Step 0 - register story with backend
    
    var storyID;
    axios.post('http://' + constants.backendConfig.url + "add/story", {
        name: storyConf.name,
        category: storyConf.author,
        story_json: storyConf
    })

    // Steo 1 - get current storyID back from server
    .then((response)=> {
        // store story ID to state
        commit("setStoryConf", {
            ...state.storyConf,
            storyID: response.data.storyID
        });
        storyID = response.data.storyID;

    }).then(
    () => {console.log('ok')})

    // Step 3 - upload each step's html content
    .then(
           () => {
            for (const htmlContent of htmlContents) {
                postStoryHtmlContent(htmlContent,storyID);
            }
            
        }

        )

    // axios
    //     .get(add_story_query_url)
    //     // .then((response) => (storyList = response.data))
    //     // .then((response) => (console.log(response.data)))
    //     .then(
    //         // Step 1 - Register the story in the backend
    //         axios.post('http://' + constants.backendConfig.url + "add/story", {
    //             name: storyConf.name,
    //             category: storyConf.author,
    //             story_json: storyConf
    //         })
    //             .then(function (response) {
    //                 console.log(response);

    //             })
    //             .catch(function (error) {
    //                 console.log(error);
    //             })
    //     )



}


export default {
    saveHtmlContent,
    addStoryChapter,
    saveStoryStep,
    deleteStoryStep,
    downloadStoryFiles,
    uploadStoryFiles
};
