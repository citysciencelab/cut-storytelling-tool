# The layerSelector module

Module to configure interactions with the layertree and the map, executed on a defined event.

## Configuration of the module

|Name|Required|Type|Default|Description|
|----|--------|----|-------|-----------|
|events|yes|Object[]||Events to be executed from other modules to select or add layers in the layertree.|
|default|no|Object||Object to overwirte the missing parts in the events objects.|

**Example:**

```json
{
    "events": [
        {
            "event": "eventName",
            "deselectPreviousLayers": "always",
            "layerIds": ["1001"]
        },
        {
            "event": "eventName",
            "deselectPreviousLayers": "always",
            "layerIds": ["1000"],
            "extent": [550697, 5927004, 579383, 5941340],
        }
    ],
    "default": {
        "openFolderForLayerIds": [],
    }
}
```

***

### layerSelector.events

Array of Objects. In a single object, interactions with the layertree and the map can be configured. Those interactions are executed on a defined event.

|Name|Required|Type|Default|Description|
|----|--------|----|-------|-----------|
|event|yes|String||The name of the event that can trigger actions. For possible values and their meanings see the table below.|
|showLayerId|no|String||Layer ID of the layer to be shown in the layer tree. Opens the layer tree and extends all correspoding folders at the location of the defined layer. Only in destop mode.|
|layerIds|no|String[]||Layer IDs to select in the layer tree.|
|openFolderForLayerIds|no|String[]||List of Layer IDs to open their folders in the layer tree.|
|extent|no|Integer[]||Bounding Box to zoom to when this event is triggered.|
|deselectPreviousLayers|no|String|always|Deselects all selected layers if it has the value 'always'. For value 'none' nothing happens.|

**Example:**

```json
{
    "events": [{
        "event": "measure_geometry",
        "showLayerId": "1234",
        "layerIds": ["2345", "3456", "4567"],
        "openFolderForLayerIds": ["2345"],
        "extent": [550697, 5927004,579383, 5941340],
        "deselectPreviousLayers": "always",
    }]
}
```

***

**Values for event**

|event|Description|
|-----|-----------|
|comparefeatures_select|when a layer is selected for comparison in CompareFeatures module|
|fileimport_imported|when files were successfully imported in FileImport module|
|measure_geometry|when the selected geometry value changed in Measure module|


***

**Information for developer**

To add more events, just add an entry into the eventMap attribute in **[stateLayerSelector.js](src\modules\layerSelector\store\stateLayerSelector.js)**

***