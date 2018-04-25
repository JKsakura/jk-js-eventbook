jQuery(function ($) {
    // Declare Global Note Vars
    var noteID, notes;
    var categoryList = $("#category-list"),
        noteList = $("#note-list"),
        categories = [
            {
                slug: 'javascript',
                name: 'JavaScript',
                children: [
                    {
                        slug: 'array',
                        name: 'Array'
                    },
                    {
                        slug: 'booleans',
                        name: 'Booleans'
                    },
                    {
                        slug: 'date',
                        name: 'Date'
                    },
                    {
                        slug: 'error',
                        name: 'Error'
                    },
                    {
                        slug: 'global',
                        name: 'Global'
                    }
                ]
            },
            {
                slug: 'html-dom',
                name: 'HTML DOM',
                children: [
                    {
                        slug: 'attribute',
                        name: 'Attribute'
                    },
                    {
                        slug: 'console',
                        name: 'Console'
                    },
                    {
                        slug: 'document',
                        name: 'Document'
                    },
                    {
                        slug: 'element',
                        name: 'Element'
                    },
                    {
                        slug: 'events',
                        name: 'Events'
                    }
                ]
            },
            {
                slug: 'html-objects',
                name: 'HTML Objects',
                children: [
                    {
                        slug: 'anchor',
                        name: 'Anchor'
                    },
                    {
                        slug: 'abbreviation',
                        name: 'Abbreviation'
                    },
                    {
                        slug: 'address',
                        name: 'Address'
                    },
                    {
                        slug: 'area',
                        name: 'Area'
                    },
                    {
                        slug: 'article',
                        name: 'Article'
                    }
                ]
            },
            {
                slug: 'other-objects',
                name: 'Other Objects',
                children: [
                    {
                        slug: 'css-style-declaration',
                        name: 'CSSStyleDeclaration'
                    },
                    {
                        slug: 'type-conversion',
                        name: 'Type Conversion'
                    },
                    {
                        slug: 'storage',
                        name: 'Storage'
                    }
                ]
            }
        ],
        cache = [];

/* ============================================================== */
/*    EVENT FOR ALL NOTE HEADING BUTTONS */
/* ============================================================== */
    var DOMManager = {
        noteHeader: function () {
            headerToggle.menuToggle();
            filterManager.iniCategory();
        },

        noteBody: function () {
            categoryManager.displayCategory();
        }
    };
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE HEADER  */
/* ============================================================== */
    // INITIAL NOTE BODY EVENTS
    var filterManager = {
        goSearch: function () {
            $(".filter-search").on("input", function () {
                var search = $(this).val().trim().toUpperCase();
                cache.forEach( function(note){
                    note.element.hide();
                    if (
                            note.title.trim().toUpperCase().indexOf(search) > -1 || 
                            note.category.trim().toUpperCase().indexOf(search) > -1 || 
                            note.introduction.trim().toUpperCase().indexOf(search) > -1 || 
                            note.syntax.trim().toUpperCase().indexOf(search) > -1 || 
                            note.description.trim().toUpperCase().indexOf(search) > -1
                    ) {
                        $(note.element).show();
                    }
                });
                $(categoryList).find("p.list-group-item").each(function () {
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
                var newCategory = $("<option></option>").text(category.name).val(category.slug).appendTo(filterCategory);
            });
        },
        goFilter: function () {
            $("#filter-category").change(function() {
                var filterCategory = $(this).val();
                $(categoryList).find(".category").hide();
                $(categoryList).find(".category").each(function () {
                    if( filterCategory === "all") {
                        $(categoryList).find(".category").show();
                    } else if ($(this).data('category') === filterCategory) {
                        $(this).show();
                    }
                });
            });
        }
    };

/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE CATEGORY LIST  */
/* ============================================================== */
    var categoryManager = {
        displayCategory: function() {
            var listCategory,
                listClass;
            categories.forEach(function (category) {
                listClass = "category";
                listTitle = $("<p class='list-group-item'></p>").text(category.name);
                listCategory = $("<li></li>").addClass(listClass).data('category', category.slug).append(listTitle, "<ul></ul>");
                category.children.forEach(function (subcategory) {
                    var itemClass = "list-item list-group-item list-group-item-action",
                        linkClass = "list-trigger";
                    var listLink = $("<a></a>").attr("href", "#" + category.slug + '&' + subcategory.slug).text(subcategory.name).addClass(linkClass).append(subcategory);
                    var listItem = $("<li></li>").attr("id", subcategory.slug).addClass(itemClass).append(listLink);
                    $(listCategory).append(listItem);
                });
                $(categoryList).append(listCategory);
            });
        }
    };
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    var noteManager = {
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
                introductionClass = "item-introduction note-field-area",
                linkClass = "detail-trigger";

            /* =========== Item Top ============ */
            // Item Header
            var itemTitle = $("<p></p>").addClass(TitleClass).text(note.title);
            var itemCategory = $("<h5></h5>").addClass(categoryClass).text(note.category);

            var itemHeader = $("<div></div>").addClass(headerClass).append(itemTitle, itemCategory);

            // Item Introduction
            var itemIntroduction = $("<p></p>").addClass(introductionClass).text(note.introduction);
            var itemTop = $("<div></div>").addClass(topClass).append(itemHeader, itemIntroduction);

            /* =========== List Item ============ */
            var listLink = $("<a></a>").attr("href", "#" + itemId).addClass(linkClass).append(itemTop);
            var listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(listLink);

            //$(noteList).find(".category-" + note.category).find("ul").append(listItem);
            cache.push({ // Add an object to the cache array
                element: listItem, // This row
                title: note.title,
                category: note.category,
                subcategory: note.subcategory,
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

/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */
/* ============================================================== */
    var dataManager = {
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
                    pageToggle.pageForward(".page1", ".page2");
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

    function pageManager() {
        $(".page").each(function () {
            var page = this;
            var page1 = $(".page1");
            $(this).on("click", function (e) {
                var target = e.target;
                if ($(target).is(".detail-trigger")) {
                    e.preventDefault();
                    noteManager.fetchDetail(target);
                    pageToggle.pageForward(".page1", ".page2");
                }
                if ($(target).is("p.list-group-item")) {
                    $(target).each(function () {
                        $(this).next("ul").stop().slideToggle(300);
                        $(this).stop().toggleClass("closed");
                    });
                }
                if ($(target).is(".back-to-all")) {
                    e.preventDefault();
                    pageToggle.pageBackward(".page1", ".page2");
                }
                if ($(target).is('.list-trigger')) {
                    e.preventDefault();
                    var current = target.hash.slice(1).split('&');
                    currentCat = current[0];
                    currentSub = current[1];
                    $(categoryList).hide();
                    $(noteList).show();
                    console.log(cache);
                    cache.forEach(function (note) {
                        console.log(note);
                        if (categories[note.category].slug === currentCat) {
                            console.log('works');
                            $(noteList).append(cache.element);
                        }
                    });
                }
            });
        });
    }
    
    DOMManager.noteHeader();
    DOMManager.noteBody();

    // LOAD DATA FROM JSON FILE
    dataManager.loadData();

    // INITIAL HEADER FILTER
    filterManager.goSearch();
    filterManager.goFilter();

    pageManager();
});