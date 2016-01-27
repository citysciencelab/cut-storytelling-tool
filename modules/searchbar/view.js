define([
    "backbone",
    "text!modules/searchbar/template.html",
    "text!modules/searchbar/templateRecommendedList.html",
    "text!modules/searchbar/templateHitList.html",
    "modules/searchbar/model",
    "eventbus"
    ], function (Backbone, SearchbarTemplate, SearchbarRecommendedListTemplate, SearchbarHitListTemplate, Searchbar, EventBus) {
    "use strict";
    return Backbone.View.extend({
        model: Searchbar,
        id: "searchbar", // wird ignoriert, bei renderToDOM
        className: "navbar-form col-xs-9", // wird ignoriert, bei renderToDOM
        template: _.template(SearchbarTemplate),
        /**
        * @description View der Searchbar
        * @param {Object} config - Das Konfigurationsobjekt der Searchbar
        * @param {Object} [config.gazetteer] - Das Konfigurationsobjekt der Gazetteersuche.
        * @param {Object} [config.specialWFS] - Das Konfigurationsobjekt der speziellen WFS.
        * @param {Object} [config.visibleWFS] - Das Konfigurationsobjekt sichtbaren WFS Suche.
        * @param {Object} [config.bkg] - Das Konfigurationsobjekt der BKG Suggest Suche.
        * @param {Object} [config.tree] - Das Konfigurationsobjekt der Suche im Tree.
        * @param {string} [config.renderToDOM=searchbar] - Die id des DOM-Elements, in das die Searchbar geladen wird.
        * @param {string} [config.recommandedListLength=5] - Die Länge der Vorschlagsliste.
        * @param {boolean} [config.quickHelp=false] - Gibt an, ob die quickHelp-Buttons angezeigt werden sollen.
        * @param {string} [config.placeholder=Suche] - Placeholder-Value der Searchbar.
        * @param {string} [initialQuery] - Initiale Suche.
        */
        initialize: function (config, querySearchString) {
            if (config.renderToDOM) {
                this.setElement(config.renderToDOM);
            }
            if (config.recommandedListLength) {
                this.model.set("recommandedListLength", config.recommandedListLength);
            }
            if (config.placeholder) {
                this.model.set("placeholder", config.placeholder);
            }
            this.className = "navbar-form col-xs-9";
            this.model.set("querySearchString", querySearchString);

            EventBus.on("searchInput:setFocus", this.setFocus, this);
            EventBus.on("searchInput:deleteSearchString", this.deleteSearchString, this);

            // this.listenTo(this.model, "change:searchString", this.render);
            this.listenTo(this.model, "change:recommendedList", function () {
                this.renderRecommendedList();
            });

            this.render();
            $(window).on("orientationchange", function () {
                this.render();
            }, this);
            if (navigator.appVersion.indexOf("MSIE 9.") !== -1) {
                $("#searchInput").val(this.model.get("placeholder"));
            }
            $("#searchInput").blur();
            // bedarfsweises Laden der Suchalgorythmen
            if (_.has(config, "gazetteer") === true) {
                require(["modules/searchbar/gaz/model"], function (GAZModel) {
                    new GAZModel(config.gazetteer, querySearchString);
                });
            }
            if (_.has(config, "specialWFS") === true) {
                require(["modules/searchbar/specialWFS/model"], function (SpecialWFSModel) {
                    new SpecialWFSModel(config.specialWFS, querySearchString);
                });
            }
            if (_.has(config, "visibleWFS") === true) {
                require(["modules/searchbar/visibleWFS/model"], function (VisibleWFSModel) {
                    new VisibleWFSModel(config.visibleWFS);
                });
            }
            if (_.has(config, "bkg") === true) {
                require(["modules/searchbar/bkg/model"], function (BKGModel) {
                    new BKGModel(config.bkg);
                });
            }
            if (_.has(config, "tree") === true) {
                require(["modules/searchbar/tree/model"], function (TreeModel) {
                    new TreeModel(config.tree);
                });
            }
        },
        events: {
            "keyup input": "setSearchString",
            "focusin input": "toggleStyleForRemoveIcon",
            "focusout input": "toggleStyleForRemoveIcon",
            "click .form-control-feedback": "deleteSearchString",
            "click .btn-search": "renderHitList",
            "click .list-group-item.hit": "hitSelected",
            "click .list-group-item.results": "renderHitList",
            "mouseover .list-group-item.hit": "showMarker",
            "mouseleave .list-group-item.hit": "hideMarker",
            "click .list-group-item.type": "collapseHits",
            "click .btn-search-question": function () {
                EventBus.trigger("showWindowHelp", "search");
            },
            "keydown": "navigateList"
        },
        /**
        *
        */
        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            if (window.innerWidth < 768) {
                $(".navbar-toggle").before(this.$el); // vor dem toggleButton
            }
            else {
                $(".navbar-collapse").append(this.$el); // rechts in der Menuebar
            }
            this.focusOnEnd($("#searchInput"));
            if (this.model.get("searchString").length !== 0) {
                $("#searchInput:focus").css("border-right-width", "0");
            }
        },
        /**
        * @description Methode, um den Searchstring über den Eventbus zu steuern ohne Event auszulösen
        * @param {string} searchstring - Der einzufügende Searchstring
        */
        setSearchbarString: function (searchstring) {
            $("#searchInput").val(searchstring);
        },
        /**
        * @description Verbirgt die Menubar
        */
        hideMenu: function () {
            $(".dropdown-menu-search").hide();
        },
        /**
        *
        */
        renderRecommendedList: function () {
            // if (this.model.get("isHitListReady") === true) {
                var attr = this.model.toJSON(),
                    // sz, will in lokaler Umgebung nicht funktionieren, daher erst das Template als Variable
                    // $("ul.dropdown-menu-search").html(_.template(SearchbarRecommendedListTemplate, attr));
                    template = _.template(SearchbarRecommendedListTemplate);

                $("ul.dropdown-menu-search").html(template(attr));
            // }
            // Wird gerufen
            if (this.model.get("querySearchString") !== undefined && this.model.get("hitList").length === 1) { // workaround für die initiale Suche von B-Plänen
                this.hitSelected();
                this.model.unset("querySearchString", true);
            }
        },
        /**
        *
        */
        renderHitList: function () {
            // if (this.model.get("isHitListReady") === true) {
                if (this.model.get("hitList").length === 1) {
                    this.hitSelected(); // erster und einziger Eintrag in Liste
                }
                else {
                    this.model.set("typeList", _.uniq(_.pluck(this.model.get("hitList"), "type")));
                    var attr = this.model.toJSON(),
                    // sz, will in lokaler Umgebung nicht funktionieren, daher erst das Template als Variable
                    // $("ul.dropdown-menu-search").html(_.template(SearchbarHitListTemplate, attr));
                        template = _.template(SearchbarHitListTemplate);

                    $("ul.dropdown-menu-search").html(template(attr));
                }
            // }
        },
        /*
         * Methode, um den Focus über den EventBus in SearchInput zu legen
         */
        setFocus: function () {
            $("#searchInput").focus();
        },
        /**
        * Wird ausgeführt, wenn ein Eintrag ausgewählt oder bestätigt wurde.
        */
        hitSelected: function (evt) {
            var hit;

            // Ermittle Hit
            if (_.has(evt, "cid")) { // in diesem Fall ist evt = model
                hit = _.values(_.pick(this.model.get("hitList"), "0"))[0];
            }
            else if (_.has(evt, "currentTarget") === true && evt.currentTarget.id) {
                var hitID = evt.currentTarget.id;

                hit = _.findWhere(this.model.get("hitList"), {id: hitID});
            }
            else {
                hit = this.model.get("hitList")[0];
            }
            // 1. Schreibe Text in Searchbar
            if (_.has(hit, "model") && hit.model.get("type") === "nodeLayer") {
                this.setSearchbarString(hit.metaName);
            }
            else {
                this.setSearchbarString(hit.name);
            }
            // 2. Verberge Suchmenü
            this.hideMenu();
            // 3. Zoome ggf. auf Ergebnis
            EventBus.trigger("mapHandler:zoomTo", hit);
            // 4. Triggere Treffer über Eventbus
            EventBus.trigger("searchbar:hit", hit);
            // 5. Beende Event
            evt.stopPropagation();
        },
        navigateList: function () {

            var selector = "#searchInputUL ",

            selected = this.selectedElement(selector),

            firstListElement = this.firstElement(selector);

            if (selected.length === 0) {
                firstListElement.addClass("selected");
            }
            else {
                // uparrow
                if (event.keyCode === 38) {
                      this.prevElement(selected);
                }
                // down arrow
                if (event.keyCode === 40) {
                    this.nextElement(selected);
                }
                if (event.keyCode === 13) {
                    selected.click();
                }
            }
        },
        selectedElement: function (selector) {
            return this.$el.find(selector + " .selected");
        },

        clearSelection: function () {
            this.selectedElement("#searchInputUL").removeClass("selected");
        },

        isFirstChildelement: function (element) {
            return (element.parent().prev().hasClass("type") && element.is(":first-child"));
        },

        isLastChildelement: function (element) {
            return (element.parent().prev().hasClass("type") && element.is(":last-child"));
        },

        firstChildElement: function (selected) {
            return selected.next().children().first();
        },
      /*  // Berechnet ob das element im sichtbaren ausschnitt ist
        isElementVisible: function (element) {
           var viewport = {};
            viewport.top = 0; // element.parent().scrollTop();
            viewport.bottom = element.parent().height(); // + viewport.top
            var bounds = {};
            // Das oberste Element fängt nicht bei null an warum ist nicht klar.
            bounds.top = element.position().top - element.innerHeight();
            bounds.bottom = bounds.top + element.outerHeight();
            return ((bounds.bottom <= viewport.bottom) && (bounds.top >= viewport.top));
        },*/
        isFolderElement: function (element) {
            return element.hasClass("type");
        },

        scrollToNext: function (li) {
            var parent = li.parent(),
            pos = parent.scrollTop(),
            scrollHeight = pos + li.outerHeight(true);

            parent.scrollTop(scrollHeight);
        },
        scrollToPrev: function (li) {
            var parent = li.parent(),
            pos = parent.scrollTop(),
            scrollHeight = pos - li.outerHeight(true);

            parent.scrollTop(scrollHeight);
        },
        resetScroll: function (element) {
            element.scrollTop(0);
        },

        nextElement: function (selected) {
            selected.removeClass("selected");
            var next = {};

            if (this.isFolderElement(selected) && selected.hasClass("open")) {
                next = this.firstChildElement(selected);
                this.resetScroll(selected.nextAll("div:first"));
            }
            else {
                if (this.isLastChildelement(selected)) {
                    if (selected.parent().is(":last")) {
                       selected.addClass("selected");
                    }
                    else {
                        next = selected.parent().nextAll("li:first");
                    }
                }
                else {
                    // $.next() funktioniert hier nicht wg der Div zwischen den li
                    next = selected.nextAll("li:first");

                    this.scrollToNext(selected);
                }
            }
            next.addClass("selected");

        },

        prevElement: function (selected) {
            selected.removeClass("selected");
            var prev = {};

            if (this.isFirstChildelement(selected)) {
                prev = selected.parent().prevAll("li:first");
                this.resetScroll(selected.parent());
            }
            else {
                prev = selected.prevAll("li:first");
                if (this.isFolderElement(selected)) {
                    this.resetScroll(selected.prevAll("div:first"));
                }
                else {
                    this.scrollToPrev(selected);
                }
            }
            prev.addClass("selected");
        },
        firstElement: function (selector) {
            return this.$el.find(selector + " li").first();
        },
        lastElement: function (selector) {
            return this.$el.find(selector).last();
        },


        /**
        *
        */
        setSearchString: function (evt) {
            if (evt.keyCode !== 37 && evt.keyCode !== 38 && evt.keyCode !== 39 && evt.keyCode !== 40 && !(this.selectedElement("#searchInputUL").length > 0 && this.selectedElement("#searchInputUL").hasClass("type"))) {
                if (evt.key === "Enter" || evt.keyCode === 13) {
                    if (this.model.get("hitList").length === 1) {
                        this.hitSelected(); // erster und einziger Eintrag in Liste
                    }
                    else {
                        this.renderHitList();
                    }
                }
                else {
                    this.model.setSearchString(evt.target.value); // evt.target.value = Wert aus der Suchmaske
                }
            }
            if (evt.target.value.length > 0) {
                $("#searchInput + span").show();
            }
            else {
                $("#searchInput + span").hide();
            }
        },
        /**
        *
        */
        collapseHits: function (evt) {
            $(".list-group-item.type + div").hide("slow"); // schließt alle Reiter
            if ($(evt.currentTarget.nextElementSibling).css("display") === "block") {
                $(evt.currentTarget.nextElementSibling).hide("slow");
                $(evt.currentTarget).removeClass("open");
            }
            else {
                $(evt.currentTarget.nextElementSibling).show("slow");
                $(evt.currentTarget).addClass("open");
            }
        },
        /**
        *
        */
        toggleStyleForRemoveIcon: function (evt) {
            if (evt.type === "focusin") {
                if (navigator.appVersion.indexOf("MSIE 9.") !== -1) {
                    if ($("#searchInput").val() === this.model.get("placeholder")) {
                        $("#searchInput").val("");
                    }
                }
                $(".btn-deleteSearch").css("border-color", "#66afe9");
            }
            else if (evt.type === "focusout") {
                if (navigator.appVersion.indexOf("MSIE 9.") !== -1) {
                    if ($("#searchInput").val() === "") {
                        $("#searchInput").val(this.model.get("placeholder"));
                    }
                }
                $(".btn-deleteSearch").css("border-color", "#cccccc");
            }
        },
        /**
        *
        */
        deleteSearchString: function () {
            this.model.setSearchString("");
            $("#searchInput").val("");
            $("#searchInput + span").hide();
            this.focusOnEnd($("#searchInput"));
            this.hideMarker();
            EventBus.trigger("mapHandler:clearMarker", this);
            this.clearSelection();
        },
        /**
        *
        */
        showMarker: function (evt) {
            var hitID = evt.currentTarget.id,
                hit = _.findWhere(this.model.get("hitList"), {id: hitID});

            if (hit.type === "Adresse" || hit.type === "Stadtteil" || hit.type === "Olympiastandort" || hit.type === "Paralympiastandort") {
                EventBus.trigger("mapHandler:showMarker", hit.coordinate);
            }
        },
        /**
        *
        */
        hideMarker: function () {
            if ($(".dropdown-menu-search").css("display") === "block") {
                EventBus.trigger("mapHandler:hideMarker", this);
            }
        },

        /**
        * Platziert den Cursor am Ende vom String
        * @param {Element} element - Das Dom-Element
        */
        focusOnEnd: function (element) {
            var strLength = element.val().length * 2;

            element.focus();
            element[0].setSelectionRange(strLength, strLength);
        },
        showHelpWindow: function () {
            EventBus.trigger("showWindowHelp", "search");
        }
    });
});
