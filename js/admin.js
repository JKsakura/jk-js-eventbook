jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes;
    
    // Declare Global CKEditor WYSIWYG Fields
    var syntaxEditor = CKEDITOR.replace('add-syntax'),
        descriptionEditor = CKEDITOR.replace('add-description'),
        formEl = $("#note-form"),
        noteList = $("#note-list"),
        category = ["array", "booleans", "date", "error"];
    
/* ============================================================== */
/*    VISUAL PART EVENTS  */
/* ============================================================== */
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

    // TOGGLE FOR MANAGING MANAGE BUTTON
    var manageBtnToggle = (function() {
        var manageBtn = $("#note-manage-btn");
        return {
            showBtn: function() {
                $(manageBtn).show();
            },
            hideBtn: function() {
                $(manageBtn).hide();
            },
            toggleBtn: function() {
                if( $(".list-item").length > 0 ) {
                    $(manageBtn).show();
                } else {
                    $(manageBtn).hide();
                }
            }
        };
    }());

    // TOGGLE FOR DONE BUTTON
    var doneBtnToggle = (function() {
        var doneBtn = $("#note-done-btn");
        return {
            showBtn: function() {
                $(doneBtn).show();
            },
            hideBtn: function() {
                $(doneBtn).hide();
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
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    var noteManager = (function() {
        return {
            saveNote: function(obj) {
                var noteObj;
                if(obj.id) {
                    notes[obj.id] = {
                        id: obj.id,
                        title: obj.title,
                        category: obj.category,
                        introduction: obj.introduction,
                        syntax: obj.syntax,
                        description: obj.description
                    };
                    noteObj = notes[obj.id];
                } else {
                    var newNote = {
                        id: noteID,
                        title: obj.title,
                        category: obj.category,
                        introduction: obj.introduction,
                        syntax: obj.syntax,
                        description: obj.description
                    };
                    notes.push(newNote);
                    noteID++;
                    noteObj = newNote;
                }
                console.table(noteObj);
                noteManager.displayNote(noteObj);
                dataManager.saveData(notes);
            },
            // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
            displayNote: function(note) {
                // Define ID
                var itemId = "note"+note.id,
                    editId = "noteEdit"+note.id,
                    deleteId = "noteDelete"+note.id;

                // Define Classes
                var itemClass = "list-item list-group-item list-group-item-action",
                    headerClass = "item-header",
                    topClass = "item-top",
                    TitleClass = "item-title note-field-text",
                    categoryClass = "item-category note-field-select",
                    introductionClass = "item-introduction note-field-area",
                    btnsClass = "item-btns",
                    deleteClass = "item-btn delete-btn",
                    deleteBtnClass = "fas fa-trash-alt",
                    editClass = "item-btn edit-btn",
                    editBtnClass = "far fa-edit";

                /* =========== Item Top ============ */
                // Item Header
                var itemTitle = $("<p></p>").addClass(TitleClass).text(note.title);
                var itemCategory = $("<h5></h5>").addClass(categoryClass).text(note.category);

                var itemHeader = $("<div></div>").addClass(headerClass).append(itemTitle, itemCategory);

                // Item Introduction
                var itemIntroduction = $("<p></p>").addClass(introductionClass).text(note.introduction);
                var itemTop = $("<div></div>").addClass(topClass).append(itemHeader, itemIntroduction);

                /* =========== Item Buttons ============ */
                var itemDeleteBtn = $("<i></i>").addClass(deleteBtnClass);
                var itemDelete = $("<button></button>").attr("id", deleteId).addClass(deleteClass).append(itemDeleteBtn);

                var itemEditBtn = $("<i></i>").addClass(editBtnClass);
                var itemEdit = $("<button></button>").attr("id", editId).addClass(editClass).append(itemEditBtn);

                var itembtns = $("<div></div>").addClass(btnsClass).append(itemDelete, itemEdit);
                /* =========== List Item ============ */
                var listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(itemTop, itembtns);

                if( $("#"+itemId).length > 0 ) {
                    $("#"+itemId).replaceWith(listItem);
                    $("#"+itemId).find(".item-btns").addClass("active");
                } else {
                    $(noteList).find(".category-" + note.category).find("ul").append(listItem);
                }
            },
            // DELETE A NEW NOTE BASED ON THE ID
            deleteNote: function(e) {
                var targetID = $(e).attr("id").slice(10);
                var r = confirm("Are You Sure You Want to Delete This Item?");
                if( r === true ) {
                    var index = notes.map(function (element) { return element.id.toString(); }).indexOf(targetID);
                    if (index > -1) {
                        notes.splice(index,1);
                        $("#note"+targetID).remove();
                        dataManager.saveData(notes);
                    }
                } else {
                    return false;
                }
            },
            sortNote: function(e) {
                if ($(e).sortable()) {
                    $(e).sortable("enable");
                    $(e).sortable({
                        update: function (e, ui) {
                            var prevIndex = ui.item.prev(),
                                nextIndex = ui.item.next(),
                                targetID = ui.item.attr("id").slice(4),
                                newIndex,
                                note,
                                oldIntex = findTarget(notes, targetID);
                            if ($(prevIndex).length > 0) {
                                newIndex = findTarget(notes, $(prevIndex).attr("id").slice(4));
                            } else if ($(nextIndex).length > 0) {
                                newIndex = findTarget(notes, $(nextIndex).attr("id").slice(4)) - 1;
                            }
                            note = notes[oldIntex];
                            if (oldIntex > -1) {
                                notes.splice(oldIntex, 1);
                                notes.splice(newIndex, 0, note);
                                dataManager.saveData(notes);
                                console.table(notes);
                            }
                            function findTarget(object, target) {
                                return object.map(function (element) {
                                    return element.id.toString();
                                }).indexOf(target);
                            }
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
            formNoteID = "",
            formTitle = $("#add-title"),
            formCategory = $("#add-category"),
            formIntroduction = $("#add-introduction"),
            formSubmitBtn = $("#form-submit");
        var id, title, category, introduction, syntax, description, btnTxt;
        
        return {
            setForm: function(e) {
                var target = e.target;
                formSyntax = syntaxEditor.activeFilter.editor,
                formDescription = descriptionEditor.activeFilter.editor,
                id = $(target).attr("id");

                if ($(target).hasClass("edit-btn")) {
                    id = id.slice(8);
                    index = notes.map(function(element) {
                        return element.id.toString();
                    }).indexOf(id);
                    title = notes[index].title;
                    category = notes[index].category;
                    introduction = notes[index].introduction;
                    syntax = notes[index].syntax;
                    description = notes[index].description;
                    btnTxt = "Update Note";
                }
                else {
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
                
                console.log(id);
                // format obj
                var resObj = {
                    id: "",
                    title: title,
                    category: category,
                    introduction: introduction,
                    syntax: syntax,
                    description: description
                }

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
                    manageBtnToggle.toggleBtn();
                    console.table(notes);
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
    
    
    // INITIAL NOTE BODY EVENTS
    $(noteList).on("click", function(e) {
        var target = e.target;
        if( $(target).hasClass("delete-btn") ) {
            noteManager.deleteNote(target);
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
        manageBtnToggle.toggleBtn();
    });
    /* ============================================================== */
    /*    EVENT FOR ALL NOTE HEADING BUTTONS */
    /* ============================================================== */
    function noteHeader() {
        $(".notes-header").on("click", function(e) {
            var target = e.target;
            if( $(target).hasClass("add-btn") ) {
                formToggle.toggleForm();
                listToggle.toggleList();
                form.setForm(e);
                manageBtnToggle.hideBtn();
                $("#note-form-container").animate({
                    scrollTop:0
                }, 300);
            } else if( $(target).hasClass("manage-btn") ) {
                $(".item-btns").toggleClass("active");
                formToggle.hideForm();
                manageBtnToggle.hideBtn();
                addBtnToggle.hideBtn();
                doneBtnToggle.showBtn();
                $(".list-group ul").each(function() {
                    noteManager.sortNote(this);
                });
            } else if( $(target).hasClass("done-btn") ) {
                var itemBtn = $(".item-btns");
                $(itemBtn).removeClass("active");
                doneBtnToggle.hideBtn();
                manageBtnToggle.toggleBtn();
                addBtnToggle.showBtn();
                formToggle.hideForm();
                listToggle.showList();
                $( ".list-group ul" ).each(function() {
                    $(this).sortable("disable");
                });
            } else if( $(target).hasClass("cancel-btn") ) {
                formToggle.hideForm();
                listToggle.showList();
                if ( !$("#note-done-btn").is(":visible") ) {
                    manageBtnToggle.toggleBtn();
                }
            }
        });
    }
    
    function noteBody() {
        var listCategory,
            listClass,
            formCategory;
        
        for(var i=0; i<category.length; i++) {
            listClass = "category-" + category[i];
            listTitle = $("<p class=\"list-group-item list-group-item-primary\"></p>").text(category[i]);
            listCategory = $("<li></li>").addClass(listClass).append(listTitle, "<ul></ul>");
            $("#note-list").append(listCategory);
            
            formCategory = $("<option></option>").val(category[i]).text(category[i]);
            $("#add-category").append(formCategory);
        }
    }
});