jQuery(function ($) {
    // Declare Global Note Vars
    var noteID, notes;

    // Declare Global CKEditor WYSIWYG Fields
    var noteList = $("#note-list"),
        noteDetail = $("#note-detail-container"),
        category = ["array", "booleans", "date", "error"];

    /* ============================================================== */
    /*    VISUAL PART EVENTS  */
    /* ============================================================== */
    // TOGGLE FOR NOTE FORM
    var listToggle = (function () {
        var listContainer = $("#note-list-container");
        return {
            showList: function () {
                $(listContainer).removeClass("hide");
            },
            hideList: function () {
                $(listContainer).addClass("hide");
            },
            toggleList: function () {
                $(listContainer).toggleClass("hide");
            }
        };
    }());

    var detailToggle = (function () {
        var formContainer = $("#note-detail-container");
        return {
            showDetail: function () {
                $(formContainer).addClass("show");
            },
            hideDetail: function () {
                $(formContainer).removeClass("show");
            },
            toggleDetail: function () {
                $(formContainer).toggleClass("show");
            }
        };
    }());

    /* ============================================================== */
    /*    FUNCTIONS TO MANAGE THE NOTE LIST  */
    /* ============================================================== */
    var noteManager = (function () {
        return {
            // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
            displayNote: function (note) {
                // Define ID
                var itemId = "note" + note.id,
                    editId = "noteEdit" + note.id,
                    deleteId = "noteDelete" + note.id;

                // Define Classes
                var itemClass = "list-item list-group-item list-group-item-action",
                    headerClass = "item-header",
                    topClass = "item-top",
                    TitleClass = "item-title note-field-text",
                    categoryClass = "item-category note-field-select",
                    introductionClass = "item-introduction note-field-area";

                /* =========== Item Top ============ */
                // Item Header
                var itemTitle = $("<p></p>").addClass(TitleClass).text(note.title);
                var itemCategory = $("<h5></h5>").addClass(categoryClass).text(note.category);

                var itemHeader = $("<div></div>").addClass(headerClass).append(itemTitle, itemCategory);

                // Item Introduction
                var itemIntroduction = $("<p></p>").addClass(introductionClass).text(note.introduction);
                var itemTop = $("<div></div>").addClass(topClass).append(itemHeader, itemIntroduction);

                /* =========== List Item ============ */
                var listLink = $("<a></a>").attr("href", "#" + itemId).append(itemTop);
                var listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(listLink);

                if ($("#" + itemId).length > 0) {
                    $("#" + itemId).replaceWith(listItem);
                    $("#" + itemId).find(".item-btns").addClass("active");
                } else {
                    $(noteList).find(".category-" + note.category).find("ul").append(listItem);
                }
            },
            fetchDetail: function (target) {
                var id = target.hash.slice(5);
                var index = notes.map(function (element) {
                    return element.id.toString();
                }).indexOf(id);
                note = notes[index];
                noteManager.displayDetail(note);
            },
            displayDetail: function(note) {
                var detailTitle = $(".detail-title").html(note.title),
                    detailCategory = $(".detail-category").html(note.introduction),
                    detailIntroduction = $(".detail-introduction").html(note.introduction),
                    detailSyntax = $(".detail-syntax").html(note.syntax),
                    detailDescription = $(".detail-description").html(note.description);
            }
        };
    }());

    /* ============================================================== */
    /* FUNCTIONS TO LOAD AND SAVE JSON DATA */
    /* ============================================================== */
    var dataManager = (function () {
        return {
            loadData: function () {
                $.getJSON("notes.json")
                .done(function (data) {
                    notes = data.notes ? data.notes : [];
                    noteID = 0;
                    if (notes.length > 0) {
                        for (var i = 0; i < notes.length; i++) {
                            noteManager.displayNote(notes[i]);
                            if (notes[i].id >= noteID) { noteID = notes[i].id + 1; }
                        }
                    }
                })
                .fail(function (d, textStatus, error) {
                    console.error("getJSON failed, status: " + textStatus + ", error: " + error);
                })
                .always(function () {
                    console.log("complete");
                });
            }
        };
    }());

    noteBody();

    // LOAD DATA FROM JSON FILE
    dataManager.loadData();

    // INITIAL NOTE BODY EVENTS
    $(noteList).on("click", function (e) {
        var target = e.target;
        if( $(target).is("a") ) {
            e.preventDefault();
            noteManager.fetchDetail(target);
            listToggle.hideList();
            detailToggle.showDetail();
        }
    });

    $(noteDetail).on("click", function(e) {
        var target = e.target;
        if( $(target).hasClass("back-to-all") ) {
            e.preventDefault();
            detailToggle.hideDetail();
            listToggle.showList();
        }
    });
    /* ============================================================== */
    /*    EVENT FOR ALL NOTE HEADING BUTTONS */
    /* ============================================================== */
    function noteBody() {
        var listCategory,
            listClass,
            formCategory;
        for (var i = 0; i < category.length; i++) {
            listClass = "list-group category-" + category[i];
            listCategory = $("<li></li>").addClass(listClass).html("<h4 class=\"h4\">" + category[i] + "</h4>").append("<ul></ul>");
            $("#note-list").append(listCategory);
        }
    }
});