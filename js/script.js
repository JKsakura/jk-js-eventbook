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
    /*    FUNCTIONS TO MANAGE THE NOTE HEADER  */
    /* ============================================================== */
    // INITIAL NOTE BODY EVENTS
    var filterManager = (function () {
        return {
            goSearch: function () {
                $("#filter-search").keyup(function () {
                    var search = $(this).val().toUpperCase();
                    $(noteList).find(".list-item").each(function () {
                        if ($(this).html().toUpperCase().indexOf(search) > -1) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                });
            },
            iniCategory: function () {
                var defaultVal = '<option value="" disabled selected>Category</option>';
                var filterCategory = $("#filter-category").append(defaultVal, "<option value='all'>All</option>");
                for (var i = 0; i < category.length; i++) {
                    var newCategory = $("<option></option>").text(category[i]).val(category[i]).appendTo(filterCategory);
                }
            },
            goFilter: function () {
                $("#filter-category").change(function() {
                    var filterCategory = $(this).val();
                    $(noteList).find(".category").each(function () {
                        if( filterCategory === "all") {
                            $(noteList).find(".category").show();
                        } else if ($(this).find("p.list-group-item").html().toUpperCase() === filterCategory.toUpperCase()) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                });
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
                var itemId = "note" + note.id;

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

                $(noteList).find(".category-" + note.category).find("ul").append(listItem);
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
                    detailCategory = $(".detail-category").html(note.category),
                    detailIntroduction = $(".detail-introduction").html(note.introduction),
                    detailSyntax = $(".detail-syntax").addClass("code").html(note.syntax),
                    detailDescription = $(".detail-description").html(note.description);
                hljs.initHighlightingOnLoad();
                hljs.configure({ useBR: true });
                $('.code').each(function (i, block) {
                    hljs.highlightBlock(block);
                });
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
                    
                    if(location.hash) {
                        console.log();
                        noteManager.fetchDetail(location);
                        listToggle.hideList();
                        detailToggle.showDetail();
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

    noteHeader();
    noteBody();

    // LOAD DATA FROM JSON FILE
    dataManager.loadData();

    filterManager.goSearch();
    filterManager.goFilter();

    $(noteList).on("click", function (e) {
        var target = e.target;
        if( $(target).is("a") ) {
            e.preventDefault();
            noteManager.fetchDetail(target);
            listToggle.hideList();
            detailToggle.showDetail();
        } else if( $(target).is("p.list-group-item") ) {
            $(target).each(function() {
                $(this).next("ul").stop().slideToggle(300);
                $(this).stop().toggleClass("closed");
            });
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
            listClass = "category category-"+category[i];
            listTitle = $("<p class='list-group-item list-group-item-primary'></p>").text(category[i]);
            listCategory = $("<li></li>").addClass(listClass).data("category", category[i]).append(listTitle, "<ul></ul>");
            $("#note-list").append(listCategory);
        }
    }
    function noteHeader() {
        filterManager.iniCategory();
    }
});