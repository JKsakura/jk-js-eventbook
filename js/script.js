jQuery(function ($) {
    // Declare Global Note Vars
    var noteID, notes;
    var categoryList = $("#category-list"),
        noteList = $("#note-list"),
        categories = [
            {
                id: 0,
                slug: 'javascript',
                name: 'JavaScript',
                children: [4, 5, 6, 7, 8],
                notes: []
            },
            {
                id: 1,
                slug: 'html-dom',
                name: 'HTML DOM',
                children: [9, 10, 11, 12],
                notes: []
            },
            {
                id: 2,
                slug: 'html-objects',
                name: 'HTML Objects',
                children: [13, 14, 15, 16],
                notes: []
            },
            {
                id: 3,
                slug: 'other-objects',
                name: 'Other Objects',
                children: [17, 18, 19],
                notes: []
            },
            {
                id: 4,
                slug: 'array',
                name: 'Array',
                children: [],
                notes: []
            },
            {
                id: 6,
                slug: 'date',
                name: 'Date',
                children: [],
                notes: []
            },
            {
                id: 7,
                slug: 'error',
                name: 'Error',
                children: [],
                notes: []
            },
            {
                id: 5,
                slug: 'boolean',
                name: 'Boolean',
                children: [],
                notes: []
            },
            {
                id: 8,
                slug: 'global',
                name: 'Global',
                children: [],
                notes: []
            },
            {
                id: 9,
                slug: 'attribute',
                name: 'Attribute',
                children: [],
                notes: []
            },
            {
                id: 10,
                slug: 'console',
                name: 'Console',
                children: [],
                notes: []
            },
            {
                id: 11,
                slug: 'document',
                name: 'Document',
                children: [],
                notes: []
            },
            {
                id: 12,
                slug: 'element',
                name: 'Element',
                children: [],
                notes: []
            },
            {
                id: 13,
                slug: 'anchor',
                name: 'Anchor',
                children: [],
                notes: []
            },
            {
                id: 14,
                slug: 'abbreviation',
                name: 'Abbreviation',
                children: [],
                notes: []
            },
            {
                id: 15,
                slug: 'address',
                name: 'Address',
                children: [],
                notes: []
            },
            {
                id: 16,
                slug: 'area',
                name: 'Area',
                children: [],
                notes: []
            },
            {
                id: 17,
                slug: 'cssstyledeclaration',
                name: 'CSSStyleDeclaration',
                children: [],
                notes: []
            },
            {
                id: 18,
                slug: 'conversion',
                name: 'Conversion',
                children: [],
                notes: []
            },
            {
                id: 19,
                slug: 'storage',
                name: 'Storage',
                children: [],
                notes: []
            },
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
    /* FUNCTIONS TO MANAGE THE CATEGORY  */
    /* ============================================================== */
    var categoryManager = {
        displayCategory: function () {
            var selectCategory = $("#form-category"),
                formCategory;
            // console.log(categories);
            categories.forEach(function (category, index) {
                // console.log(category);
                if (category.children.length > 0) {
                    formCategory = $("<option></option>").val(index).text(category.name);
                    $(selectCategory).append(formCategory);
                }
            });
            $(selectCategory).on('change', function () {
                categoryManager.displaySubcategory($(this).val());
            });
        },
        displaySubcategory: function (index) {
            var selectSubcategory = $("#form-subcategory"),
                formSubcategory,
                category = categories[index];
            $(selectSubcategory).html('');
            subcategories = category.children;
            subcategories.forEach(function (element) {
                var subcategory = categoryManager.fetchCategory(element);
                formSubcategory = $("<option></option>").val(subcategory.id).text(subcategory.name);
                $(selectSubcategory).append(formSubcategory);
            });
        },
        removeFromCategory: function (obj, refObj, id) {
            //If the current note's category or subcategory is changed
            if (obj === '' || (obj.category !== refObj.category || obj.subcategory !== refObj.subcategory)) {
                // Remove it from the category or subcategory
                var catNote = this.fetchCategory(refObj.subcategory).notes,
                    catIndex = catNote.indexOf(id);
                catNote.splice(catIndex, 1);
            } else {
                return;
            }
        },
        insertToCategory: function (obj, refObj, update) {
            if (update === true) {
                // If editing note, then check if category is changed, if so, push current note into category
                if (obj.category !== refObj.category || obj.subcategory !== refObj.subcategory) {
                    this.fetchCategory(obj.subcategory).notes.push(refObj.id); // Push it to the updated category
                } else {
                    return;
                }
            } else {
                // If adding new note, then just push new note into category
                this.fetchCategory(obj.subcategory).notes.push(refObj.id);
            }
        },
        fetchCategory: function (targetID) {
            // Get 
            var index = categories.map(function (element) {
                return element.id;
            }).indexOf(targetID);
            return categories[index];
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