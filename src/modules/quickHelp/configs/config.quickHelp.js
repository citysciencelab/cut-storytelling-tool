const configQuickHelp = {
    search: {
        title: "common:modules.quickHelp.search.title",
        content: {
            generalInfo: {
                title: "common:modules.quickHelp.search.generalInfo",
                list: [
                    {
                        text: "common:modules.quickHelp.search.generalInfoHelp1",
                        type: "text/html"
                    },
                    {
                        imgName: "allgemein.png",
                        imgKey: "searchbarAllgemeines1"
                    },
                    {
                        text: "common:modules.quickHelp.search.generalInfoHelp2",
                        type: "text/html"
                    },
                    {
                        imgName: "allgemein_2.png",
                        imgKey: "searchbarAllgemeines2"
                    },
                    {
                        imgName: "allgemein_3.png",
                        imgKey: "searchbarAllgemeines3"
                    }
                ]
            },
            addressSearch: {
                title: "common:modules.quickHelp.search.addressSearch",
                list: [
                    {
                        text: "common:modules.quickHelp.search.addressHelp",
                        type: "text/plain"
                    }
                ]
            },
            houseNumberHelp: {
                title: "common:modules.quickHelp.search.houseNumberSearch",
                list: [
                    {
                        text: "common:modules.quickHelp.search.houseNumberHelp",
                        type: "text/plain"
                    }
                ]
            },
            topicSearchHelp: {
                title: "common:modules.quickHelp.search.topicsSearch",
                list: [
                    {
                        text: "common:modules.quickHelp.search.topicsHelp",
                        type: "text/plain"
                    }
                ]
            },
            parcelSearch: {
                title: "common:modules.quickHelp.search.parcelSearch",
                list: [
                    {
                        text: "common:modules.quickHelp.search.parcelHelp",
                        type: "text/html"
                    },
                    {
                        imgName: "allgemein_4.png",
                        imgKey: "searchbarFlurstueckssuche"
                    }
                ]
            }
        }
    },
    tree: {
        title: "common:modules.quickHelp.topicTree.title",
        content: {
            generalInfo: {
                title: "common:modules.quickHelp.search.generalInfo",
                list: [
                    {
                        text: "common:modules.quickHelp.topicTree.topicsHelp1",
                        type: "text/html"
                    }
                ]
            },
            topics: {
                title: "common:modules.quickHelp.topicTree.topics",
                list: [
                    {
                        text: "common:modules.quickHelp.topicTree.topicsHelp2",
                        type: "text/html"
                    },
                    "themen.png",
                    {
                        text: "common:modules.quickHelp.topicTree.topicsHelp3",
                        type: "text/html",
                        interpolation: {iconCls: "glyphicon glyphicon-info-sign"}
                    },
                    "themen_2.png",
                    {
                        text: "common:modules.quickHelp.topicTree.topicsHelp4",
                        type: "text/html"
                    }
                ]
            },
            selection: {
                title: "common:modules.quickHelp.topicTree.selection",
                list: [
                    {
                        text: "common:modules.quickHelp.topicTree.topicsHelp3",
                        type: "text/html",
                        interpolation: {iconCls: "glyphicon glyphicon-cog rotate"}
                    }
                ]
            },
            saveSelection: {
                title: "common:modules.quickHelp.topicTree.saveSelection",
                list: [
                    "common:modules.quickHelp.topicTree.topicsHelp6"
                ]
            }
        }
    }
};

export default configQuickHelp;
