define("app", ["jquery", "backbone.radio", "modules/restReader/collection"], function ($, Radio, RestReaderList) {
    "use strict";
    var channel = Radio.channel("RestReader");
    new RestReaderList();

    channel.on({
        "isReady": function () {
            require(["idaModules/0_checkURL/model"]);
        }
    }, this);
});