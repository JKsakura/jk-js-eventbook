jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes, formEl, listContainer, noteList, addBtn, manageBtn, doneBtn, editBtn, formContainer, syntaxEditor, descriptionEditor, category, detailTitle, detailCategory, detailIntroduction, detailSyntax, detailDescription;
    
    // Declare Global CKEditor WYSIWYG Fields
    syntaxEditor = CKEDITOR.replace('add-syntax');
    descriptionEditor = CKEDITOR.replace('add-description');
    
    // Get All Global DOM Element
    // Containers
    formContainer = $("#note-form-container");
    listContainer = $("#note-list-container");
    // Buttons
    editBtn = $("#note-edit-btn");
    doneBtn = $("#note-done-btn");
    addBtn = $("#note-add-btn");
    manageBtn = $("#note-manage-btn");
    cancelBtn = $("#note-cancel-btn");
    // Form
    formEl = $("#note-form");
    // Note
    noteList = $("#note-list");
    category = ["javascript", "jquery"];
    
    // LOAD DATA FROM JSON FILE
    loadData();
/* ============================================================== */
/*    VISUAL PART EVENTS  */
/* ============================================================== */
    // TOGGLE FOR NOTE FORM
    var formToggle = {
        showForm: function() {
            $(formContainer).addClass("show");
        },
        hideForm: function() {
            $(formContainer).removeClass("show");
        },
        toggleForm: function() {
            $(formContainer).toggleClass("show");
        }
    }
    
    var listToggle = {
        showList: function() {
            $(listContainer).removeClass("hide");
        },
        hideList: function() {
            $(listContainer).addClass("hide");
        },
        toggleList: function() {
            $(listContainer).toggleClass("hide");
        }
    }

    // TOGGLE FOR ADD BUTTON
    var addBtnToggle = {
        showBtn: function() {
            $(addBtn).show();
        },
        hideBtn: function() {
            $(addBtn).hide();
        }
    }

    // TOGGLE FOR MANAGING MANAGE BUTTON
    var manageBtnToggle = {
        showBtn: function() {
            $(manageBtn).show();
        },
        hideBtn: function() {
            $(manageBtn).hide();
        },
        toggleBtn: function() {
            console.log($(".list-item").length);
            if( $(".list-item").length > 0 ) {
                console.log('works');
                $(manageBtn).show();
            } else {
                $(manageBtn).hide();
            }
        }
    }

    // TOGGLE FOR DONE BUTTON
    var doneBtnToggle = {
        showBtn: function() {
            $(doneBtn).show();
        },
        hideBtn: function() {
            $(doneBtn).hide();
        }
    }
    
    // TOGGLE FOR CANCEL BUTTON
    var cancelBtnToggle = {
        showBtn: function() {
            $(cancelBtn).show();
        },
        hideBtn: function() {
            $(cancelBtn).hide();
        }
    }
    
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    var form = (function(){
        var formNoteID = null,
            formTitle = $("#add-title"),
            formCategory = $("#add-category"),
            formIntroduction = $("#add-introduction"),
            formSyntax = syntaxEditor.activeFilter.editor,
            formDescription = descriptionEditor.activeFilter.editor,
            formSubmitBtn = $("#form-submit");
        
        var id, title, category, introduction, syntax, description, btnTxt;
        return {
            setForm: function(e) {
                id = $(target).attr("id");

                if ($(target).hasClass("edit-btn")) {
                    id = id.slice(8);
                    title = notes[id].title;
                    category = notes[id].category;
                    introduction = notes[id].introduction;
                    syntax = notes[id].syntax;
                    description = notes[id].description;
                    btnTxt = "Update Note";
                }
                else {
                    id = '';
                    title = "";
                    category = "";
                    introduction = "";
                    syntax = "";
                    description = "";
                    btnTxt = "Add Note";
                }

                formNoteID = id;
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
                var id = formNoteID;
                var title = $(formTitle).val();
                var category = $(formCategory).val();
                var introduction = $(formIntroduction).val();
                var syntax =formSyntax.getData();
                var description = formDescription.getData();

                // format obj
                var resObj = {
                    id: '',
                    title: title,
                    category: category,
                    introduction: introduction,
                    syntax: syntax,
                    description: description
                }

                if (id) {
                    resObj['id'] = id;
                }

                return resObj;
            }
        };
    }());
    
    // INITIAL NOTE HEADER VISUAL 
    noteHeader();
    
    // INITIAL NOTE BODY EVENTS
    $(noteList).on("click", function(e) {
        var target = e.target;
        if( $(target).hasClass("delete-btn") ) {
            deleteNote(target);
        } else if( $(target).hasClass("edit-btn") ) {
            form.setForm(e);
            $("html, body").animate({
                scrollTop: 0
            });
        }
    });
    
    // INITIAL FORM EVENTS
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        // Update The Current Note
        saveNote(form.getForm());
        
        listToggle.showList();
        formToggle.hideForm();
        manageBtnToggle.toggleBtn();
    });
    
    /* ============================================================== */
    /*    EVENT FOR ALL NOTE HEADING BUTTONS */
    /* ============================================================== */
    function noteHeader() {
        $(addBtn).on("click", function(e) {
            formToggle.toggleForm();
            listToggle.toggleList();
            form.setForm(e);
            manageBtnToggle.hideBtn();
            //addBtnToggle.hideBtn();
            //doneBtnToggle.showBtn();
        });

        $(cancelBtn).on("click", function() {
            formToggle.hideForm();
            listToggle.showList();
        });
        
        $(manageBtn).on("click", function() {
            var itemBtn = $(".item-btns");
            $(itemBtn).toggleClass("active");
            formToggle.hideForm();
            manageBtnToggle.hideBtn();
            addBtnToggle.hideBtn();
            doneBtnToggle.showBtn();
        });

        $(doneBtn).on("click", function() {
            var itemBtn = $(".item-btns");
            $(itemBtn).removeClass("active");
            doneBtnToggle.hideBtn();
            manageBtnToggle.toggleBtn();
            addBtnToggle.showBtn();
            formToggle.hideForm();
            listToggle.showList();
        });
        
        manageBtnToggle.toggleBtn();
    }
    
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    function saveNote(obj) {
        var noteObj;

        if(obj.id) {
            notes[obj.id] = {
                id: obj.id,
                title: obj.title,
                category: obj.category,
                introduction: obj.introduction,
                syntax: obj.syntax,
                description: obj.description
            }
            noteObj = notes[obj.id];
        } else {
            var newNote = {
                id: noteID,
                title: obj.title,
                category: obj.category,
                introduction: obj.introduction,
                syntax: obj.syntax,
                description: obj.description
            }
            notes.push(newNote);
            noteID++;
            noteObj = newNote;
        }
        
        displayNote(noteObj);
        
        saveData(notes);
    }

    // DELETE A NEW NOTE BASED ON THE ID
    function deleteNote(e) {
        var targetID = $(e).attr("id").slice(10);
        var r = confirm("Are You Sure You Want to Delete This Item?");
        if( r === true ) {
            var index = notes.findIndex(function(element) {
                return element.id && element.id.toString() === targetID;
            });
            if (index >= -1) {
                notes.splice(index,1);
                $("#note"+targetID).remove();
                console.table(notes);
                saveData(notes);
            }
        } else {
            return false;
        }
    }

    // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
    function displayNote(note) {
        var listItem, itemTop, itemBottom, itemHeader, itemTitle, itemCategory, itemIntroduction, itemSyntax, itemDescription, itembtns, itemDelete, itemDeleteBtn, syntaxTitle, descriptionTitle, itemEditBtn, itemEdit, listCategory;

        // Define ID
        var itemId = "note"+note.id;
        var editId = "noteEdit"+note.id;
        var deleteId = "noteDelete"+note.id;

        // Define Classes
        var itemClass = "list-item list-group-item list-group-item-action";
        var headerClass = "item-header";
        var topClass = "item-top";
        var bottomClass = "item-bottom";
        var TitleClass = "item-title note-field-text";
        var categoryClass = "item-category note-field-select";
        var introductionClass = "item-introduction note-field-area";
//        var syntaxClass = "item-syntax note-field-area";
//        var descriptionClass = "item-description note-field-area";
        var btnsClass = "item-btns";
        var deleteClass = "item-btn delete-btn";
        var deleteBtnClass = "fas fa-trash-alt";
        var editClass = "item-btn edit-btn";
        var editBtnClass = "far fa-edit";

        /* =========== Item Top ============ */
        // Item Header
        itemTitle = $("<p></p>").addClass(TitleClass).text(note.title);
        itemCategory = $("<h5></h5>").addClass(categoryClass).text(note.category);

        itemHeader = $("<div></div>").addClass(headerClass).append(itemTitle, itemCategory);

        // Item Introduction
        itemIntroduction = $("<p></p>").addClass(introductionClass).text(note.introduction);
        itemTop = $("<div></div>").addClass(topClass).append(itemHeader, itemIntroduction);
        
        /* =========== Item Buttons ============ */
        itemDeleteBtn = $("<i></i>").addClass(deleteBtnClass);
        itemDelete = $("<button></button>").attr("id", deleteId).addClass(deleteClass).append(itemDeleteBtn);

        itemEditBtn = $("<i></i>").addClass(editBtnClass);
        itemEdit = $("<button></button>").attr("id", editId).addClass(editClass).append(itemEditBtn);

        itembtns = $("<div></div>").addClass(btnsClass).append(itemDelete, itemEdit);

        /* =========== List Item ============ */
        listLink = $("<a></a>").attr("href", "#"+itemId).append(itemTop, itembtns);
        listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(listLink);
        
        if( $("#"+itemId).length > 0 ) {
            $("#"+itemId).replaceWith(listItem);
            $("#"+itemId).find(".item-btns").addClass("active");
        } else {
            $(noteList).find(".category-"+note.category).find("ul").append(listItem);
        }
    }
/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */   
/* ============================================================== */
    function loadData() {
        var jqxhr = $.getJSON( "notes.json", function(data) {
            console.log( "success" );
            notes = data.notes ? data.notes : [];
            noteID = 0;
            if( notes.length > 0 ) {
                for(var i=0; i<notes.length; i++) {
                    displayNote(notes[i]);
                    if(notes[i].id > noteID) { noteID = notes[i].id+1; }
                }
            }
        })
        .done(function() {
            console.log( "second success" );
        })
        .fail( function(d, textStatus, error) {
            console.error("getJSON failed, status: " + textStatus + ", error: "+error);
        })
        .always(function() {
            console.log( "complete" );
        });
    }
    function saveData(notes) {
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
});