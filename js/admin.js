jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes;
    // Declare Global CKEditor WYSIWYG Fields
    var syntaxEditor = CKEDITOR.replace("form-syntax"),
        descriptionEditor = CKEDITOR.replace("form-description"),
        formEl = $("#note-form"),
        noteList = $("#note-table"),
        categories = {
            array: ["array", "booleans", "date", "error", "global"],
            booleans: ["array", "booleans", "date", "error", "global"],
            date: ["array", "booleans", "date", "error", "global"],
            error: ["array", "booleans", "date", "error", "global"],
            global: ["array", "booleans", "date", "error", "global"]
        },
        cache = [];

/* ============================================================== */
/*    EVENT FOR ALL NOTE HEADING BUTTONS */
/* ============================================================== */
    var DOMManager = {
        noteHeader: function () {
            headerToggle.menuToggle();
            filterManager.iniCategory();
            $(".notes-header").on("click", function (e) {
                var target = e.target;
                if ($(target).is(".add-btn")) {
                    pageToggle.pageForward(".page1", ".page2");
                    formManager.setForm(e);
                } else if ($(target).hasClass("cancel-btn")) {
                    pageToggle.pageBackward(".page1", ".page2");
                }
            });
        },
        noteBody: function () {
            var formCategory;
            for( var category in categories ) {
                formCategory = $("<option></option>").val(category).text(category);
                $("#form-category").append(formCategory).on('change', function () {
                    if ( categories[category].length > 0 ) {
                        var formSubCategory;
                        categories[category].forEach(function(term) {
                            console.log(term);
                        });
                    }
                });
            }
            $(noteList).find("tbody").each(function () {
                noteManager.orderNote(this);
            });
            noteManager.sortNote();
        }
    };
    
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE HEADER  */
/* ============================================================== */
// INITIAL NOTE BODY EVENTS
    var filterManager = {
        goSearch: function () {
            $("#filter-search").on("input", function () {
                var search = $(this).val().trim().toUpperCase();
                cache.forEach(function (note) {
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
            });
        },
        iniCategory: function () {
            var defaultVal = '<option value="" disabled selected>Category</option>';
            var filterCategory = $("#filter-category").append(defaultVal, "<option value='all'>All</option>");
            for( var category in categories ) {
                var newCategory = $("<option></option>").text(category).val(category).appendTo(filterCategory);
            }
        },
        goFilter: function () {
            $("#filter-category").change(function () {
                var filterCategory = $(this).val().trim().toUpperCase();
                cache.forEach(function(note) {
                    note.element.hide();
                    if(note.category.trim().toUpperCase() === filterCategory || filterCategory === "ALL" ) {
                        note.element.show();
                    }
                });
            });
        }
    };

/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    var noteManager = {
        saveNote: function(obj) {
            var noteObj;
            if(obj.id) {
                var targetID = obj.id;
                var index = notes.map(function (element) { return element.id }).indexOf(targetID);
                notes[index] = {
                    id: targetID,
                    title: obj.title,
                    created: obj.created ? obj.created : Date.now(),
                    category: obj.category,
                    introduction: obj.introduction,
                    syntax: obj.syntax,
                    description: obj.description
                }
                noteObj = notes[index];
                noteManager.displayNote(noteObj, true);
            } else {
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
                noteManager.displayNote(noteObj, false);
            }
            dataManager.saveData(notes);
        },
        // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
        displayNote: function(note, update) {
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
            if(update===true) {
                var row = $("<tr></tr>").append(id, title, created, category, introduction, editBtn, deleteBtn);
                var index = notes.map(function(element){ return element.id }).indexOf(note.id);
                cache[index].element.replaceWith(row);
                cache[index] = { // Add an object to the cache array
                    element: row, // This row
                    id: note.id,
                    title: note.title,
                    category: note.category,
                    introduction: note.introduction,
                    syntax: note.syntax,
                    description: note.description
                };
            } else {
                var row = $("<tr></tr>").append(id, title, created, category, introduction, editBtn, deleteBtn).appendTo($(noteList).find('tbody'));
                cache.push({ // Add an object to the cache array
                    element: row, // This row
                    title: note.title,
                    category: note.category,
                    introduction: note.introduction,
                    syntax: note.syntax,
                    description: note.description
                });
            }
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
                dataManager.saveData(notes);
            } else {
                return false;
            }
        },
        orderNote: function(e) {
            var oldIndex, newIndex, note;
            $(e).sortable({
                start: function (e, ui) {
                    oldIndex = ui.item.index();
                },
                update: function (e, ui) {
                    newIndex = ui.item.index();
                    note = notes[oldIndex];
                    if( oldIndex < newIndex ) {
                        newIndex += 1;
                    } else {
                        oldIndex += 1;
                    }
                    notes.splice(newIndex, 0, note);
                    notes.splice(oldIndex, 1);
                    cache.splice(newIndex, 0, note);
                    cache.splice(oldIndex, 1);
                    dataManager.saveData(notes);
                }
            });
            $(e).disableSelection();
        },
        sortNote: function () {
            var compare = {
                id: function (a, b) {
                    return a - b;
                },
                title: function (a, b) {
                    if (a < b) {
                        return -1;
                    } else {
                        return a > b ? 1 : 0;
                    }
                },
                date: function (a, b) {
                    a = new Date(a);
                    b = new Date(b);
                    return a - b;
                }
            };

            $(noteList).each(function() {
                var table = this,
                    control = $(table).find("th"),
                    tbody = $(table).find("tbody");
                
                $(control).on("click", function () {
                    var header = this,
                        rows = $(tbody).find("tr").toArray(),
                        order = $(header).data('sort'),
                        column = control.index(this);
                        if ($(header).is(".ascending") || $(header).is(".descending")) {
                            $(header).toggleClass('ascending descending');
                            $(tbody).append(rows.reverse());
                        } else {
                            $(control).removeClass("ascending descending");
                            $(header).addClass("ascending");
                            if (compare.hasOwnProperty(order)) {
                                rows.sort(function (a, b) {
                                    a = $(a).find("td").eq(column).text();
                                    b = $(b).find("td").eq(column).text();
                                    return compare[order](a, b);
                                });
                                $(tbody).append(rows);
                            }
                        }
                });
            });
        }
    };
    
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    var formManager = (function(){
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
                    $(formTitle).val(note.title);
                    $(formCategory).val(note.category);
                    $(formIntroduction).val(note.introduction);
                    formSyntax.setData(note.syntax);
                    formDescription.setData(note.description);
                    btnTxt = "Update Note";
                } else {
                    $(formEl)[0].reset();
                    formSyntax.setData("");
                    formDescription.setData("");
                    btnTxt = "Add Note";
                }

                $(formSubmitBtn).text(btnTxt);
                // SHOW THE FORM AFTER IT HAS BEEN ASSIGNED VALUES
                pageToggle.pageForward(".page1", ".page2");
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
    var dataManager = {
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

    // INITIAL NOTE HEADER VISUAL 
    DOMManager.noteHeader();
    DOMManager.noteBody();
    
    // LOAD DATA FROM JSON FILE
    dataManager.loadData();
    //dataManager.resetData();

    // INITIAL HEADER FILTER
    filterManager.goSearch();
    filterManager.goFilter();

    // INITIAL NOTE BODY EVENTS
    $(".page").each(function() {
        var page = this;
        $(page).on("click", function(e) {
            var target = e.target;
            if( $(target).is(".delete-btn") ) {
                noteManager.deleteNote(e);
            } else if( $(target).is(".edit-btn") ) {
                formManager.setForm(e);
            } else if( $(target).is("p.list-group-item") ) {
                $(target).each(function() {
                    $(this).next("ul").stop().slideToggle(300);
                    $(this).stop().toggleClass("closed");
                });
            }
        });
    });
    
    // INITIAL FORM EVENTS
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        // Update The Current Note
        noteManager.saveNote(formManager.getForm());
        
        pageToggle.pageBackward(".page1", ".page2");
    });
});