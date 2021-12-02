>Use the remote interface.

[TOC]

# Remote interface

The remote interface allows programmatic interaction with the Masterportal. It gives access to all registered VueX actions and a set of dedicated additional functions.

## Generic remote interface to call VueX actions

|Name|Type|Explanation|
|-|-|-|
|namespace|String|Namespace of VueX module|
|action|String|Name of action to call on module|
|args|Object|Parameter object provided as payload to action|

### Example
Any VueX action may be called as follows:

```js
const myIframe = document.getElementById("my-iframe");
myIframe.contentWindow.postMessage({
    namespace: "Name/Space/Of/VueX/Store",
    action: "nameOfAction",
    args: {
        "param1": "value1",
        "paramX": "valueX"
    }
});
```

The remote interface will interpret the message given and produce the following call:

```js
store.dispatch(
    "Name/Space/Of/VueX/Store/nameOfAction",
    {
        "param1": "value1",
        "paramX": "valueX"
    },
    { root: true }
);
```

## Calling a dedicated function via remote interface

The singular key given to `.postMessage()`'s parameter object is to correspond to a function name. The value of this key must be an array and will be spread to be the call's parameters.

|Name|Type|Explanation|
|-|-|-|
|`${nameOfFunction}`|Array|Parameters to call `${nameOfFunction}` with|
|domain|String|Receiver window's domain|

### Example

A function may be called as follows:

```js
const myIframe = document.getElementById("my-iframe");
const nameOfFunction = "this should be the name of a function";
myIframe.contentWindow.postMessage(
    { [nameOfFunction]: ["param1", "param2", "paramX"] },
    domain
);
```

### List of dedicated functions

#### showPositionByExtent

A map marker will be placed at the center of the given extent, and the map's view will center on it.

|Name|Type|Explanation|
|-|-|-|
|showPositionByExtent|Array|extent; map marker will be set to its center|
|domain|String|receiver window's domain|

##### Example

```js
const myIframe = document.getElementById("my-iframe").contentWindow;
iframe.postMessage({
    "showPositionByExtent": [xMin, yMin, xMax, yMax]
}, domain);
```

#### showPositionByExtentNoScroll

A map marker will be placed at the center of the given extent. The map is **not** center to it, hence it may remain outside of the user's view.

|Name|Type|Explanation|
|-|-|-|
|showPositionByExtent|Array|extent; map marker will be set to its center|
|domain|String|receiver window's domain|

##### Example

```js
const myIframe = document.getElementById("my-iframe").contentWindow;
iframe.postMessage({
    "showPositionByExtentNoScroll": [xMin, yMin, xMax, yMax]
}, domain);
```
#### transactFeatureById

Modify a WFS-T layer's feature, triggering a server interaction.

|Name|Type|Explanation|
|-|-|-|
|transactFeaturesById|String|feature id|
|layerId|String|WFS-T layer id|
|attributes|String|JSON containing feature attributes|
|mode|String|name of the WFS-T operation that is to be executed; Currently only "update" is available|
|domain|String|receiver window's domain|

##### Example
```js
const myIframe = document.getElementById("my-iframe").contentWindow;
const id = "the id of the feature to modify";
iframe.postMessage({
    "transactFeatureById": id,
    "layerId": layerId,
    "attributes": attrs,
    "mode": "update"
}, domain);
```

#### zoomToExtent

The map's view will fit the given extent.

|Name|Type|Explanation|
|-|-|-|
|zoomToExtent|Array|extent|
|domain|String|receiver window's domain|

##### Example
```js
const myIframe = document.getElementById("my-iframe").contentWindow;
iframe.postMessage({
    "zoomToExtent": [xmin, ymin, xmax, ymax]
}, domain);
```

#### highlightfeature

Highlight a vector feature on the map.

|Name|Type|Explanation|
|-|-|-|
|highlightfeature|String|id of layer and feature as comma-separated string|
|domain|String|receiver window's domain|

##### Example

```js
const myIframe = document.getElementById("my-iframe").contentWindow;
iframe.postMessage({
    "highlightfeature": "layerid,featureId"
}, domain);
```

#### hidePosition

Hide the map marker.

|Name|Type|Explanation|
|-|-|-|
|hidePosition|String|used standalone (not in object)|
|domain|String|receiver window's domain|

##### Example

```js
const myIframe = document.getElementById("my-iframe").contentWindow;
iframe.postMessage("hidePosition", domain);
```

## Generic remote interface for `Backbone.Radio` (deprecated)

The functions registered to the `Backbone.Radio` element may also be used via `postMessage()`. They are called by channel and function name.

> Please mind that the usage of Backbone.Radio itself is currently deprecated. Backbone will eventually be removed.

|Name|Type|Explanation|
|----|---|------------|
|radio_channel|String|radio channel to target|
|radio_function|String|radio channel function to call|
|radio_para_object|Object|optional parameter object forwarded to the called function|
|domain|String|receiver window's domain|

### Example
```js
const myIframe = document.getElementById("my-iframe").contentWindow;
iframe.postMessage({
    "radio_channel": "MyRadioChannel",
    "radio_function": "myRequestedFunction",
    "radio_para_object": {
        "param1": "param1",
        "paramX": "paramX"
    }
}, domain);
```

This will construct and execute the following call.

```js
Radio.request(
    "MyRadioChannel",
    "myRequestedFunction",
    {
        "param1": "param1",
        "paramX": "paramX"
    }
);
```

## Masterportal communication to the parent window

Previously the *top-down* communication (parent to Masterportal) has been shown. The Masterportal may also communicate in the opposite direction.

|Name|Type|Explanation|
|-|-|-|
|params|Object|parameter object sent to parent window|

### Examples

```js
// From a Vue component
this.$remoteInterface.sendMessage({
    "param1": "param1",
    "paramX": "paramX"
});
```

```js
// From a VueX action
this._vm.$remoteInterface.sendMessage({
    "param1": "param1",
    "paramX": "paramX"
});
```

The remote interface translates both to the following call:

```js
parent.postMessage({
    "param1": "param1",
    "paramX": "paramX"
}, options.postMessageUrl);
```

## Masterportal communication to the parent window via `Backbone.Radio` (deprecated)

> Please mind that the usage of Backbone.Radio itself is currently deprecated. Backbone will eventually be removed.

|Name|Type|Explanation|
|-|-|-|
|params|Object|parameter object sent to parent window|

### Example

```js
Radio.trigger(
    "RemoteInterface",
    "postMessage", {
        "param1": "param1",
        "paramX": "paramX"
    }
);
```

## Tutorial: Integration of the master portal into an iframe
The following tutorial shows how to use the masterportal remote interface within an iFrame.

### The first step
Configure the remoteInterface in the config.js of a portal. This entry is necessary to open the interface to the outside of the portal.

```js
const Config = {
...
    remoteInterface: {
        postMessageUrl: "https://localhost:9001"
    },
...
}
```

### The second step
Configure the input map and in it the target projection in the config.js of the same portals as the first step. Coordinates will be translated to it before being communicated via remoteInterface.

```js
const Config = {
...
    inputMap: {
        targetProjection: "EPSG:4326"
    },
...
}
```

### The third step
Create an html-file and add the follow content. In it, an iframe is created in which the portal `https://localhost:9001/portal/master` is loaded. Then 3 buttons are created and a click event is assigned to each.

Note: The html-file must be stored in a path that is accessible via the localhost.

The example can also be called directly here with a running server:  **[iframe Example](https://localhost:9001/doc/remoteInterface/iframeExample.html)**.
To do this, the following must be added to `portal/master/config.js`

```js
remoteInterface: {
    postMessageUrl: "http://localhost:8080"
},
```

Example of an iframe:
```html
<!DOCTYPE html>
<html style="height:100%">
<body style="height:100%">

<style>
    html, body { height:100%; }
    button { width: 50px; }
</style>

<!-- Create a iframe with the portal master as source. -->
<iframe
    id="iframe"
    src="https://localhost:9001/portal/master"
    width="100%"
    height="85%"
    name="SELFHTML_in_a_box"
></iframe>

<!-- Createthree buttons. -->
<button id="b1">1</button>
<button id="b2">2</button>
<button id="b3">3</button>

</body>

<script>
    // Gets the elements from dom.
    const iframe1 = document.getElementById("iframe"),
        b1 = document.getElementById("b1"),
        b2 = document.getElementById("b2"),
        b3 = document.getElementById("b3");

    // Sets the screen back to the start scale
    b1.addEventListener("click", event => {
        iframe1.contentWindow.postMessage({
            radio_channel: "RemoteInterface",
            radio_function: "resetView",
            radio_para_object: {}
        });
    });

    // Outputs a message with the message "foo".
    b2.addEventListener("click", event => {
        iframe1.contentWindow.postMessage({
            namespace: "Alerting",
            action: "addSingleAlert",
            args: {content: "foo"}
        });
    });

    // Starts a draw event. A polygon can be drawn on the map with the mouse.
    b3.addEventListener("click", event => {
        iframe1.contentWindow.postMessage({
            namespace: "Tools/Draw",
            action: "initializeWithoutGUI",
            args: {"drawType": "Polygon", "color": [127,255,0,0.5], "opacity": 0.5, "maxFeatures": null, "initialJSON": null}
        });
    });

    // Logs the message event.
    window.addEventListener("message", function (messageEvent) {
        console.log(messageEvent);
        if (messageEvent.data === "portalReady") {
            Radio.request("RemoteInterface", "getZoomLevel");
        }
    }, false);

</script>

</html>

```
