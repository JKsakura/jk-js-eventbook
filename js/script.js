jQuery(function ($) {
    // Declare Global Note Vars
    var noteID, notes;
    var noteList = $("#note-list"),
        noteDetail = $("#note-detail-container"),
        categories = ["array", "booleans", "date", "error", "global"],
        cache = [];

    /* ============================================================== */
    /*    VISUAL PART EVENTS  */
    /* ============================================================== */
    // TOGGLE FOR APP HEADER
    var headerToggle =(function() {
        var header = $("#header");
        var menu = $("#main-menu");
        var toggle = $("#menu-toggle");
        return {
            menuToggle: function() {
                $(toggle).on("click", function () {
                    $(header).toggleClass("open");
                });
            }
        };
    }());
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
                $("#filter-search").on("input", function () {
                    var search = $(this).val().trim().toUpperCase();
                    cache.forEach( function(note){
                        note.element.hide();
                        if (
                             note.title.trim().toUpperCase().indexOf(search) > -1 
                          || note.category.trim().toUpperCase().indexOf(search) > -1
                          || note.introduction.trim().toUpperCase().indexOf(search) > -1
                          || note.syntax.trim().toUpperCase().indexOf(search) > -1
                          || note.description.trim().toUpperCase().indexOf(search) > -1
                        ) {
                            $(note.element).show();
                        }
                    });
                    $(noteList).find("p.list-group-item").each(function () {
                        $(this).hide();
                        if ($(this).html().toUpperCase().indexOf(search) > -1) {
                            $(this).show();
                        }
                    });
                });
            },
            iniCategory: function () {
                var defaultVal = '<option value="" disabled selected>Category</option>';
                var filterCategory = $("#filter-category").append(defaultVal, "<option value='all'>All</option>");
                categories.forEach(function(category) {
                    var newCategory = $("<option></option>").text(category).val(category).appendTo(filterCategory);
                });
            },
            goFilter: function () {
                $("#filter-category").change(function() {
                    var filterCategory = $(this).val().trim().toUpperCase();
                    $(noteList).find(".category").hide();
                    $(noteList).find(".category").each(function () {
                        if( filterCategory === "ALL") {
                            $(noteList).find(".category").show();
                        } else if ($(this).find("p.list-group-item").text().trim().toUpperCase() === filterCategory.toUpperCase()) {
                            $(this).show();
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
                cache.push({ // Add an object to the cache array
                  element: listItem, // This row
                  title: note.title,
                  category: note.category,
                  introduction: note.introduction,
                  syntax: note.syntax,
                  description: note.description
                });
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
                        notes.forEach(function(note) {
                            noteManager.displayNote(note);
                            if (note.id >= noteID) { noteID = note.id + 1; }
                        });
                    }
                    if(location.hash) {
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

    // INITIAL HEADER FILTER
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
    function noteHeader() {
        headerToggle.menuToggle();
        filterManager.iniCategory();
    }
    function noteBody() {
        var listCategory,
            listClass,
            formCategory;
        categories.forEach(function(category){
            listClass = "category category-"+category;
            listTitle = $("<p class='list-group-item'></p>").text(category);
            listCategory = $("<li></li>").addClass(listClass).data("category", category).append(listTitle, "<ul></ul>");
            $("#note-list").append(listCategory); 
        });
    }
});