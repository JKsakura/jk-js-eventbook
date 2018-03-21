jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes, formEl, noteList, addBtn, manageBtn, doneBtn, editBtn, formContainer, syntaxEditor, descriptionEditor, formTitle, formCategory, formIntroduction, formSyntax, formDescription, formNoteID, formSubmitBtn, category, detailTitle, detailCategory, detailIntroduction, detailSyntax, detailDescription;

    // Declare Global CKEditor WYSIWYG Fields
    syntaxEditor = CKEDITOR.replace('add-syntax');
    descriptionEditor = CKEDITOR.replace('add-description');
    
    // Get All Global DOM Element
    formContainer = $("#note-form-container");
    editBtn = $("#note-edit-btn");
    doneBtn = $("#note-done-btn");
    addBtn = $("#note-add-btn");
    manageBtn = $("#note-manage-btn");
    formEl = $("#note-form");
    noteList = $("#note-list");
    doneBtn = $("#note-done-btn");
    formSubmitBtn = $("#form-submit");
    
    noteDetail = $("#note-detail");
    detailTitle = $("#detail-title");
    detailIntroduction = $("#detail-introduction");
    detailCategory = $("#detail-category");
    detailSyntax = $("#detail-syntax");
    detailDescription = $("#detail-description");
    
    notes = [];
    category = ["javascript", "jquery"];
    
    $.getJSON( "notes.json" )
    .done(function( data ) {
        console.log( "success" );
        notes = data.notes;
        for(var i=0; i<notes.length; i++) {
            displayNote(notes[i]);
        }
    })
    .fail(function() {
        console.log( "error" );
    })
    .always(function() {
        console.log( "complete" );
    });
    
    //notes = notes ? notes : [];
    noteID = notes.length > 0 ? notes[length-1].id : 0;
    /* ============================================================== */
    /*    VISUAL PART EVENTS  */
    /* ============================================================== */
    // TOGGLE FOR NOTE FORM 
    var formToggle = {
        showForm: function() {
            $(formContainer).fadeIn(300);
        },
        hideForm: function() {
            $(formContainer).fadeOut(300);
        },
        toggleForm: function() {
            $(formContainer).fadeToggle(300);
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
            if( $(noteList).is(":parent") ) {
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
    
    /* ============================================================== */
    /*    EVENT FOR ALL NOTE HEADING BUTTONS */
    /* ============================================================== */
    function noteHeader() {
        $(addBtn).on("click", function(e) {
            formToggle.toggleForm();
            setForm(e);
            manageBtnToggle.hideBtn();
            addBtnToggle.hideBtn();
            doneBtnToggle.showBtn();
            $("html, body").animate({
                scrollTop: $(formContainer).offset().top 
            });
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
        });

        manageBtnToggle.toggleBtn();
    }

    /* ============================================================== */
    /* EVENT FOR ALL NOTE BODY BUTTONS */
    /* ============================================================== */
    function noteBody() {
        $(noteList).on("click", function(e) {
            var target = e.target;
            if( $(target).hasClass("delete-btn") ) {
                deleteNote(target);
            } else if( $(target).hasClass("edit-btn") ) {
                setForm(e);
                $("html, body").animate({
                    scrollTop: $(formContainer).offset().top 
                });
            } else if( $(target).is("a") ) {
                e.preventDefault();
                var detailId = $(target).attr("href").slice(5);
                displayDetail(notes[detailId]);
                $(noteList).addClass("hide");
                $(noteDetail).addClass("show");
            }
        });
        $(noteDetail).on("click", function(e) {
            var target = e.target;
            if( $(target).is("a") ) {
                e.preventDefault();
                $(noteList).removeClass("hide");
                $(noteDetail).removeClass("show");
            }
        });
    }
    
    /* ============================================================== */
    /*    MAIN NOTE FUNCTIONS CALL */
    /* ============================================================== */
    noteHeader();
    noteBody();
    
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        // Update The Current Note
        saveNote(getFormData());
    })
    
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
            notes[noteID] = newNote;
            noteID++;
            noteObj = newNote;
        }
        
        displayNote(noteObj);
        
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

        $("html, body").animate({
            scrollTop: 0
        });

        formToggle.hideForm();
    }

    // DELETE A NEW NOTE BASED ON THE ID
    function deleteNote(e) {
        var targetID = $(e).attr("id").slice(10);
        var r = confirm("Are You Sure You Want to Delete This Item?");
        if( r === true ) {
            notes[targetID] = '';
            $("#note"+targetID).remove();
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

        /* =========== Item Bottom ============ */
//        syntaxTitle = $("<h4></h4>").text("Syntax");
//        itemSyntax = $("<div></div>").addClass(syntaxClass).html(note.syntax).prepend(syntaxTitle);
//        descriptionTitle = $("<h4></h4>").text("Description");
//        itemDescription = $("<div></div>").addClass(descriptionClass).html(note.description).prepend(descriptionTitle);
//
//        itemBottom = $("<div></div>").addClass(bottomClass).append(itemSyntax, itemDescription);

        /* =========== Item Buttons ============ */
        itemDeleteBtn = $("<i></i>").addClass(deleteBtnClass);
        itemDelete = $("<button></button>").attr("id", deleteId).addClass(deleteClass).append(itemDeleteBtn);

        itemEditBtn = $("<i></i>").addClass(editBtnClass);
        itemEdit = $("<button></button>").attr("id", editId).addClass(editClass).append(itemEditBtn);

        itembtns = $("<div></div>").addClass(btnsClass).append(itemDelete, itemEdit);

        /* =========== List Item ============ */
//        listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(itemTop, itemBottom, itembtns);

        listLink = $("<a></a>").attr("href", "#"+itemId).append(itemTop, itembtns);
        listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(listLink);
        
        if( $("#"+itemId).length > 0 ) {
            $("#"+itemId).replaceWith(listItem);
            $("#"+itemId).find(".item-btns").addClass("active");
        } else {
            $(noteList).find(".category-"+note.category).find("ul").append(listItem);
        }
    }

    // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
    function displayDetail(note) {
        $(detailTitle).text(note.title);
        $(detailCategory).text(note.category);
        $(detailIntroduction).text(note.introduction);
        $(detailSyntax).html(note.syntax);
        $(detailDescription).html(note.description);
    }
    
    /* ============================================================== */
    /* FUNCTIONS TO MANAGE THE FORM */   
    /* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    function setForm(e) {
        var target = e.target;
        var id, title, category, introduction, syntax, description, btnTxt;
        formTitle = $("#add-title");
        formCategory = $("#add-category");
        formIntroduction = $("#add-introduction");
        formNoteID = '';
        formSyntax = syntaxEditor.activeFilter.editor;
        formDescription = descriptionEditor.activeFilter.editor;
        
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
        formToggle.showForm();
    }
    
    function getFormData() {
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
});