jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes;
    
    // Declare Global CKEditor WYSIWYG Fields
    var syntaxEditor = CKEDITOR.replace('form-syntax'),
        descriptionEditor = CKEDITOR.replace('form-description'),
        formEl = $("#note-form"),
        noteList = $("#note-table"),
        categories = ["array", "booleans", "date", "error", "global"],
        cache = [];
    
/* ============================================================== */
/*    VISUAL PART EVENTS  */
/* ============================================================== */
    // TOGGLE FOR APP HEADER
    var headerToggle = (function () {
        var header = $("#header");
        var menu = $("#main-menu");
        var toggle = $("#menu-toggle");
        return {
            menuToggle: function () {
                $(toggle).on("click", function () {
                    $(header).toggleClass("open");
                });
            }
        };
    }());
    // TOGGLE FOR NOTE FORM
    var formToggle = (function() {
        var formContainer = $("#note-form-container");
        return {
            showForm: function() {
                $(formContainer).addClass("show");
            },
            hideForm: function() {
                $(formContainer).removeClass("show");
            },
            toggleForm: function() {
                $(formContainer).toggleClass("show");
            }
        };
    }());
    
    var listToggle = (function() {
        var listContainer = $("#note-list-container");
        return {
            showList: function() {
                $(listContainer).removeClass("hide");
            },
            hideList: function() {
                $(listContainer).addClass("hide");
            },
            toggleList: function() {
                $(listContainer).toggleClass("hide");
            }
        };
    }());

    // TOGGLE FOR ADD BUTTON
    var addBtnToggle = (function() {
        var addBtn = $("#note-add-btn");
        return {
            showBtn: function() {
                $(addBtn).show();
            },
            hideBtn: function() {
                $(addBtn).hide();
            }
        };
    }());

    // TOGGLE FOR CANCEL BUTTON
    var cancelBtnToggle = (function() {
        var cancelBtn = $("#note-cancel-btn");
        return {
            showBtn: function() {
                $(cancelBtn).show();
            },
            hideBtn: function() {
                $(cancelBtn).hide();
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
                    cache.forEach(function (note) {
                        if (note.content.trim().toUpperCase().indexOf(search) > -1) {
                            $(note.element).show();
                        } else {
                            $(note.element).hide();
                        }
                    });
                    $(noteList).find("p.list-group-item").each(function () {
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
                categories.forEach(function (category) {
                    var newCategory = $("<option></option>").text(category).val(category).appendTo(filterCategory);
                });
            },
            goFilter: function () {
                $("#filter-category").change(function () {
                    var filterCategory = $(this).val();
                    $(noteList).find(".category").each(function () {
                        if (filterCategory === "all") {
                            cache.forEach(function(cache) {
                                cache.element.show();
                            });
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
    var noteManager = (function() {
        return {
            saveNote: function(obj) {
                var noteObj;
                var newNote = {
                    id: noteID,
                    title: obj.title,
                    created: Date.now(),
                    category: obj.category,
                    introduction: obj.introduction,
                    syntax: obj.syntax,
                    description: obj.description
                };
                notes.push(newNote);
                noteID++;
                noteObj = newNote;

                // console.table(noteObj);
                noteManager.displayNote(noteObj);
                dataManager.saveData(notes);
            },
            // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
            displayNote: function(note) {
                var id = $("<td></td>").text(note.id),
                    title = $("<td></td>").text(note.title),
                    created = $("<td></td>").text(note.created),
                    category = $("<td></td>").text(note.category),
                    introduction = $("<td></td>").text(note.introduction),
                    temEdit = $("<button></button>").addClass("item-btn edit-btn"),
                    itemEditBtn = $("<i></i>").addClass("far fa-edit"),
                    itemDelete = $("<button></button>").addClass("item-btn delete-btn"),
                    itemDeleteBtn = $("<i></i>").addClass("far fa-trash-alt"),
                    editBtn = $("<td></td>").append($(temEdit).append(itemEditBtn)),
                    deleteBtn = $("<td></td>").append($(itemDelete).append(itemDeleteBtn));
                var row = $("<tr></tr>").append(id, title, created, category, introduction, editBtn, deleteBtn).appendTo($(noteList).find('tbody'));
                cache.push({                          // Add an object to the cache array
                  element: row,                      // This image
                  content: row.html() // Its alt text (lowercase trimmed)
                });
            },
            // DELETE A NEW NOTE BASED ON THE ID
            deleteNote: function(e) {
                var target = e.target;
                var index = $(target).closest("tr").index();
                var r = confirm("Are You Sure You Want to Delete This Item?");
                if(r === true) {
                    notes.splice(index, 1);
                    cache[index].element.remove();
                    cache.splice(index, 1);
                } else {
                    return false;
                }
            },
            sortNote: function(e) {
                if ($(e).sortable()) {
                    var oldIndex, newIndex;
                    $(e).sortable("enable");
                    $(e).sortable({
                        start: function (e, ui) {
                            oldIndex = ui.item.index();
                            console.table(notes[oldIndex]);
                        },
                        update: function (e, ui) {
                            newIndex = ui.item.index();
                            notes.splice(newIndex, 0, notes[oldIndex]);
                            notes.splice(oldIndex, 1);
                            cache.splice(newIndex, 0, notes[oldIndex]);
                            cache.splice(oldIndex, 1);
                        }
                    });
                    $(e).disableSelection();
                }
            }
        };
    }());
    
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    var form = (function(){
        var formSyntax,
            formDescription,
            formTitle = $("#form-title"),
            formCategory = $("#form-category"),
            formIntroduction = $("#form-introduction"),
            formSubmitBtn = $("#form-submit");
        var id, title, category, introduction, syntax, description, btnTxt;
        
        return {
            setForm: function(e) {
                var target = e.target,
                    index = $(target).closest("tr").index();
                formSyntax = syntaxEditor.activeFilter.editor;
                formDescription = descriptionEditor.activeFilter.editor;
            
                if( index > -1 ) {
                    var note = notes[index];
                    id = note.id;
                    title = note.title;
                    category = note.category;
                    introduction = note.introduction;
                    syntax = note.syntax;
                    description = note.description;
                    btnTxt = "Update Note";
                } else {
                    id = "";
                    title = "";
                    category = "";
                    introduction = "";
                    syntax = "";
                    description = "";
                    btnTxt = "Add Note";
                }

                $(formTitle).val(title);
                $(formCategory).val(category);
                $(formIntroduction).val(introduction);
                formSyntax.setData(syntax);
                formDescription.setData(description);
                $(formSubmitBtn).text(btnTxt);

                // SHOW THE FORM AFTER IT HAS BEEN ASSIGNED VALUES
                listToggle.hideList();
                formToggle.showForm();
            },
            getForm: function() {
                // fetch form data
                title = $(formTitle).val();
                category = $(formCategory).val();
                introduction = $(formIntroduction).val();
                syntax =formSyntax.getData();
                description = formDescription.getData();
                
                // format obj
                var resObj = {
                    id: "",
                    title: title,
                    category: category,
                    introduction: introduction,
                    syntax: syntax,
                    description: description
                };

                if (id) {
                    resObj.id = id;
                }

                return resObj;
            }
        };
    }());
    
/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */   
/* ============================================================== */
    var dataManager = (function() {
        return {
            resetData: function() {
                notes = [];
                noteID = 0;
            },
            loadData: function() {
                $.getJSON( "notes.json" )
                .done(function(data) {
                    notes = data.notes ? data.notes : [];
                    noteID = 0;
                    if( notes.length > 0 ) {
                        for(var i=0; i<notes.length; i++) {
                            noteManager.displayNote(notes[i]);
                            if(notes[i].id >= noteID) { noteID = notes[i].id+1; }
                        }
                    }
                })
                .fail( function(d, textStatus, error) {
                    console.error("getJSON failed, status: " + textStatus + ", error: "+error);
                })
                .always(function() {
                    console.log( "complete" );
                });
            },
            saveData: function(notes) {
                var noteData = {"notes": notes};

                $.post("notes.php", {
                    json: JSON.stringify(noteData)
                })
                .done(function() {
                    console.log( "second success" );
                })
                .fail(function() {
                    console.log( "error" );
                })
                .always(function() {
                    console.log( "finished" );
                });
            }
        };
    }());
    // INITIAL NOTE HEADER VISUAL 
    noteHeader();
    noteBody();
    
    // LOAD DATA FROM JSON FILE
    dataManager.loadData();
    dataManager.resetData();

    // INITIAL HEADER FILTER
    filterManager.goSearch();
    filterManager.goFilter();

    // INITIAL NOTE BODY EVENTS
    $(noteList).on("click", function(e) {
        var target = e.target;
        if( $(target).hasClass("delete-btn") ) {
            noteManager.deleteNote(e);
        } else if( $(target).hasClass("edit-btn") ) {
            form.setForm(e);
            $("#note-form-container").animate({
                scrollTop: 0
            });
        } else if( $(target).is("p.list-group-item") ) {
            $(target).each(function() {
                $(this).next("ul").stop().slideToggle(300);
                $(this).stop().toggleClass("closed");
            });
        }
    });
    
    // INITIAL FORM EVENTS
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        // Update The Current Note
        noteManager.saveNote(form.getForm());
        
        listToggle.showList();
        formToggle.hideForm();
    });
    /* ============================================================== */
    /*    EVENT FOR ALL NOTE HEADING BUTTONS */
    /* ============================================================== */
    function noteHeader() {
        headerToggle.menuToggle();
        filterManager.iniCategory();
        $(".notes-header").on("click", function(e) {
            var target = e.target;
            if( $(target).hasClass("add-btn") ) {
                formToggle.toggleForm();
                listToggle.toggleList();
                form.setForm(e);
                $("#note-form-container").animate({
                    scrollTop:0
                }, 300);
            } else if( $(target).hasClass("cancel-btn") ) {
                formToggle.hideForm();
                listToggle.showList();
            }
        });
    }
    
    function noteBody() {
        var formCategory;
        
        categories.forEach(function(category) {
            formCategory = $("<option></option>").val(category).text(category);
            $("#form-category").append(formCategory);
        });
    }
});